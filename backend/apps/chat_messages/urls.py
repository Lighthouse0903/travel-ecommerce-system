from django.urls import path
from .views import SendMessageView, ConversationView, RecentThreadsView, ConversationListView, ConversationDetailView

urlpatterns = [
    path('send/', SendMessageView.as_view(), name='message_send'),
    path('', ConversationView.as_view(), name='conversation'),
    path("conversations/", ConversationListView.as_view(), name="conversation_list"),
    path("conversations/<uuid:receiver_id>/", ConversationDetailView.as_view(), name="conversation_detail"),
    path('recents/', RecentThreadsView.as_view(), name='recent_threads')
]