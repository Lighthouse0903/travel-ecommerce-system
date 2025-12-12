from django.urls import path
from .views import TourListCreateView, TourDetailAgencyView, MyToursView, PublicTourListView, TourDetailCustomerView

urlpatterns = [
    path('', TourListCreateView.as_view(), name='tour_list_create'),
    path('my-tours/', MyToursView.as_view(), name='my_tours'),
    path('manage/<uuid:tour_id>/', TourDetailAgencyView.as_view(), name='tour_detail_agency'),
    path('public/', PublicTourListView.as_view(), name='tour_public_list'),
    path('public/<uuid:tour_id>/', TourDetailCustomerView.as_view(), name='tour_detail_customer'),
]
