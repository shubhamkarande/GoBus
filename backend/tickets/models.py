"""
Ticket model for GoBus
"""
import uuid
from django.db import models
from bookings.models import Booking


class Ticket(models.Model):
    """E-ticket model with QR code for validated entry"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking = models.OneToOneField(
        Booking,
        on_delete=models.CASCADE,
        related_name='ticket'
    )
    
    # QR Code data (JSON string containing ticket info)
    qr_data = models.TextField()
    
    # QR Code image path (optional, can be generated on-demand)
    qr_image = models.ImageField(upload_to='tickets/qr/', blank=True, null=True)
    
    # Ticket validation
    is_validated = models.BooleanField(default=False)
    validated_at = models.DateTimeField(null=True, blank=True)
    validated_by = models.CharField(max_length=255, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'tickets'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Ticket {self.id} for Booking {self.booking.id}"
    
    def validate(self, validated_by: str = None):
        """Mark ticket as validated"""
        from django.utils import timezone
        self.is_validated = True
        self.validated_at = timezone.now()
        self.validated_by = validated_by
        self.save(update_fields=['is_validated', 'validated_at', 'validated_by'])
