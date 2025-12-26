"""
Bus views for search and details
"""
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.utils import timezone
from datetime import datetime, timedelta
from .models import Bus, Seat
from .serializers import (
    BusListSerializer,
    BusDetailSerializer,
    BusSearchSerializer,
    SeatSerializer
)


class BusSearchView(APIView):
    """Search buses by route and date"""
    
    permission_classes = [AllowAny]
    
    def get(self, request):
        serializer = BusSearchSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        
        data = serializer.validated_data
        source = data['source'].strip().lower()
        destination = data['destination'].strip().lower()
        date = data['date']
        
        # Build date range for the selected date
        start_datetime = timezone.make_aware(
            datetime.combine(date, datetime.min.time())
        )
        end_datetime = start_datetime + timedelta(days=1)
        
        # Query buses
        queryset = Bus.objects.filter(
            source__icontains=source,
            destination__icontains=destination,
            departure_time__gte=start_datetime,
            departure_time__lt=end_datetime,
            is_active=True
        ).select_related('operator')
        
        # Apply optional filters
        if 'bus_type' in data:
            queryset = queryset.filter(bus_type=data['bus_type'])
        if 'min_price' in data:
            queryset = queryset.filter(price__gte=data['min_price'])
        if 'max_price' in data:
            queryset = queryset.filter(price__lte=data['max_price'])
        
        # Order by departure time
        queryset = queryset.order_by('departure_time')
        
        serializer = BusListSerializer(queryset, many=True)
        return Response({
            'count': queryset.count(),
            'buses': serializer.data
        })


class BusDetailView(generics.RetrieveAPIView):
    """Get detailed bus information with seat layout"""
    
    permission_classes = [AllowAny]
    queryset = Bus.objects.prefetch_related('seats').select_related('operator')
    serializer_class = BusDetailSerializer
    lookup_field = 'id'


class BusSeatListView(APIView):
    """Get seat availability for a specific bus"""
    
    permission_classes = [AllowAny]
    
    def get(self, request, bus_id):
        try:
            bus = Bus.objects.prefetch_related('seats').get(id=bus_id)
        except Bus.DoesNotExist:
            return Response(
                {'error': 'Bus not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        seats = bus.seats.all()
        serializer = SeatSerializer(seats, many=True)
        
        return Response({
            'bus_id': str(bus.id),
            'bus_name': bus.name,
            'rows': bus.rows,
            'seats_per_row': bus.seats_per_row,
            'total_seats': bus.total_seats,
            'available_seats': bus.available_seats_count,
            'seats': serializer.data
        })


class PopularRoutesView(APIView):
    """Get popular routes for home screen"""
    
    permission_classes = [AllowAny]
    
    def get(self, request):
        # Get distinct routes with bus count
        routes = Bus.objects.filter(
            is_active=True,
            departure_time__gte=timezone.now()
        ).values('source', 'destination').distinct()[:10]
        
        popular_routes = []
        for route in routes:
            min_price = Bus.objects.filter(
                source=route['source'],
                destination=route['destination'],
                is_active=True
            ).order_by('price').first()
            
            popular_routes.append({
                'source': route['source'],
                'destination': route['destination'],
                'starting_price': min_price.price if min_price else 0
            })
        
        return Response({'routes': popular_routes})
