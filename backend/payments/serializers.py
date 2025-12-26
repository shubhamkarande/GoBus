"""
Payment serializers
"""
from rest_framework import serializers
from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    """Serializer for payment details"""
    
    booking_id = serializers.UUIDField(source='booking.id', read_only=True)
    
    class Meta:
        model = Payment
        fields = [
            'id', 'booking_id', 'amount', 'currency',
            'razorpay_order_id', 'razorpay_payment_id',
            'status', 'created_at'
        ]


class PaymentCreateSerializer(serializers.Serializer):
    """Serializer for creating a payment"""
    
    booking_id = serializers.UUIDField()


class PaymentVerifySerializer(serializers.Serializer):
    """Serializer for verifying a payment"""
    
    booking_id = serializers.UUIDField()
    razorpay_payment_id = serializers.CharField(max_length=255)
    razorpay_signature = serializers.CharField(max_length=500)
