
from datetime import timedelta

from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import serializers

from .models import Conversation, Message

User = get_user_model()


class SimpleUserSerializer(serializers.ModelSerializer):
    """User rút gọn để hiển thị partner/sender."""

    is_online = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("user_id", "full_name", "username", "is_online")

    def get_is_online(self, obj):
        if not getattr(obj, "last_seen", None):
            return False
        return timezone.now() - obj.last_seen < timedelta(minutes=2)


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
        request = self.context.get("request")
        current_user = getattr(request, "user", None)

        if current_user is None or not getattr(current_user, "is_authenticated", False):
            return None

        partner = obj.user2 if obj.user1 == current_user else obj.user1
        return SimpleUserSerializer(partner, context=self.context).data

    def get_unread_count(self, obj):
        """Đếm số tin nhắn chưa đọc do partner gửi."""
        request = self.context.get("request")
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

    def validate_content(self, value):
        value = (value or "").strip()
        if not value:
            raise serializers.ValidationError("Nội dung tin nhắn không được để trống.")
        # optional: giới hạn độ dài để tránh spam/DB bloat
        if len(value) > 2000:
            raise serializers.ValidationError("Nội dung tin nhắn quá dài (tối đa 2000 ký tự).")
        return value


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
