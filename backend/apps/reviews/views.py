from rest_framework import generics, permissions, status
from .models import Review
from .serializers import ReviewCreateSerializer, ReviewListItemSerializer, ReviewUpdateSerializer
from rest_framework.response import Response
class CreateReviewView(generics.CreateAPIView):
    serializer_class = ReviewCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

class TourReviewsListView(generics.ListAPIView):
    serializer_class = ReviewListItemSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        tour_id = self.kwargs["tour_id"]
        return (Review.objects
                .filter(booking__tour__tour_id=tour_id)
                .select_related("booking__customer__user")
                .order_by("-created_at"))

    # Trả message nếu chưa có review
    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        if not qs.exists():
            return Response({"message": "Tour này chưa có đánh giá."}, status=status.HTTP_200_OK)
        return super().list(request, *args, **kwargs)

class MyReviewUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Review.objects.select_related("booking__customer__user")
    serializer_class = ReviewUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'review_id'

    def get_queryset(self):
        return self.queryset.filter(booking__customer__user=self.request.user)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.is_deleted:
            return Response({"message": "Bình luận đã bị xoá, không thể sửa."}, status=status.HTTP_400_BAD_REQUEST)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.comment = None
        instance.is_deleted = True
        instance.save(update_fields=["comment", "is_deleted"])
        return Response({"message": "Đã ẩn bình luận, vẫn giữ điểm đánh giá."}, status=status.HTTP_200_OK)
