"""
Booking views
"""
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Booking, BookingStatus
from .serializers import (
    BookingCreateSerializer,
    BookingSerializer,
    BookingListSerializer,
    BookingConfirmSerializer
)
from .services import BookingService


class BookingCreateView(APIView):
    """Create a new booking with seat locks"""
    
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = BookingCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            booking = BookingService.create_booking(
                user=request.user,
                bus_id=serializer.validated_data['bus_id'],
                seat_ids=serializer.validated_data['seat_ids'],
                passenger_name=serializer.validated_data['passenger_name'],
                passenger_phone=serializer.validated_data['passenger_phone'],
                passenger_email=serializer.validated_data['passenger_email']
            )
            
            return Response({
                'message': 'Booking created successfully',
                'booking': BookingSerializer(booking).data
            }, status=status.HTTP_201_CREATED)
            
        except ValueError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class BookingConfirmView(APIView):
    """Confirm a booking after payment"""
    
    permission_classes = [IsAuthenticated]
    
    def post(self, request, booking_id):
        serializer = BookingConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            booking = BookingService.confirm_booking(
                booking_id=booking_id,
                user=request.user
            )
            
            return Response({
                'message': 'Booking confirmed successfully',
                'booking': BookingSerializer(booking).data
            })
            
        except ValueError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class BookingCancelView(APIView):
    """Cancel a booking"""
    
    permission_classes = [IsAuthenticated]
    
    def post(self, request, booking_id):
        try:
            booking = BookingService.cancel_booking(
                booking_id=booking_id,
                user=request.user
            )
            
            return Response({
                'message': 'Booking cancelled successfully',
                'booking': BookingSerializer(booking).data
            })
            
        except ValueError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class BookingDetailView(generics.RetrieveAPIView):
    """Get booking details"""
    
    permission_classes = [IsAuthenticated]
    serializer_class = BookingSerializer
    lookup_field = 'id'
    lookup_url_kwarg = 'booking_id'
    
    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user).select_related('bus').prefetch_related('seats')


class BookingHistoryView(generics.ListAPIView):
    """Get user's booking history"""
    
    permission_classes = [IsAuthenticated]
    serializer_class = BookingListSerializer
    
    def get_queryset(self):
        queryset = BookingService.get_user_bookings(self.request.user)
        
        # Optional status filter
        status_filter = self.request.query_params.get('status')
        if status_filter and status_filter in BookingStatus.values:
            queryset = queryset.filter(status=status_filter)
        
        return queryset


class UpcomingTripsView(generics.ListAPIView):
    """Get user's upcoming trips"""
    
    permission_classes = [IsAuthenticated]
    serializer_class = BookingListSerializer
    
    def get_queryset(self):
        from django.utils import timezone
        return Booking.objects.filter(
            user=self.request.user,
            status=BookingStatus.CONFIRMED,
            bus__departure_time__gte=timezone.now()
        ).select_related('bus').prefetch_related('seats').order_by('bus__departure_time')
