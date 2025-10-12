import React, { useState, useEffect } from 'react';
import RegisterPage from './RegisterPage';
import api from './api';

const LoginPage = ({ onLoginSuccess }) => {
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
            setError('Por favor, preencha email e senha.');
            return;
        }
        try {
            const res = await api.login(email, password);
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Login falhou.');
            } else {
                setError('');
                // Pass user data to parent component
                onLoginSuccess(data.user);
            }
        } catch (err) {
            setError('Erro de rede. Certifique-se de que o backend está rodando na porta 4000.');
        }
    };

    if (showRegister) {
        return <RegisterPage onBack={() => setShowRegister(false)} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-700">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="text-pink-400 text-3xl">★</span>
                        <span className="text-teal-300 text-2xl font-bold">StarFit</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white">Login</h2>
                </div>
                
                {/* Connection Status Indicator */}
                <div className={`mb-4 p-2 rounded text-sm ${
                    connectionStatus === 'connected' ? 'bg-green-500/20 text-green-400' :
                    connectionStatus === 'disconnected' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                }`}>
                    {connectionStatus === 'connected' ? '✓ Backend Conectado' :
                     connectionStatus === 'disconnected' ? '✗ Backend Desconectado - Inicie o servidor' :
                     '⟳ Verificando conexão...'}
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="p-3 text-lg rounded-lg border border-gray-600 bg-gray-700 text-white focus:outline-none focus:border-teal-400"
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="p-3 text-lg rounded-lg border border-gray-600 bg-gray-700 text-white focus:outline-none focus:border-teal-400"
                    />
                    {error && <div className="text-red-400 text-sm bg-red-500/10 p-2 rounded">{error}</div>}
                    
                    <button type="submit" className="bg-teal-500 text-white py-3 rounded-lg font-semibold hover:bg-teal-600 transition">
                        Entrar
                    </button>
                    
                    <button 
                        type="button" 
                        className="bg-gray-700 text-white py-2 rounded-lg font-semibold hover:bg-gray-600 transition" 
                        onClick={() => setShowRegister(true)}
                    >
                        Criar Conta
                    </button>
                </form>

                {/* Demo Credentials */}
                <div className="mt-6 p-4 bg-gray-700/50 rounded-lg text-sm">
                    <p className="text-gray-300 mb-2 font-semibold">🔐 Contas de Teste:</p>
                    <p className="text-gray-400 text-xs">Manager: manager@starfit.com / admin123</p>
                    <p className="text-gray-400 text-xs">Usuário: user@starfit.com / user123</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

