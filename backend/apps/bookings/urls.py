from django.urls import path
from .views import CreateBookingView, MyBookingListView, MyBookingDetailView, AgencyBookingListView, AgencyUpdateBookingStatusView

urlpatterns = [
    path('create/', CreateBookingView.as_view(), name='booking_create'),
    path('my/', MyBookingListView.as_view(), name='booking_list_customer'),
    path('my/<uuid:booking_id>/', MyBookingDetailView.as_view(), name='booking_detail_customer'),
    path('agency/', AgencyBookingListView.as_view(), name='booking_list_agency'),
    path('<uuid:booking_id>/status/', AgencyUpdateBookingStatusView.as_view(), name='booking_update_status')
]
