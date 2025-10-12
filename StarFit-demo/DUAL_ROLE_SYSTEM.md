# StarFit - Dual Role System Documentation

## 🎯 Overview

StarFit now has a complete dual-role authentication system with:
- **Manager Dashboard**: Analytics, member management, and routine creation
- **User Dashboard**: Exercise routines, plan management, and progress tracking

---

## 🚀 Quick Start

### 1. Start Backend Server
```bash
cd e:\Git\Star-fit\StarFit-demo\auth-backend
node server.js
```
✅ Backend runs on: **http://localhost:4000**

### 2. Start Frontend (Vite)
```bash
cd e:\Git\Star-fit\StarFit-demo\starfit-vite
npm run dev
```
✅ Frontend runs on: **http://localhost:5173**

---

## 🔐 Demo Credentials

### Manager Account
- **Email**: manager@starfit.com
- **Password**: admin123
- **Access**: Full dashboard with analytics and member management

### User Accounts
- **Email**: user@starfit.com | **Password**: user123
- **Email**: ana@starfit.com | **Password**: ana123
- **Email**: bruno@starfit.com | **Password**: bruno123
- **Email**: carla@starfit.com | **Password**: carla123
- **Access**: Personal dashboard with routines and plan details

---

## 📊 Manager Dashboard Features

### Analytics & Metrics
- **Monthly Recurring Revenue (MRR)**: Real-time revenue tracking
- **Active Members Count**: Current active membership
- **Occupancy Rate**: Gym capacity utilization
- **Churn Rate**: Member retention metrics

### Member Management
- View all registered members
- See member plans and payment dates
- Track member status (Active/Pending)

### Routine Creation
1. Click "Criar Rotina" for any member
2. Select exercise from dropdown:
   - Spinning (Cardio)
   - Musculação (Força)
   - Yoga (Flexibilidade)
   - Zumba (Dança)
   - Crossfit (Funcional)
3. Set number of sets and repetitions
4. Routine is instantly assigned to the user

### Class Occupancy Tracking
- Real-time view of today's class capacity
- Visual bar charts for each activity
- Color-coded for easy identification

---

## 💪 User Dashboard Features

### My Routines Tab
- View all assigned exercise routines
- See exercise details (category, sets, reps)
- Mark exercises as completed
- Visual feedback for finished workouts

### Exercise Library Tab
- Browse all available exercises
- View exercise categories and descriptions
- Inspiration for requesting new routines from manager

### My Plan Tab
#### Plan Benefits
- Complete list of subscription perks
- Access level information

#### Payment Information
- Current plan details
- Monthly payment amount
- Next payment due date
- Payment method on file
- Quick payment management

#### Upgrade Options
- Premium plan comparison
- Special offers and promotions

### Plan Details Display
- **Plan Name**: User's current subscription tier
- **Status**: Active/Pending indicator
- **Next Payment**: Exact date and countdown
- **Payment Amount**: Monthly fee

---

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

---

## 🔌 API Endpoints

### Authentication
- `POST /login` - User login (returns user object with role)
- `POST /register` - New user registration

### User Management (Manager Only)
- `GET /users` - Get all users
- `GET /stats` - Get dashboard statistics

### Exercise Management
- `GET /exercises` - Get all available exercises
- `GET /routines/:user_id` - Get routines for specific user
- `POST /routines` - Create new routine for user
- `PUT /routines/:id/complete` - Mark routine as completed
- `DELETE /routines/:id` - Delete a routine

---

## 🎨 User Interface

