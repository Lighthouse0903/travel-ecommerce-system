from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import MessageSendSerializer, ConversationListSerializer, MessageListSerializer, RecentThreadSerializer, MessageSerializer
from django.db.models import Q, Max
from .models import Message
from django.contrib.auth import get_user_model
User = get_user_model()
class SendMessageView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MessageSendSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        message = serializer.save()

        # Dữ liệu trả về
        data = {
            "message_id": str(message.message_id),
            "sender_id": str(message.sender.user_id),
            "receiver_id": str(message.receiver.user_id),
            "content": message.content,
            "created_at": message.created_at,
        }

        return Response(
            {
                "data": data,
                "message": "Gửi tin nhắn thành công.",
            },
            status=status.HTTP_201_CREATED,
        )

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
                Q(sender=user, receiver__user_id=receiver_id)
                | Q(sender__user_id=receiver_id, receiver=user)
            )
            .select_related("sender", "receiver")
            .order_by("created_at")
        )

    def list(self, request, *args, **kwargs):
        receiver_id = request.query_params.get("receiver_id")
        if not receiver_id:
            return Response(
                {"message": "Thiếu receiver_id.", "data": None},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Kiểm tra người nhận tồn tại
        if not User.objects.filter(user_id=receiver_id).exists():
            return Response(
                {"message": "Người nhận không tồn tại.", "data": None},
                status=status.HTTP_404_NOT_FOUND
            )

        queryset = self.get_queryset()
        if not queryset.exists():
            return Response(
                {"message": "Chưa có tin nhắn với người này.", "data": []},
                status=status.HTTP_200_OK
            )

        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page or queryset, many=True)

        data = serializer.data
        if page is not None:
            # Nếu có phân trang
            paginated = self.get_paginated_response(data)
            return Response(
                {
                    "message": "Lấy danh sách tin nhắn thành công.",
                    "data": paginated.data
                },
                status=status.HTTP_200_OK
            )

        # Không phân trang
        return Response(
            {
                "message": "Lấy danh sách tin nhắn thành công.",
                "data": data
            },
            status=status.HTTP_200_OK
        )
class RecentThreadsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        # Lấy tối đa 200 tin gần nhất của user để gom (tuỳ chỉnh theo nhu cầu)
        msgs = (
            Message.objects
            .filter(Q(sender=user) | Q(receiver=user))
            .select_related("sender", "receiver")
            .order_by("-created_at")[:200]
        )

        threads = {}
        for m in msgs:
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
                {
                    "message": "Chưa có cuộc trò chuyện nào.",
                    "data": []
                },
                status=status.HTTP_200_OK
            )

        ser = RecentThreadSerializer(data, many=True)
        return Response(
            {
                "message": "Lấy danh sách cuộc trò chuyện gần nhất thành công.",
                "data": ser.data
            },
            status=status.HTTP_200_OK
        )

class ConversationListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ConversationListSerializer

    def list(self, request, *args, **kwargs):
        user = request.user

        # Lấy list sender/receiver + thời gian tin nhắn cuối
        partners = (
            Message.objects
            .filter(Q(sender=user) | Q(receiver=user))
            .values("sender_id", "receiver_id")
            .annotate(last_time=Max("created_at"))
            .order_by("-last_time")
        )

        conversations = []
        added = set()

        for p in partners:
            # Xác định ai là receiver (partner)
            partner_id = (
                p["receiver_id"] if p["sender_id"] == user.user_id else p["sender_id"]
            )

            if partner_id in added:
                continue
            added.add(partner_id)

            partner = User.objects.filter(user_id=partner_id).first()
            if not partner:
                continue

            # Lấy tin nhắn cuối cùng giữa user & partner
            last_msg = (
                Message.objects.filter(
                    (Q(sender=user) & Q(receiver=partner)) |
                    (Q(sender=partner) & Q(receiver=user))
                )
                .order_by("-created_at")
                .first()
            )

            conversations.append({
                "receiver_id": partner.user_id,
                "receiver_name": partner.full_name,
                "last_message": last_msg.content if last_msg else "",
                "last_message_time": last_msg.created_at if last_msg else None,
            })

        serializer = self.get_serializer(conversations, many=True)
        return Response({
            "data": serializer.data,
            "message": "Lấy danh sách đoạn hội thoại thành công."
        })

class ConversationDetailView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        receiver_id = self.kwargs.get("receiver_id")

        # Validate receiver có tồn tại không
        receiver = User.objects.filter(user_id=receiver_id).first()
        if not receiver:
            return Message.objects.none()

        # lấy tất cả tin nhắn giữa user & receiver
        return (
            Message.objects
            .filter(
                Q(sender=user, receiver=receiver) |
                Q(sender=receiver, receiver=user)
            )
            .order_by("created_at")
        )

    def list(self, request, *args, **kwargs):
        receiver_id = kwargs.get("receiver_id")
        receiver = User.objects.filter(user_id=receiver_id).first()

        if not receiver:
            return Response(
                {"data": [], "message": "Người nhận không tồn tại."},
                status=404
            )

        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        return Response({
            "receiver_id": receiver.user_id,
            "receiver_name": receiver.full_name,
            "data": serializer.data,
            "message": "Lấy lịch sử tin nhắn thành công."
        })