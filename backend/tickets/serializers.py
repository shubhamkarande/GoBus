"""
Ticket serializers
"""
from rest_framework import serializers
from .models import Ticket
from bookings.serializers import BookingSerializer


class TicketSerializer(serializers.ModelSerializer):
    """Serializer for ticket details"""
    
    bus_name = serializers.CharField(source='booking.bus.name', read_only=True)
    bus_number = serializers.CharField(source='booking.bus.bus_number', read_only=True)
    source = serializers.CharField(source='booking.bus.source', read_only=True)
    destination = serializers.CharField(source='booking.bus.destination', read_only=True)
    departure_time = serializers.DateTimeField(source='booking.bus.departure_time', read_only=True)
    arrival_time = serializers.DateTimeField(source='booking.bus.arrival_time', read_only=True)
    seat_numbers = serializers.ListField(source='booking.seat_numbers', read_only=True)
    passenger_name = serializers.CharField(source='booking.passenger_name', read_only=True)
    passenger_phone = serializers.CharField(source='booking.passenger_phone', read_only=True)
    total_amount = serializers.DecimalField(
        source='booking.total_amount',
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    
    class Meta:
        model = Ticket
        fields = [
            'id', 'bus_name', 'bus_number', 'source', 'destination',
            'departure_time', 'arrival_time', 'seat_numbers',
            'passenger_name', 'passenger_phone', 'total_amount',
            'qr_data', 'is_validated', 'validated_at', 'created_at'
        ]


class TicketValidateSerializer(serializers.Serializer):
    """Serializer for ticket validation"""
    
    qr_data = serializers.CharField()
    validated_by = serializers.CharField(max_length=255, required=False)
