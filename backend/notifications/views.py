"""
Notification views
"""
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .services import NotificationService


class TestNotificationView(APIView):
    """Send a test notification to the current user"""
    
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        if not request.user.fcm_token:
            return Response(
                {'error': 'No FCM token registered for this user'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        notification_service = NotificationService()
        success = notification_service.fcm.send_notification(
            user=request.user,
            title="Test Notification 🔔",
            body="This is a test notification from GoBus!",
            data={'type': 'test'}
        )
        
        if success:
            return Response({'message': 'Test notification sent successfully'})
        else:
            return Response(
                {'error': 'Failed to send notification'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
