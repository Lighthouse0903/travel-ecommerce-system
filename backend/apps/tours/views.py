from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import generics, permissions, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from .models import Tour
from .serializers import TourSerializer, TourPublicSerializer
from .permissions import IsAgencyOwnerOrReadOnly, IsAgencyUser
import traceback
from botocore.exceptions import ClientError
# API Lấy danh sách tất cả tour (public) + tạo tour (agency)
class TourListCreateView(generics.ListCreateAPIView):
    parser_classes = (MultiPartParser, FormParser)
    queryset = Tour.objects.filter(is_active=True).select_related("agency")
    serializer_class = TourSerializer
    permission_classes = [IsAgencyOwnerOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = [
        "name", "start_location", "end_location",
        "agency__company_name", "price", "region", "categories"
    ]
    ordering_fields = ["price", "created_at", "duration_days"]

    def perform_create(self, serializer):
        agency = getattr(self.request.user, "agency_profile", None)
        if not agency:
            raise PermissionDenied("Bạn chưa đăng ký agency.")
        if agency.status != "approved" or not agency.verified:
            if agency.status == "pending":
                raise PermissionDenied("Agency của bạn đang chờ duyệt. Không thể tạo tour.")
            elif agency.status == "rejected":
                raise PermissionDenied(f"Agency của bạn đã bị từ chối. Lý do: {agency.reason_rejected}")
            else:
                raise PermissionDenied("Agency của bạn chưa được duyệt. Không thể tạo tour.")
        serializer.save(agency=agency)

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data, context={"request": request})
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            tour = serializer.instance
            return Response(
                {"data": self.get_serializer(tour).data, "message": "Tạo tour thành công."},
                status=status.HTTP_201_CREATED,
            )
        except Exception as e:
            traceback.print_exc()
            detail = {"error": str(e)}
            if isinstance(e, ClientError):
                detail = {
                    "error_code": e.response.get("Error", {}).get("Code"),
                    "error_msg": e.response.get("Error", {}).get("Message"),
                    "request_id": e.response.get("ResponseMetadata", {}).get("RequestId"),
                }
            return Response({"error": "Đã xảy ra lỗi nội bộ.", "detail": detail}, status=500)


# API Chi tiết / sửa / xoá tour
class TourDetailAgencyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tour.objects.all().select_related('agency')
    serializer_class = TourSerializer
    permission_classes = [IsAgencyOwnerOrReadOnly]
    lookup_field = 'tour_id'
    parser_classes = (MultiPartParser, FormParser)   # <-- nhận form-data cho UPDATE

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({"data": serializer.data, "message": "Lấy chi tiết tour thành công."}, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        try:
            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response({"data": serializer.data, "message": "Cập nhật tour thành công."}, status=status.HTTP_200_OK)
        except Exception as e:
            traceback.print_exc()
            detail = {"error": str(e)}
            if isinstance(e, ClientError):
                detail = {
                    "error_code": e.response.get("Error", {}).get("Code"),
                    "error_msg": e.response.get("Error", {}).get("Message"),
                    "request_id": e.response.get("ResponseMetadata", {}).get("RequestId"),
                }
            return Response({"error": "Đã xảy ra lỗi nội bộ.", "detail": detail}, status=500)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"message": "Xóa tour thành công."}, status=status.HTTP_200_OK)
# API Lấy danh sách tour của chính agency (tiện cho dashboard)
class MyToursView(generics.ListAPIView):
    serializer_class = TourSerializer
    permission_classes = [permissions.IsAuthenticated, IsAgencyUser]

    def get_queryset(self):
        agency = self.request.user.agency_profile
        return Tour.objects.filter(agency=agency).select_related('agency')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        # Nếu không có tour nào
        if not queryset.exists():
            return Response({
                "data": [],
                "message": "Bạn chưa có tour nào được tạo."
            }, status=status.HTTP_200_OK)

        # Nếu có tour
        return Response({
            "data": serializer.data,
            "message": "Lấy danh sách tour của bạn thành công."
        }, status=status.HTTP_200_OK)

# API Lấy, tìm kiếm danh sách public tour
class PublicTourListView(generics.ListAPIView):
    queryset = Tour.objects.filter(is_active=True).select_related('agency')
    serializer_class = TourPublicSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()

        # ---- 1) Filter bằng DB ----
        agency = self.request.query_params.get("agency")
        if agency:
            qs = qs.filter(agency__company_name__icontains=agency)

        min_price = self.request.query_params.get("min_price")
        max_price = self.request.query_params.get("max_price")
        if min_price:
            qs = qs.filter(price__gte=min_price)
        if max_price:
            qs = qs.filter(price__lte=max_price)

        start_location = self.request.query_params.get("start_location")
        end_location = self.request.query_params.get("end_location")
        if start_location:
            qs = qs.filter(start_location__icontains=start_location)
        if end_location:
            qs = qs.filter(end_location__icontains=end_location)

        region_param = self.request.query_params.get("region")
        if region_param:
            alias = {"north": Tour.NORTH, "central": Tour.CENTRAL, "south": Tour.SOUTH}
            raw_parts = [p.strip().lower() for p in region_param.split(",") if p.strip()]
            region_vals = []
            for p in raw_parts:
                if p.isdigit():
                    region_vals.append(int(p))
                elif p in alias:
                    region_vals.append(alias[p])
            if region_vals:
                qs = qs.filter(region__in=region_vals)

        cat_param = self.request.query_params.get("category") or self.request.query_params.get("categories")
        if cat_param:
            cats = [c.strip().lower() for c in cat_param.split(",") if c.strip()]
            if cats:
                qs = qs.filter(categories__overlap=cats)

        # ---- 2) Tìm không dấu ----
        q = self.request.query_params.get("q")
        if q:
            from unidecode import unidecode
            q_un = unidecode(q).lower()
            qs = [
                t for t in qs
                if q_un in unidecode(t.name).lower()
                or q_un in unidecode(t.description or "").lower()
                or q_un in unidecode(t.start_location).lower()
                or q_un in unidecode(t.end_location).lower()
            ]
        return qs

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if not queryset:
            return Response(
                {"message": "Không tìm thấy kết quả."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.get_serializer(queryset, many=True)
        return Response({
            "data": serializer.data,
            "message": "Lấy danh sách tour thành công."
        }, status=status.HTTP_200_OK)

# API chọn xem chi tiết tour
class TourDetailCustomerView(generics.RetrieveAPIView):
    queryset = Tour.objects.filter(is_active=True).select_related("agency")
    serializer_class = TourPublicSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "tour_id"

    def retrieve(self, request, *args, **kwargs):
        """Ghi đè lại để custom response format"""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(
            {
                "data": serializer.data,
                "message": "Lấy thông tin tour thành công."
            },
            status=status.HTTP_200_OK
        )
