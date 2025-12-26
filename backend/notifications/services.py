"""
Firebase Cloud Messaging notification service
Supports both real FCM and mock mode for development
"""
import json
from django.conf import settings
from users.models import User


class FCMService:
    """Service for sending Firebase Cloud Messaging notifications"""
    
    def __init__(self):
        self.mock_mode = getattr(settings, 'FIREBASE_MOCK_MODE', True)
        self._initialized = False
        
        if not self.mock_mode:
            self._initialize_firebase()
    
    def _initialize_firebase(self):
        """Initialize Firebase Admin SDK"""
        try:
            import firebase_admin
            from firebase_admin import credentials
            
            cred_path = getattr(settings, 'FIREBASE_CREDENTIALS_PATH', '')
            if cred_path:
                cred = credentials.Certificate(cred_path)
                firebase_admin.initialize_app(cred)
                self._initialized = True
        except Exception as e:
            print(f"Firebase initialization failed: {e}")
            self.mock_mode = True
    
    def send_notification(self, user: User, title: str, body: str, data: dict = None) -> bool:
        """Send push notification to a user"""
        
        if not user.fcm_token:
            return False
        
        if self.mock_mode:
            # Log notification in mock mode
            print(f"[MOCK FCM] To: {user.email}")
            print(f"[MOCK FCM] Title: {title}")
            print(f"[MOCK FCM] Body: {body}")
            print(f"[MOCK FCM] Data: {json.dumps(data) if data else 'None'}")
            return True
        
        try:
            from firebase_admin import messaging
            
            message = messaging.Message(
                notification=messaging.Notification(
                    title=title,
                    body=body
                ),
                data=data or {},
                token=user.fcm_token
            )
            
            response = messaging.send(message)
            print(f"FCM sent successfully: {response}")
            return True
            
        except Exception as e:
            print(f"FCM send failed: {e}")
            return False
    
    def send_to_multiple(self, users: list, title: str, body: str, data: dict = None) -> int:
        """Send notification to multiple users"""
        
        success_count = 0
        for user in users:
            if self.send_notification(user, title, body, data):
                success_count += 1
        
        return success_count


class NotificationService:
    """High-level notification service for booking events"""
    
    def __init__(self):
        self.fcm = FCMService()
    
    def send_booking_confirmation(self, booking):
        """Send booking confirmation notification"""
        
        title = "Booking Confirmed! 🎉"
        body = f"Your booking for {booking.bus.name} ({booking.bus.source} → {booking.bus.destination}) is confirmed. Seats: {', '.join(booking.seat_numbers)}"
        
        data = {
            'type': 'booking_confirmation',
            'booking_id': str(booking.id)
        }
        
        return self.fcm.send_notification(booking.user, title, body, data)
    
    def send_trip_reminder(self, booking, hours_before: int = 2):
        """Send trip reminder notification"""
        
        title = f"Trip Reminder - {hours_before}h to go! ⏰"
        body = f"Your bus {booking.bus.name} departs at {booking.bus.departure_time.strftime('%I:%M %p')} from {booking.bus.source}"
        
        data = {
            'type': 'trip_reminder',
            'booking_id': str(booking.id)
        }
        
        return self.fcm.send_notification(booking.user, title, body, data)
    
    def send_cancellation_alert(self, booking):
        """Send booking cancellation notification"""
        
        title = "Booking Cancelled"
        body = f"Your booking for {booking.bus.name} has been cancelled. Refund will be processed shortly."
        
        data = {
            'type': 'booking_cancelled',
            'booking_id': str(booking.id)
        }
        
        return self.fcm.send_notification(booking.user, title, body, data)
    
    def send_payment_success(self, booking, amount):
        """Send payment success notification"""
        
        title = "Payment Successful ✓"
        body = f"₹{amount} paid successfully for your {booking.bus.source} → {booking.bus.destination} trip"
        
        data = {
            'type': 'payment_success',
            'booking_id': str(booking.id)
        }
        
        return self.fcm.send_notification(booking.user, title, body, data)
