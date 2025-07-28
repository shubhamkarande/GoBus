# GoBus - Bus Ticket Booking App

**Your Commute, Simplified**

A full-featured mobile app for searching, booking, and managing bus tickets with real-time seat selection, QR-based e-tickets, secure payments, and trip history.

## 🚀 Features

### Core Features
- **Bus Search with Filters**: Search buses by route, filter by price, time, rating
- **Real-Time Seat Selection**: Interactive seat layout with live availability
- **E-Ticket with QR Code**: Digital tickets with QR codes for easy boarding
- **Secure Payment Integration**: Razorpay integration for multiple payment methods
- **Trip History & Management**: View past and upcoming trips, cancel bookings
- **Push Notifications**: Trip reminders, offers, and booking updates

### User Experience
- Clean, intuitive interface with smooth navigation
- Real-time seat availability updates
- Comprehensive trip management
- Offline ticket viewing capability
- Share and download tickets

## 🛠 Tech Stack

### Frontend
- **React Native** with Expo
- **TypeScript** for type safety
- **Expo Router** for navigation
- **React Native SVG** for QR codes
- **Expo Linear Gradient** for UI enhancements

### Backend (Planned)
- **Django REST Framework** hosted on GCP Cloud Run
- **PostgreSQL** database on GCP Cloud SQL
- **Razorpay API** for payments
- **Firebase Cloud Messaging** for notifications

## 📱 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gobus
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   ```bash
   # For Android
   npm run android
   
   # For iOS
   npm run ios
   
   # For web
   npm run web
   ```

## 📁 Project Structure

```
gobus/
├── app/                    # App screens and navigation
│   ├── index.tsx          # Home/Landing screen
│   ├── search.tsx         # Bus search screen
│   ├── bus-list.tsx       # Available buses list
│   ├── seat-selection.tsx # Seat selection interface
│   ├── payment.tsx        # Payment processing
│   ├── ticket.tsx         # E-ticket display
│   ├── history.tsx        # Trip history
│   └── _layout.tsx        # Root navigation layout
├── constants/             # App constants and configuration
│   ├── API.ts            # API endpoints and config
│   └── Colors.ts         # Color scheme
├── types/                # TypeScript type definitions
│   └── index.ts          # All app types
├── assets/               # Images, fonts, and static assets
└── package.json          # Dependencies and scripts
```

## 🎨 App Flow

### 1. Search Flow
1. User selects source, destination, and travel date
2. App fetches available buses from API
3. Results displayed with filters and sorting options

### 2. Booking Flow
1. User selects a bus from search results
2. Interactive seat selection with real-time availability
3. Passenger details entry
4. Payment processing via Razorpay
5. E-ticket generation with QR code

### 3. Trip Management
1. View upcoming and past trips
2. Access e-tickets with QR codes
3. Cancel bookings (within policy)
4. Share and download tickets

## 🔧 Configuration

### API Configuration
Update `constants/API.ts` with your backend API endpoints:

```typescript
export const API_CONFIG = {
  BASE_URL: 'https://your-django-api.com/api',
  // ... other endpoints
};
```

### Payment Configuration
Configure Razorpay in `constants/API.ts`:

```typescript
export const RAZORPAY_CONFIG = {
  KEY_ID: 'your_razorpay_key_id',
  KEY_SECRET: 'your_razorpay_key_secret',
};
```

### Firebase Configuration
Set up Firebase for notifications in `constants/API.ts`:

```typescript
export const FIREBASE_CONFIG = {
  apiKey: 'your_firebase_api_key',
  projectId: 'your_project_id',
  // ... other config
};
```

## 📱 Key Screens

### Home Screen
- Welcome interface with quick actions
- Access to search and trip history
- Feature highlights

### Search Screen
- Source and destination selection
- Date picker for travel date
- Popular routes suggestions

### Bus List Screen
- Available buses with details
- Sorting and filtering options
- Real-time availability updates

### Seat Selection Screen
- Interactive bus layout
- Seat type indicators (window/aisle)
- Real-time seat availability
- Maximum seat selection limit

### Payment Screen
- Trip summary and price breakdown
- Multiple payment method options
- Secure payment processing

### E-Ticket Screen
- QR code for boarding
- Complete trip details
- Share and download options
- Cancellation option (if applicable)

### Trip History Screen
- Upcoming and past trips tabs
- Trip status indicators
- Quick access to tickets

## 🚀 Deployment

### Frontend Deployment
```bash
# Build for production
eas build --platform android
eas build --platform ios

# Submit to app stores
eas submit --platform android
eas submit --platform ios
```

### Backend Deployment (Planned)
- Deploy Django REST API to GCP Cloud Run
- Set up PostgreSQL on GCP Cloud SQL
- Configure Razorpay webhooks
- Set up Firebase Cloud Messaging

## 🔒 Security Features

- Secure payment processing with Razorpay
- QR code encryption for tickets
- User authentication and authorization
- Data validation and sanitization
- HTTPS enforcement

## 📊 Performance Optimizations

- Lazy loading of screens
- Image optimization
- Efficient state management
- Minimal re-renders
- Optimized bundle size

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and queries:
- Email: support@gobus.com
- Phone: +91-XXXX-XXXX-XX

## 🎯 Future Enhancements

- Offline ticket storage
- Multi-language support
- Loyalty program integration
- Advanced filtering options
- Real-time bus tracking
- In-app chat support
- Wallet integration
- Referral system

---

**GoBus** - Making bus travel simple, convenient, and reliable! 🚌