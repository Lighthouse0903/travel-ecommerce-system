from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Conversation, Message
from datetime import timedelta
from django.utils import timezone

User = get_user_model()


class SimpleUserSerializer(serializers.ModelSerializer):
    """User rút gọn để hiển thị partner."""

    is_online = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ("user_id", "full_name", "username","is_online")

    def get_is_online(self, obj):
        if not obj.last_seen:
            return False
        return timezone.now() - obj.last_seen < timedelta(minutes=2)  # online nếu hoạt động trong 2p gần đây


class MessageSerializer(serializers.ModelSerializer):
    sender = SimpleUserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ("message_id", "sender", "content", "is_read", "created_at")


class ConversationListSerializer(serializers.ModelSerializer):
    partner = serializers.SerializerMethodField()
    last_message = MessageSerializer(read_only=True)
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = (
            "conversation_id",
            "partner",
            "last_message",
            "updated_at",
            "unread_count",
        )

    def get_partner(self, obj):
        """Trả về user còn lại trong cuộc trò chuyện (partner)."""
        request = self.context.get("request", None)
        current_user = getattr(request, "user", None)

        # Nếu không có request hoặc user → khỏi tính partner (tránh lỗi 500)
        if current_user is None or not getattr(current_user, "is_authenticated", False):
            return None

        if obj.user1 == current_user:
            partner = obj.user2
        else:
            partner = obj.user1

        return SimpleUserSerializer(partner).data

    def get_unread_count(self, obj):
        """Đếm số tin nhắn chưa đọc do partner gửi."""
        request = self.context.get("request", None)
        current_user = getattr(request, "user", None)

        if current_user is None or not getattr(current_user, "is_authenticated", False):
            return 0

        return obj.messages.filter(is_read=False).exclude(sender=current_user).count()


class MessageListSerializer(serializers.ModelSerializer):
    sender = SimpleUserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ("message_id", "sender", "content", "is_read", "created_at")
        read_only_fields = ("message_id", "sender", "is_read", "created_at")


class ConversationDetailSerializer(serializers.ModelSerializer):
    user1 = SimpleUserSerializer(read_only=True)
    user2 = SimpleUserSerializer(read_only=True)

    class Meta:
        model = Conversation
        fields = (
            "conversation_id",
            "user1",
            "user2",
            "created_at",
            "updated_at",
        )
