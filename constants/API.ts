// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://your-django-api.com/api',
  ENDPOINTS: {
    // Auth
    LOGIN: '/auth/login/',
    REGISTER: '/auth/register/',
    REFRESH_TOKEN: '/auth/refresh/',
    
    // Bus Search
    SEARCH_BUSES: '/buses/search/',
    BUS_DETAILS: '/buses/{id}/',
    SEAT_LAYOUT: '/buses/{id}/seats/',
    
    // Booking
    CREATE_BOOKING: '/bookings/',
    BOOKING_DETAILS: '/bookings/{id}/',
    USER_BOOKINGS: '/bookings/user/',
    CANCEL_BOOKING: '/bookings/{id}/cancel/',
    
    // Payment
    CREATE_PAYMENT: '/payments/create/',
    VERIFY_PAYMENT: '/payments/verify/',
    PAYMENT_STATUS: '/payments/{id}/status/',
    
    // Tickets
    GENERATE_TICKET: '/tickets/generate/',
    TICKET_DETAILS: '/tickets/{id}/',
    VALIDATE_TICKET: '/tickets/{id}/validate/',
  },
};

// Razorpay Configuration
export const RAZORPAY_CONFIG = {
  KEY_ID: 'your_razorpay_key_id',
  KEY_SECRET: 'your_razorpay_key_secret',
  WEBHOOK_SECRET: 'your_webhook_secret',
};

// Firebase Configuration
export const FIREBASE_CONFIG = {
  apiKey: 'your_firebase_api_key',
  authDomain: 'your_project.firebaseapp.com',
  projectId: 'your_project_id',
  storageBucket: 'your_project.appspot.com',
  messagingSenderId: 'your_sender_id',
  appId: 'your_app_id',
};