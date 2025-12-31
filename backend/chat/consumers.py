from datetime import timedelta

from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.utils import timezone

from .models import Conversation, Message

User = get_user_model()


@database_sync_to_async
def user_in_conversation(user: User, conversation_id: str) -> bool:
    try:
        conv = Conversation.objects.only("user1_id", "user2_id").get(conversation_id=conversation_id)
        return conv.user1_id == user.user_id or conv.user2_id == user.user_id
    except Conversation.DoesNotExist:
        return False


@database_sync_to_async
def create_message(conversation_id: str, user: User, content: str) -> Message:
    conversation = Conversation.objects.get(conversation_id=conversation_id)

    message = Message.objects.create(
        conversation=conversation,
        sender=user,
        content=content,
    )

    conversation.last_message = message
    conversation.save(update_fields=["last_message", "updated_at"])

    return Message.objects.select_related("sender").get(pk=message.pk)


def serialize_message(message: Message) -> dict:
    sender = message.sender

    is_online = False
    if getattr(sender, "last_seen", None):
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
    User.objects.filter(pk=user.pk).update(last_seen=timezone.now())


@database_sync_to_async
def mark_messages_read_in_conversation(conversation_id: str, reader: User) -> int:
    qs = Message.objects.filter(conversation_id=conversation_id, is_read=False).exclude(sender=reader)
    return qs.update(is_read=True)


class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        user = self.scope.get("user")
        if not user or not user.is_authenticated:
            await self.close()
            return

        self.conversation_id = str(self.scope["url_route"]["kwargs"]["conversation_id"])
        self.group_name = f"chat_{self.conversation_id}"

        in_conv = await user_in_conversation(user, self.conversation_id)
        if not in_conv:
            await self.close()
            return

        await update_last_seen(user)

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        updated = await mark_messages_read_in_conversation(self.conversation_id, user)
        if updated:
            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "chat.read",
                    "conversation_id": self.conversation_id,
                    "reader_id": str(user.user_id),
                },
            )

    async def disconnect(self, close_code):
        user = self.scope.get("user")
        if user and user.is_authenticated:
            await update_last_seen(user)

        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive_json(self, content, **kwargs):
        user = self.scope.get("user")
        if not user or not user.is_authenticated:
            await self.close()
            return

        await update_last_seen(user)

        msg_type = content.get("type")

        if msg_type == "message":
            text = (content.get("content") or "").strip()
            if not text:
                return
            if len(text) > 2000:
                return

            message = await create_message(self.conversation_id, user, text)
            msg_data = serialize_message(message)  # ✅ bỏ await

            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "chat.message",
                    "conversation_id": self.conversation_id,
                    "data": msg_data,
                },
            )
            return

        if msg_type == "read":
            updated = await mark_messages_read_in_conversation(self.conversation_id, user)
            if updated:
                await self.channel_layer.group_send(
                    self.group_name,
                    {
                        "type": "chat.read",
                        "conversation_id": self.conversation_id,
                        "reader_id": str(user.user_id),
                    },
                )
            return

    async def chat_message(self, event):
        await self.send_json(
            {
                "type": "message",
                "conversation_id": event["conversation_id"],
                "data": event["data"],
            }
        )

    async def chat_read(self, event):
        await self.send_json(
            {
                "type": "read",
                "conversation_id": event["conversation_id"],
                "reader_id": event["reader_id"],
            }
        )
