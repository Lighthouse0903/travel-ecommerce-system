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

        if hasattr(booking, "payment") and booking.payment.status == Payment.SUCCESS:
            raise serializers.ValidationError("Booking này đã thanh toán thành công.")

        attrs["__booking"] = booking
        return attrs

    def create(self, validated):
        booking = validated.pop("__booking")

        # Tạo hoặc cập nhật Payment
        payment, created = Payment.objects.get_or_create(
            booking=booking,
            defaults={
                "amount": booking.total_price,
                "provider": "momo",
                "status": Payment.PENDING,
            },
        )

        if not created and payment.amount != booking.total_price:
            payment.amount = booking.total_price
            payment.save(update_fields=["amount"])

        momo_response = create_momo_payment(
            amount=payment.amount,
            order_info=f"Thanh toán booking {booking.booking_id}"
        )

        pay_url = momo_response.get("payUrl")
        order_id = momo_response.get("orderId")

        payment.transaction_id = order_id
        payment.extra_data = momo_response
        payment.pay_url = pay_url
        payment.save(update_fields=["transaction_id", "extra_data", "pay_url"])

        return payment