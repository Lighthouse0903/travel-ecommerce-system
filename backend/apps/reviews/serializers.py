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

    def validate_rating(self, value):
        if value is None:
            raise serializers.ValidationError("rating là bắt buộc.")
        if not (0 <= value <= 5):
            raise serializers.ValidationError("rating phải trong khoảng 0–5.")
        return value

    def validate(self, attrs):
        user = self.context["request"].user

        booking_id = attrs.get("booking_id")
        if not booking_id:
            raise serializers.ValidationError({"booking_id": "Thiếu booking_id."})

        try:
            booking = (
                Booking.objects
                .select_related("customer__user", "tour")
                .get(booking_id=booking_id, customer__user=user)
            )
        except Booking.DoesNotExist:
            raise serializers.ValidationError({"booking_id": "Không tìm thấy booking của bạn."})

        # Chỉ đánh giá sau ngày đi
        if booking.travel_date > timezone.localdate():
            raise serializers.ValidationError({"booking_id": "Bạn chỉ được đánh giá sau khi đã đi tour."})

        # Phải đã xác nhận
        if booking.status != Booking.CONFIRMED:
            raise serializers.ValidationError({"booking_id": "Booking chưa được xác nhận, không thể đánh giá."})

        # Mỗi booking chỉ 1 review
        if Review.objects.filter(booking=booking).exists():
            raise serializers.ValidationError({"booking_id": "Booking này đã được đánh giá rồi."})

        attrs["__booking"] = booking
        return attrs

    def create(self, validated_data):
        booking = validated_data.pop("__booking")
        validated_data.pop("booking_id", None)
        return Review.objects.create(booking=booking, **validated_data)
# API xem danh sách review của 1 tour
class ReviewListItemSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source="booking.customer.user.full_name", read_only=True)

    # thêm mới
    user_id = serializers.UUIDField(source="booking.customer.user.user_id", read_only=True)
    customer_id = serializers.UUIDField(source="booking.customer.customer_id", read_only=True)

    class Meta:
        model = Review
        fields = [
            "review_id",
            "rating",
            "comment",
            "customer_name",
            "user_id",
            "customer_id",
            "created_at"
        ]
        read_only_fields = fields

    def to_representation(self, instance):
        data = super().to_representation(instance)

        # Nếu review bị xóa → ẩn comment
        if instance.is_deleted:
            data["comment"] = None

        return data
# API Sửa comment
class ReviewUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ["comment"]
