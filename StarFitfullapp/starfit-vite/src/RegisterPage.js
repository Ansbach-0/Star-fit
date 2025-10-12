import React, { useState } from 'react';
import api from './api';

const RegisterPage = ({ onBack }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('user');
    const [plan, setPlan] = useState('Plano Fit');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!email || !password || !name) {
            setError('Por favor, preencha todos os campos.');
            return;
        }
        try {
            const res = await api.register(email, password, role, name, plan);
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Registro falhou.');
            } else {
                setSuccess('Registro bem-sucedido! Você já pode fazer login.');
                setEmail('');
                setPassword('');
                setName('');
            }
        } catch (err) {
            setError('Erro de rede. Certifique-se de que o backend está rodando na porta 4000.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-700">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="text-pink-400 text-3xl">★</span>
                        <span className="text-teal-300 text-2xl font-bold">StarFit</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white">Criar Conta</h2>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Nome Completo"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="p-3 text-lg rounded-lg border border-gray-600 bg-gray-700 text-white focus:outline-none focus:border-teal-400"
                    />
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
                    
                    <div>
                        <label className="block text-gray-300 text-sm mb-2">Tipo de Conta</label>
                        <select
                            value={role}
                            onChange={e => setRole(e.target.value)}
                            className="w-full p-3 text-lg rounded-lg border border-gray-600 bg-gray-700 text-white focus:outline-none focus:border-teal-400"
                        >
                            <option value="user">Usuário</option>
                            <option value="manager">Gerente</option>
                        </select>
                    </div>

                    {role === 'user' && (
                        <div>
                            <label className="block text-gray-300 text-sm mb-2">Plano</label>
                            <select
                                value={plan}
                                onChange={e => setPlan(e.target.value)}
                                className="w-full p-3 text-lg rounded-lg border border-gray-600 bg-gray-700 text-white focus:outline-none focus:border-teal-400"
                            >
                                <option value="Plano Fit">Plano Fit - R$ 99/mês</option>
                                <option value="Plano Gold">Plano Gold - R$ 149/mês</option>
                                <option value="Plano Premium">Plano Premium - R$ 199/mês</option>
                            </select>
                        </div>
                    )}

                    {error && <div className="text-red-400 text-sm bg-red-500/10 p-2 rounded">{error}</div>}
                    {success && <div className="text-green-400 text-sm bg-green-500/10 p-2 rounded">{success}</div>}
                    
                    <button type="submit" className="bg-teal-500 text-white py-3 rounded-lg font-semibold hover:bg-teal-600 transition">
                        Registrar
                    </button>
                    
                    <button 
                        type="button" 
                        className="bg-gray-700 text-white py-2 rounded-lg font-semibold hover:bg-gray-600 transition" 
                        onClick={onBack}
                    >
                        Voltar ao Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
