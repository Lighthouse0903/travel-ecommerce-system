from http.client import responses
from django.utils import timezone
from django.core.serializers import serialize
from rest_framework import generics, permissions, status, serializers
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from .models import Booking

from .serializers import BookingCreateSerializer, AgencyBookingListSerializer,  AgencyBookingDetailSerializer, BookingStatusUpdateSerializer,CustomerBookingListSerializer,CustomerBookingDetailSerializer
from ..agencies.models import Agency
from ..customers.models import Customer

# API Tạo booking tour
class CreateBookingView(generics.CreateAPIView):
    serializer_class = BookingCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            booking = serializer.save()

            return Response({
                "data": self.get_serializer(booking).data,
                "message": "Đặt tour thành công, chờ thanh toán"
            }, status=201)

        except Exception as e:
            import traceback
            traceback.print_exc()  # <--- QUAN TRỌNG: IN LỖI THẬT SỰ

            return Response({
                "message": "Đã xảy ra lỗi hệ thống.",
                "detail": str(e)
            }, status=500)
        

# API Xem danh sách tour người dùng đã book
class MyBookingListView(generics.ListAPIView):
    serializer_class =  CustomerBookingListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        customer = Customer.objects.filter(user=user).first()
        if not customer:
            raise PermissionDenied("Chỉ Customer mới xem được danh sách đặt tour của mình.")

        return (
            Booking.objects
            .filter(customer=customer)
            .select_related("tour")
            .order_by("-booking_date")
        )

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


# API xem chi tiết tour đã book bên phía khách
class MyBookingDetailView(generics.RetrieveAPIView):
    serializer_class = CustomerBookingDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "booking_id"

    def get_queryset(self):
        user = self.request.user
        customer = Customer.objects.filter(user=user).first()
        if not customer:
            raise PermissionDenied("Chỉ tài khoản Customer mới xem được chi tiết booking.")

        return (
            Booking.objects
            .filter(customer=customer)
            .select_related("tour")
        )

    def retrieve(self, request, *args, **kwargs):
        booking = self.get_queryset().filter(booking_id=kwargs["booking_id"]).first()

        if not booking:
            return Response(
                {"data": None, "message": "Không tìm thấy thông tin booking của bạn."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.get_serializer(booking, context={"request": request})
        return Response(
            {"data": serializer.data, "message": "Lấy chi tiết booking thành công."},
            status=status.HTTP_200_OK
        )


# API Agency xem danh sách các booking 
class AgencyBookingListView(generics.ListAPIView):
    serializer_class = AgencyBookingListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        agency = Agency.objects.filter(user=user).first()
        if not agency:
            raise PermissionDenied("Chỉ tài khoản Agency mới xem được danh sách đơn của mình.")
        
        qs=(
            Booking.objects
            .filter(tour__agency=agency)
            .select_related("tour", "customer__user")
            .order_by("-booking_date")
        )

        status_param = self.request.query_params.get("status")
        if status_param:
            qs = qs.filter(status=status_param)

        return qs

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        if not serializer.data:
            return Response(
                {"data": [], "message": "Chưa có booking nào."},
                status=status.HTTP_200_OK
            )
        

        return Response(
            {"data": serializer.data, "message": "Lấy danh sách đơn đặt tour thành công."},
            status=status.HTTP_200_OK
        )
    
# API Agency lấy chi tiết booking cho đại lý
class AgencyBookingDetailView(generics.RetrieveAPIView):
    serializer_class = AgencyBookingDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "booking_id"

    def get_queryset(self):
        user = self.request.user
        agency = Agency.objects.filter(user=user).first()
        if not agency:
            raise PermissionDenied("Chỉ tài khoản Agency mới xem được chi tiết booking.")

        return (
            Booking.objects
            .filter(tour__agency=agency)
            .select_related("tour", "customer__user")
        )

    def retrieve(self, request, *args, **kwargs):
        booking = self.get_queryset().filter(booking_id=kwargs["booking_id"]).first()
        if not booking:
            return Response(
                {"data": None, "message": "Không tìm thấy booking hoặc bạn không có quyền truy cập."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.get_serializer(booking)
        return Response(
            {"data": serializer.data, "message": "Lấy chi tiết booking cho đại lý thành công."},
            status=status.HTTP_200_OK
        )

# API Agency duyệt booking tour
class AgencyUpdateBookingStatusView(generics.UpdateAPIView):
    queryset = Booking.objects.select_related("tour__agency")
    serializer_class = BookingStatusUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "booking_id"

    def patch(self, request, *args, **kwargs):
        booking = self.get_object()

        agency = Agency.objects.filter(user=request.user).first()
        if not agency or booking.tour.agency_id != agency.agency_id:
            raise PermissionDenied("Bạn không có quyền cập nhật đơn này.")

        serializer = self.get_serializer(booking, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        booking = serializer.save()

        data = {
            "booking_id": str(booking.booking_id),
            "status": booking.status,
            "approved_at": booking.approved_at,
            "rejected_at": booking.rejected_at,
            "rejected_reason": booking.rejected_reason,
        }

        return Response(
            {"data": data, "message": "Cập nhật trạng thái booking thành công."},
            status=status.HTTP_200_OK
        )