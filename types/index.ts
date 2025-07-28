// Bus Types
export interface Bus {
  id: string;
  name: string;
  type: 'AC Sleeper' | 'AC Semi-Sleeper' | 'AC Seater' | 'Non-AC Sleeper' | 'Non-AC Seater';
  operator: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  rating: number;
  amenities: string[];
  pickupPoints: PickupPoint[];
  dropPoints: DropPoint[];
}

export interface PickupPoint {
  id: string;
  name: string;
  address: string;
  time: string;
  landmark?: string;
}

export interface DropPoint {
  id: string;
  name: string;
  address: string;
  time: string;
  landmark?: string;
}

// Seat Types
export interface Seat {
  id: string;
  number: string;
  type: 'window' | 'aisle' | 'middle';
  status: 'available' | 'booked' | 'selected' | 'blocked';
  price: number;
  gender?: 'male' | 'female';
}

export interface SeatLayout {
  busId: string;
  layout: Seat[][];
  totalSeats: number;
  availableSeats: number;
  lastUpdated: string;
}

// Booking Types
export interface Booking {
  id: string;
  ticketId: string;
  userId: string;
  busId: string;
  bus: Bus;
  selectedSeats: Seat[];
  passengers: Passenger[];
  pickupPoint: PickupPoint;
  dropPoint: DropPoint;
  journeyDate: string;
  bookingDate: string;
  status: 'confirmed' | 'cancelled' | 'completed' | 'refunded';
  totalAmount: number;
  paymentId: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
}

export interface Passenger {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  seatNumber: string;
  idType?: 'aadhar' | 'pan' | 'passport' | 'license';
  idNumber?: string;
}

// Payment Types
export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: 'INR';
  method: 'razorpay' | 'upi' | 'wallet' | 'netbanking';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  createdAt: string;
  updatedAt: string;
}

// Search Types
export interface SearchParams {
  from: string;
  to: string;
  date: string;
  passengers?: number;
}

export interface SearchFilters {
  busType?: string[];
  priceRange?: [number, number];
  departureTime?: [string, string];
  arrivalTime?: [string, string];
  amenities?: string[];
  rating?: number;
  sortBy?: 'price' | 'departure' | 'arrival' | 'rating' | 'duration';
  sortOrder?: 'asc' | 'desc';
}

// User Types
export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female';
  profilePicture?: string;
  isVerified: boolean;
  createdAt: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'reminder' | 'offer' | 'cancellation';
  isRead: boolean;
  data?: any;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Route Types
export interface Route {
  from: string;
  to: string;
  distance: number;
  estimatedDuration: string;
  isActive: boolean;
}

// City Types
export interface City {
  id: string;
  name: string;
  state: string;
  code: string;
  isActive: boolean;
}