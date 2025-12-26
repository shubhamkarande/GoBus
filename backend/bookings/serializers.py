"""
Booking serializers
"""
from rest_framework import serializers
from .models import Booking, BookingStatus
from buses.serializers import BusListSerializer, SeatSerializer


class BookingCreateSerializer(serializers.Serializer):
    """Serializer for creating a new booking"""
    
    bus_id = serializers.UUIDField()
    seat_ids = serializers.ListField(
        child=serializers.IntegerField(),
        min_length=1,
        max_length=10
    )
    passenger_name = serializers.CharField(max_length=255)
    passenger_phone = serializers.CharField(max_length=20)
    passenger_email = serializers.EmailField()


class BookingSerializer(serializers.ModelSerializer):
    """Serializer for booking details"""
    
    bus = BusListSerializer(read_only=True)
    seats = SeatSerializer(many=True, read_only=True)
    seat_numbers = serializers.ReadOnlyField()
    
    class Meta:
        model = Booking
        fields = [
            'id', 'bus', 'seats', 'seat_numbers',
            'passenger_name', 'passenger_phone', 'passenger_email',
            'seat_count', 'price_per_seat', 'total_amount',
            'status', 'lock_expires_at', 'created_at'
        ]


class BookingListSerializer(serializers.ModelSerializer):
    """Simplified serializer for booking list"""
    
    bus_name = serializers.CharField(source='bus.name', read_only=True)
    source = serializers.CharField(source='bus.source', read_only=True)
    destination = serializers.CharField(source='bus.destination', read_only=True)
    departure_time = serializers.DateTimeField(source='bus.departure_time', read_only=True)
    seat_numbers = serializers.ReadOnlyField()
    
    class Meta:
        model = Booking
        fields = [
            'id', 'bus_name', 'source', 'destination', 'departure_time',
            'seat_numbers', 'total_amount', 'status', 'created_at'
        ]


class BookingConfirmSerializer(serializers.Serializer):
    """Serializer for confirming a booking"""
    
    payment_id = serializers.CharField(max_length=255)
