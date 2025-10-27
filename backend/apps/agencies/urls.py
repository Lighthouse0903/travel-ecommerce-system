from django.urls import path
from .views import AgencyApplyView, MyAgencyView

urlpatterns = [
    path('register/', AgencyApplyView.as_view(), name='agency_register'),
    path('me/', MyAgencyView.as_view(), name='agency_me')
]
