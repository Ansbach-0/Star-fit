import React, { useState } from 'react';

const RegisterPage = ({ onBack }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }
        try {
            const res = await fetch('http://localhost:4000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Registration failed.');
            } else {
                setSuccess('Registration successful! You can now log in.');
                setEmail('');
                setPassword('');
            }
        } catch (err) {
            setError('Network error.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-16 p-8 rounded-xl shadow-lg bg-white text-center">
            <h2 className="mb-6 text-2xl font-bold text-gray-800">Register for StarFit</h2>
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
                {success && <div className="text-green-600 text-sm">{success}</div>}
                <button type="submit" className="bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700">Register</button>
                <button type="button" className="bg-gray-100 text-blue-600 py-2 rounded font-semibold hover:bg-gray-200" onClick={onBack}>Back to Login</button>
            </form>
        </div>
    );
};

export default RegisterPage;
