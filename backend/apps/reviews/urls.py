from django.urls import path
from .views import CreateReviewView, TourReviewsListView

urlpatterns = [
    path('create/', CreateReviewView.as_view(), name='review_create'),
    path('tour/<uuid:tour_id>/', TourReviewsListView.as_view(), name='tour_reviews'),
]
