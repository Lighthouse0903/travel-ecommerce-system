from rest_framework.views import APIView
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .serializers import PaymentInitSerializer
from django.utils import timezone
from .models import Payment
from ..bookings.models import Booking
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import traceback, hmac, hashlib, json, logging
from django.conf import settings

logger = logging.getLogger(__name__)

MOMO_ACCESS_KEY = settings.MOMO_ACCESS_KEY
MOMO_SECRET_KEY = settings.MOMO_SECRET_KEY
MOMO_PARTNER_CODE = settings.MOMO_PARTNER_CODE

# API Khởi tạo thanh toán
class InitPaymentView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PaymentInitSerializer

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            payment = serializer.save()

            data = {
                "payment_id": str(payment.payment_id),
                "booking_id": str(payment.booking.booking_id),
                "amount": str(payment.amount),
                "status": payment.status,
                "provider": payment.provider,
                "pay_url": payment.pay_url,
            }

            return Response(
                {
                    "data": data,
                    "message": "Khởi tạo thanh toán thành công."
                },
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            print("LỖI TRONG API KHỞI TẠO THANH TOÁN:")
            traceback.print_exc()  # In lỗi chi tiết ra terminal
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

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


class MomoIPNView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request, *args, **kwargs):
        data = request.data
        try:
            required_fields = [
                "partnerCode", "orderId", "requestId", "amount",
                "orderInfo", "orderType", "transId", "resultCode",
                "message", "payType", "responseTime", "extraData",
                "signature"
            ]

            for f in required_fields:
                if f not in data:
                    return Response({"message": f"Thiếu trường {f}"}, status=400)

            received_signature = data["signature"]

            raw_signature = (
                    "accessKey=" + str(MOMO_ACCESS_KEY) +
                    "&amount=" + str(data["amount"]) +
                    "&extraData=" + str(data["extraData"]) +
                    "&message=" + str(data["message"]) +
                    "&orderId=" + str(data["orderId"]) +
                    "&orderInfo=" + str(data["orderInfo"]) +
                    "&orderType=" + str(data["orderType"]) +
                    "&partnerCode=" + str(data["partnerCode"]) +
                    "&payType=" + str(data["payType"]) +
                    "&requestId=" + str(data["requestId"]) +
                    "&responseTime=" + str(data["responseTime"]) +
                    "&resultCode=" + str(data["resultCode"]) +
                    "&transId=" + str(data["transId"])
            )

            cal_signature = hmac.new(
                MOMO_SECRET_KEY.encode("utf-8"),
                raw_signature.encode("utf-8"),
                hashlib.sha256
            ).hexdigest()

            if cal_signature != received_signature:
                return Response({"message": "Invalid signature"}, status=400)

            try:
                payment = Payment.objects.select_related("booking").get(
                    transaction_id=data["orderId"]
                )
            except Payment.DoesNotExist:
                return Response({"message": "Payment không tồn tại"}, status=404)

            booking = payment.booking

            result_code = int(data["resultCode"])

            if result_code == 0:
                payment.status = Payment.SUCCESS
                payment.paid_at = timezone.now()
                payment.extra_data = data
                payment.save(update_fields=["status", "paid_at", "extra_data"])

                booking.status = Booking.PAID_WAITING
                booking.save(update_fields=["status"])

                return Response({
                    "partnerCode": data["partnerCode"],
                    "orderId": data["orderId"],
                    "requestId": data["requestId"],
                    "resultCode": 0,
                    "message": "Thành công"
                })

            else:
                payment.status = Payment.FAILED
                payment.extra_data = data
                payment.save(update_fields=["status", "extra_data"])

                booking.status = Booking.CANCELLED
                booking.save(update_fields=["status"])

                return Response({
                    "partnerCode": data["partnerCode"],
                    "orderId": data["orderId"],
                    "requestId": data["requestId"],
                    "resultCode": result_code,
                    "message": "Thất bại"
                })
        except Exception as e:
            print("\nLỖI IPN MoMo:")
            traceback.print_exc()
            return Response(
                {"message": "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau."},
                status=500,
            )
