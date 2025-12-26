"""
Admin configuration for Buses app
"""
from django.contrib import admin
from .models import Bus, Seat


class SeatInline(admin.TabularInline):
    model = Seat
    extra = 0
    readonly_fields = ['seat_number', 'row', 'column']
    fields = ['seat_number', 'row', 'column', 'is_booked', 'locked_until']


@admin.register(Bus)
class BusAdmin(admin.ModelAdmin):
    list_display = ['name', 'bus_number', 'bus_type', 'source', 'destination', 
                    'departure_time', 'price', 'available_seats_count', 'is_active']
    list_filter = ['bus_type', 'is_active', 'source', 'destination']
    search_fields = ['name', 'bus_number', 'source', 'destination']
    ordering = ['departure_time']
    inlines = [SeatInline]
    
    fieldsets = (
        (None, {'fields': ('operator', 'name', 'bus_number', 'bus_type')}),
        ('Route', {'fields': ('source', 'destination')}),
        ('Schedule', {'fields': ('departure_time', 'arrival_time')}),
        ('Pricing & Capacity', {'fields': ('price', 'total_seats', 'rows', 'seats_per_row')}),
        ('Amenities', {'fields': ('has_wifi', 'has_charging', 'has_toilet', 'has_water')}),
        ('Status', {'fields': ('is_active',)}),
    )
    
    def save_model(self, request, obj, form, change):
        is_new = obj.pk is None or not change
        super().save_model(request, obj, form, change)
        # Auto-create seats for new buses
        if is_new and obj.seats.count() == 0:
            obj.create_seats()


@admin.register(Seat)
class SeatAdmin(admin.ModelAdmin):
    list_display = ['bus', 'seat_number', 'is_booked', 'locked_until', 'locked_by']
    list_filter = ['is_booked', 'bus']
    search_fields = ['bus__name', 'seat_number']
