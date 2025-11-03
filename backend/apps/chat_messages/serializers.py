from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Message
from ..customers.models import Customer
from ..agencies.models import Agency

User = get_user_model()

# API gửi tin nhắn
class MessageSendSerializer(serializers.ModelSerializer):
    receiver_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = Message
        fields = ["message_id", "receiver_id", "content", "created_at"]
        read_only_fields = ["message_id", "created_at"]

    def validate(self, attrs):
        sender = self.context["request"].user
        receiver_id = attrs.get("receiver_id")

        # Kiểm tra người nhận tồn tại
        try:
            receiver = User.objects.get(user_id=receiver_id)
        except User.DoesNotExist:
            raise serializers.ValidationError({"receiver_id": "Người nhận không tồn tại."})

        # Không được gửi cho chính mình
        if receiver.user_id == sender.user_id:
            raise serializers.ValidationError({"receiver_id": "Không thể gửi tin nhắn cho chính mình."})

        # Chỉ cho phép chat giữa Customer và Agency
        is_sender_customer = Customer.objects.filter(user=sender).exists()
        is_sender_agency = Agency.objects.filter(user=sender).exists()
        is_receiver_customer = Customer.objects.filter(user=receiver).exists()
        is_receiver_agency = Agency.objects.filter(user=receiver).exists()

        valid_pair = (is_sender_customer and is_receiver_agency) or (is_sender_agency and is_receiver_customer)
        if not valid_pair:
            raise serializers.ValidationError({"receiver_id": "Chỉ cho phép chat giữa Customer và Agency."})

        attrs["__receiver"] = receiver
        return attrs

    def create(self, validated_data):
        receiver = validated_data.pop("__receiver")
        sender = self.context["request"].user
        return Message.objects.create(sender=sender, receiver=receiver, **validated_data)


class MessageOutSerializer(serializers.ModelSerializer):
    sender_username   = serializers.CharField(source="sender.username", read_only=True)
    receiver_username = serializers.CharField(source="receiver.username", read_only=True)

    class Meta:
        model = Message
        fields = ["message_id", "sender_username", "receiver_username", "content", "created_at"]
        read_only_fields = fields
# API hển thị tin nhắn
class MessageListSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source="sender.username", read_only=True)
    receiver_username = serializers.CharField(source="receiver.username", read_only=True)

    class Meta:
        model = Message
        fields = ["message_id", "sender_username", "receiver_username", "content", "created_at"]
        read_only_fields = fields

# API lấy danh sách đoạn hội thoại gần đây
class RecentThreadSerializer(serializers.Serializer):
    partner_id = serializers.UUIDField()
    partner_username = serializers.CharField()
    last_message = serializers.CharField()
    last_time = serializers.DateTimeField()
    direction = serializers.CharField()
