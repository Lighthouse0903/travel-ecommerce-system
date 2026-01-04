from django.urls import path
from .views import chatbot_proxy

urlpatterns = [
    path("chatbot/", chatbot_proxy),
]