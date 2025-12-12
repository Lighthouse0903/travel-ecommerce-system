from django.urls import path
from .views import InitPaymentView, PaymentCallbackView, MomoIPNView

urlpatterns = [
    path('init/', InitPaymentView.as_view(), name='payment_init'),
    path("callback/", PaymentCallbackView.as_view(), name="payment_callback"),
    path("momo/ipn/", MomoIPNView.as_view(), name="momo-ipn"),
]