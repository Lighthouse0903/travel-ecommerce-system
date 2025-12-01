from django.db import models
from django.conf import settings
from django.db.models import Q, F
import uuid


class Conversation(models.Model):
    conversation_id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False
    )

    user1 = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="conversations_as_user1",
    )
    user2 = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="conversations_as_user2",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Hỗ trợ load sidebar nhanh
    last_message = models.ForeignKey(
        "Message",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="+",
        to_field="message_id",
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user1", "user2"],
                name="unique_conversation_between_two_users",
            ),
            models.CheckConstraint(
                check=~Q(user1=F("user2")),
                name="prevent_self_conversation",
            ),
        ]

    def __str__(self):
        return f"Conversation giữa {self.user1} và {self.user2}"

    def save(self, *args, **kwargs):
        # đảm bảo luôn user1_id < user2_id để không trùng cặp
        if self.user1_id and self.user2_id and self.user1_id > self.user2_id:
            self.user1_id, self.user2_id = self.user2_id, self.user1_id
        super().save(*args, **kwargs)

    @staticmethod
    def get_or_create_conversation(userA, userB):
        if userA.user_id < userB.user_id:
            u1, u2 = userA, userB
        else:
            u1, u2 = userB, userA

        conv, created = Conversation.objects.get_or_create(user1=u1, user2=u2)
        return conv


class Message(models.Model):
    message_id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False
    )

    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name="messages",
    )

    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="sent_messages",
    )

    content = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Tin nhắn từ {self.sender} lúc {self.created_at}"
