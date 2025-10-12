import React, { useState, useEffect } from 'react';
import api from './api';

const ManagerDashboard = ({ user, onLogout }) => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showRoutineForm, setShowRoutineForm] = useState(false);
    const [routineForm, setRoutineForm] = useState({
        exercise_id: '',
        sets: 3,
        reps: 12
    });

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [statsRes, usersRes, exercisesRes] = await Promise.all([
                api.getStats(),
                api.getUsers(),
                api.getExercises()
            ]);

            const statsData = await statsRes.json();
            const usersData = await usersRes.json();
            const exercisesData = await exercisesRes.json();

            setStats(statsData);
            setUsers(usersData.users || []);
            setExercises(exercisesData.exercises || []);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    };

    const handleCreateRoutine = async (e) => {
        e.preventDefault();
        if (!selectedUser || !routineForm.exercise_id) return;

        try {
            const res = await api.createRoutine(
                selectedUser.id,
                routineForm.exercise_id,
                routineForm.sets,
                routineForm.reps
            );
            const data = await res.json();
            
            if (data.success) {
                alert(`Rotina criada com sucesso para ${selectedUser.name || selectedUser.email}!`);
                setShowRoutineForm(false);
                setSelectedUser(null);
                setRoutineForm({ exercise_id: '', sets: 3, reps: 12 });
            }
        } catch (error) {
            console.error('Error creating routine:', error);
            alert('Erro ao criar rotina.');
        }
    };

    const calculateChurnRate = () => {
        if (!stats) return 0;
        const churn = ((stats.total_members - stats.active_members) / stats.total_members) * 100;
        return Math.round(churn) || 21;
    };

    const calculateOccupancy = () => {
        if (!stats) return 0;
        return stats.occupancy_rate || 78;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-8">
            {/* Header */}
            <header className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Dashboard Inteligente em Ação</h1>
                    <p className="text-gray-400">Visualize a saúde da sua academia em tempo real com métricas poderosas e gráficos interativos.</p>
                    <p className="text-red-400 text-sm mt-1">(Demonstração com dados fictícios)</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-teal-300">👤 {user.email}</span>
                    <button 
                        onClick={onLogout}
                        className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    >
                        Sair
                    </button>
                </div>
            </header>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <p className="text-gray-400 text-sm mb-2">Receita Mensal (MRR)</p>
                        <p className="text-4xl font-bold text-white">R$ {stats.revenue.toLocaleString()}</p>
                        <p className="text-green-400 text-sm mt-2">+3.2% vs mês anterior</p>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <p className="text-gray-400 text-sm mb-2">Membros Ativos</p>
                        <p className="text-4xl font-bold text-white">{stats.active_members}</p>
                        <p className="text-green-400 text-sm mt-2">+12 novos</p>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <p className="text-gray-400 text-sm mb-2">Taxa de Ocupação</p>
                        <p className="text-4xl font-bold text-white">{calculateOccupancy()}%</p>
                        <p className="text-yellow-400 text-sm mt-2">-1,5 vs semana passada</p>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <p className="text-gray-400 text-sm mb-2">Churn Rate</p>
                        <p className="text-4xl font-bold text-white">{calculateChurnRate()}%</p>
                        <p className="text-green-400 text-sm mt-2">+0.3%</p>
                    </div>
                </div>
            )}

            {/* Members Table */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
                <h2 className="text-2xl font-bold mb-6">Últimos Membros Cadastrados</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="text-left py-3 px-4 text-gray-400 font-medium">NOME</th>
                                <th className="text-left py-3 px-4 text-gray-400 font-medium">PLANO</th>
                                <th className="text-left py-3 px-4 text-gray-400 font-medium">PRÓXIMO PAGAMENTO</th>
                                <th className="text-left py-3 px-4 text-gray-400 font-medium">STATUS</th>
                                <th className="text-left py-3 px-4 text-gray-400 font-medium">AÇÕES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((member) => (
                                <tr key={member.id} className="border-b border-gray-700 hover:bg-gray-750">
                                    <td className="py-4 px-4">{member.name || member.email}</td>
                                    <td className="py-4 px-4">{member.plan}</td>
                                    <td className="py-4 px-4">{new Date(member.next_payment).toLocaleDateString('pt-BR')}</td>
                                    <td className="py-4 px-4">
                                        <span className={`px-3 py-1 rounded-full text-sm ${
                                            member.status === 'active' 
                                                ? 'bg-green-500/20 text-green-400' 
                                                : 'bg-yellow-500/20 text-yellow-400'
                                        }`}>
                                            {member.status === 'active' ? 'Ativo' : 'Pendente'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <button
                                            onClick={() => {
                                                setSelectedUser(member);
                                                setShowRoutineForm(true);
                                            }}
                                            className="bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded-lg text-sm transition"
                                        >
                                            Criar Rotina
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Routine Modal */}
            {showRoutineForm && selectedUser && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full border border-gray-700">
                        <h3 className="text-2xl font-bold mb-4">
                            Criar Rotina para {selectedUser.name || selectedUser.email}
                        </h3>
                        <form onSubmit={handleCreateRoutine} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Exercício</label>
                                <select
                                    value={routineForm.exercise_id}
                                    onChange={(e) => setRoutineForm({...routineForm, exercise_id: e.target.value})}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
                                    required
                                >
                                    <option value="">Selecione um exercício</option>
                                    {exercises.map((ex) => (
                                        <option key={ex.id} value={ex.id}>
                                            {ex.name} - {ex.category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Séries</label>
                                    <input
                                        type="number"
                                        value={routineForm.sets}
                                        onChange={(e) => setRoutineForm({...routineForm, sets: parseInt(e.target.value)})}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
                                        min="1"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Repetições</label>
                                    <input
                                        type="number"
                                        value={routineForm.reps}
                                        onChange={(e) => setRoutineForm({...routineForm, reps: parseInt(e.target.value)})}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
                                        min="1"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 mt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-teal-500 hover:bg-teal-600 py-3 rounded-lg font-semibold transition"
                                >
                                    Criar Rotina
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowRoutineForm(false);
                                        setSelectedUser(null);
                                    }}
                                    className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-semibold transition"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Class Occupancy Section */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h2 className="text-2xl font-bold mb-6">Ocupação das Aulas Hoje</h2>
                <div className="space-y-4">
                    {['Spinning', 'Musculação', 'Yoga', 'Zumba', 'Crossfit'].map((activity, index) => {
                        const percentage = [85, 70, 60, 90, 75][index];
                        return (
                            <div key={activity}>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-300">{activity}</span>
                                    <span className="text-gray-400">{percentage}%</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-3">
                                    <div
                                        className={`h-3 rounded-full ${
                                            index === 0 ? 'bg-red-400' :
                                            index === 1 ? 'bg-teal-400' :
                                            index === 2 ? 'bg-blue-400' :
                                            index === 3 ? 'bg-orange-400' :
                                            'bg-purple-400'
                                        }`}
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ManagerDashboard;
