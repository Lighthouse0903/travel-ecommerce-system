from rest_framework import serializers
from .models import Payment
from ..bookings.models import Booking
from .utils.momo_client import create_momo_payment


class PaymentInitSerializer(serializers.ModelSerializer):
    booking_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = Payment
        fields = ["payment_id", "booking_id", "amount", "provider", "status", "created_at"]
        read_only_fields = ["payment_id", "amount", "provider", "status", "created_at"]

    def validate(self, attrs):
        user = self.context["request"].user
        try:
            booking = Booking.objects.select_related("customer__user").get(
                booking_id=attrs["booking_id"],
                customer__user=user
            )
        except Booking.DoesNotExist:
            raise serializers.ValidationError({"booking_id": "Booking không hợp lệ."})

        # Nếu đã có payment SUCCESS thì không cho thanh toán lại
        if hasattr(booking, "payment") and booking.payment.status == Payment.SUCCESS:
            raise serializers.ValidationError("Booking này đã thanh toán thành công.")

        # Chỉ cho phép tạo thanh toán khi booking đang ở trạng thái chờ thanh toán
        if booking.status != Booking.PAID_WAITING:
            raise serializers.ValidationError(
                "Booking chưa sẵn sàng để thanh toán (cần được duyệt trước)."
            )

        attrs["__booking"] = booking
        return attrs

    def create(self, validated):
        booking = validated.pop("__booking")

        # Tạo hoặc cập nhật Payment (1 booking - 1 payment)
        payment, created = Payment.objects.get_or_create(
            booking=booking,
            defaults={
                "amount": booking.total_price,
                "provider": "momo",
                "status": Payment.PENDING,
            },
        )

        # Nếu booking đổi giá thì cập nhật lại amount
        if not created and payment.amount != booking.total_price:
            payment.amount = booking.total_price
            payment.save(update_fields=["amount"])

        # (optional) nếu payment đã success thì không tạo lại
        if payment.status == Payment.SUCCESS:
            return payment

        momo_response = create_momo_payment(
            amount=payment.amount,
            order_info=f"Thanh toán booking {booking.booking_id}",
            booking_id=str(booking.booking_id),
        )

        pay_url = momo_response.get("payUrl")
        order_id = momo_response.get("orderId")

        payment.transaction_id = order_id
        payment.extra_data = momo_response
        payment.pay_url = pay_url
        payment.provider = "momo"
        payment.status = Payment.PENDING
        payment.save(update_fields=["transaction_id", "extra_data", "pay_url", "provider", "status"])

        return payment
