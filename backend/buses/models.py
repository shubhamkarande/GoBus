"""
Bus and Seat models for GoBus
"""
import uuid
from django.db import models
from django.conf import settings
from django.utils import timezone


class BusType(models.TextChoices):
    AC_SLEEPER = 'ac_sleeper', 'AC Sleeper'
    AC_SEATER = 'ac_seater', 'AC Seater'
    NON_AC_SLEEPER = 'non_ac_sleeper', 'Non-AC Sleeper'
    NON_AC_SEATER = 'non_ac_seater', 'Non-AC Seater'
    VOLVO = 'volvo', 'Volvo Multi-Axle'


class Bus(models.Model):
    """Bus model representing a specific bus service"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    operator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name='buses',
        null=True,
        blank=True
    )
    
    # Bus details
    name = models.CharField(max_length=255)
    bus_number = models.CharField(max_length=50)
    bus_type = models.CharField(
        max_length=20,
        choices=BusType.choices,
        default=BusType.AC_SEATER
    )
    
    # Route information
    source = models.CharField(max_length=255)
    destination = models.CharField(max_length=255)
    
    # Schedule
    departure_time = models.DateTimeField()
    arrival_time = models.DateTimeField()
    
    # Pricing
    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Capacity
    total_seats = models.IntegerField(default=40)
    rows = models.IntegerField(default=10)  # Number of rows
    seats_per_row = models.IntegerField(default=4)  # Seats per row (2+2 layout)
    
    # Amenities
    has_wifi = models.BooleanField(default=False)
    has_charging = models.BooleanField(default=True)
    has_toilet = models.BooleanField(default=False)
    has_water = models.BooleanField(default=True)
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'buses'
        ordering = ['departure_time']
        verbose_name_plural = 'Buses'
    
    def __str__(self):
        return f"{self.name} - {self.source} to {self.destination}"
    
    @property
    def duration(self):
        """Calculate journey duration"""
        if self.arrival_time and self.departure_time:
            delta = self.arrival_time - self.departure_time
            hours = delta.seconds // 3600
            minutes = (delta.seconds % 3600) // 60
            return f"{hours}h {minutes}m"
        return None
    
    @property
    def available_seats_count(self):
        """Count available seats"""
        return self.seats.filter(is_booked=False).exclude(
            locked_until__gt=timezone.now()
        ).count()
    
    def create_seats(self):
        """Create seats for the bus based on configuration"""
        seat_labels = ['A', 'B', 'C', 'D', 'E']
        seats_to_create = []
        
        for row in range(1, self.rows + 1):
            for col in range(self.seats_per_row):
                seat_number = f"{row}{seat_labels[col]}"
                seats_to_create.append(
                    Seat(bus=self, seat_number=seat_number, row=row, column=col)
                )
        
        Seat.objects.bulk_create(seats_to_create)


class Seat(models.Model):
    """Seat model for individual bus seats"""
    
    bus = models.ForeignKey(
        Bus,
        on_delete=models.CASCADE,
        related_name='seats'
    )
    seat_number = models.CharField(max_length=10)  # e.g., "1A", "2B"
    row = models.IntegerField()
    column = models.IntegerField()
    
    # Booking status
    is_booked = models.BooleanField(default=False)
    
    # Temporary lock for checkout
    locked_until = models.DateTimeField(null=True, blank=True)
    locked_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='locked_seats'
    )
    
    class Meta:
        db_table = 'seats'
        ordering = ['row', 'column']
        unique_together = ['bus', 'seat_number']
    
    def __str__(self):
        return f"{self.bus.name} - Seat {self.seat_number}"
    
    @property
    def is_available(self):
        """Check if seat is available for booking"""
        if self.is_booked:
            return False
        if self.locked_until and self.locked_until > timezone.now():
            return False
        return True
    
    def lock(self, user, minutes=10):
        """Lock seat temporarily for checkout"""
        self.locked_until = timezone.now() + timezone.timedelta(minutes=minutes)
        self.locked_by = user
        self.save(update_fields=['locked_until', 'locked_by'])
    
    def unlock(self):
        """Release seat lock"""
        self.locked_until = None
        self.locked_by = None
        self.save(update_fields=['locked_until', 'locked_by'])
    
    def book(self):
        """Mark seat as booked"""
        self.is_booked = True
        self.locked_until = None
        self.locked_by = None
        self.save(update_fields=['is_booked', 'locked_until', 'locked_by'])
