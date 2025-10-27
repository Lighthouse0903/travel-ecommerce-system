from rest_framework import generics, permissions, status
from .models import Review
from .serializers import ReviewCreateSerializer, ReviewListItemSerializer
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