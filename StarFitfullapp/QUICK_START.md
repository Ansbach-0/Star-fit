# 🚀 StarFit - Quick Start Guide

## ⚡ 5-Minute Setup

Follow these steps to get StarFit running on your local machine.

### Step 1: Install Dependencies

#### Backend
```powershell
cd auth-backend
npm install
```

#### Frontend (Open new terminal)
```powershell
cd starfit-vite
npm install
```

### Step 2: Setup Database

```powershell
cd auth-backend
node migrate.js
node seed.js
```

✅ **Expected Output:**
- Database tables created
- Demo users inserted with hashed passwords
- Demo credentials displayed

### Step 3: Start Servers

#### Terminal 1 - Backend
```powershell
cd auth-backend
node server.js
```

✅ **Expected Output:**
```
Auth server running on http://localhost:3001
Connected to SQLite database.
```

#### Terminal 2 - Frontend
```powershell
cd starfit-vite
npm run dev
```

✅ **Expected Output:**
```
VITE ready in XXX ms
Local: http://localhost:5173/
```

### Step 4: Access the Application

Open your browser and navigate to: **http://localhost:5173/**

## 🔑 Test Login

### Manager Login
1. Click "Sign In" or navigate to http://localhost:5173/login
2. Enter credentials:
   - Email: `manager@starfit.com`
   - Password: `Manager@123`
3. You'll be redirected to the Manager Dashboard

### User Login
1. Navigate to http://localhost:5173/login
2. Enter credentials:
   - Email: `user@starfit.com`
   - Password: `User@123`
3. You'll be redirected to the User Dashboard

## 🆕 Test Registration

### Register as User
1. Navigate to http://localhost:5173/register
2. Fill in the form:
   - Name: Your Name
   - Email: your.email@example.com
   - Plan: Choose any
   - Password: At least 6 characters
   - Confirm Password: Same as above
3. Click "Create Account"
4. You'll be auto-logged in and redirected to User Dashboard

### Register as Manager
1. Navigate to http://localhost:5173/register/manager
2. Fill in the form:
   - Name: Your Name
   - Email: manager@example.com
   - Gym Name: Your Gym (optional)
   - Phone: Your Phone (optional)
   - Password: At least 8 characters
   - Confirm Password: Same as above
3. Click "Create Manager Account"
4. You'll be auto-logged in and redirected to Manager Dashboard

## 🎯 What to Test

### As Manager
- ✅ View dashboard analytics (revenue, members, growth)
- ✅ View all users in Members tab
- ✅ Create workout routines for users
- ✅ View advanced analytics charts
- ✅ Logout and login again

### As User
- ✅ View your workout routines
- ✅ Complete routines
- ✅ View your membership plan
- ✅ Check payment status
- ✅ Logout and login again

## 🔧 Troubleshooting

### Backend won't start
**Problem:** Port 3001 already in use

**Solution:**
```powershell
# Windows - Find and kill process
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Or change port in auth-backend/.env
PORT=3002
```

### Frontend won't start
**Problem:** Port 5173 already in use

**Solution:**
```powershell
# Kill the process or Vite will auto-select another port
# Accept the new port or free up 5173
```

### Can't login / "Invalid credentials"
**Problem:** Database not properly seeded

**Solution:**
```powershell
cd auth-backend
rm users.db
node migrate.js
node seed.js
```

### "Backend Disconnected" error
**Problem:** Backend server not running or wrong port

**Solution:**
1. Check if backend is running: http://localhost:3001
2. Verify `API_BASE_URL` in `starfit-vite/src/api.js`
3. Check CORS settings in `auth-backend/.env`

### Token expired / Automatic logout
**Problem:** JWT token expired (default 24h)

**Solution:**
- Just login again
- Token expiry can be changed in `auth-backend/.env`:
  ```env
  JWT_EXPIRES_IN=7d  # 7 days
  ```

## 📝 Development Notes

### Demo Accounts
All demo accounts are created with **hashed passwords** using bcrypt.

**Manager:**
- manager@starfit.com / Manager@123

**Users:**
- user@starfit.com / User@123
- ana@starfit.com / Ana@123
- bruno@starfit.com / Bruno@123
- carla@starfit.com / Carla@123

⚠️ **Remember:** Remove these before production!

### Database Location
- SQLite database: `auth-backend/users.db`
- Excluded from git via `.gitignore`
- Reset anytime with `node migrate.js && node seed.js`

### Environment Variables
- Backend config: `auth-backend/.env`
- Template available: `auth-backend/.env.example`
- **Important:** Change `JWT_SECRET` for production!

## 🎨 Features to Explore

1. **Landing Page** (/)
   - Modern design with gradients
   - Features showcase
   - Pricing plans
   - Testimonials

2. **Login System** (/login)
   - Secure JWT authentication
   - Rate limiting (5 attempts / 15 min)
   - Connection status indicator

3. **Registration Forms**
   - User registration (/register)
   - Manager registration (/register/manager)
   - Real-time validation

4. **Manager Dashboard** (/manager)
   - Revenue analytics
   - Member management
   - Workout routine creation
   - Advanced charts

5. **User Dashboard** (/user)
   - Personal workout routines
   - Progress tracking
   - Membership info

## 🚀 Next Steps

After exploring the basics:

1. **Create a custom workout routine** as manager
2. **Test rate limiting** (try 6+ failed logins)
3. **Inspect JWT tokens** in browser DevTools
4. **Check API responses** in Network tab
5. **Review security features** in code

## 📚 Additional Resources

- [Full README](./README.md) - Complete documentation
- [Security Details](./SECURITY_AND_FEATURES.md) - Security implementation
- [API Endpoints](#) - Backend API documentation

## 💡 Tips

- Open DevTools (F12) to see JWT token storage
- Check Network tab to see API requests with Authorization headers
- Backend logs show all requests in terminal
- Frontend hot-reloads on file changes (Vite)
- Backend requires restart after code changes

## ✨ You're All Set!

StarFit is now running with:
- ✅ Secure JWT authentication
- ✅ Bcrypt password hashing
- ✅ Rate limiting
- ✅ Input validation
- ✅ Role-based access control
- ✅ Professional UI

Enjoy exploring! 🎉

---

**Need help?** Check the [Troubleshooting](#-troubleshooting) section or open an issue.
