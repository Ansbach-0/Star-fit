import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from './api';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        plan: 'Plano Fit'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        if (!formData.name || !formData.email || !formData.password) {
            setError('Please fill in all required fields');
            return false;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await api.register(
                formData.email,
                formData.password,
                formData.name,
                formData.plan
            );

            if (response.ok) {
                const data = await response.json();
                // Token is already stored by the api module
                navigate('/user');
            } else {
                const errorData = await response.json();
                setError(errorData.error || errorData.errors?.[0]?.msg || 'Registration failed');
            }
        } catch (err) {
            setError('Unable to connect to server. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-500 via-blue-500 to-purple-600 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="text-pink-500 text-4xl">★</span>
                        <span className="text-teal-600 text-3xl font-bold">StarFit</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Your Account</h2>
                    <p className="text-gray-600">Join StarFit and start your fitness journey</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="name">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
                            Email Address *
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                            placeholder="your.email@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="plan">
                            Select Your Plan *
                        </label>
                        <select
                            id="plan"
                            name="plan"
                            value={formData.plan}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                        >
                            <option value="Plano Fit">Plano Fit - $99/month</option>
                            <option value="Plano Gold">Plano Gold - $149/month</option>
                            <option value="Plano Premium">Plano Premium - $199/month</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
                            Password *
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                            placeholder="Min. 6 characters"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="confirmPassword">
                            Confirm Password *
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                            placeholder="Confirm your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-blue-600 transition duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-6 text-center space-y-2">
                    <p className="text-gray-600 text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-teal-600 hover:text-teal-700 font-semibold">
                            Login here
                        </Link>
                    </p>
                    <p className="text-gray-600 text-sm">
                        Are you a gym manager?{' '}
                        <Link to="/register/manager" className="text-purple-600 hover:text-purple-700 font-semibold">
                            Register as Manager
                        </Link>
                    </p>
                    <p className="text-gray-600 text-sm">
                        <Link to="/" className="text-gray-500 hover:text-gray-700">
                            ← Back to Home
                        </Link>
                    </p>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center">
                        By registering, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
