# StarFit - Complete Gym Management System 🏋️‍♀️

A modern, full-stack fitness management platform with dual-role authentication, real-time analytics, and personalized workout routines.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![React](https://img.shields.io/badge/React-18-61dafb)
![Vite](https://img.shields.io/badge/Vite-7-646cff)
![Node](https://img.shields.io/badge/Node.js-Express-green)

## ✨ Features

### 🎯 Dual Role System
- **Manager Dashboard**: Real-time analytics, member management, routine creation
- **User Dashboard**: Personal routines, plan management, progress tracking

### 📊 Manager Features
- Real-time revenue (MRR) and member analytics
- Complete member list with payment tracking
- Create personalized exercise routines for members
- Class occupancy monitoring with visual charts
- Churn rate and retention metrics

### 💪 User Features
- View assigned exercise routines
- Mark exercises as completed with progress tracking
- Browse available exercises library
- Plan and payment management dashboard
- Subscription upgrade options

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/Ansbach-0/Star-fit.git
cd Star-fit/StarFit-demo
```

2. **Start Backend Server**
```bash
cd auth-backend
npm install
node migrate.js  # Setup database with demo data
node server.js   # Start on http://localhost:4000
```

3. **Start Frontend (in new terminal)**
```bash
cd starfit-vite
npm install
npm run dev      # Start on http://localhost:5173
```

4. **Access the Application**
Open http://localhost:5173 in your browser

## 🔐 Demo Credentials

### Manager Account
- **Email**: `manager@starfit.com`
- **Password**: `admin123`
- **Access**: Full dashboard with analytics and member management

### User Accounts
- **Email**: `user@starfit.com` | **Password**: `user123`
- **Email**: `ana@starfit.com` | **Password**: `ana123`
- **Email**: `bruno@starfit.com` | **Password**: `bruno123`
- **Access**: Personal dashboard with routines and plan details

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite 7** - Lightning-fast build tool
- **Tailwind CSS 4** - Utility-first styling
- **React Hooks** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **SQLite3** - Embedded database
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
StarFit-demo/
├── auth-backend/              # Backend server
│   ├── server.js              # Express API with all endpoints
│   ├── migrate.js             # Database migration script
│   ├── seed.js                # Demo data seeder
│   ├── users.db               # SQLite database (auto-created)
│   └── package.json
│
├── starfit-vite/              # Frontend application
│   ├── src/
│   │   ├── App.js             # Main router with role-based routing
│   │   ├── LoginPage.js       # Authentication page
│   │   ├── RegisterPage.js    # User registration
│   │   ├── ManagerDashboard.js # Manager dashboard component
│   │   ├── UserDashboard.js   # User dashboard component
│   │   ├── LandingPage.js     # Marketing landing page
│   │   ├── api.js             # Backend API wrapper
│   │   ├── main.jsx           # React entry point
│   │   └── index.css          # Tailwind imports
│   ├── index.html
│   ├── vite.config.js         # Vite configuration
│   ├── tailwind.config.js     # Tailwind configuration
│   ├── postcss.config.js      # PostCSS configuration
│   └── package.json
│
└── docs/                      # Documentation
    ├── DUAL_ROLE_SYSTEM.md    # Complete feature guide
    ├── VITE_CONNECTION_GUIDE.md
    ├── TAILWIND_FIX.md
    └── REPAIR_SUMMARY.md
```

## 📚 Complete Documentation

- **[🎯 Dual Role System Guide](./DUAL_ROLE_SYSTEM.md)** - Complete feature documentation
- **[🔗 Vite Connection Guide](./VITE_CONNECTION_GUIDE.md)** - Setup and troubleshooting
- **[🎨 Tailwind Fix](./TAILWIND_FIX.md)** - Styling configuration details
- **[🔧 Repair Summary](./REPAIR_SUMMARY.md)** - Development history

## 🎯 Key Features Explained

### Manager Dashboard
- **Analytics Cards**: MRR, Active Members, Occupancy Rate, Churn Rate
- **Member Management Table**: Complete list with plan and payment information
- **Routine Creator**: Assign exercises with custom sets/reps to any member
- **Class Occupancy Chart**: Visual representation of today's class capacity
- **Real-time Statistics**: Live data updates

### User Dashboard
- **My Routines Tab**: View and complete assigned exercises with progress tracking
- **Exercise Library Tab**: Browse all 5+ available gym activities
- **My Plan Tab**: Subscription details, payment info, and upgrade options
- **Progress Tracking**: Visual feedback for completed workouts
- **Payment Management**: Next due date, amount, and payment method

### Exercise Categories (Color-Coded)
- 🚴 **Cardio** (Red): Spinning
- 💪 **Força** (Orange): Musculação
- 🧘 **Flexibilidade** (Blue): Yoga
- 💃 **Dança** (Pink): Zumba
- 🏋️ **Funcional** (Purple): Crossfit

## 🔄 API Endpoints

### Authentication
```
POST   /login              # User authentication with role detection
POST   /register           # User registration with role selection
```

### User Management (Manager Only)
```
GET    /users              # Get all registered users
GET    /stats              # Dashboard statistics (revenue, members, etc.)
```

### Exercise & Routine Management
```
GET    /exercises          # Get all available exercises
GET    /routines/:user_id  # Get routines for specific user
POST   /routines           # Create new routine for user
PUT    /routines/:id/complete  # Mark routine as completed
DELETE /routines/:id       # Delete a routine
```

## 🧪 Testing the Application

### Test Manager Flow
1. Visit http://localhost:5173
2. Click "Login"
3. Use manager credentials
4. View dashboard with analytics
5. Click "Criar Rotina" for any user
6. Select exercise, set reps/sets
7. Create routine
8. Verify user receives the routine

### Test User Flow
1. Logout from manager
2. Login with user credentials
3. Navigate to "Minhas Rotinas" tab
4. View assigned exercises
5. Click "Concluir Exercício"
6. Check "Exercícios Disponíveis" tab
7. View "Meu Plano" for subscription details

### Test Role-Based Routing
1. Login as manager → See analytics dashboard
2. Logout
3. Login as user → See personal dashboard
4. Verify completely different interfaces

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    name TEXT,
    plan TEXT,
    next_payment DATE,
    status TEXT DEFAULT 'active'
)
```

### Exercises Table
```sql
CREATE TABLE exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT
)
```

### Routines Table
```sql
CREATE TABLE routines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    exercise_id INTEGER,
    sets INTEGER,
    reps INTEGER,
    completed INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
)
```

## 🐛 Troubleshooting

### Backend Connection Issues
```bash
# Check if port 4000 is in use
netstat -ano | findstr :4000

