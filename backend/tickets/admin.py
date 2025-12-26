"""
Admin configuration for Tickets app
"""
from django.contrib import admin
from .models import Ticket


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ['id', 'booking', 'is_validated', 'validated_at', 'created_at']
    list_filter = ['is_validated', 'created_at']
    search_fields = ['booking__id', 'booking__passenger_name']
    ordering = ['-created_at']
    readonly_fields = ['id', 'qr_data', 'created_at']
