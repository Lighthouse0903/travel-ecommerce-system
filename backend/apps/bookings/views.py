from http.client import responses
from django.utils import timezone
from django.core.serializers import serialize
from rest_framework import generics, permissions, status, serializers
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from .models import Booking
from .serializers import BookingCreateSerializer, BookingHistorySerializer, BookingDetailSerializer, BookingListSerializer, BookingStatusUpdateSerializer
from ..customers.models import Customer
from ..agencies.models import Agency

# API Tạo booking tour
class CreateBookingView(generics.CreateAPIView):
    serializer_class = BookingCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        booking = serializer.save()

        # Serialize lại kết quả vừa tạo (để hiển thị đầy đủ dữ liệu)
        response_serializer = self.get_serializer(booking)

        return Response({
            "data": response_serializer.data,
            "message": "Đặt tour thành công, chờ thanh toán"
        }, status=status.HTTP_201_CREATED)


# API Xem danh sách tour người dùng đã book
class MyBookingListView(generics.ListAPIView):
    serializer_class = BookingHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        customer = Customer.objects.filter(user=user).first()
        if not customer:
            raise PermissionDenied("Chỉ Customer mới xem được danh sách đặt tour của mình.")
        return Booking.objects.filter(customer=customer).select_related("tour").order_by("-booking_date")

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if not queryset.exists():
            return Response({
                "data": [],
                "message": "Bạn chưa đặt tour nào."
            }, status=status.HTTP_200_OK)

        serializer = self.get_serializer(queryset, many=True)
        return Response({
            "data": serializer.data,
            "message": "Lấy danh sách lịch sử đặt tour thành công."
        }, status=status.HTTP_200_OK)

# API xem chi tiết tour đã book

class MyBookingDetailView(generics.RetrieveAPIView):
    serializer_class = BookingDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "booking_id"

    def get_queryset(self):
        user = self.request.user
        customer = Customer.objects.filter(user=user).first()
        if not customer:
            raise PermissionDenied("Chỉ tài khoản Customer mới xem được chi tiết booking.")
        return Booking.objects.filter(customer=customer).select_related("tour", "tour__agency")

    def retrieve(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        booking_id = self.kwargs.get("booking_id")

        booking = queryset.filter(booking_id=booking_id).first()
        if not booking:
            return Response(
                {
                    "data": None,
                    "message": "Không tìm thấy thông tin booking của bạn."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.get_serializer(booking)
        return Response(
            {
                "data": serializer.data,
                "message": "Lấy chi tiết booking thành công."
            },
            status=status.HTTP_200_OK
        )

# API Agency xem các tour đã được book
class AgencyBookingListView(generics.ListAPIView):
    serializer_class = BookingListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        agency = Agency.objects.filter(user=user).first()
        if not agency:
            raise PermissionDenied("Chỉ tài khoản Agency mới xem được danh sách đơn của mình.")
        return (
            Booking.objects
            .filter(tour__agency=agency)
            .select_related('tour', 'customer__user')
            .order_by('-booking_date')
        )

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if not queryset.exists():
            return Response(
                {
                    "data": [],
                    "message": "Hiện chưa có đơn đặt tour nào."
                },
                status=status.HTTP_200_OK
            )

        serializer = self.get_serializer(queryset, many=True)
        return Response(
            {
                "data": serializer.data,
                "message": "Lấy danh sách đơn đặt tour thành công."
            },
            status=status.HTTP_200_OK
        )

# API Agency duyệt booking tour
class AgencyUpdateBookingStatusView(generics.UpdateAPIView):
    queryset = Booking.objects.select_related('tour__agency')
    serializer_class = BookingStatusUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'booking_id'

    def update(self, request, *args, **kwargs):
        booking = self.get_object()
        agency = Agency.objects.filter(user=request.user).first()

        if not agency or booking.tour.agency_id != agency.agency_id:
            raise PermissionDenied("Bạn không có quyền cập nhật đơn này.")

        new_status = request.data.get("status")
        if new_status not in [Booking.CONFIRMED, Booking.CANCELLED]:
            return Response(
                {"message": "Chỉ được phép chọn 'confirmed' hoặc 'cancelled'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if booking.status == Booking.CANCELLED:
            return Response(
                {"message": "Đơn đã bị huỷ, không thể đổi trạng thái."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if booking.status == Booking.CONFIRMED and new_status == Booking.PENDING:
            return Response(
                {"message": "Không thể chuyển 'confirmed' về 'pending'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if booking.status == new_status:
            msg = (
                "Bạn đã xác nhận đơn này rồi."
                if new_status == Booking.CONFIRMED
                else "Bạn đã huỷ đơn này rồi."
            )
            return Response({"message": msg}, status=status.HTTP_400_BAD_REQUEST)

        booking.status = new_status
        if new_status == Booking.CONFIRMED:
            booking.confirmed_at = timezone.now()
        elif new_status == Booking.CANCELLED:
            booking.cancelled_at = timezone.now()
        booking.save(update_fields=['status', 'confirmed_at', 'cancelled_at'])

        data = {
            "booking_id": str(booking.booking_id),
            "status": booking.status,
            "confirmed_at": booking.confirmed_at,
            "cancelled_at": booking.cancelled_at
        }

        return Response(
            {
                "data": data,
                "message": "Cập nhật trạng thái thành công."
            },
            status=status.HTTP_200_OK
        )