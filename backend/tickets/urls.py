"""
URL patterns for tickets
"""
from django.urls import path
from .views import TicketDetailView, TicketValidateView, MyTicketsView

urlpatterns = [
    path('my-tickets/', MyTicketsView.as_view(), name='my_tickets'),
    path('validate/', TicketValidateView.as_view(), name='ticket_validate'),
    path('<uuid:booking_id>/', TicketDetailView.as_view(), name='ticket_detail'),
]
