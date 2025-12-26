"""
Payment service for Razorpay integration
Supports both real Razorpay and mock mode for development
"""
import uuid
import hashlib
import hmac
from decimal import Decimal
from django.conf import settings
from .models import Payment, PaymentStatus
from bookings.models import Booking, BookingStatus


class RazorpayService:
    """Service for Razorpay payment operations"""
    
    def __init__(self):
        self.mock_mode = getattr(settings, 'RAZORPAY_MOCK_MODE', True)
        self.key_id = getattr(settings, 'RAZORPAY_KEY_ID', '')
        self.key_secret = getattr(settings, 'RAZORPAY_KEY_SECRET', '')
        
        if not self.mock_mode:
            import razorpay
            self.client = razorpay.Client(auth=(self.key_id, self.key_secret))
    
    def create_order(self, booking: Booking) -> Payment:
        """Create a Razorpay order for a booking"""
        
        # Check if payment already exists for this booking
        existing_payment = Payment.objects.filter(booking=booking).first()
        if existing_payment:
            if existing_payment.status == PaymentStatus.COMPLETED:
                raise ValueError("Payment already completed for this booking")
            # Return existing pending payment
            return existing_payment
        
        amount_in_paise = int(booking.total_amount * 100)  # Convert to paise
        
        if self.mock_mode:
            # Mock order creation
            order_id = f"order_mock_{uuid.uuid4().hex[:16]}"
        else:
            # Real Razorpay order creation
            order_data = {
                'amount': amount_in_paise,
                'currency': 'INR',
                'receipt': str(booking.id),
                'notes': {
                    'booking_id': str(booking.id),
                    'user_id': str(booking.user.id)
                }
            }
            order = self.client.order.create(data=order_data)
            order_id = order['id']
        
        # Create payment record
        payment = Payment.objects.create(
            booking=booking,
            amount=booking.total_amount,
            currency='INR',
            razorpay_order_id=order_id,
            status=PaymentStatus.PENDING
        )
        
        return payment
    
    def verify_payment(self, payment: Payment, razorpay_payment_id: str, razorpay_signature: str) -> bool:
        """Verify Razorpay payment signature"""
        
        if self.mock_mode:
            # In mock mode, accept any payment ID starting with "pay_mock_"
            if razorpay_payment_id.startswith('pay_mock_'):
                payment.mark_completed(razorpay_payment_id, razorpay_signature)
                return True
            # Also accept for testing purposes
            payment.mark_completed(razorpay_payment_id, razorpay_signature)
            return True
        
        # Real signature verification
        try:
            # Create signature verification string
            message = f"{payment.razorpay_order_id}|{razorpay_payment_id}"
            expected_signature = hmac.new(
                self.key_secret.encode(),
                message.encode(),
                hashlib.sha256
            ).hexdigest()
            
            if expected_signature == razorpay_signature:
                payment.mark_completed(razorpay_payment_id, razorpay_signature)
                return True
            else:
                payment.mark_failed("Invalid signature")
                return False
                
        except Exception as e:
            payment.mark_failed(str(e))
            return False
    
    def get_checkout_options(self, payment: Payment, user) -> dict:
        """Get options for Razorpay checkout"""
        
        return {
            'key': self.key_id if not self.mock_mode else 'rzp_test_mock',
            'amount': int(payment.amount * 100),
            'currency': payment.currency,
            'name': 'GoBus',
            'description': f'Booking for {payment.booking.bus.name}',
            'order_id': payment.razorpay_order_id,
            'prefill': {
                'name': user.name,
                'email': user.email,
                'contact': user.phone or ''
            },
            'notes': {
                'booking_id': str(payment.booking.id)
            },
            'theme': {
                'color': '#1E88E5'
            },
            'mock_mode': self.mock_mode
        }


class PaymentService:
    """High-level payment service"""
    
    def __init__(self):
        self.razorpay = RazorpayService()
    
    def initiate_payment(self, booking_id: str, user) -> dict:
        """Initiate payment for a booking"""
        
        try:
            booking = Booking.objects.get(id=booking_id, user=user)
        except Booking.DoesNotExist:
            raise ValueError("Booking not found")
        
        if booking.status != BookingStatus.PENDING:
            raise ValueError(f"Cannot process payment. Booking status: {booking.status}")
        
        # Create Razorpay order
        payment = self.razorpay.create_order(booking)
        
        # Get checkout options
        checkout_options = self.razorpay.get_checkout_options(payment, user)
        
        return {
            'payment_id': str(payment.id),
            'order_id': payment.razorpay_order_id,
            'amount': float(payment.amount),
            'currency': payment.currency,
            'checkout_options': checkout_options
        }
    
    def verify_and_confirm(self, booking_id: str, razorpay_payment_id: str, 
                           razorpay_signature: str, user) -> Booking:
        """Verify payment and confirm booking"""
        
        try:
            booking = Booking.objects.get(id=booking_id, user=user)
        except Booking.DoesNotExist:
            raise ValueError("Booking not found")
        
        try:
            payment = Payment.objects.get(booking=booking)
        except Payment.DoesNotExist:
            raise ValueError("Payment not found")
        
        # Verify payment
        if not self.razorpay.verify_payment(payment, razorpay_payment_id, razorpay_signature):
            raise ValueError("Payment verification failed")
        
        # Confirm booking
        booking.confirm()
        
        return booking
