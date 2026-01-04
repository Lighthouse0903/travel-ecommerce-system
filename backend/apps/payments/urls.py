from django.urls import path
from .views import InitPaymentView, MomoIPNView

urlpatterns = [
    path('init/', InitPaymentView.as_view(), name='payment_init'),
    path("momo/ipn/", MomoIPNView.as_view(), name="momo-ipn"),
]