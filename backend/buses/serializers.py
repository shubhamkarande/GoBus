"""
Bus serializers for API responses
"""
from rest_framework import serializers
from django.utils import timezone
from .models import Bus, Seat, BusType
from users.serializers import UserSerializer


class SeatSerializer(serializers.ModelSerializer):
    """Serializer for individual seat"""
    
    is_available = serializers.ReadOnlyField()
    
    class Meta:
        model = Seat
        fields = ['id', 'seat_number', 'row', 'column', 'is_booked', 'is_available']


class BusListSerializer(serializers.ModelSerializer):
    """Serializer for bus list in search results"""
    
    operator_name = serializers.CharField(source='operator.name', read_only=True)
    available_seats = serializers.IntegerField(source='available_seats_count', read_only=True)
    duration = serializers.ReadOnlyField()
    
    class Meta:
        model = Bus
        fields = [
            'id', 'name', 'bus_number', 'bus_type',
            'source', 'destination',
            'departure_time', 'arrival_time', 'duration',
            'price', 'total_seats', 'available_seats',
            'has_wifi', 'has_charging', 'has_toilet', 'has_water',
            'operator_name'
        ]


class BusDetailSerializer(serializers.ModelSerializer):
    """Serializer for detailed bus view with seats"""
    
    operator_name = serializers.CharField(source='operator.name', read_only=True)
    available_seats = serializers.IntegerField(source='available_seats_count', read_only=True)
    duration = serializers.ReadOnlyField()
    seats = SeatSerializer(many=True, read_only=True)
    
    class Meta:
        model = Bus
        fields = [
            'id', 'name', 'bus_number', 'bus_type',
            'source', 'destination',
            'departure_time', 'arrival_time', 'duration',
            'price', 'total_seats', 'available_seats',
            'rows', 'seats_per_row',
            'has_wifi', 'has_charging', 'has_toilet', 'has_water',
            'operator_name', 'seats'
        ]


class BusCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new bus (operator only)"""
    
    class Meta:
        model = Bus
        fields = [
            'name', 'bus_number', 'bus_type',
            'source', 'destination',
            'departure_time', 'arrival_time',
            'price', 'total_seats', 'rows', 'seats_per_row',
            'has_wifi', 'has_charging', 'has_toilet', 'has_water'
        ]
    
    def validate(self, attrs):
        if attrs['departure_time'] >= attrs['arrival_time']:
            raise serializers.ValidationError({
                'arrival_time': 'Arrival time must be after departure time.'
            })
        if attrs['departure_time'] < timezone.now():
            raise serializers.ValidationError({
                'departure_time': 'Departure time cannot be in the past.'
            })
        return attrs
    
    def create(self, validated_data):
        # Set operator from request user
        validated_data['operator'] = self.context['request'].user
        bus = super().create(validated_data)
        # Auto-create seats
        bus.create_seats()
        return bus


class BusSearchSerializer(serializers.Serializer):
    """Serializer for bus search parameters"""
    
    source = serializers.CharField(max_length=255)
    destination = serializers.CharField(max_length=255)
    date = serializers.DateField()
    bus_type = serializers.ChoiceField(choices=BusType.choices, required=False)
    min_price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    max_price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
