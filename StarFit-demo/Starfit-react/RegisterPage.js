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
        <div style={styles.container}>
            <h2 style={styles.title}>Register for StarFit</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={styles.input}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={styles.input}
                />
                {error && <div style={styles.error}>{error}</div>}
                {success && <div style={styles.success}>{success}</div>}
                <button type="submit" style={styles.button}>Register</button>
                <button type="button" style={styles.backButton} onClick={onBack}>Back to Login</button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: 350,
        margin: '60px auto',
        padding: 32,
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        background: '#fff',
        textAlign: 'center',
    },
    title: {
        marginBottom: 24,
        color: '#2d2d2d',
        fontWeight: 700,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
    },
    input: {
        padding: 10,
        fontSize: 16,
        borderRadius: 4,
        border: '1px solid #ccc',
    },
    button: {
        padding: 12,
        fontSize: 16,
        borderRadius: 4,
        border: 'none',
        background: '#1976d2',
        color: '#fff',
        fontWeight: 600,
        cursor: 'pointer',
    },
    backButton: {
        padding: 10,
        fontSize: 15,
        borderRadius: 4,
        border: 'none',
        background: '#eee',
        color: '#1976d2',
        fontWeight: 600,
        cursor: 'pointer',
    },
    error: {
        color: '#d32f2f',
        fontSize: 14,
    },
    success: {
        color: '#388e3c',
        fontSize: 14,
    },
};

export default RegisterPage;
