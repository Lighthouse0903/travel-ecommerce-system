from django.urls import path
from .views import TourListCreateView, TourDetailAgencyView, MyToursView, PublicTourListView, TourDetailCustomerView

urlpatterns = [
    # Public 
    # GET: list public (filter + pagination)
    path("", PublicTourListView.as_view(), name="tour_public_list"),
    # GET: detail public
    path("<uuid:tour_id>/", TourDetailCustomerView.as_view(), name="tour_public_detail"),

    # Agency
    # GET: list tour của agency
    path("my/", MyToursView.as_view(), name="tour_my_list"),

    # POST: tạo tour
    path("create/", TourListCreateView.as_view(), name="tour_create"),

    # GET/PATCH/DELETE: quản lý tour
    path("<uuid:tour_id>/manage/", TourDetailAgencyView.as_view(), name="tour_manage"),
]
