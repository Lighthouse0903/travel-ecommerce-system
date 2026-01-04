from django.contrib.auth import get_user_model
from django.db.models import Q
from django.shortcuts import get_object_or_404

from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from .models import Conversation, Message
from .serializers import (
    ConversationListSerializer,
    MessageListSerializer,
    ConversationDetailSerializer,
)

User = get_user_model()


# =====================================
# 1) LẤY DANH SÁCH CONVERSATION
# =====================================
class ConversationListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ConversationListSerializer

    def get_queryset(self):
        user = self.request.user
        return (
            Conversation.objects.filter(Q(user1=user) | Q(user2=user))
            .select_related("user1", "user2", "last_message")
            .order_by("-updated_at")
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

    def list(self, request, *args, **kwargs):
        """
        GET /api/chat/conversations/
        Trả về: { message, data: [...] }
        """
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        return Response(
            {
                "message": "Lấy danh sách cuộc trò chuyện thành công.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )


# =====================================
# 2) LẤY + GỬI TIN NHẮN TRONG 1 CONVERSATION
# =====================================
class ConversationMessagesView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MessageListSerializer

    def get_conversation(self):
        conv_id = self.kwargs["conversation_id"]
        conversation = get_object_or_404(Conversation, conversation_id=conv_id)

        user = self.request.user
        if conversation.user1 != user and conversation.user2 != user:
            raise PermissionDenied("Bạn không thuộc cuộc trò chuyện này.")

        return conversation

    def get_queryset(self):
        conversation = self.get_conversation()
        user = self.request.user

        # Auto mark read
        conversation.messages.filter(
            is_read=False
        ).exclude(sender=user).update(is_read=True)

        return conversation.messages.select_related("sender").order_by("created_at")

    def list(self, request, *args, **kwargs):
        """
        GET /api/chat/conversations/<id>/messages/
        """
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        return Response(
            {
                "message": "Lấy danh sách tin nhắn thành công.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def create(self, request, *args, **kwargs):
        """
        POST /api/chat/conversations/<id>/messages/
        Body: { "content": "..." }
        """
        conversation = self.get_conversation()
        user = self.request.user

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        message = serializer.save(
            conversation=conversation,
            sender=user,
        )

        # cập nhật last_message
        conversation.last_message = message
        conversation.save(update_fields=["last_message", "updated_at"])

        # serialize lại message sau khi save (để có sender)
        response_serializer = self.get_serializer(message)

        return Response(
            {
                "message": "Gửi tin nhắn thành công.",
                "data": response_serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )


# =====================================
# 3) BẮT ĐẦU HOẶC LẤY CONVERSATION
# =====================================
class StartConversationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        partner_id = request.data.get("partner_id")

        if not partner_id:
            return Response(
                {
                    "message": "Thiếu partner_id.",
                    "data": None,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if str(user.user_id) == str(partner_id):
            return Response(
                {
                    "message": "Không thể nhắn với chính mình.",
                    "data": None,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        partner = get_object_or_404(User, user_id=partner_id)

        # Sắp xếp user1, user2 để tránh trùng cặp
        if user.user_id < partner.user_id:
            u1, u2 = user, partner
        else:
            u1, u2 = partner, user

        conversation, created = Conversation.objects.get_or_create(
            user1=u1,
            user2=u2,
        )

        data = ConversationListSerializer(
            conversation, context={"request": request}
        ).data

        return Response(
            {
                "message": "Tạo hoặc lấy cuộc trò chuyện thành công.",
                "data": data,
            },
            status=status.HTTP_200_OK,
        )


# =====================================
# 4) CHI TIẾT CONVERSATION
# =====================================
class ConversationDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ConversationDetailSerializer
    lookup_field = "conversation_id"

    def get_queryset(self):
        user = self.request.user
        return Conversation.objects.filter(Q(user1=user) | Q(user2=user))

    def get_object(self):
        conversation = super().get_object()
        user = self.request.user

        if conversation.user1 != user and conversation.user2 != user:
            raise PermissionDenied("Bạn không thuộc cuộc trò chuyện này.")

        return conversation

    def retrieve(self, request, *args, **kwargs):
        """
        GET /api/chat/conversations/<id>/
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        return Response(
            {
                "message": "Lấy chi tiết cuộc trò chuyện thành công.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )
