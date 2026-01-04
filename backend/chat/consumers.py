import json
from datetime import timedelta

from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.utils import timezone

from .models import Conversation, Message

User = get_user_model()


@database_sync_to_async
def user_in_conversation(user, conversation_id):
    try:
        conv = Conversation.objects.get(conversation_id=conversation_id)
        return (conv.user1_id == user.user_id) or (conv.user2_id == user.user_id)
    except Conversation.DoesNotExist:
        return False


@database_sync_to_async
def create_message(conversation_id, user, content: str):
    conversation = Conversation.objects.get(conversation_id=conversation_id)
    message = Message.objects.create(
        conversation=conversation,
        sender=user,
        content=content,
    )
    conversation.last_message = message
    conversation.save(update_fields=["last_message", "updated_at"])
    return message


@database_sync_to_async
def serialize_message(message: Message):
    """
    Trả về JSON message dùng chung cho cả API & WebSocket.
    Thêm is_online dựa trên last_seen của sender.
    """
    sender = message.sender

    is_online = False
    if sender.last_seen:
        is_online = timezone.now() - sender.last_seen < timedelta(minutes=2)

    return {
        "message_id": str(message.message_id),
        "sender": {
            "user_id": str(sender.user_id),
            "full_name": sender.full_name,
            "username": sender.username,
            "is_online": is_online,
        },
        "content": message.content,
        "is_read": message.is_read,
        "created_at": message.created_at.isoformat(),
    }


@database_sync_to_async
def update_last_seen(user: User):
    """
    Cập nhật thời gian hoạt động gần nhất của user.
    Dùng để tính trạng thái online.
    """
    User.objects.filter(pk=user.pk).update(last_seen=timezone.now())

@database_sync_to_async
def mark_message_read(message_id: str):
    """
    Đánh dấu 1 message là đã đọc (dùng khi user đang mở phòng chat).
    """
    from .models import Message  # tránh import vòng

    Message.objects.filter(message_id=message_id).update(is_read=True)


class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        user = self.scope.get("user", None)
        if not user or not user.is_authenticated:
            await self.close()
            return

        self.conversation_id = str(
            self.scope["url_route"]["kwargs"]["conversation_id"]
        )
        self.group_name = f"chat_{self.conversation_id}"

        # Kiểm tra user có thuộc cuộc trò chuyện không
        in_conv = await user_in_conversation(user, self.conversation_id)
        if not in_conv:
            await self.close()
            return

        # Cập nhật last_seen khi connect
        await update_last_seen(user)

        # Join group
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Rời group khi disconnect
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive_json(self, content, **kwargs):
        """
        Client gửi JSON dạng:
        {
          "type": "message",
          "content": "Hello anh ơi"
        }
        """
        user = self.scope.get("user", None)
        if not user or not user.is_authenticated:
            await self.close()
            return

        # Mỗi lần user gửi tin → cũng coi là đang active
        await update_last_seen(user)

        msg_type = content.get("type")
        if msg_type == "message":
            text = content.get("content", "").strip()
            if not text:
                return

            # Tạo message trong DB
            message = await create_message(self.conversation_id, user, text)
            msg_data = await serialize_message(message)

            # Broadcast cho tất cả client trong group
            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "chat.message",  # handler method: chat_message
                    "message": msg_data,
                },
            )

    async def chat_message(self, event):
        """
        Nhận event từ group_send và gửi xuống từng client trong group.
        Nếu client hiện tại KHÔNG phải là người gửi → coi như đã đọc → mark is_read.
        """
        msg = event["message"]
        user = self.scope.get("user", None)

        # Nếu user hợp lệ và không phải là sender → đánh dấu đã đọc
        if user and user.is_authenticated:
            sender_id = msg.get("sender", {}).get("user_id")
            if sender_id and str(sender_id) != str(user.user_id):
                await mark_message_read(msg["message_id"])

        # Gửi message xuống client
        await self.send_json(msg)
  
