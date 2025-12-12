from rest_framework import generics, permissions, status
from .models import Review
from .serializers import ReviewCreateSerializer, ReviewListItemSerializer, ReviewUpdateSerializer
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.db import IntegrityError
class CreateReviewView(generics.CreateAPIView):
    serializer_class = ReviewCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        try:
            ser = self.get_serializer(data=request.data)
            ser.is_valid(raise_exception=True)
            review = ser.save()

            data = {
                "review_id": str(review.review_id),
                "booking_id": str(review.booking.booking_id),
                "customer_id": str(review.booking.customer.customer_id),   # <--- THÊM
                "rating": review.rating,
                "comment": review.comment,
                "created_at": review.created_at,
            }

            return Response(
                {"message": "Đánh giá của bạn đã được ghi nhận thành công.", "data": data},
                status=status.HTTP_201_CREATED,
            )

        except ValidationError as e:
            detail = e.detail if hasattr(e, "detail") else {"message": str(e)}
            return Response(
                {"message": "Dữ liệu không hợp lệ.", "errors": detail},
                status=status.HTTP_400_BAD_REQUEST,
            )

        except IntegrityError:
            return Response(
                {"message": "Booking này đã được đánh giá rồi."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception as e:
            return Response(
                {"message": f"Lỗi nội bộ: {type(e).__name__}: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class TourReviewsListView(generics.ListAPIView):
    serializer_class = ReviewListItemSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        tour_id = self.kwargs["tour_id"]
        return (
            Review.objects.filter(booking__tour__tour_id=tour_id)
            .select_related("booking__customer__user")
            .order_by("-created_at")
        )

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        if not queryset.exists():
            return Response(
                {"message": "Tour này chưa có đánh giá.", "data": []},
                status=status.HTTP_200_OK,
            )

        serializer = self.get_serializer(queryset, many=True)
        return Response(
            {"data": serializer.data, "message": "Lấy danh sách đánh giá thành công."},
            status=status.HTTP_200_OK,
        )
class MyReviewUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Review.objects.select_related("booking__customer__user")
    serializer_class = ReviewUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "review_id"

    def get_queryset(self):
        return self.queryset.filter(booking__customer__user=self.request.user)

    # Cập nhật bình luận
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.is_deleted:
            return Response(
                {"message": "Bình luận đã bị xoá, không thể sửa.", "data": None},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {
                "message": "Cập nhật bình luận thành công.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    # Xóa (ẩn) bình luận
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.is_deleted:
            return Response(
                {"message": "Bình luận đã bị ẩn trước đó.", "data": None},
                status=status.HTTP_400_BAD_REQUEST,
            )

        instance.comment = None
        instance.is_deleted = True
        instance.save(update_fields=["comment", "is_deleted"])

        return Response(
            {
                "message": "Đã ẩn bình luận, vẫn giữ nguyên điểm đánh giá.",
                "data": {
                    "review_id": str(instance.review_id),
                    "rating": instance.rating,
                    "comment": None,
                },
            },
            status=status.HTTP_200_OK,
        )
