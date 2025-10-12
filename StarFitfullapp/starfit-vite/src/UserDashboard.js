import React, { useState, useEffect } from 'react';
import { api } from './api';

const UserDashboard = ({ user, onLogout }) => {
    const [routines, setRoutines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('routines'); // routines, plan, exercises

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const res = await api.getRoutines(user.id);
            const data = await res.json();
            setRoutines(data.routines || []);
        } catch (error) {
            console.error('Error loading user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteRoutine = async (routineId) => {
        try {
            const res = await api.completeRoutine(routineId);
            const data = await res.json();
            if (data.success) {
                // Update local state
                setRoutines(routines.map(r => 
                    r.id === routineId ? { ...r, completed: 1 } : r
                ));
                alert('Exercício concluído! 🎉');
            }
        } catch (error) {
            console.error('Error completing routine:', error);
        }
    };

    const nextPaymentDate = user.next_payment 
        ? new Date(user.next_payment).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
        : 'Não definido';

    const daysUntilPayment = user.next_payment
        ? Math.ceil((new Date(user.next_payment) - new Date()) / (1000 * 60 * 60 * 24))
        : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
            {/* Header */}
            <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-pink-400 text-3xl">★</span>
                        <span className="text-teal-300 text-2xl font-bold">StarFit</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <span className="text-gray-300">Olá, {user.name || user.email}!</span>
                        <button 
                            onClick={onLogout}
                            className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm"
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-6 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Bem-vindo de volta! 💪</h1>
                    <p className="text-gray-400">Gerencie sua rotina de exercícios e acompanhe seu progresso.</p>
                </div>

                {/* Plan Info Card */}
                <div className="bg-gradient-to-r from-pink-500 to-teal-400 rounded-xl p-6 mb-8 shadow-xl">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">🏆 {user.plan || 'Plano Fit'}</h2>
                            <p className="text-white/90 mb-4">Plano Premium Ativo</p>
                            <div className="flex gap-8">
                                <div>
                                    <p className="text-white/70 text-sm">Próximo Pagamento</p>
                                    <p className="text-xl font-bold">{nextPaymentDate}</p>
                                    <p className="text-white/80 text-sm">Em {daysUntilPayment} dias</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-4 text-center">
                            <p className="text-white/80 text-sm mb-1">Status</p>
                            <p className="text-2xl font-bold">✓ Ativo</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6 border-b border-gray-700">
                    <button
                        onClick={() => setActiveTab('routines')}
                        className={`px-6 py-3 font-semibold transition border-b-2 ${
                            activeTab === 'routines' 
                                ? 'border-teal-400 text-teal-400' 
                                : 'border-transparent text-gray-400 hover:text-white'
                        }`}
                    >
                        Minhas Rotinas
                    </button>
                    <button
                        onClick={() => setActiveTab('exercises')}
                        className={`px-6 py-3 font-semibold transition border-b-2 ${
                            activeTab === 'exercises' 
                                ? 'border-teal-400 text-teal-400' 
                                : 'border-transparent text-gray-400 hover:text-white'
                        }`}
                    >
                        Exercícios Disponíveis
                    </button>
                    <button
                        onClick={() => setActiveTab('plan')}
                        className={`px-6 py-3 font-semibold transition border-b-2 ${
                            activeTab === 'plan' 
                                ? 'border-teal-400 text-teal-400' 
                                : 'border-transparent text-gray-400 hover:text-white'
                        }`}
                    >
                        Meu Plano
                    </button>
                </div>

                {/* Content Based on Active Tab */}
                {activeTab === 'routines' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Minha Rotina de Treino</h2>
                        {loading ? (
                            <p className="text-gray-400">Carregando...</p>
                        ) : routines.length === 0 ? (
                            <div className="bg-gray-800 rounded-xl p-12 text-center border border-gray-700">
                                <p className="text-gray-400 text-lg mb-2">Nenhuma rotina criada ainda</p>
                                <p className="text-gray-500">Seu gerente irá criar uma rotina personalizada para você!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {routines.map((routine) => (
                                    <div
                                        key={routine.id}
                                        className={`bg-gray-800 rounded-xl p-6 border ${
                                            routine.completed 
                                                ? 'border-green-500 opacity-75' 
                                                : 'border-gray-700'
                                        } transition hover:border-teal-400`}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                routine.category === 'Cardio' ? 'bg-red-500/20 text-red-400' :
                                                routine.category === 'Força' ? 'bg-orange-500/20 text-orange-400' :
                                                routine.category === 'Flexibilidade' ? 'bg-blue-500/20 text-blue-400' :
                                                routine.category === 'Dança' ? 'bg-pink-500/20 text-pink-400' :
                                                'bg-purple-500/20 text-purple-400'
                                            }`}>
                                                {routine.category}
                                            </span>
                                            {routine.completed === 1 && (
                                                <span className="text-green-400 text-2xl">✓</span>
                                            )}
                                        </div>
                                        
                                        <h3 className="text-xl font-bold mb-2">{routine.exercise_name}</h3>
                                        <p className="text-gray-400 text-sm mb-4">{routine.description}</p>
                                        
                                        <div className="flex gap-4 mb-4">
                                            <div className="bg-gray-700/50 rounded-lg px-4 py-2 flex-1 text-center">
                                                <p className="text-gray-400 text-xs mb-1">Séries</p>
                                                <p className="text-2xl font-bold text-teal-400">{routine.sets}</p>
                                            </div>
                                            <div className="bg-gray-700/50 rounded-lg px-4 py-2 flex-1 text-center">
                                                <p className="text-gray-400 text-xs mb-1">Reps</p>
                                                <p className="text-2xl font-bold text-pink-400">{routine.reps}</p>
                                            </div>
                                        </div>

                                        {routine.completed === 0 && (
                                            <button
                                                onClick={() => handleCompleteRoutine(routine.id)}
                                                className="w-full bg-teal-500 hover:bg-teal-600 py-2 rounded-lg font-semibold transition"
                                            >
                                                Concluir Exercício
                                            </button>
                                        )}
                                        {routine.completed === 1 && (
                                            <div className="w-full bg-green-500/20 text-green-400 py-2 rounded-lg text-center font-semibold">
                                                Concluído! 🎉
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'exercises' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Exercícios Disponíveis na Academia</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { name: 'Spinning', category: 'Cardio', desc: 'Aula de ciclismo indoor de alta intensidade', icon: '🚴' },
                                { name: 'Musculação', category: 'Força', desc: 'Treino com pesos e equipamentos', icon: '💪' },
                                { name: 'Yoga', category: 'Flexibilidade', desc: 'Alongamento, postura e meditação', icon: '🧘' },
                                { name: 'Zumba', category: 'Dança', desc: 'Dança fitness com música latina', icon: '💃' },
                                { name: 'Crossfit', category: 'Funcional', desc: 'Treino funcional de alta intensidade', icon: '🏋️' },
                                { name: 'Pilates', category: 'Flexibilidade', desc: 'Fortalecimento e alongamento', icon: '🤸' },
                            ].map((ex, index) => (
                                <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-teal-400 transition">
                                    <div className="text-5xl mb-4">{ex.icon}</div>
                                    <h3 className="text-xl font-bold mb-2">{ex.name}</h3>
                                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-400 mb-3">
                                        {ex.category}
                                    </span>
                                    <p className="text-gray-400 text-sm">{ex.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'plan' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Detalhes do Plano</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Plan Benefits */}
                            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                                <h3 className="text-xl font-bold mb-4">✨ Benefícios do {user.plan}</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3">
                                        <span className="text-teal-400">✓</span>
                                        <span>Acesso ilimitado a todas as aulas</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="text-teal-400">✓</span>
                                        <span>Rotinas personalizadas por personal trainer</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="text-teal-400">✓</span>
                                        <span>Acompanhamento de progresso</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="text-teal-400">✓</span>
                                        <span>Acesso ao app mobile</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="text-teal-400">✓</span>
                                        <span>Desconto em suplementos</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Payment Info */}
                            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                                <h3 className="text-xl font-bold mb-4">💳 Informações de Pagamento</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-gray-400 text-sm mb-1">Plano Atual</p>
                                        <p className="text-xl font-semibold">{user.plan}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm mb-1">Valor Mensal</p>
                                        <p className="text-xl font-semibold">R$ 150,00</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm mb-1">Próximo Vencimento</p>
                                        <p className="text-xl font-semibold">{nextPaymentDate}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm mb-1">Forma de Pagamento</p>
                                        <p className="text-xl font-semibold">Cartão de Crédito •••• 4532</p>
                                    </div>
                                    <button className="w-full bg-pink-500 hover:bg-pink-600 py-3 rounded-lg font-semibold mt-4 transition">
                                        Gerenciar Pagamento
                                    </button>
                                </div>
                            </div>

                            {/* Upgrade Options */}
                            <div className="md:col-span-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6">
                                <h3 className="text-2xl font-bold mb-2">🚀 Upgrade para Plano Premium</h3>
                                <p className="mb-4 text-white/90">
                                    Ganhe acesso a personal trainer exclusivo, nutricionista e muito mais!
                                </p>
                                <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition">
                                    Ver Planos Disponíveis
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
