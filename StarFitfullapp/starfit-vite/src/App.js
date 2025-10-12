import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ManagerRegisterPage from './ManagerRegisterPage';
import LandingPage from './LandingPage';
import ManagerDashboard from './ManagerDashboard';
import UserDashboard from './UserDashboard';
import { tokenManager } from './api';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = localStorage.getItem('starfit_user');
    if (storedUser && tokenManager.isAuthenticated()) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('starfit_user');
        tokenManager.removeToken();
      }
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('starfit_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('starfit_user');
    tokenManager.removeToken();
  };

  // Protected route wrapper
  const ProtectedRoute = ({ children, requiredRole }) => {
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    if (!tokenManager.isAuthenticated() || !currentUser) {
      return <Navigate to="/login" replace />;
    }

    if (requiredRole && currentUser.role !== requiredRole) {
      return <Navigate to={currentUser.role === 'manager' ? '/manager' : '/user'} replace />;
    }

    return children;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading StarFit...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register/manager" element={<ManagerRegisterPage />} />

        {/* Protected routes */}
        <Route 
          path="/manager" 
          element={
            <ProtectedRoute requiredRole="manager">
              <ManagerDashboard user={currentUser} onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user" 
          element={
            <ProtectedRoute requiredRole="user">
              <UserDashboard user={currentUser} onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />

        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
