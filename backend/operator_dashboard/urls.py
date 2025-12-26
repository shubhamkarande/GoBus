"""
URL patterns for operator dashboard
"""
from django.urls import path
from .views import (
    OperatorDashboardView,
    OperatorBusListView,
    OperatorBusDetailView,
    OperatorBookingsView,
    OperatorBusPassengersView
)

urlpatterns = [
    path('dashboard/', OperatorDashboardView.as_view(), name='operator_dashboard'),
    path('buses/', OperatorBusListView.as_view(), name='operator_buses'),
    path('buses/<uuid:id>/', OperatorBusDetailView.as_view(), name='operator_bus_detail'),
    path('buses/<uuid:bus_id>/passengers/', OperatorBusPassengersView.as_view(), name='operator_bus_passengers'),
    path('bookings/', OperatorBookingsView.as_view(), name='operator_bookings'),
]
