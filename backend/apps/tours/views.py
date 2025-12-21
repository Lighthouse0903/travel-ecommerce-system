from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import generics, permissions, filters ,status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied,ValidationError
from .models import Tour
from .serializers import TourSerializer, TourPublicDetailSerializer, TourListItemSerializer, TourPublicListSerializer
from .permissions import IsAgencyOwnerOrReadOnly, IsAgencyUser
import traceback, logging
from botocore.exceptions import ClientError
from django.db import IntegrityError
from django.db.models import Q


# API Lấy danh sách tất cả tour (public) + tạo tour (agency)
class TourListCreateView(generics.ListCreateAPIView):
    """
    GET: list public tours (is_active=true)
    POST: create tour (agency only)
    """
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = TourSerializer
    permission_classes = [IsAgencyOwnerOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = [
        "name",
        "departure_location",
        "destination",
        "agency__agency_name",
    ]

    ordering_fields = ["adult_price", "children_price", "created_at", "duration_days"]

    def get_queryset(self):
        # public list mặc định chỉ lấy active
        return (
            Tour.objects.filter(is_active=True)
            .select_related("agency", "thumbnail")
            .prefetch_related("images")
            .order_by("-created_at")
        )

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

        except ValidationError as e:
            detail = e.detail if hasattr(e, "detail") else e.args
            msg = detail.get("message") if isinstance(detail, dict) else None
            return Response(
                {"message": msg or "Dữ liệu không hợp lệ.", "errors": detail},
                status=status.HTTP_400_BAD_REQUEST,
            )

        except IntegrityError as e:
            return Response(
                {"message": "Tour trùng (tên, nơi khởi hành, điểm đến, số ngày) đã tồn tại."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        except ClientError as e:
            return Response(
                {
                    "message": "Lỗi khi thao tác với S3.",
                    "errors": {
                        "error_code": e.response.get("Error", {}).get("Code"),
                        "error_msg": e.response.get("Error", {}).get("Message"),
                        "request_id": e.response.get("ResponseMetadata", {}).get("RequestId"),
                    },
                },
                status=status.HTTP_502_BAD_GATEWAY,
            )

        except Exception as e:
            return Response(
                {"message": "Đã xảy ra lỗi nội bộ.", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# API Chi tiết / sửa / xoá tour
class TourDetailAgencyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = (
        Tour.objects.all()
        .select_related("agency", "thumbnail")
        .prefetch_related("images")
    )
    serializer_class = TourSerializer
    permission_classes = [IsAgencyOwnerOrReadOnly]
    lookup_field = 'tour_id'
    parser_classes = (MultiPartParser, FormParser)   # nhận multipart form-data

    # GET /api/tours/manage/<tour_id>
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(
            {"data": serializer.data, "message": "Lấy chi tiết tour thành công."},
            status=status.HTTP_200_OK
        )

    # PATCH / PUT cập nhật tour
    def update(self, request, *args, **kwargs):
        try:
            partial = kwargs.pop('partial', False)
            instance = self.get_object()

            serializer = self.get_serializer(
                instance,
                data=request.data,
                partial=partial,
                context={"request": request}
            )

            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)

            return Response(
                {"data": serializer.data, "message": "Cập nhật tour thành công."},
                status=status.HTTP_200_OK
            )

        except ValidationError as e:
            # lỗi validate từ serializer
            return Response(
                {"message": "Dữ liệu không hợp lệ.", "errors": e.detail},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        except IntegrityError:
            return Response(
                {"message": "Tour trùng (tên, nơi khởi hành, điểm đến, số ngày) đã tồn tại."},
                status=status.HTTP_400_BAD_REQUEST
            )

        except ClientError as e:
            # lỗi AWS S3
            return Response(
                {
                    "message": "Lỗi khi thao tác với S3.",
                    "errors": {
                        "error_code": e.response.get("Error", {}).get("Code"),
                        "error_msg": e.response.get("Error", {}).get("Message"),
                        "request_id": e.response.get("ResponseMetadata", {}).get("RequestId"),
                    },
                },
                status=status.HTTP_502_BAD_GATEWAY
            )

        except Exception as e:
            traceback.print_exc()
            return Response(
                {"message": "Đã xảy ra lỗi nội bộ.", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
    # DELETE tour
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {"message": "Xóa tour thành công."},
            status=status.HTTP_200_OK
        )

# API Lấy danh sách tour của chính agency (tiện cho dashboard) gồm cả active/inactive
logger = logging.getLogger(__name__)

class MyToursView(generics.ListAPIView):
    serializer_class = TourListItemSerializer
    permission_classes = [permissions.IsAuthenticated, IsAgencyUser]

    def get_queryset(self):
        try:
            agency = self.request.user.agency_profile
        except Exception:
            raise PermissionDenied("Bạn chưa đăng ký agency.")

        return (
            Tour.objects.filter(agency=agency)
            .select_related("agency", "thumbnail")   # OK khi không dùng .only()
            .prefetch_related("images")
            .order_by("-created_at")
        )

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()  # nếu PermissionDenied -> DRF trả 403, không 500
        data = self.get_serializer(qs, many=True).data
        return Response(
            {
                "data": data,
                "message": (
                    "Bạn chưa có tour nào được tạo."
                    if not qs.exists()
                    else "Lấy danh sách tour của bạn thành công."
                ),
            },
            status=status.HTTP_200_OK,
        )

# API Lấy, tìm kiếm danh sách public tour
class PublicTourListView(generics.ListAPIView):
    serializer_class = TourPublicListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = (
            Tour.objects.filter(is_active=True)
            .select_related("agency", "thumbnail")
            .prefetch_related("images")
            .order_by("-created_at")
        )

        # filter agency name
        agency = self.request.query_params.get("agency")
        if agency:
            qs = qs.filter(agency__agency_name__icontains=agency)

        # filter price (ép kiểu để chắc)
        min_price = self.request.query_params.get("min_price")
        max_price = self.request.query_params.get("max_price")

        try:
            if min_price not in (None, ""):
                qs = qs.filter(adult_price__gte=float(min_price))
        except (ValueError, TypeError):
            pass

        try:
            if max_price not in (None, ""):
                qs = qs.filter(adult_price__lte=float(max_price))
        except (ValueError, TypeError):
            pass

        # filter departure_location / destination
        departure_location = self.request.query_params.get("departure_location")
        if departure_location:
            qs = qs.filter(departure_location__icontains=departure_location)

        destination = self.request.query_params.get("destination")
        if destination:
            qs = qs.filter(destination__icontains=destination)

        # filter region
        region_param = self.request.query_params.get("region")
        if region_param:
            alias = {"north": Tour.NORTH, "central": Tour.CENTRAL, "south": Tour.SOUTH}
            raw = [p.strip().lower() for p in region_param.split(",") if p.strip()]

            vals = []
            for p in raw:
                if p.isdigit():
                    vals.append(int(p))
                elif p in alias:
                    vals.append(alias[p])

            if vals:
                qs = qs.filter(region__in=vals)

        # filter categories overlap
        cat_param = self.request.query_params.get("category") or self.request.query_params.get("categories")
        if cat_param:
            cats = [c.strip() for c in cat_param.split(",") if c.strip()]
            if cats:
                qs = qs.filter(categories__overlap=cats)

        # search q
        q = self.request.query_params.get("q")
        if q:
            qs = qs.filter(
                Q(name__icontains=q)
                | Q(description__icontains=q)
                | Q(destination__icontains=q)
            )

        return qs

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        return Response(
            {
                "message": "Lấy danh sách tour thành công",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

# API chọn xem chi tiết tour
class TourDetailCustomerView(generics.RetrieveAPIView):
    queryset = (
        Tour.objects
        .filter(is_active=True)
        .select_related("agency", "thumbnail")
        .prefetch_related("images")
    )
    serializer_class = TourPublicDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "tour_id"

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(
            {
                "data": serializer.data,
                "message": "Lấy chi tiết tour thành công."
            },
            status=status.HTTP_200_OK
        )