### Color Scheme
- **Primary**: Teal (#14B8A6) - Actions, CTAs
- **Secondary**: Pink (#EC4899) - Highlights, accents
- **Dark**: Gray-900/Black - Background
- **Cards**: Gray-800 with Gray-700 borders

### Exercise Categories (Color-Coded)
- **Cardio**: Red
- **Força**: Orange
- **Flexibilidade**: Blue
- **Dança**: Pink
- **Funcional**: Purple

---

## 🔄 User Flow

### Manager Flow
1. Login with manager credentials
2. View dashboard analytics
3. Browse member list
4. Create personalized routines for members
5. Monitor gym occupancy and metrics

### User Flow
1. Login with user credentials
2. View assigned exercise routines
3. Complete exercises and mark as done
4. Browse exercise library
5. Check plan details and payment info
6. Explore upgrade options

---

## 🛠️ Development Notes

### Frontend Structure
```
starfit-vite/src/
├── App.js              # Main router with role-based views
├── LoginPage.js        # Login with role detection
├── RegisterPage.js     # Registration with role selection
├── ManagerDashboard.js # Manager dashboard component
├── UserDashboard.js    # User dashboard component
├── LandingPage.js      # Marketing landing page
└── api.js              # Backend API wrapper
```

### Backend Structure
```
auth-backend/
├── server.js           # Express server with all endpoints
├── migrate.js          # Database migration script
├── seed.js             # Demo data seeder
└── users.db            # SQLite database (auto-created)
```

---

## 🧪 Testing the System

### Test Manager Features
1. Login as manager@starfit.com
2. Verify dashboard shows:
   - Revenue metrics
   - Active member count
   - List of users
3. Click "Criar Rotina" for any user
4. Select exercise, set reps/sets
5. Create routine

### Test User Features
1. Login as user@starfit.com
2. Check "Minhas Rotinas" tab
3. Complete an exercise
4. Browse "Exercícios Disponíveis"
5. View plan details in "Meu Plano"

### Test Role Switching
1. Logout from manager account
2. Login as user
3. Verify different dashboard appears
4. Test all user features
5. Logout and login as manager again

---

## 🔧 Database Management

### Reset Database
```bash
cd auth-backend
node migrate.js
```
This will:
- Delete old database
- Create new schema
- Insert demo exercises
- Create demo users

### Add New Exercise
Connect to database and run:
```sql
INSERT INTO exercises (name, category, description) 
VALUES ('Pilates', 'Flexibilidade', 'Fortalecimento e alongamento');
```

### Add New User Manually
```sql
INSERT INTO users (email, password, role, name, plan, next_payment, status) 
VALUES ('newuser@starfit.com', 'password123', 'user', 'New User', 'Plano Fit', '2025-12-11', 'active');
```

---

## 📱 Future Enhancements

### Planned Features
- [ ] Password hashing (bcrypt)
- [ ] JWT authentication tokens
- [ ] Real payment integration
- [ ] Progress tracking charts
- [ ] Mobile app (React Native)
- [ ] Email notifications for payments
- [ ] Manager can view user progress
- [ ] Exercise video tutorials
- [ ] Meal plan integration
- [ ] Social features (friend workouts)

---

## 🐛 Troubleshooting

### Backend Not Connecting
```bash
# Check if port 4000 is available
netstat -ano | findstr :4000

# Kill process if needed
taskkill /F /PID <PID_NUMBER>

# Restart backend
cd auth-backend
node server.js
```

### Database Locked Error
```bash
# Stop all node processes
taskkill /F /IM node.exe

# Wait 2 seconds
Start-Sleep -Seconds 2

# Run migration
node migrate.js

# Restart server
node server.js
```

### Frontend Not Loading Styles
1. Check if Vite is running on port 5173
2. Clear browser cache (Ctrl+Shift+R)
3. Verify tailwind.config.js is correct
4. Restart Vite: `npm run dev`

---

## 📄 License

This is a university project for demonstration purposes.

**Author**: Luc  
**Project**: StarFit - Academia Management System  
**Course**: Engenharia de Software

---

## 🎉 Summary

You now have a complete dual-role fitness management system with:
✅ Separate dashboards for managers and users  
✅ Exercise routine management  
✅ Real-time analytics  
✅ Plan and payment tracking  
✅ Beautiful, responsive UI  
✅ SQLite database  
✅ REST API backend  

**Ready to use!** Visit http://localhost:5173 and login with demo credentials.
