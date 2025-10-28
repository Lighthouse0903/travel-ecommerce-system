from django.urls import path
from .views import SendMessageView, ConversationView

urlpatterns = [
    path('send/', SendMessageView.as_view(), name='message_send'),
    path('conversation/', ConversationView.as_view(), name='conversation')
]