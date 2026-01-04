from http.client import responses
from django.utils import timezone
from django.core.serializers import serialize
from rest_framework import generics, permissions, status, serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, PermissionDenied
import logging
from .models import Booking
from django.db.models import Count, Sum, Q
from .serializers import BookingCreateSerializer, AgencyBookingListSerializer,  AgencyBookingDetailSerializer, BookingStatusUpdateSerializer,CustomerBookingListSerializer,CustomerBookingDetailSerializer, AgencyBookingSearchSerializer
from ..agencies.models import Agency
from ..customers.models import Customer
from ..payments.models import Payment
from ..core.pagination import MetaPageNumberPagination
from datetime import datetime, time, timedelta
from rest_framework.views import APIView
from django.db.models.functions import TruncDate, TruncWeek, TruncMonth

# API Tạo booking tour
class CreateBookingView(generics.CreateAPIView):
    serializer_class = BookingCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
            booking = serializer.save()

            return Response(
                {
                    "message": "Đặt tour thành công, chờ đại lý xác nhận.",
                    "data": self.get_serializer(booking).data,
                    "errors": None,
                },
                status=status.HTTP_201_CREATED,
            )

        #  lỗi validate (400)
        except ValidationError as e:
            return Response(
                {
                    "message": "Dữ liệu không hợp lệ.",
                    "errors": e.detail,   # <-- QUAN TRỌNG
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # không có quyền (403)
        except PermissionDenied as e:
            return Response(
                {
                    "message": str(e),
                    "errors": {
                        "permission": [str(e)]
                    },
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        # lỗi hệ thống thật (500)
        except Exception:
            logging.exception("Create booking failed")
            return Response(
                {
                    "message": "Đã xảy ra lỗi hệ thống.",
                    "errors": None,
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        

# API Xem danh sách tour người dùng đã book
class MyBookingListView(generics.ListAPIView):
    serializer_class =  CustomerBookingListSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = MetaPageNumberPagination

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
            return Response(
                {"data": [], "message": "Bạn chưa đặt tour nào."},
                status=status.HTTP_200_OK
            )

        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.paginator.get_paginated_response(
                serializer.data,
                message="Lấy danh sách lịch sử đặt tour thành công."
            )
        
        # fallback nếu ko pagintaion trả full
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
    pagination_class = MetaPageNumberPagination
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

        if not queryset.exists():
            return Response(
                {"data": [], "message": "Chưa có booking nào."},
                status=status.HTTP_200_OK
            )
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.paginator.get_paginated_response(
                serializer.data,
                message="Lấy danh sách đơn đặt tour thành công."
            )
        
        # fall back nếu ko paginate
        serializer = self.get_serializer(queryset, many=True)
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
    

# APi lấy ra overview tổng quan
class AgencyAnalyticsOverviewView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        agency = Agency.objects.filter(user=request.user).first()
        if not agency:
            raise PermissionDenied("Chỉ tài khoản Agency mới xem được thống kê.")

        now = timezone.now()
        dt_from = now - timedelta(days=30)
        dt_to = now

        bookings = Booking.objects.filter(tour__agency=agency)

        # counts
        status_counts = bookings.values("status").annotate(c=Count("booking_id"))
        map_counts = {x["status"]: x["c"] for x in status_counts}

        payments = Payment.objects.filter(
            booking__tour__agency=agency,
            status=Payment.SUCCESS
        )

        revenue = payments.aggregate(total=Sum("amount"))["total"] or 0
        paid_orders = payments.count()

        data = {
            "orders": {
                "pending": map_counts.get(Booking.PENDING, 0),
                "paid_waiting": map_counts.get(Booking.PAID_WAITING, 0),
                "paid": map_counts.get(Booking.PAID, 0),
                "rejected": map_counts.get(Booking.REJECTED, 0),
            },
            "revenue": {
                "total": str(revenue),
                "paid_orders": paid_orders,
            },
        }

        return Response(
            {"data": data, "message": "Lấy thống kê tổng quan thành công", "errors": None},
            status=status.HTTP_200_OK
        )
    
# APi GET Overview Summary
class AgencyAnalyticsOverviewTimeseriesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        agency = Agency.objects.filter(user=request.user).first()
        if not agency:
            raise PermissionDenied("Chỉ tài khoản Agency mới xem được thống kê.")

        # Query params
        metric = request.query_params.get("metric", "revenue")  # revenue | paid_orders | orders
        days = request.query_params.get("days", "7")

        try:
            days = int(days)
            if days <= 0:
                days = 7
        except Exception:
            days = 7

        now = timezone.now()
        dt_from = now - timedelta(days=days - 1)  # gồm cả hôm nay
        dt_to = now

        # tạo khung ngày để luôn trả đủ ngày (kể cả 0)
        date_list = []
        for i in range(days):
            d = (dt_from.date() + timedelta(days=i))
            date_list.append(d)

        # metric = revenue / paid_orders (theo Payment.paid_at)
        if metric in ["revenue", "paid_orders"]:
            qs = Payment.objects.filter(
                booking__tour__agency=agency,
                status=Payment.SUCCESS,
                paid_at__isnull=False,
                paid_at__gte=dt_from,
                paid_at__lte=dt_to,
            ).annotate(day=TruncDate("paid_at"))

            if metric == "revenue":
                agg = qs.values("day").annotate(value=Sum("amount"))
            else:  # paid_orders
                agg = qs.values("day").annotate(value=Count("payment_id"))

        # metric = orders (theo booking_date nếu có, fallback created_at)
        elif metric == "orders":
            # Nếu Booking có booking_date thì dùng booking_date, không thì dùng created_at
            date_field = "booking_date" if hasattr(Booking, "booking_date") else "created_at"

            qs = Booking.objects.filter(
                tour__agency=agency,
                **{
                    f"{date_field}__gte": dt_from,
                    f"{date_field}__lte": dt_to,
                }
            ).annotate(day=TruncDate(date_field))

            agg = qs.values("day").annotate(value=Count("booking_id"))

        else:
            return Response(
                {
                    "data": None,
                    "message": "metric không hợp lệ. Dùng: revenue | paid_orders | orders",
                    "errors": {"metric": ["Invalid metric"]},
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # map day -> value
        map_day = {}
        for row in agg:
            day = row["day"]
            val = row["value"] or 0
            map_day[day] = val

        # build output (đảm bảo đủ ngày)
        points = []
        for d in date_list:
            v = map_day.get(d, 0)
            # revenue là Decimal => string cho an toàn
            if metric == "revenue":
                v = str(v) if v else "0"
            else:
                v = int(v)
            points.append({"date": d.isoformat(), "value": v})

        return Response(
            {
                "data": {
                    "metric": metric,
                    "days": days,
                    "from": dt_from.date().isoformat(),
                    "to": dt_to.date().isoformat(),
                    "points": points,
                },
                "message": "Lấy dữ liệu biểu đồ tổng quan thành công.",
                "errors": None,
            },
            status=status.HTTP_200_OK,
        )
    

# helper
def _floor_to_week_start(d):
    # Monday as week start
    return d - timedelta(days=d.weekday())


def _month_add(d, months=1):
    # add months safely (d is a date with day=1)
    year = d.year + (d.month - 1 + months) // 12
    month = (d.month - 1 + months) % 12 + 1
    return d.replace(year=year, month=month, day=1)


# API: GET /api/bookings/analytics/timeseries/?metric=...&group_by=...&from=YYYY-MM-DD&to=YYYY-MM-DD
class AgencyAnalyticsTimeseriesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        agency = Agency.objects.filter(user=request.user).first()
        if not agency:
            raise PermissionDenied("Chỉ tài khoản Agency mới xem được thống kê.")

        metric = request.query_params.get("metric", "revenue")      # revenue | paid_orders | orders
        group_by = request.query_params.get("group_by", "day")      # day | week | month
        from_str = request.query_params.get("from")
        to_str = request.query_params.get("to")

        now = timezone.now()

        # ✅ Parse date chắc chắn (YYYY-MM-DD)
        try:
            if from_str:
                dt_from = timezone.make_aware(datetime.strptime(from_str, "%Y-%m-%d"))
            else:
                dt_from = now - timedelta(days=30)

            if to_str:
                dt_to = timezone.make_aware(
                    datetime.combine(datetime.strptime(to_str, "%Y-%m-%d").date(), time.max)
                )
            else:
                dt_to = now

        except Exception:
            return Response(
                {
                    "data": None,
                    "message": "from/to không hợp lệ. Dùng định dạng YYYY-MM-DD",
                    "errors": {"date": ["Invalid from/to format"]},
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if dt_from > dt_to:
            return Response(
                {
                    "data": None,
                    "message": "`from` phải <= `to`.",
                    "errors": {"date": ["from must be <= to"]},
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ✅ Chọn trunc function + tạo bucket labels (fill 0)
        if group_by == "day":
            trunc_fn = TruncDate
            start_date = dt_from.date()
            end_date = dt_to.date()
            bucket_dates = []
            cur = start_date
            while cur <= end_date:
                bucket_dates.append(cur)
                cur = cur + timedelta(days=1)

        elif group_by == "week":
            trunc_fn = TruncWeek
            start_date = _floor_to_week_start(dt_from.date())
            end_date = _floor_to_week_start(dt_to.date())
            bucket_dates = []
            cur = start_date
            while cur <= end_date:
                bucket_dates.append(cur)  # week start date
                cur = cur + timedelta(days=7)

        elif group_by == "month":
            trunc_fn = TruncMonth
            start_date = dt_from.date().replace(day=1)
            end_date = dt_to.date().replace(day=1)
            bucket_dates = []
            cur = start_date
            while cur <= end_date:
                bucket_dates.append(cur)  # month start date
                cur = _month_add(cur, 1)

        else:
            return Response(
                {
                    "data": None,
                    "message": "group_by không hợp lệ. Dùng: day | week | month",
                    "errors": {"group_by": ["Invalid group_by"]},
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ✅ metric theo Payment (revenue/paid_orders) hoặc Booking (orders)
        if metric in ["revenue", "paid_orders"]:
            qs = Payment.objects.filter(
                booking__tour__agency=agency,
                status=Payment.SUCCESS,
                paid_at__isnull=False,
                paid_at__gte=dt_from,
                paid_at__lte=dt_to,
            ).annotate(bucket=trunc_fn("paid_at"))

            if metric == "revenue":
                agg = qs.values("bucket").annotate(value=Sum("amount"))
            else:
                agg = qs.values("bucket").annotate(value=Count("payment_id"))

        elif metric == "orders":
            date_field = "booking_date" if hasattr(Booking, "booking_date") else "created_at"

            qs = Booking.objects.filter(
                tour__agency=agency,
                **{
                    f"{date_field}__gte": dt_from,
                    f"{date_field}__lte": dt_to,
                }
            ).annotate(bucket=trunc_fn(date_field))

            agg = qs.values("bucket").annotate(value=Count("booking_id"))

        else:
            return Response(
                {
                    "data": None,
                    "message": "metric không hợp lệ. Dùng: revenue | paid_orders | orders",
                    "errors": {"metric": ["Invalid metric"]},
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ✅ Map bucket -> value
        map_bucket = {}
        for row in agg:
            b = row["bucket"]
            if not b:
                continue
            b_date = b.date() if hasattr(b, "date") else b
            map_bucket[b_date] = row["value"] or 0

        # ✅ Build points (fill 0)
        points = []
        for d in bucket_dates:
            v = map_bucket.get(d, 0)
            if metric == "revenue":
                v = str(v) if v else "0"
            else:
                v = int(v)

            points.append({"bucket": d.isoformat(), "value": v})

        return Response(
            {
                "data": {
                    "metric": metric,
                    "group_by": group_by,
                    "from": dt_from.date().isoformat(),
                    "to": dt_to.date().isoformat(),
                    "points": points,
                },
                "message": "Lấy dữ liệu biểu đồ báo cáo thành công.",
                "errors": None,
            },
            status=status.HTTP_200_OK,
        )
    

# API lấy ra 5 thằng tour bán chạy nhất của đại lý đó
class AgencyAnalyticsTopToursView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        agency = Agency.objects.filter(user=request.user).first()
        if not agency:
            raise PermissionDenied("Chỉ tài khoản Agency mới xem được thống kê.")

        metric = request.query_params.get("metric", "revenue")  # revenue | orders | paid_orders
        limit = request.query_params.get("limit", "5")
        from_str = request.query_params.get("from")
        to_str = request.query_params.get("to")

        try:
            limit = int(limit)
            if limit <= 0:
                limit = 5
        except Exception:
            limit = 5

        now = timezone.now()

        # Parse YYYY-MM-DD
        try:
            dt_from = timezone.make_aware(datetime.strptime(from_str, "%Y-%m-%d")) if from_str else (now - timedelta(days=30))
            dt_to = timezone.make_aware(datetime.combine(datetime.strptime(to_str, "%Y-%m-%d").date(), time.max)) if to_str else now
        except Exception:
            return Response(
                {
                    "data": None,
                    "message": "from/to không hợp lệ. Dùng định dạng YYYY-MM-DD",
                    "errors": {"date": ["Invalid from/to format"]},
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if dt_from > dt_to:
            return Response(
                {
                    "data": None,
                    "message": "`from` phải <= `to`.",
                    "errors": {"date": ["from must be <= to"]},
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Base tours của agency
        # NOTE: nếu Tour PK là tour_id UUID thì values("tour_id") là đúng.
        base = Booking.objects.filter(tour__agency=agency)

        # Tùy metric sẽ lọc theo thời gian khác nhau:
        # - revenue & paid_orders: dựa vào Payment.paid_at (chuẩn nhất)
        # - orders: dựa booking_date/created_at (giống list booking)
        if metric == "revenue":
            qs = base.filter(
                payment__status=Payment.SUCCESS,
                payment__paid_at__isnull=False,
                payment__paid_at__gte=dt_from,
                payment__paid_at__lte=dt_to,
            ).values(
                "tour__tour_id", "tour__name", "tour__destination"
            ).annotate(
                revenue=Sum("payment__amount"),
                paid_orders=Count("booking_id"),
            ).order_by("-revenue")

            items = []
            for r in qs[:limit]:
                items.append({
                    "tour_id": str(r["tour__tour_id"]),
                    "tour_name": r["tour__name"],
                    "destination": r["tour__destination"],
                    "value": str(r["revenue"] or 0),
                    "paid_orders": int(r["paid_orders"] or 0),
                })

        elif metric == "paid_orders":
            qs = base.filter(
                payment__status=Payment.SUCCESS,
                payment__paid_at__isnull=False,
                payment__paid_at__gte=dt_from,
                payment__paid_at__lte=dt_to,
            ).values(
                "tour__tour_id", "tour__name", "tour__destination"
            ).annotate(
                paid_orders=Count("booking_id"),
                revenue=Sum("payment__amount"),
            ).order_by("-paid_orders", "-revenue")

            items = []
            for r in qs[:limit]:
                items.append({
                    "tour_id": str(r["tour__tour_id"]),
                    "tour_name": r["tour__name"],
                    "destination": r["tour__destination"],
                    "value": int(r["paid_orders"] or 0),
                    "revenue": str(r["revenue"] or 0),
                })

        elif metric == "orders":
            date_field = "booking_date" if hasattr(Booking, "booking_date") else "created_at"
            qs = base.filter(
                **{f"{date_field}__gte": dt_from, f"{date_field}__lte": dt_to}
            ).values(
                "tour__tour_id", "tour__name", "tour__destination"
            ).annotate(
                orders=Count("booking_id"),
            ).order_by("-orders")

            items = []
            for r in qs[:limit]:
                items.append({
                    "tour_id": str(r["tour__tour_id"]),
                    "tour_name": r["tour__name"],
                    "destination": r["tour__destination"],
                    "value": int(r["orders"] or 0),
                })
        else:
            return Response(
                {
                    "data": None,
                    "message": "metric không hợp lệ. Dùng: revenue | paid_orders | orders",
                    "errors": {"metric": ["Invalid metric"]},
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "data": {
                    "metric": metric,
                    "limit": limit,
                    "from": dt_from.date().isoformat(),
                    "to": dt_to.date().isoformat(),
                    "items": items,
                },
                "message": "Lấy top tours thành công.",
                "errors": None,
            },
            status=status.HTTP_200_OK,
        )

# API Trả về breakdown theo by=
# by=status → pending/paid_waiting/paid/rejected (count)
# by=provider → momo/zalopay… (count + revenue)
# by=destination → theo điểm đến (count + revenue)
class AgencyAnalyticsBreakdownView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        agency = Agency.objects.filter(user=request.user).first()
        if not agency:
            raise PermissionDenied("Chỉ tài khoản Agency mới xem được thống kê.")

        by = request.query_params.get("by", "status")  # status | provider | destination
        from_str = request.query_params.get("from")
        to_str = request.query_params.get("to")

        now = timezone.now()

        # parse date
        try:
            dt_from = timezone.make_aware(datetime.strptime(from_str, "%Y-%m-%d")) if from_str else (now - timedelta(days=30))
            dt_to = timezone.make_aware(datetime.combine(datetime.strptime(to_str, "%Y-%m-%d").date(), time.max)) if to_str else now
        except Exception:
            return Response(
                {"data": None, "message": "from/to không hợp lệ. Dùng YYYY-MM-DD", "errors": {"date": ["Invalid from/to format"]}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if dt_from > dt_to:
            return Response(
                {"data": None, "message": "`from` phải <= `to`.", "errors": {"date": ["from must be <= to"]}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        base_bookings = Booking.objects.filter(tour__agency=agency)

        # 1) breakdown by status (count booking theo booking_date/created_at)
        if by == "status":
            date_field = "booking_date" if hasattr(Booking, "booking_date") else "created_at"
            qs = base_bookings.filter(
                **{f"{date_field}__gte": dt_from, f"{date_field}__lte": dt_to}
            ).values("status").annotate(
                count=Count("booking_id")
            )

            items = [{"key": r["status"], "count": int(r["count"] or 0)} for r in qs]
            return Response(
                {"data": {"by": by, "from": dt_from.date().isoformat(), "to": dt_to.date().isoformat(), "items": items},
                 "message": "Lấy breakdown theo trạng thái thành công.",
                 "errors": None},
                status=status.HTTP_200_OK
            )

        # 2) breakdown by provider (Payment.SUCCESS)
        if by == "provider":
            qs = Payment.objects.filter(
                booking__tour__agency=agency,
                status=Payment.SUCCESS,
                paid_at__isnull=False,
                paid_at__gte=dt_from,
                paid_at__lte=dt_to,
            ).values("provider").annotate(
                count=Count("payment_id"),
                revenue=Sum("amount")
            ).order_by("-revenue")

            items = [{
                "key": r["provider"] or "unknown",
                "count": int(r["count"] or 0),
                "revenue": str(r["revenue"] or 0),
            } for r in qs]

            return Response(
                {"data": {"by": by, "from": dt_from.date().isoformat(), "to": dt_to.date().isoformat(), "items": items},
                 "message": "Lấy breakdown theo phương thức thanh toán thành công.",
                 "errors": None},
                status=status.HTTP_200_OK
            )

        # 3) breakdown by destination (Payment.SUCCESS)
        if by == "destination":
            qs = Payment.objects.filter(
                booking__tour__agency=agency,
                status=Payment.SUCCESS,
                paid_at__isnull=False,
                paid_at__gte=dt_from,
                paid_at__lte=dt_to,
            ).values("booking__tour__destination").annotate(
                count=Count("payment_id"),
                revenue=Sum("amount")
            ).order_by("-revenue")

            items = [{
                "key": r["booking__tour__destination"] or "unknown",
                "count": int(r["count"] or 0),
                "revenue": str(r["revenue"] or 0),
            } for r in qs]

            return Response(
                {"data": {"by": by, "from": dt_from.date().isoformat(), "to": dt_to.date().isoformat(), "items": items},
                 "message": "Lấy breakdown theo điểm đến thành công.",
                 "errors": None},
                status=status.HTTP_200_OK
            )

        return Response(
            {"data": None, "message": "by không hợp lệ. Dùng: status | provider | destination",
             "errors": {"by": ["Invalid by"]}},
            status=status.HTTP_400_BAD_REQUEST,
        )

class AgencyBookingSearchView(generics.ListAPIView):
    serializer_class = AgencyBookingSearchSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        agency = getattr(user, "agency_profile", None)

        if not agency:
            return Booking.objects.none()

        qs = Booking.objects.filter(tour__agency=agency)

        booking_code = self.request.query_params.get("booking_code")
        customer_name = self.request.query_params.get("customer_name")
        status = self.request.query_params.get("status")
        if booking_code:
            qs = qs.filter(booking_id__startswith=booking_code)
        elif customer_name:
            qs = qs.filter(
                Q(customer__user__username__icontains=customer_name) |
                Q(customer__user__first_name__icontains=customer_name) |
                Q(customer__user__last_name__icontains=customer_name)
            )
        elif status:
            qs = qs.filter(
                status=status
            )
        return qs.order_by("-booking_date")
