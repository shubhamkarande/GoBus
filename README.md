# GoBus 🚌

**Your Commute, Simplified**

*Search fast. Book smart. Travel easy.*

A full-stack bus ticket booking mobile app built with .NET MAUI and Django REST Framework.

![.NET MAUI](https://img.shields.io/badge/.NET_MAUI-512BD4?style=flat&logo=dotnet&logoColor=white)
![Django](https://img.shields.io/badge/Django-092E20?style=flat&logo=django&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)

## ✨ Features

- **🔍 Bus Search** - Search routes by source, destination, and date
- **💺 Real-time Seat Selection** - Interactive seat layout with live availability
- **🔒 Secure Seat Locking** - 10-minute checkout lock to prevent double booking
- **💳 Payment Integration** - Razorpay integration (mock mode for development)
- **🎫 QR E-Tickets** - Generated tickets with scannable QR codes
- **🔔 Push Notifications** - Firebase FCM for booking alerts (mock mode available)
- **📜 Trip History** - View upcoming and past trips
- **👤 User Profiles** - JWT-based authentication with role support

## 🏗️ Architecture

```
GoBus/
├── backend/              # Django REST Framework API
│   ├── gobus/           # Django project settings
│   ├── users/           # Authentication & user management
│   ├── buses/           # Bus & seat management
│   ├── bookings/        # Booking logic with seat locking
│   ├── payments/        # Razorpay integration
│   ├── tickets/         # QR code generation
│   ├── notifications/   # FCM push notifications
│   └── operator_dashboard/  # Operator web API
│
└── GoBusApp/            # .NET MAUI Mobile App
    ├── Models/          # Data models
    ├── ViewModels/      # MVVM ViewModels
    ├── Views/           # XAML UI pages
    ├── Services/        # API, Auth, Storage services
    └── Helpers/         # Constants & utilities
```

## 🚀 Getting Started

### Prerequisites

- **Backend**: Python 3.11+, PostgreSQL
- **Mobile**: .NET 8 SDK, Visual Studio 2022 / VS Code

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure database in .env
# Update DATABASE_URL with your PostgreSQL connection

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start server
python manage.py runserver
```

### Mobile App Setup

```bash
cd GoBusApp

# Restore packages
dotnet restore

# Build
dotnet build

# Run (select target platform)
dotnet build -t:Run -f net8.0-android   # Android
dotnet build -t:Run -f net8.0-ios       # iOS
dotnet build -t:Run -f net8.0-windows   # Windows
```

## 📱 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register/` | POST | User registration |
| `/api/auth/login/` | POST | User login (JWT) |
| `/api/buses/search/` | GET | Search buses |
| `/api/buses/{id}/seats/` | GET | Get seat layout |
| `/api/bookings/create/` | POST | Create booking |
| `/api/payments/create/` | POST | Initiate payment |
| `/api/payments/verify/` | POST | Verify payment |
| `/api/tickets/{bookingId}/` | GET | Get e-ticket |

## 🔧 Configuration

### Environment Variables (`.env`)

```env
DATABASE_URL=postgres://user:pass@localhost:5432/gobus_db
SECRET_KEY=your-secret-key
DEBUG=True

# Mock modes for development
RAZORPAY_MOCK_MODE=True
FIREBASE_MOCK_MODE=True
```

### Mobile API URL

Update `Helpers/Constants.cs`:

```csharp
public const string ApiBaseUrl = "http://10.0.2.2:8000/api/";  // Android emulator
```

## 👥 User Roles

| Role | Capabilities |
|------|--------------|
| **Passenger** | Search, book, view tickets |
| **Operator** | Manage buses, view bookings, validate tickets |
| **Admin** | Full access via Django admin |

## 📦 Tech Stack

| Component | Technology |
|-----------|------------|
| Mobile App | .NET MAUI, C#, XAML |
| Architecture | MVVM with CommunityToolkit.MVVM |
| Backend | Django REST Framework |
| Database | PostgreSQL |
| Auth | JWT (SimpleJWT) |
| QR Codes | ZXing.Net.MAUI / qrcode (Python) |
| Payments | Razorpay |
| Notifications | Firebase Cloud Messaging |

## 📄 License

MIT License - see [LICENSE](LICENSE) file.

---

**GoBus** - Built with ❤️ for seamless travel booking
