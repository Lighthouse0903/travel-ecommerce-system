from decimal import Decimal
from rest_framework import serializers
from django.utils import timezone
from .models import Booking
from ..tours.models import Tour
from ..customers.models import Customer

class BookingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            "booking_id",
            "tour",
            "travel_date",
            "num_adults",
            "num_children",
            "note",
            "total_price",
            "status",
            "booking_date",
        ]
        read_only_fields = [
            "booking_id",
            "total_price",
            "status",
            "booking_date",
        ]

    def validate(self, attrs):
        request = self.context["request"]
        tour = attrs['tour']

        # Tour phải còn hoạt đọng
        if not tour.is_active:
            raise serializers.ValidationError({
                "tour":"Tour không tồn tại hoặc đã ngừng bán"
            })
        
        # Ko được đặt tour của chính mình
        if tour.agency and tour.agency.user_id == request.user.user_id:
            raise serializers.ValidationError({
                "tour": "Bạn không thể đặt tour của chính mình."
            })
        

        #  Validate ngày khởi hành
        travel = attrs["travel_date"]
        if travel < timezone.localdate():
            raise serializers.ValidationError({"travel_date": "Ngày khởi hành phải từ hôm nay trở đi."})

        # Validate số người 
        adults = int(attrs.get("num_adults", 0))
        if adults < 1:
            raise serializers.ValidationError({
                "num_adults": "Ít nhất phải có 1 người lớn."
            })

        return attrs
       
    
    def create(self, validated_data):
        request = self.context["request"]

        customer = Customer.objects.filter(user= request.user).first()
        if not customer:
            raise serializers.ValidationError({
                "detail": "Tài khoản này chưa có hồ sơ Customer."
            })
        
        tour = validated_data["tour"]
        adults =int(validated_data['num_adults'])
        children = int(validated_data.get("num_children", 0))

        total = (
            Decimal(tour.adult_price or 0) * Decimal(adults)
            + Decimal(tour.children_price or 0) * Decimal(children)
        )

        # áp dụng discount nếu có
        discount = Decimal(tour.discount or 0)
        if discount > 0:
            total = total * (Decimal("100") - discount) / Decimal("100")
        
        return Booking.objects.create(
            customer=customer,
            status=Booking.PENDING,
            total_price=total,
            **validated_data
        )
    

# Danh sách booking của khách hàng
class CustomerBookingListSerializer(serializers.ModelSerializer):
    tour_name = serializers.CharField(source= "tour.name",read_only =True)
    class Meta:
        model=Booking
        fields = [
            "booking_id",
            "booking_date",
            "travel_date",
            "num_adults",
            "num_children",
            "total_price",
            "status",
            "tour_name",
        ]


# chi tiết Booking bên phía khách hàng
class CustomerBookingDetailSerializer(serializers.ModelSerializer):
    tour_id = serializers.UUIDField(source="tour.tour_id",read_only=True)
    tour_name = serializers.CharField(source="tour.name", read_only=True)
    categories = serializers.ListField(
        source="tour.categories",
        read_only=True
    )
    departure_location = serializers.CharField(source="tour.departure_location", read_only=True)
    destination = serializers.CharField(source="tour.destination", read_only=True)
    customer_name = serializers.CharField(source="customer.user.full_name", read_only=True)
    customer_email = serializers.EmailField(source="customer.user.email", read_only=True)
    customer_phone = serializers.CharField(source="customer.user.phone", read_only=True)
    
    thumbnail_url = serializers.SerializerMethodField()
    class Meta:
        model=Booking
        fields = [
            "booking_id",
            "booking_date",
            "travel_date",
            "num_adults",
            "num_children",
            "note",
            "categories",
            "total_price",
            "status",
            "approved_at",
            "paid_at",
            "rejected_at",
            "rejected_reason",
            "tour_id",
            "tour_name",
            "thumbnail_url",
            "departure_location",
            "destination",
            "customer_name",
            "customer_email",
            "customer_phone"
        ]
    def get_thumbnail_url(self, obj):
        """
        TourThumbnail related_name='thumbnail'
        Field ảnh: TourThumbnail.thumbnail
        => URL: obj.tour.thumbnail.thumbnail.url
        """
        tour = getattr(obj, "tour", None)
        if not tour:
            return None

        thumb_obj = getattr(tour, "thumbnail", None)  # TourThumbnail instance
        if not thumb_obj or not getattr(thumb_obj, "thumbnail", None):
            return None

        try:
            url = thumb_obj.thumbnail.url
        except Exception:
            return None

        request = self.context.get("request")
        return request.build_absolute_uri(url) if request else url

