import React, { useState } from 'react';
import LoginPage from './LoginPage';
import LandingPage from './LandingPage';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  return showLogin
    ? <LoginPage />
    : <LandingPage onLogin={() => setShowLogin(true)} />;
}

export default App;
