"""
Ticket views
"""
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from bookings.models import Booking, BookingStatus
from .models import Ticket
from .serializers import TicketSerializer, TicketValidateSerializer
from .services import TicketService


class TicketDetailView(APIView):
    """Get ticket for a booking"""
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request, booking_id):
        try:
            booking = Booking.objects.get(id=booking_id, user=request.user)
        except Booking.DoesNotExist:
            return Response(
                {'error': 'Booking not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if booking.status != BookingStatus.CONFIRMED:
            return Response(
                {'error': 'Ticket only available for confirmed bookings'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Generate ticket if not exists
        try:
            ticket = TicketService.generate_ticket(booking)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        # Get QR code as base64
        qr_base64 = TicketService.get_qr_base64(ticket)
        
        serializer = TicketSerializer(ticket)
        return Response({
            **serializer.data,
            'qr_image_base64': qr_base64
        })


class TicketValidateView(APIView):
    """Validate a ticket (for operators)"""
    
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        # Only operators and admins can validate tickets
        if request.user.role not in ['operator', 'admin']:
            return Response(
                {'error': 'Only operators can validate tickets'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = TicketValidateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        result = TicketService.validate_ticket(
            qr_data=serializer.validated_data['qr_data'],
            validated_by=serializer.validated_data.get('validated_by', request.user.name)
        )
        
        if result['valid']:
            return Response(result)
        else:
            return Response(result, status=status.HTTP_400_BAD_REQUEST)


class MyTicketsView(APIView):
    """Get all tickets for the current user"""
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        tickets = Ticket.objects.filter(
            booking__user=request.user
        ).select_related('booking', 'booking__bus').order_by('-created_at')
        
        serializer = TicketSerializer(tickets, many=True)
        return Response({
            'count': tickets.count(),
            'tickets': serializer.data
        })
