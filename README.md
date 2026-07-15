# Pharma 2 - Medical OCR & Dashboard

A full-stack pharmaceutical management application with OCR scanning capabilities, built with React + Vite frontend and Django backend.

## 🎯 Overview

Pharma 2 is a modern web application designed to streamline pharmaceutical operations with integrated optical character recognition (OCR) technology. Users can securely scan, manage, and analyze pharmaceutical data through an intuitive dashboard interface.

## ✨ Features

- **User Authentication**: Secure login and registration system
- **Protected Dashboard**: Role-based access control with protected routes
- **OCR Scanning**: Scan and extract data from pharmaceutical documents
- **Scan History**: View and manage all previous scans
- **Analytics & Insights**: Gain actionable insights from scanned data
- **Responsive Design**: Mobile-friendly interface using modern CSS
- **Real-time Updates**: Hot module replacement (HMR) during development

## 🛠️ Tech Stack

### Frontend
- **React** 19.2.7 - UI library
- **Vite** 8.1.1 - Build tool and dev server
- **React Router** 7.18.1 - Client-side routing
- **React Icons** 5.7.0 - Icon library
- **ESLint** - Code quality and linting

### Backend
- **Django** 6.0.7 - Web framework
- **Django REST Framework** - REST API development
- **Django CORS Headers** - Cross-origin resource sharing
- **SQLite** - Database (dev environment)

## 📋 Prerequisites

- Python 3.9+
- Node.js 16+ and npm
- pip (Python package manager)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Nathaniel-saint/med-ocr.git
cd med-ocr
```

### 2. Backend Setup

```bash
# Create and activate virtual environment
python -m venv .venv
.venv\Scripts\activate  # On Windows
# source .venv/bin/activate  # On macOS/Linux

# Install Python dependencies
pip install django djangorestframework django-cors-headers

# Run migrations
python manage.py migrate

# Create superuser (optional, for Django admin)
python manage.py createsuperuser

# Start Django development server
python manage.py runserver
```

The backend will run on `http://localhost:8000`

### 3. Frontend Setup

```bash
# Install Node dependencies
npm install

# Start Vite development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📦 Project Structure

```
pharma_2/
├── public/                    # Static assets
├── src/
│   ├── pages/                # Page components
│   │   ├── Auth/            # Authentication pages
│   │   │   ├── Signin.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   └── Dashboard/       # Dashboard pages
│   │       ├── Dashboard.jsx
│   │       ├── Dashnav.jsx
│   │       ├── Scan.jsx
│   │       ├── History.jsx
│   │       ├── Insight.jsx
│   │       └── Unregistered.jsx
│   ├── sections/            # Reusable sections
│   │   ├── Nav.jsx
│   │   ├── Hero.jsx
│   │   └── Footer.jsx
│   ├── styles/              # CSS files
│   ├── reactbackend/        # Django backend
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── views.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
├── manage.py
├── db.sqlite3
└── eslint.config.js
```

## 📖 Usage

### Frontend Routes

| Route | Description |
|-------|-------------|
| `/` | Home page with navigation and hero section |
| `/register` | User registration |
| `/login` | User login |
| `/unregistered` | Unregistered user page |
| `/dashboard` | Main dashboard (protected) |
| `/dashboard/scan` | OCR scanning interface |
| `/dashboard/history` | View scan history |
| `/dashboard/insight` | Analytics and insights |

### Authentication Flow

1. New users sign up via `/register`
2. Existing users login via `/login`
3. After authentication, users access protected dashboard routes
4. Unauthenticated users are redirected to `/unregistered`

## 🔧 Available Scripts

### Frontend

```bash
npm run dev       # Start development server with HMR
npm run build     # Build for production
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

### Backend

```bash
python manage.py runserver        # Start Django server
python manage.py migrate          # Apply database migrations
python manage.py createsuperuser  # Create admin user
python manage.py collectstatic    # Collect static files
```

## 🔐 Security Notes

⚠️ **Important**: The current configuration is for development only.

Before deploying to production:
- [ ] Change `SECRET_KEY` in `settings.py`
- [ ] Set `DEBUG = False`
- [ ] Configure `ALLOWED_HOSTS`
- [ ] Use environment variables for sensitive data
- [ ] Set up proper CORS configuration
- [ ] Enable HTTPS
- [ ] Use a production database (PostgreSQL/MySQL)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

## 📧 Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.

---

**Made with ❤️ by Nathaniel Saint**
