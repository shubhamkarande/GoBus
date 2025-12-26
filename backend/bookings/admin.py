"""
Admin configuration for Bookings app
"""
from django.contrib import admin
from .models import Booking, BookingSeat


class BookingSeatInline(admin.TabularInline):
    model = BookingSeat
    extra = 0
    readonly_fields = ['seat']


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'bus', 'seat_count', 'total_amount', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['user__email', 'user__name', 'bus__name', 'passenger_name']
    ordering = ['-created_at']
    inlines = [BookingSeatInline]
    readonly_fields = ['id', 'created_at', 'updated_at']
    
    fieldsets = (
        (None, {'fields': ('id', 'user', 'bus')}),
        ('Passenger Details', {'fields': ('passenger_name', 'passenger_phone', 'passenger_email')}),
        ('Pricing', {'fields': ('seat_count', 'price_per_seat', 'total_amount')}),
        ('Status', {'fields': ('status', 'lock_expires_at')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
