"""
Booking model for GoBus
"""
import uuid
from django.db import models
from django.conf import settings
from buses.models import Bus, Seat


class BookingStatus(models.TextChoices):
    PENDING = 'pending', 'Pending'
    CONFIRMED = 'confirmed', 'Confirmed'
    CANCELLED = 'cancelled', 'Cancelled'
    COMPLETED = 'completed', 'Completed'


class Booking(models.Model):
    """Booking model linking users to bus seats"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='bookings'
    )
    bus = models.ForeignKey(
        Bus,
        on_delete=models.CASCADE,
        related_name='bookings'
    )
    
    # Selected seats (M2M relationship)
    seats = models.ManyToManyField(
        Seat,
        related_name='bookings_included',
        through='BookingSeat'
    )
    
    # Passenger details
    passenger_name = models.CharField(max_length=255)
    passenger_phone = models.CharField(max_length=20)
    passenger_email = models.EmailField()
    
    # Pricing
    seat_count = models.IntegerField(default=1)
    price_per_seat = models.DecimalField(max_digits=10, decimal_places=2)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Status
    status = models.CharField(
        max_length=20,
        choices=BookingStatus.choices,
        default=BookingStatus.PENDING
    )
    
    # Lock expiry for pending bookings
    lock_expires_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'bookings'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Booking {self.id} - {self.user.name} - {self.bus.name}"
    
    @property
    def seat_numbers(self):
        """Get list of seat numbers"""
        return list(self.seats.values_list('seat_number', flat=True))
    
    def confirm(self):
        """Confirm the booking and mark seats as booked"""
        self.status = BookingStatus.CONFIRMED
        self.save(update_fields=['status', 'updated_at'])
        
        # Mark all seats as booked
        for seat in self.seats.all():
            seat.book()
    
    def cancel(self):
        """Cancel the booking and release seats"""
        self.status = BookingStatus.CANCELLED
        self.save(update_fields=['status', 'updated_at'])
        
        # Release all seats
        for seat in self.seats.all():
            seat.is_booked = False
            seat.unlock()


class BookingSeat(models.Model):
    """Through model for Booking-Seat M2M relationship"""
    
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE)
    seat = models.ForeignKey(Seat, on_delete=models.CASCADE)
    
    class Meta:
        db_table = 'booking_seats'
        unique_together = ['booking', 'seat']
