# Vite + Backend Connection Guide

## ✅ Connection Status

Your Vite frontend is now properly connected to the authentication backend!

## 🚀 Running the Full Stack App

### 1. Start the Backend Server (Terminal 1)
```bash
cd e:\Git\Star-fit\StarFit-demo\auth-backend
node server.js
```
✓ Backend runs on: **http://localhost:4000**

### 2. Start the Vite Frontend (Terminal 2)
```bash
cd e:\Git\Star-fit\StarFit-demo\starfit-vite
npm run dev
```
✓ Frontend runs on: **http://localhost:5173**

## 🔗 Connection Features

### API Communication
- Centralized API module: `src/api.js`
- Backend URL: `http://localhost:4000`
- Endpoints:
  - `POST /login` - User authentication
  - `POST /register` - New user registration

### Connection Status Indicator
The login page now shows:
- ✓ **Backend Connected** (green) - Backend is running
- ✗ **Backend Disconnected** (red) - Backend is not running
- ⟳ **Checking connection...** (yellow) - Testing connection

### Vite Proxy Configuration
Added proxy in `vite.config.js` for seamless API calls:
- `/api/*` routes automatically proxy to `http://localhost:4000`

## 🧪 Testing the Connection

1. Visit **http://localhost:5173** in your browser
2. Click **"Login"** button
3. Check the connection status indicator:
   - If green (✓ Backend Connected), you're all set!
   - If red (✗ Backend Disconnected), start the backend server

4. **Test Registration:**
   - Click "Register"
   - Enter email: `test@example.com`
   - Enter password: `password123`
   - Click "Register"
   - You should see: "Registration successful! You can now log in."

5. **Test Login:**
   - Click "Back to Login"
   - Enter the same credentials
   - Click "Login"
   - You should see: "Logged in successfully!"

## 🛠️ Troubleshooting

### Backend not connecting?
1. Ensure backend is running: `node server.js` in auth-backend folder
2. Check terminal for "Auth server running on http://localhost:4000"
3. Verify port 4000 is not in use by another application

### CORS errors?
- Backend already has CORS enabled with `cors()` middleware
- All origins are allowed by default

### Network errors in browser console?
1. Open DevTools (F12)
2. Check Console tab for errors
3. Check Network tab to see if requests reach the backend

## 📁 File Structure

```
StarFit-demo/
├── auth-backend/          # Backend server
│   ├── server.js          # Express + SQLite server
│   ├── users.db           # SQLite database (auto-created)
│   └── package.json
│
└── starfit-vite/          # Frontend app
    ├── src/
    │   ├── api.js         # ✨ NEW: API communication module
    │   ├── App.js         # Main app component
    │   ├── LoginPage.js   # ✨ UPDATED: Shows connection status
    │   ├── RegisterPage.js # ✨ UPDATED: Uses API module
    │   └── ...
    ├── vite.config.js     # ✨ UPDATED: Added proxy config
    └── package.json
```

## 🎉 You're All Set!

Both your Vite frontend and backend are connected and working together!
