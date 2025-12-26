"""
URL patterns for bookings
"""
from django.urls import path
from .views import (
    BookingCreateView,
    BookingConfirmView,
    BookingCancelView,
    BookingDetailView,
    BookingHistoryView,
    UpcomingTripsView
)

urlpatterns = [
    path('create/', BookingCreateView.as_view(), name='booking_create'),
    path('history/', BookingHistoryView.as_view(), name='booking_history'),
    path('upcoming/', UpcomingTripsView.as_view(), name='upcoming_trips'),
    path('<uuid:booking_id>/', BookingDetailView.as_view(), name='booking_detail'),
    path('<uuid:booking_id>/confirm/', BookingConfirmView.as_view(), name='booking_confirm'),
    path('<uuid:booking_id>/cancel/', BookingCancelView.as_view(), name='booking_cancel'),
]
