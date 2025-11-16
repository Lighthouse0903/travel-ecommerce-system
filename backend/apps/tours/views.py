from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import generics, permissions, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from .models import Tour
from .serializers import TourSerializer, TourPublicDetailSerializer, TourListItemSerializer, TourPublicListSerializer
from .permissions import IsAgencyOwnerOrReadOnly, IsAgencyUser
import traceback
from botocore.exceptions import ClientError
from rest_framework.exceptions import ValidationError
from django.db import IntegrityError
# API Lấy danh sách tất cả tour (public) + tạo tour (agency)
class TourListCreateView(generics.ListCreateAPIView):
    parser_classes = (MultiPartParser, FormParser)
    queryset = Tour.objects.filter(is_active=True).select_related("agency")
    serializer_class = TourSerializer
    permission_classes = [IsAgencyOwnerOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = [
        "name", "start_location", "end_location",
        "agency__agency_name", "adult_price", "region", "categories"
    ]

    ordering_fields = ["adult_price", "children_price", "created_at", "duration_days"]

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
                {"message": "Tour trùng (tên, tuyến, số ngày) đã tồn tại."},
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
                {"message": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# API Chi tiết / sửa / xoá tour
class TourDetailAgencyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = (
        Tour.objects
        .all()
        .select_related('agency')
        .prefetch_related('images')
    )
    serializer_class = TourSerializer
    permission_classes = [IsAgencyOwnerOrReadOnly]
    lookup_field = 'tour_id'
    parser_classes = (MultiPartParser, FormParser)   # nhận multipart form-data

    # -----------------------------
    # GET /api/tours/manage/<tour_id>
    # -----------------------------
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(
            {"data": serializer.data, "message": "Lấy chi tiết tour thành công."},
            status=status.HTTP_200_OK
        )

    # -----------------------------
    # PATCH / PUT cập nhật tour
    # -----------------------------
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
            # lỗi bất ngờ
            traceback.print_exc()
            return Response(
                {"message": "Đã xảy ra lỗi nội bộ.", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    # -----------------------------
    # DELETE tour
    # -----------------------------
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {"message": "Xóa tour thành công."},
            status=status.HTTP_200_OK
        )

# API Lấy danh sách tour của chính agency (tiện cho dashboard)
class MyToursView(generics.ListAPIView):
    serializer_class = TourListItemSerializer
    permission_classes = [permissions.IsAuthenticated, IsAgencyUser]

    def get_queryset(self):
        agency = self.request.user.agency_profile
        return (
            Tour.objects.filter(agency=agency)
            .select_related("agency")
            .prefetch_related("images")
            .only(
                "tour_id", "name", "categories", "description",
                "adult_price", "children_price", "discount",
                "duration_days", "destination", "agency_id"
            )
            .order_by("-created_at")
        )

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
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
            .select_related("agency")
            .prefetch_related("images")
            .order_by("-created_at")
        )

        # --- Filter agency ---
        agency = self.request.query_params.get("agency")
        if agency:
            qs = qs.filter(agency__agency_name__icontains=agency)

        # --- Filter adult_price ---
        min_price = self.request.query_params.get("min_price")
        max_price = self.request.query_params.get("max_price")
        if min_price:
            qs = qs.filter(adult_price__gte=min_price)
        if max_price:
            qs = qs.filter(adult_price__lte=max_price)

        # --- Filter location ---
        start_location = self.request.query_params.get("start_location")
        end_location = self.request.query_params.get("end_location")
        if start_location:
            qs = qs.filter(start_location__icontains=start_location)
        if end_location:
            qs = qs.filter(end_location__icontains=end_location)

        # --- Filter region ---
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

        # --- Filter categories ---
        cat_param = self.request.query_params.get("category") or self.request.query_params.get("categories")
        if cat_param:
            cats = [c.strip() for c in cat_param.split(",") if c.strip()]
            qs = qs.filter(categories__overlap=cats)

        # --- Search không dấu ---
        q = self.request.query_params.get("q")
        if q:
            from unidecode import unidecode
            q_un = unidecode(q).lower()
            qs = [
                t for t in qs
                if q_un in unidecode(t.name).lower()
                or q_un in unidecode(t.description or "").lower()
                or q_un in unidecode(t.destination or "").lower()
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
        return Response(
            {
                "data": serializer.data,
                "message": "Lấy danh sách tour của bạn thành công."
            },
            status=status.HTTP_200_OK
        )




# API chọn xem chi tiết tour
class TourDetailCustomerView(generics.RetrieveAPIView):
    queryset = (
        Tour.objects
        .filter(is_active=True)
        .select_related("agency")
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


