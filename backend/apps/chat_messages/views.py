from Tools.demo.mcast import sender, receiver
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.utils.representation import manager_repr
from rest_framework.views import APIView

from .serializers import MessageSendSerializer, MessageOutSerializer, MessageListSerializer, RecentThreadSerializer
from django.db.models import Q
from .models import Message
from django.contrib.auth import get_user_model
User = get_user_model()
class SendMessageView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MessageSendSerializer

    def create(self, request, *args, **kwargs):
        ser = self.get_serializer(data=request.data)
        ser.is_valid(raise_exception=True)
        msg = ser.save()
        return Response(MessageOutSerializer(msg).data, status=status.HTTP_201_CREATED)

class ConversationView(generics.ListAPIView):
    serializer_class = MessageListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        receiver_id = self.request.query_params.get("receiver_id")

        if not receiver_id:
            return Message.objects.none()

        return (
            Message.objects
            .filter(
                Q(sender=user, receiver__user_id=receiver_id) |
                Q(sender__user_id=receiver_id, receiver=user)
            )
            .select_related("sender", "receiver")
            .order_by("created_at")
        )

    def list(self, request, *args, **kwargs):
        receiver_id = request.query_params.get("receiver_id")
        if not receiver_id:
            return Response(
                {"message": "Thiếu receiver_id."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # (tuỳ chọn) kiểm tra receiver có tồn tại
        if not User.objects.filter(user_id=receiver_id).exists():
            return Response(
                {"message": "Người nhận không tồn tại."},
                status=status.HTTP_404_NOT_FOUND
            )

        queryset = self.get_queryset()
        if not queryset.exists():
            return Response(
                {"message": "Chưa có tin nhắn với người này."},
                status=status.HTTP_200_OK
            )

        page = self.paginate_queryset(queryset)
        if page is not None:
            ser = self.get_serializer(page, many=True)
            return self.get_paginated_response(ser.data)

        ser = self.get_serializer(queryset, many=True)
        return Response(ser.data, status=status.HTTP_200_OK)
class RecentThreadsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        # Lấy tối đa 200 tin gần nhất của user để gom (tuỳ bạn chỉnh)
        msgs = (Message.objects
                .filter(Q(sender=user) | Q(receiver=user))
                .select_related("sender", "receiver")
                .order_by("-created_at")[:200])

        threads = {}
        for m in msgs:
            # xác định "đối tác" ở đầu kia
            partner = m.receiver if m.sender_id == user.user_id else m.sender
            if partner.user_id not in threads:
                threads[partner.user_id] = {
                    "partner_id": partner.user_id,
                    "partner_username": partner.username,
                    "last_message": m.content,
                    "last_time": m.created_at,
                    "direction": "sent" if m.sender_id == user.user_id else "received",
                }

        data = list(threads.values())
        if not data:
            return Response(
                {"message": "Chưa có cuộc trò chuyện nào."},
                status=status.HTTP_200_OK
            )
        return Response(RecentThreadSerializer(data, many=True).data, status=status.HTTP_200_OK)