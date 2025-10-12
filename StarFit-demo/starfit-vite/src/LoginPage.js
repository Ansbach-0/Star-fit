import React, { useState, useEffect } from 'react';
import RegisterPage from './RegisterPage';
import api from './api';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showRegister, setShowRegister] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('checking');

    useEffect(() => {
        // Test backend connection on mount
        api.testConnection().then(isConnected => {
            setConnectionStatus(isConnected ? 'connected' : 'disconnected');
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }
        try {
            const res = await api.login(email, password);
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Login failed.');
            } else {
                setError('');
                alert('Logged in successfully!');
                // TODO: Redirect or store user info if needed
            }
        } catch (err) {
            setError('Network error. Please ensure the backend is running on port 4000.');
        }
    };

    if (showRegister) {
        return <RegisterPage onBack={() => setShowRegister(false)} />;
    }

    return (
        <div className="max-w-md mx-auto mt-16 p-8 rounded-xl shadow-lg bg-white text-center">
            <h2 className="mb-6 text-2xl font-bold text-gray-800">StarFit Login</h2>
            
            {/* Connection Status Indicator */}
            <div className={`mb-4 p-2 rounded text-sm ${
                connectionStatus === 'connected' ? 'bg-green-100 text-green-700' :
                connectionStatus === 'disconnected' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
            }`}>
                {connectionStatus === 'connected' ? '✓ Backend Connected' :
                 connectionStatus === 'disconnected' ? '✗ Backend Disconnected - Please start the server' :
                 '⟳ Checking connection...'}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="p-3 text-lg rounded border border-gray-300"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="p-3 text-lg rounded border border-gray-300"
                />
                {error && <div className="text-red-600 text-sm">{error}</div>}
                <button type="submit" className="bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700">Login</button>
                <button type="button" className="bg-gray-100 text-blue-600 py-2 rounded font-semibold hover:bg-gray-200" onClick={() => setShowRegister(true)}>
                    Register
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
