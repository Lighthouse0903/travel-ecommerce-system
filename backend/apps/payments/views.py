from rest_framework.views import APIView
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .serializers import PaymentInitSerializer
from django.utils import timezone
from .models import Payment
from ..bookings.models import Booking
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
# API Khởi tạo thanh toán
class InitPaymentView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PaymentInitSerializer

    def create(self, request, *args, **kwargs):
        ser = self.get_serializer(data=request.data)
        ser.is_valid(raise_exception=True)
        payment = ser.save()

        checkout_url = f"https://sandbox.example/checkout/{payment.payment_id}"

        data = {
            "payment_id": str(payment.payment_id),
            "booking_id": str(payment.booking.booking_id),
            "amount": str(payment.amount),
            "status": payment.status,
            "provider": payment.provider,
            "checkout_url": checkout_url,
        }
        return Response(data, status=status.HTTP_201_CREATED)

# API Xác nhận thanh toán
@method_decorator(csrf_exempt, name='dispatch')
class PaymentCallbackView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        payment_id = request.data.get("payment_id")
        raw_success = request.data.get("success")

        if not payment_id:
            return Response({"error": "Thiếu payment_id."}, status=status.HTTP_400_BAD_REQUEST)

        # chuẩn hoá success
        success = str(raw_success).lower() in ["1", "true", "success", "ok"]

        try:
            payment = Payment.objects.select_related("booking").get(payment_id=payment_id)
        except Payment.DoesNotExist:
            return Response({"error": "Payment không tồn tại."}, status=status.HTTP_404_NOT_FOUND)

        # nếu đã thành công rồi mà callback lại
        if payment.status == Payment.SUCCESS and success:
            return Response({"message": "Payment đã được xác nhận trước đó."}, status=status.HTTP_200_OK)

        if success:
            payment.status = Payment.SUCCESS
            payment.paid_at = timezone.now()
            payment.save(update_fields=["status", "paid_at"])

            booking = payment.booking
            booking.status = Booking.PAID_WAITING
            booking.save(update_fields=["status"])

            return Response({"message": "Thanh toán thành công."}, status=status.HTTP_200_OK)
        else:
            payment.status = Payment.FAILED
            payment.save(update_fields=["status"])
            return Response({"message": "Thanh toán thất bại."}, status=status.HTTP_200_OK)