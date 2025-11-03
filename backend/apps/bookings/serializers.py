# apps/bookings/serializers.py
from decimal import Decimal
from rest_framework import serializers
from django.utils import timezone
from .models import Booking
from ..tours.models import Tour
from ..customers.models import Customer

class BookingCreateSerializer(serializers.ModelSerializer):
    tour_id = serializers.UUIDField(write_only=True)
    travel_date = serializers.DateField()

    class Meta:
        model = Booking
        # KHÔNG cho client gửi customer_id; lấy từ request.user
        fields = ["booking_id", "tour_id", "booking_date", "travel_date",
                  "num_people", "total_price", "status"]
        read_only_fields = ["booking_id", "total_price", "status", "booking_date"]

    def validate(self, attrs):
        request = self.context["request"]
        # 1) Tour tồn tại & đang hoạt động
        try:
            tour = Tour.objects.get(tour_id=attrs["tour_id"], is_active=True)
        except Tour.DoesNotExist:
            raise serializers.ValidationError({"tour_id": "Tour không tồn tại hoặc đã ngừng bán."})
        if tour.agency and tour.agency.user_id == request.user.user_id:
            raise serializers.ValidationError({"tour_id": "Bạn không thể đặt tour của chính mình."})
        # 2) Ngày đi hợp lệ
        if attrs["travel_date"] < timezone.localdate():
            raise serializers.ValidationError({"travel_date": "Ngày khởi hành phải từ hôm nay trở đi."})

        # 3) Số người hợp lệ
        if attrs["num_people"] < 1:
            raise serializers.ValidationError({"num_people": "Ít nhất 1 người."})

        # giữ lại tour để dùng ở create()
        attrs["__tour"] = tour
        return attrs

    def create(self, validated_data):
        request = self.context["request"]
        user = request.user

        customer = Customer.objects.filter(user=user).first()
        if not customer:
            raise serializers.ValidationError({"detail": "Tài khoản này chưa có hồ sơ Customer."})

        tour = validated_data.pop("__tour")
        validated_data.pop("tour_id", None)

        total = (tour.price or Decimal("0")) * Decimal(validated_data["num_people"])

        return Booking.objects.create(
            customer=customer,
            tour=tour,
            total_price=total,
            **validated_data
        )

class BookingHistorySerializer(serializers.ModelSerializer):
    tour_name = serializers.CharField(source="tour.name", read_only=True)

    class Meta:
        model = Booking
        fields = [
            "booking_id",
            "tour_id",
            "tour_name",
            "travel_date",
            "num_people",
            "total_price",
            "status",
            "booking_date",
        ]


class BookingDetailSerializer(serializers.ModelSerializer):
    tour_id = serializers.UUIDField(source="tour.tour_id", read_only=True)
    tour_name = serializers.CharField(source="tour.name", read_only=True)
    agency_name = serializers.CharField(source="tour.agency.company_name", read_only=True)
    start_location = serializers.CharField(source="tour.start_location", read_only=True)
    end_location = serializers.CharField(source="tour.end_location", read_only=True)
    price_per_person = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            "booking_id", "status", "booking_date",
            "travel_date", "num_people", "total_price",
            "tour_id", "tour_name", "agency_name",
            "start_location", "end_location", "price_per_person",
        ]
        read_only_fields = fields

    def get_price_per_person(self, obj):
        return getattr(obj.tour, "price", None)

class BookingListSerializer(serializers.ModelSerializer):
    tour_name = serializers.CharField(source="tour.name", read_only=True)
    customer_name = serializers.CharField(source="customer.user.full_name", read_only=True)

    class Meta:
        model = Booking
        fields = [
            "booking_id", "tour_name", "customer_name",
            "travel_date", "num_people", "total_price",
            "status", "booking_date"
        ]
        read_only_fields = fields

class BookingStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['status']

    def validate_status(self, value):
        if value not in [Booking.CONFIRMED, Booking.CANCELLED]:
            raise serializers.ValidationError("Chỉ cho phép 'confirmed' hoặc 'cancelled'.")
        return value