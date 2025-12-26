"""
URL patterns for payments
"""
from django.urls import path
from .views import PaymentCreateView, PaymentVerifyView

urlpatterns = [
    path('create/', PaymentCreateView.as_view(), name='payment_create'),
    path('verify/', PaymentVerifyView.as_view(), name='payment_verify'),
]
