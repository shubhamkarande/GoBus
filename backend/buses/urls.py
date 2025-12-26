"""
URL patterns for buses
"""
from django.urls import path
from .views import (
    BusSearchView,
    BusDetailView,
    BusSeatListView,
    PopularRoutesView
)

urlpatterns = [
    path('search/', BusSearchView.as_view(), name='bus_search'),
    path('popular-routes/', PopularRoutesView.as_view(), name='popular_routes'),
    path('<uuid:id>/', BusDetailView.as_view(), name='bus_detail'),
    path('<uuid:bus_id>/seats/', BusSeatListView.as_view(), name='bus_seats'),
]