# Danh sách booking của đại lý
class AgencyBookingListSerializer(serializers.ModelSerializer):
    tour_name = serializers.CharField(source="tour.name", read_only=True)
    customer_name = serializers.CharField(
        source="customer.user.username", read_only=True
    )
    customer_email = serializers.EmailField(
        source="customer.user.email", read_only=True
    )

    class Meta:
        model = Booking
        fields = [
            "booking_id",
            "booking_date",  
            "travel_date",
            "status",
            "tour_name",
            "customer_name",
            "customer_email",
            "total_price",
        ]
        read_only_fields = fields
       

# Chi tiêt 1 booking bên đại lý
class AgencyBookingDetailSerializer(serializers.ModelSerializer):
    # tour snapshot
    tour_id = serializers.UUIDField(source="tour.tour_id", read_only=True)
    tour_name = serializers.CharField(source="tour.name", read_only=True)
    departure_location = serializers.CharField(
        source="tour.departure_location", read_only=True
    )
    destination = serializers.CharField(
        source="tour.destination", read_only=True
    )
    thumbnail_url = serializers.SerializerMethodField()

    # customer snapshot
    customer_name = serializers.CharField(
        source="customer.user.username", read_only=True
    )
    customer_email = serializers.EmailField(
        source="customer.user.email", read_only=True
    )
    customer_phone = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            # booking core
            "booking_id",
            "booking_date",
            "travel_date",
            "num_adults",
            "num_children",
            "note",
            "total_price",
            "status",

            # timeline
            "approved_at",
            "paid_at",
            "rejected_at",
            "rejected_reason",

            # tour
            "tour_id",
            "tour_name",
            "thumbnail_url",
            "departure_location",
            "destination",

            # customer
            "customer_name",
            "customer_email",
            "customer_phone",
        ]

    def get_customer_phone(self, obj):
        """
        Nếu khách chưa nhập phone → trả chuỗi rỗng ""
        """
        phone = getattr(obj.customer.user, "phone", None)
        return phone or ""

    def get_thumbnail_url(self, obj):
        """
        TourThumbnail related_name='thumbnail'
        Field ảnh: TourThumbnail.thumbnail
        => URL: obj.tour.thumbnail.thumbnail.url
        """
        tour = getattr(obj, "tour", None)
        if not tour:
            return ""

        thumb_obj = getattr(tour, "thumbnail", None)
        if not thumb_obj:
            return ""

        image = getattr(thumb_obj, "thumbnail", None)
        if not image:
            return ""

        try:
            url = image.url
        except Exception:
            return ""

        request = self.context.get("request")
        return request.build_absolute_uri(url) if request else url


class BookingStatusUpdateSerializer(serializers.ModelSerializer):
    """
    Agency PATCH status:
    - pending -> paid_waiting
    - pending -> rejected (kèm rejected_reason)
    """
    class Meta:
        model = Booking
        fields = ["status", "rejected_reason"]
        extra_kwargs = {
            "rejected_reason": {"required": False, "allow_blank": True, "allow_null": True}
        }

    def validate_status(self, value:str):
        allowed = [Booking.PAID_WAITING, Booking.REJECTED]
        if value not in allowed:
            raise serializers.ValidationError(f"Chỉ được chuyển sang '{Booking.PAID_WAITING}' hoặc '{Booking.REJECTED}'.")
        return value
    
    def validate(self, attrs):
        booking: Booking = self.instance
        new_status = attrs.get("status")

        # chỉ được duyệt khi còn là pending
        if booking.status != Booking.PENDING:
            raise serializers.ValidationError(
                {"status": "Chỉ có thể cập nhật khi booking đang ở trạng thái 'pending'."}
            )
        # nếu rejeced thì bắt buộc phải có lý do
        if new_status == Booking.REJECTED:
            reason = (attrs.get("rejected_reason") or "").strip()
            if not reason:
                raise serializers.ValidationError(
                    {"rejected_reason": "Vui lòng nhập lý do từ chối."}
                )
            
        return attrs
    def update(self, instance: Booking, validated_data):
        new_status = validated_data["status"]

        instance.status = new_status

        if new_status == Booking.PAID_WAITING:
            instance.approved_at = timezone.now()
            instance.rejected_at = None
            instance.rejected_reason = None

        elif new_status == Booking.REJECTED:
            instance.rejected_at = timezone.now()
            instance.rejected_reason = validated_data.get("rejected_reason")

        instance.save(update_fields=[
            "status",
            "approved_at",
            "rejected_at",
            "rejected_reason",
        ])
        return instance