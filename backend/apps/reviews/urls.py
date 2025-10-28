from django.urls import path
from .views import CreateReviewView, TourReviewsListView, MyReviewUpdateDeleteView

urlpatterns = [
    path('create/', CreateReviewView.as_view(), name='review_create'),
    path('tour/<uuid:tour_id>/', TourReviewsListView.as_view(), name='tour_reviews'),
    path("<uuid:review_id>/", MyReviewUpdateDeleteView.as_view(), name="my_review_update_delete"),
]
