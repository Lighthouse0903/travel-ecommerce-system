from rest_framework import serializers
from django.utils import timezone
from .models import Review
from ..bookings.models import Booking


# API tạo review
class ReviewCreateSerializer(serializers.ModelSerializer):
    booking_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = Review
        fields = ["review_id", "booking_id", "rating", "comment", "created_at"]
        read_only_fields = ["review_id", "created_at"]

    def validate(self, attrs):
        user = self.context["request"].user
        try:
            booking = Booking.objects.select_related("customer", "tour").get(
                booking_id=attrs["booking_id"],
                customer__user=user
            )
        except Booking.DoesNotExist:
            raise serializers.ValidationError("Không tìm thấy booking của bạn.")

        # Kiểm tra ngày đi
        if booking.travel_date > timezone.localdate():
            raise serializers.ValidationError("Bạn chỉ được đánh giá sau khi đã đi tour.")

        # Kiểm tra trạng thái booking
        if booking.status != Booking.CONFIRMED:
            raise serializers.ValidationError("Booking chưa được xác nhận, không thể đánh giá.")

        # Kiểm tra trùng review
        if hasattr(booking, "review"):
            raise serializers.ValidationError("Booking này đã được đánh giá rồi.")

        attrs["__booking"] = booking
        return attrs

    def create(self, validated_data):
        booking = validated_data.pop("__booking")
        validated_data.pop("booking_id", None)
        return Review.objects.create(booking=booking, **validated_data)

# API xem danh sách review của 1 tour
class ReviewListItemSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source="booking.customer.user.full_name", read_only=True)

    class Meta:
        model = Review
        fields = ["review_id", "rating", "comment", "customer_name", "created_at"]
        read_only_fields = fields
    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.is_deleted:
            data['comment'] = None
        return data
# API Sửa comment
class ReviewUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ["comment"]
