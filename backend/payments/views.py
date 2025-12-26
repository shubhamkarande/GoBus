"""
Payment views
"""
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import PaymentCreateSerializer, PaymentVerifySerializer, PaymentSerializer
from .services import PaymentService


class PaymentCreateView(APIView):
    """Create a payment order for a booking"""
    
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = PaymentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            payment_service = PaymentService()
            result = payment_service.initiate_payment(
                booking_id=serializer.validated_data['booking_id'],
                user=request.user
            )
            
            return Response({
                'message': 'Payment initiated',
                **result
            })
            
        except ValueError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class PaymentVerifyView(APIView):
    """Verify payment and confirm booking"""
    
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = PaymentVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            payment_service = PaymentService()
            booking = payment_service.verify_and_confirm(
                booking_id=serializer.validated_data['booking_id'],
                razorpay_payment_id=serializer.validated_data['razorpay_payment_id'],
                razorpay_signature=serializer.validated_data['razorpay_signature'],
                user=request.user
            )
            
            return Response({
                'message': 'Payment verified and booking confirmed',
                'booking_id': str(booking.id),
                'booking_status': booking.status
            })
            
        except ValueError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