# Kill process if needed (Windows)
taskkill /F /PID <PID_NUMBER>

# Restart backend
cd auth-backend
node server.js
```

### Database Locked Error
```bash
# Stop all node processes
taskkill /F /IM node.exe

# Wait a moment
Start-Sleep -Seconds 2

# Run migration to recreate database
node migrate.js

# Restart server
node server.js
```

### Frontend Styling Issues
```bash
# Clear cache and restart Vite
cd starfit-vite
rm -rf node_modules/.vite
npm run dev
```

### Database Reset
```bash
cd auth-backend
node migrate.js  # Completely recreates database with demo data
```

## 📱 Future Roadmap

- [ ] **Security**: Password hashing (bcrypt), JWT authentication
- [ ] **Payments**: Real payment integration (Stripe/PayPal)
- [ ] **Analytics**: Progress charts and advanced analytics
- [ ] **Mobile**: React Native mobile app
- [ ] **Notifications**: Email/SMS for payment reminders
- [ ] **Content**: Exercise video tutorials
- [ ] **Nutrition**: Meal plan integration
- [ ] **Social**: Friend workouts and challenges
- [ ] **AI**: Personalized workout recommendations
- [ ] **Export**: PDF reports for users

## 🎨 Design System

### Color Palette
- **Primary**: Teal (#14B8A6) - Actions, CTAs
- **Secondary**: Pink (#EC4899) - Highlights, accents
- **Background**: Gray-900/Black gradient
- **Cards**: Gray-800 with Gray-700 borders
- **Success**: Green (#10B981)
- **Error**: Red (#EF4444)

### Typography
- **Headings**: Bold, sans-serif
- **Body**: Regular, sans-serif
- **Code**: Monospace

## 👨‍💻 Author

**Luc**  
Engenharia de Software - Projeto de Conclusão de Curso

## 🤝 Contributing

This is a university project for educational purposes. Suggestions and feedback are welcome!

## 📄 License

This project is for educational and demonstration purposes only.

## 🙏 Acknowledgments

- Built as part of Software Engineering curriculum
- Inspired by modern fitness management platforms
- Uses cutting-edge web technologies
- Designed with user experience in mind

---

**Ready to run!** 🎉  
Start both servers and visit http://localhost:5173

For detailed feature documentation, see [DUAL_ROLE_SYSTEM.md](./DUAL_ROLE_SYSTEM.md)
