from django.urls import path
from .views import InitPaymentView, PaymentCallbackView

urlpatterns = [
    path('init/', InitPaymentView.as_view(), name='payment_init'),
    path("callback/", PaymentCallbackView.as_view(), name="payment_callback"),
]
