"""
Booking business logic services
"""
from django.utils import timezone
from django.conf import settings
from django.db import transaction
from buses.models import Bus, Seat
from .models import Booking, BookingStatus


class BookingService:
    """Service for handling booking operations"""
    
    @staticmethod
    def create_booking(user, bus_id, seat_ids, passenger_name, passenger_phone, passenger_email):
        """
        Create a new booking with seat locks.
        Returns the booking if successful, raises exception otherwise.
        """
        try:
            bus = Bus.objects.get(id=bus_id, is_active=True)
        except Bus.DoesNotExist:
            raise ValueError("Bus not found or not available")
        
        # Verify all seats exist and are available
        seats = Seat.objects.filter(id__in=seat_ids, bus=bus)
        
        if seats.count() != len(seat_ids):
            raise ValueError("One or more seats not found")
        
        unavailable_seats = []
        for seat in seats:
            if not seat.is_available:
                unavailable_seats.append(seat.seat_number)
        
        if unavailable_seats:
            raise ValueError(f"Seats not available: {', '.join(unavailable_seats)}")
        
        with transaction.atomic():
            # Lock seats for checkout
            lock_timeout_minutes = getattr(settings, 'SEAT_LOCK_TIMEOUT', 10)
            lock_expires = timezone.now() + timezone.timedelta(minutes=lock_timeout_minutes)
            
            for seat in seats:
                seat.lock(user, minutes=lock_timeout_minutes)
            
            # Calculate pricing
            seat_count = len(seat_ids)
            price_per_seat = bus.price
            total_amount = price_per_seat * seat_count
            
            # Create booking
            booking = Booking.objects.create(
                user=user,
                bus=bus,
                passenger_name=passenger_name,
                passenger_phone=passenger_phone,
                passenger_email=passenger_email,
                seat_count=seat_count,
                price_per_seat=price_per_seat,
                total_amount=total_amount,
                status=BookingStatus.PENDING,
                lock_expires_at=lock_expires
            )
            
            # Add seats to booking
            booking.seats.set(seats)
            
            return booking
    
    @staticmethod
    def confirm_booking(booking_id, user):
        """Confirm a booking after successful payment"""
        try:
            booking = Booking.objects.get(id=booking_id, user=user)
        except Booking.DoesNotExist:
            raise ValueError("Booking not found")
        
        if booking.status != BookingStatus.PENDING:
            raise ValueError(f"Booking cannot be confirmed. Current status: {booking.status}")
        
        # Check if lock has expired
        if booking.lock_expires_at and booking.lock_expires_at < timezone.now():
            raise ValueError("Booking lock has expired. Please try again.")
        
        booking.confirm()
        return booking
    
    @staticmethod
    def cancel_booking(booking_id, user):
        """Cancel a booking"""
        try:
            booking = Booking.objects.get(id=booking_id, user=user)
        except Booking.DoesNotExist:
            raise ValueError("Booking not found")
        
        if booking.status not in [BookingStatus.PENDING, BookingStatus.CONFIRMED]:
            raise ValueError(f"Booking cannot be cancelled. Current status: {booking.status}")
        
        # Check if trip hasn't started
        if booking.bus.departure_time < timezone.now():
            raise ValueError("Cannot cancel a booking after trip has started")
        
        booking.cancel()
        return booking
    
    @staticmethod
    def get_user_bookings(user, status=None):
        """Get all bookings for a user, optionally filtered by status"""
        queryset = Booking.objects.filter(user=user).select_related('bus').prefetch_related('seats')
        
        if status:
            queryset = queryset.filter(status=status)
        
        return queryset.order_by('-created_at')
    
    @staticmethod
    def cleanup_expired_locks():
        """Release expired seat locks (called by scheduled task)"""
        expired_time = timezone.now()
        
        # Find pending bookings with expired locks
        expired_bookings = Booking.objects.filter(
            status=BookingStatus.PENDING,
            lock_expires_at__lt=expired_time
        )
        
        for booking in expired_bookings:
            # Release seat locks
            for seat in booking.seats.all():
                seat.unlock()
            
            # Mark booking as cancelled
            booking.status = BookingStatus.CANCELLED
            booking.save(update_fields=['status'])
        
        # Also clean up orphan seat locks
        Seat.objects.filter(
            locked_until__lt=expired_time,
            is_booked=False
        ).update(locked_until=None, locked_by=None)
