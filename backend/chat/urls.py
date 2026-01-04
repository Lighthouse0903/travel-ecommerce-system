# chat/urls.py
from django.urls import path
from .views import (
    ConversationListView,
    ConversationDetailView,
    ConversationMessagesView,
    StartConversationView,

)

urlpatterns = [
    path("conversations/", ConversationListView.as_view(), name="conversation-list"),
    path(
        "conversations/start/",
        StartConversationView.as_view(),
        name="conversation-start",
    ),
    path(
        "conversations/<uuid:conversation_id>/",
        ConversationDetailView.as_view(),
        name="conversation-detail",
    ),
    path(
        "conversations/<uuid:conversation_id>/messages/",
        ConversationMessagesView.as_view(),
        name="conversation-messages",
    ),
    
]
