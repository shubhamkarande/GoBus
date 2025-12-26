"""
Operator Dashboard views
"""
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Count, Sum
from datetime import timedelta
from buses.models import Bus
from buses.serializers import BusListSerializer, BusCreateSerializer, BusDetailSerializer
from bookings.models import Booking, BookingStatus
from bookings.serializers import BookingListSerializer


class OperatorPermission:
    """Mixin to check operator permission"""
    
    def check_operator(self, request):
        if request.user.role not in ['operator', 'admin']:
            return False
        return True


class OperatorDashboardView(APIView, OperatorPermission):
    """Operator dashboard overview"""
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if not self.check_operator(request):
            return Response(
                {'error': 'Operator access required'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        user = request.user
        now = timezone.now()
        
        # Get operator's buses
        buses = Bus.objects.filter(operator=user)
        
        # Today's stats
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        today_bookings = Booking.objects.filter(
            bus__operator=user,
            created_at__gte=today_start,
            status=BookingStatus.CONFIRMED
        )
        
        # This week's stats
        week_start = today_start - timedelta(days=today_start.weekday())
        week_bookings = Booking.objects.filter(
            bus__operator=user,
            created_at__gte=week_start,
            status=BookingStatus.CONFIRMED
        )
        
        # Calculate revenue
        today_revenue = today_bookings.aggregate(total=Sum('total_amount'))['total'] or 0
        week_revenue = week_bookings.aggregate(total=Sum('total_amount'))['total'] or 0
        
        # Upcoming departures
        upcoming_buses = buses.filter(
            departure_time__gte=now,
            departure_time__lte=now + timedelta(hours=24)
        ).order_by('departure_time')[:5]
        
        return Response({
            'overview': {
                'total_buses': buses.count(),
                'active_buses': buses.filter(is_active=True).count(),
                'today_bookings': today_bookings.count(),
                'today_revenue': float(today_revenue),
                'week_bookings': week_bookings.count(),
                'week_revenue': float(week_revenue)
            },
            'upcoming_departures': BusListSerializer(upcoming_buses, many=True).data
        })


class OperatorBusListView(generics.ListCreateAPIView, OperatorPermission):
    """List and create buses for operator"""
    
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return BusCreateSerializer
        return BusListSerializer
    
    def get_queryset(self):
        return Bus.objects.filter(operator=self.request.user).order_by('-created_at')
    
    def list(self, request, *args, **kwargs):
        if not self.check_operator(request):
            return Response(
                {'error': 'Operator access required'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().list(request, *args, **kwargs)
    
    def create(self, request, *args, **kwargs):
        if not self.check_operator(request):
            return Response(
                {'error': 'Operator access required'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().create(request, *args, **kwargs)


class OperatorBusDetailView(generics.RetrieveUpdateDestroyAPIView, OperatorPermission):
    """Manage a specific bus"""
    
    permission_classes = [IsAuthenticated]
    serializer_class = BusDetailSerializer
    lookup_field = 'id'
    
    def get_queryset(self):
        return Bus.objects.filter(operator=self.request.user)
    
    def retrieve(self, request, *args, **kwargs):
        if not self.check_operator(request):
            return Response(
                {'error': 'Operator access required'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().retrieve(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        if not self.check_operator(request):
            return Response(
                {'error': 'Operator access required'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        if not self.check_operator(request):
            return Response(
                {'error': 'Operator access required'},
                status=status.HTTP_403_FORBIDDEN
            )
        # Soft delete - just mark as inactive
        bus = self.get_object()
        bus.is_active = False
        bus.save(update_fields=['is_active'])
        return Response({'message': 'Bus deactivated successfully'})


class OperatorBookingsView(generics.ListAPIView, OperatorPermission):
    """List bookings for operator's buses"""
    
    permission_classes = [IsAuthenticated]
    serializer_class = BookingListSerializer
    
    def get_queryset(self):
        queryset = Booking.objects.filter(
            bus__operator=self.request.user
        ).select_related('bus', 'user').order_by('-created_at')
        
        # Optional filters
        bus_id = self.request.query_params.get('bus_id')
        if bus_id:
            queryset = queryset.filter(bus__id=bus_id)
        
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        return queryset
    
    def list(self, request, *args, **kwargs):
        if not self.check_operator(request):
            return Response(
                {'error': 'Operator access required'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().list(request, *args, **kwargs)


class OperatorBusPassengersView(APIView, OperatorPermission):
    """Get passenger list for a specific bus"""
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request, bus_id):
        if not self.check_operator(request):
            return Response(
                {'error': 'Operator access required'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            bus = Bus.objects.get(id=bus_id, operator=request.user)
        except Bus.DoesNotExist:
            return Response(
                {'error': 'Bus not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        bookings = Booking.objects.filter(
            bus=bus,
            status=BookingStatus.CONFIRMED
        ).prefetch_related('seats')
        
        passengers = []
        for booking in bookings:
            passengers.append({
                'booking_id': str(booking.id),
                'passenger_name': booking.passenger_name,
                'passenger_phone': booking.passenger_phone,
                'passenger_email': booking.passenger_email,
                'seats': booking.seat_numbers,
                'booked_at': booking.created_at
            })
        
        return Response({
            'bus': BusListSerializer(bus).data,
            'total_passengers': len(passengers),
            'passengers': passengers
        })
