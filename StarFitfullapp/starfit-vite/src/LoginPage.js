import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api, tokenManager } from './api';

const LoginPage = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('checking');
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is already logged in
        if (tokenManager.isAuthenticated()) {
            // Try to validate token by making a request
            api.testConnection().then(isValid => {
                if (isValid) {
                    // Redirect based on stored user data
                    const userData = localStorage.getItem('starfit_user');
                    if (userData) {
                        const user = JSON.parse(userData);
                        navigate(user.role === 'manager' ? '/manager' : '/user');
                    }
                }
            });
        }

        // Test backend connection
        api.testConnection().then(isConnected => {
            setConnectionStatus(isConnected ? 'connected' : 'disconnected');
        });
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!email || !password) {
            setError('Please fill in both email and password.');
            return;
        }

        setLoading(true);
        
        console.log('Attempting login with:', { email, password: '***' });

        try {
            const { response, data } = await api.login(email, password);
            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);
            console.log('Response data:', data);
            
            if (!response.ok) {
                setError(data.error || data.errors?.[0]?.msg || 'Login failed. Please check your credentials.');
            } else {
                // Store user data
                localStorage.setItem('starfit_user', JSON.stringify(data.user));
                
                // Pass user data to parent component
                if (onLoginSuccess) {
                    onLoginSuccess(data.user);
                }
                
                // Navigate based on role
                navigate(data.user.role === 'manager' ? '/manager' : '/user');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Unable to connect to server. Please ensure the backend is running on port 3001.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="text-pink-500 text-4xl">★</span>
                        <span className="text-indigo-600 text-3xl font-bold">StarFit</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
                    <p className="text-gray-600">Sign in to your account</p>
                </div>
                
                {/* Connection Status Indicator */}
                <div className={`mb-4 p-3 rounded-lg text-sm font-semibold ${
                    connectionStatus === 'connected' ? 'bg-green-100 text-green-700' :
                    connectionStatus === 'disconnected' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                }`}>
                    {connectionStatus === 'connected' ? '✓ Backend Connected' :
                     connectionStatus === 'disconnected' ? '✗ Backend Disconnected - Please start the server' :
                     '⟳ Checking connection...'}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="your.email@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                            disabled={loading}
                        />
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}
                    
                    <button 
                        type="submit" 
                        disabled={loading || connectionStatus !== 'connected'}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center space-y-3">
                    <p className="text-gray-600 text-sm">
                        Don't have an account?
                    </p>
                    <div className="flex gap-3">
                        <Link 
                            to="/register" 
                            className="flex-1 bg-gradient-to-r from-teal-500 to-blue-500 text-white py-2 rounded-lg font-semibold hover:from-teal-600 hover:to-blue-600 transition text-center"
                        >
                            Register as User
                        </Link>
                        <Link 
                            to="/register/manager" 
                            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition text-center"
                        >
                            Register as Manager
                        </Link>
                    </div>
                    <p className="text-gray-600 text-sm pt-4">
                        <Link to="/" className="text-gray-500 hover:text-gray-700">
                            ← Back to Home
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

