from django.urls import path
from .views import CreateBookingView, MyBookingListView, MyBookingDetailView, AgencyBookingListView, AgencyUpdateBookingStatusView, AgencyBookingDetailView,AgencyAnalyticsOverviewView,AgencyAnalyticsOverviewTimeseriesView, AgencyAnalyticsTimeseriesView,AgencyAnalyticsTopToursView,AgencyAnalyticsBreakdownView


urlpatterns = [
    path('create/', CreateBookingView.as_view(), name='booking_create'),
    path('my/', MyBookingListView.as_view(), name='booking_list_customer'),
    path('my/<uuid:booking_id>/', MyBookingDetailView.as_view(), name='booking_detail_customer'),
    path('agency/<uuid:booking_id>/', AgencyBookingDetailView.as_view(), name='booking_detail_agency'),
    path('agency/', AgencyBookingListView.as_view(), name='booking_list_agency'),
    path('<uuid:booking_id>/status/', AgencyUpdateBookingStatusView.as_view(), name='booking_update_status'),
    path('analytics/overview/', AgencyAnalyticsOverviewView.as_view()),
    path('analytics/overview/timeseries/', AgencyAnalyticsOverviewTimeseriesView.as_view()),
    path('analytics/timeseries/', AgencyAnalyticsTimeseriesView.as_view()),
    path('analytics/top-tours/', AgencyAnalyticsTopToursView.as_view()),
    path('analytics/breakdown/', AgencyAnalyticsBreakdownView.as_view()),
]
