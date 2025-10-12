import React, { useState } from 'react';
import LoginPage from './LoginPage';
import LandingPage from './LandingPage';
import ManagerDashboard from './ManagerDashboard';
import UserDashboard from './UserDashboard';

function App() {
  const [currentView, setCurrentView] = useState('landing'); // landing, login, manager, user
  const [currentUser, setCurrentUser] = useState(null);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    // Route based on user role
    if (user.role === 'manager') {
      setCurrentView('manager');
    } else {
      setCurrentView('user');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('landing');
  };

  // Render based on current view
  if (currentView === 'login') {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  if (currentView === 'manager' && currentUser) {
    return <ManagerDashboard user={currentUser} onLogout={handleLogout} />;
  }

  if (currentView === 'user' && currentUser) {
    return <UserDashboard user={currentUser} onLogout={handleLogout} />;
  }

  // Default: Landing Page
  return <LandingPage onLogin={() => setCurrentView('login')} />;
}

export default App;
