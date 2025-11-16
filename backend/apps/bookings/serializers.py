# apps/bookings/serializers.py
from decimal import Decimal
from rest_framework import serializers
from django.utils import timezone
from .models import Booking
from ..tours.models import Tour
from ..customers.models import Customer

class BookingCreateSerializer(serializers.ModelSerializer):
    tour_id = serializers.UUIDField(write_only=True)
    pickup_point = serializers.CharField(write_only=True)

    class Meta:
        model = Booking
        fields = [
            "booking_id",
            "tour_id",
            "travel_date",
            "num_adults",
            "num_children",
            "pickup_point",
            "total_price",
            "status",
            "booking_date",
        ]
        read_only_fields = ["booking_id", "total_price", "status", "booking_date"]

    def validate(self, attrs):
        request = self.context["request"]

        # --- 1. Lấy tour ---
        try:
            tour = Tour.objects.get(tour_id=attrs["tour_id"], is_active=True)
        except Tour.DoesNotExist:
            raise serializers.ValidationError({"tour_id": "Tour không tồn tại hoặc đã ngừng bán."})

        # --- 2. Không tự đặt tour của mình ---
        if tour.agency and tour.agency.user_id == request.user.user_id:
            raise serializers.ValidationError({"tour_id": "Bạn không thể đặt tour của chính mình."})

        # --- 3. Validate ngày ---
        travel = attrs["travel_date"]
        if travel < timezone.localdate():
            raise serializers.ValidationError({"travel_date": "Ngày khởi hành phải từ hôm nay trở đi."})

        # --- 4. Convert số người ---
        adults = int(attrs.get("num_adults", 0))
        children = int(attrs.get("num_children", 0))

        if adults < 1:
            raise serializers.ValidationError({"num_adults": "Ít nhất phải có 1 người lớn."})

        # --- 5. Validate pickup ---
        pickup_data = tour.pickup_points or []  # Fix NULL

        # fix nếu pickup_points là string JSON trong DB
        if isinstance(pickup_data, str):
            import json
            pickup_data = json.loads(pickup_data)

        valid_locations = [p.get("location") for p in pickup_data]
        pickup_input = attrs["pickup_point"]

        if pickup_input not in valid_locations:
            raise serializers.ValidationError({
                "pickup_point": f"Điểm đón không hợp lệ. Hợp lệ: {valid_locations}"
            })

        attrs["__tour"] = tour
        return attrs

    def create(self, validated_data):
        request = self.context["request"]

        customer = Customer.objects.filter(user=request.user).first()
        if not customer:
            raise serializers.ValidationError({"detail": "Tài khoản này chưa có hồ sơ Customer."})

        tour = validated_data.pop("__tour")
        validated_data.pop("tour_id", None)

        adults = int(validated_data.pop("num_adults"))
        children = int(validated_data.pop("num_children"))
        pickup_point = validated_data.pop("pickup_point")

        total = tour.adult_price * adults + tour.children_price * children

        return Booking.objects.create(
            customer=customer,
            tour=tour,
            pickup_point=pickup_point,
            num_adults=adults,
            num_children=children,
            total_price=total,
            **validated_data
        )




class BookingHistorySerializer(serializers.ModelSerializer):
    tour_name = serializers.CharField(source="tour.name", read_only=True)
    tour_image = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            "booking_id",
            "tour_id",
            "tour_name",
            "tour_image",
            "travel_date",
            "num_adults",
            "num_children",
            "pickup_point",
            "total_price",
            "status",
            "booking_date",
        ]

    def get_tour_image(self, obj):
        first_img = obj.tour.images.first()
        return first_img.image.url if first_img else None



class BookingDetailSerializer(serializers.ModelSerializer):
    tour_id = serializers.UUIDField(source="tour.tour_id", read_only=True)
    tour_name = serializers.CharField(source="tour.name", read_only=True)
    agency_name = serializers.CharField(source="tour.agency.agency_name", read_only=True)
    start_location = serializers.CharField(source="tour.start_location", read_only=True)
    end_location = serializers.CharField(source="tour.end_location", read_only=True)

    adult_price = serializers.DecimalField(source="tour.adult_price", max_digits=10, decimal_places=2, read_only=True)
    children_price = serializers.DecimalField(source="tour.children_price", max_digits=10, decimal_places=2, read_only=True)
    discount = serializers.DecimalField(source="tour.discount", max_digits=5, decimal_places=2, read_only=True)

    tour_image = serializers.SerializerMethodField()
    final_price_per_person = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            "booking_id",
            "status",
            "booking_date",
            "travel_date",

            # booking numbers
            "num_adults",
            "num_children",
            "pickup_point",
            "total_price",

            # tour info
            "tour_id",
            "tour_name",
            "agency_name",
            "start_location",
            "end_location",
            "adult_price",
            "children_price",
            "discount",
            "final_price_per_person",

            "tour_image",
        ]
        read_only_fields = fields

    def get_tour_image(self, obj):
        first_img = obj.tour.images.first()
        return first_img.image.url if first_img else None

    def get_final_price_per_person(self, obj):
        """
        Giá sau khi áp dụng discount (%)
        """
        tour = obj.tour
        discount = tour.discount or 0

        adult = tour.adult_price
        child = tour.children_price

        if discount > 0:
            adult = adult * (100 - discount) / 100
            child = child * (100 - discount) / 100

        return {
            "adult": f"{adult:.2f}",
            "children": f"{child:.2f}",
        }


class BookingListSerializer(serializers.ModelSerializer):
    tour_id = serializers.UUIDField(source="tour.tour_id", read_only=True)
    tour_name = serializers.CharField(source="tour.name", read_only=True)
    customer_name = serializers.CharField(source="customer.user.full_name", read_only=True)

    adult_price = serializers.DecimalField(source="tour.adult_price", max_digits=10, decimal_places=2, read_only=True)
    children_price = serializers.DecimalField(source="tour.children_price", max_digits=10, decimal_places=2, read_only=True)
    discount = serializers.DecimalField(source="tour.discount", max_digits=5, decimal_places=2, read_only=True)

    tour_image = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            "booking_id",
            "tour_id",
            "tour_name",
            "customer_name",

            "travel_date",
            "num_adults",
            "num_children",
            "pickup_point",
            "total_price",

            "adult_price",
            "children_price",
            "discount",

            "status",
            "booking_date",
            "tour_image",
        ]
        read_only_fields = fields

    def get_tour_image(self, obj):
        img = obj.tour.images.first()
        return img.image.url if img else None


class BookingStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['status']

    def validate_status(self, value):
        if value not in [Booking.CONFIRMED, Booking.CANCELLED]:
            raise serializers.ValidationError("Chỉ cho phép 'confirmed' hoặc 'cancelled'.")
        return value