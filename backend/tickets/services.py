"""
Ticket generation and QR code services
"""
import json
import io
import base64
import qrcode
from django.conf import settings
from django.core.files.base import ContentFile
from bookings.models import Booking, BookingStatus
from .models import Ticket


class TicketService:
    """Service for ticket generation and validation"""
    
    @staticmethod
    def generate_ticket(booking: Booking) -> Ticket:
        """Generate a ticket for a confirmed booking"""
        
        if booking.status != BookingStatus.CONFIRMED:
            raise ValueError("Can only generate tickets for confirmed bookings")
        
        # Check if ticket already exists
        existing_ticket = Ticket.objects.filter(booking=booking).first()
        if existing_ticket:
            return existing_ticket
        
        # Create QR data
        qr_data = {
            'ticket_type': 'gobus_v1',
            'booking_id': str(booking.id),
            'bus_id': str(booking.bus.id),
            'bus_name': booking.bus.name,
            'bus_number': booking.bus.bus_number,
            'source': booking.bus.source,
            'destination': booking.bus.destination,
            'departure_time': booking.bus.departure_time.isoformat(),
            'seats': booking.seat_numbers,
            'passenger_name': booking.passenger_name,
            'passenger_phone': booking.passenger_phone,
            'total_amount': str(booking.total_amount),
            'booking_date': booking.created_at.isoformat()
        }
        
        # Create ticket
        ticket = Ticket.objects.create(
            booking=booking,
            qr_data=json.dumps(qr_data)
        )
        
        # Generate QR image
        TicketService.generate_qr_image(ticket)
        
        return ticket
    
    @staticmethod
    def generate_qr_image(ticket: Ticket) -> str:
        """Generate QR code image and return base64 string"""
        
        # Create QR code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(ticket.qr_data)
        qr.make(fit=True)
        
        # Create image
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Save to bytes
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        buffer.seek(0)
        
        # Save to ticket model
        ticket.qr_image.save(
            f'ticket_{ticket.id}.png',
            ContentFile(buffer.read()),
            save=True
        )
        
        # Return base64 encoded string
        buffer.seek(0)
        return base64.b64encode(buffer.read()).decode('utf-8')
    
    @staticmethod
    def get_qr_base64(ticket: Ticket) -> str:
        """Get QR code as base64 string"""
        
        if ticket.qr_image:
            with ticket.qr_image.open('rb') as f:
                return base64.b64encode(f.read()).decode('utf-8')
        
        # Generate on-demand if not exists
        return TicketService.generate_qr_image(ticket)
    
    @staticmethod
    def validate_ticket(qr_data: str, validated_by: str = None) -> dict:
        """Validate a ticket from QR code data"""
        
        try:
            data = json.loads(qr_data)
        except json.JSONDecodeError:
            return {'valid': False, 'error': 'Invalid QR code format'}
        
        if data.get('ticket_type') != 'gobus_v1':
            return {'valid': False, 'error': 'Invalid ticket type'}
        
        booking_id = data.get('booking_id')
        if not booking_id:
            return {'valid': False, 'error': 'Missing booking ID'}
        
        try:
            ticket = Ticket.objects.select_related('booking', 'booking__bus').get(
                booking__id=booking_id
            )
        except Ticket.DoesNotExist:
            return {'valid': False, 'error': 'Ticket not found'}
        
        if ticket.is_validated:
            return {
                'valid': False,
                'error': 'Ticket already validated',
                'validated_at': ticket.validated_at.isoformat() if ticket.validated_at else None
            }
        
        # Validate the ticket
        ticket.validate(validated_by)
        
        return {
            'valid': True,
            'ticket_id': str(ticket.id),
            'booking_id': str(ticket.booking.id),
            'bus_name': ticket.booking.bus.name,
            'seats': ticket.booking.seat_numbers,
            'passenger_name': ticket.booking.passenger_name
        }
