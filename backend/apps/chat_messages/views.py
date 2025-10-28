from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .serializers import MessageSendSerializer, MessageOutSerializer, MessageListSerializer
from django.db.models import Q
from .models import Message
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

        return Message.objects.filter(
            Q(sender=user, receiver__user_id=receiver_id) |
            Q(sender__user_id=receiver_id, receiver=user)
        ).order_by("created_at")