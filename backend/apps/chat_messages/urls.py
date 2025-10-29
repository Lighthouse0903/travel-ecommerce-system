from django.urls import path
from .views import SendMessageView, ConversationView, RecentThreadsView

urlpatterns = [
    path('send/', SendMessageView.as_view(), name='message_send'),
    path('conversation/', ConversationView.as_view(), name='conversation'),
    path('recents/', RecentThreadsView.as_view(), name='recent_threads')
]