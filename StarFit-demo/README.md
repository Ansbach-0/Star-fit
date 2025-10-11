# StarFit - Gym Management System

A modern React application built with Vite and Tailwind CSS for gym and fitness management.

## Project Structure

```
StarFit-demo/
├── auth-backend/          # Node.js/Express authentication server
│   ├── server.js         # Express server with SQLite
│   └── package.json
│
└── starfit-vite/         # Main Vite + React + Tailwind frontend
    ├── src/
    │   ├── main.jsx      # App entry point
    │   ├── App.js        # Main app component
    │   ├── LandingPage.js    # Landing page
    │   ├── LoginPage.js      # Login form
    │   ├── RegisterPage.js   # Registration form
    │   └── index.css         # Tailwind CSS imports
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

## Setup Instructions

### 1. Backend Setup

```powershell
cd auth-backend
npm install
npm start
```

The backend will run on `http://localhost:4000`

### 2. Frontend Setup

```powershell
cd starfit-vite
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

## Features

- 🎨 Modern UI with Tailwind CSS
- ⚡ Fast development with Vite
- 🔐 User authentication (login/register)
- 📱 Responsive design
- 🎯 Clean component architecture

## Tech Stack

- **Frontend**: React 18, Vite 7, Tailwind CSS 4
- **Backend**: Node.js, Express, SQLite
- **Authentication**: REST API with JWT-ready structure

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## API Endpoints

- `POST /login` - User login
- `POST /register` - User registration

## Notes

This is a visual prototype for a Software Engineering course project. Some features may not be fully functional.
