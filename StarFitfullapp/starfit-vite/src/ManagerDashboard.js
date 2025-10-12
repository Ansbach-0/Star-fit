import React, { useState, useEffect } from 'react';
import { api } from './api';

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

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Revenue Evolution Chart */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h2 className="text-2xl font-bold mb-6">Evolução do Faturamento (Últimos 6 meses)</h2>
                    <div className="relative h-64">
                        <svg className="w-full h-full" viewBox="0 0 700 250">
                            {/* Grid lines */}
                            {[0, 1, 2, 3, 4, 5].map(i => (
                                <line 
                                    key={i} 
                                    x1="50" 
                                    y1={30 + i * 40} 
                                    x2="680" 
                                    y2={30 + i * 40} 
                                    stroke="#374151" 
                                    strokeWidth="1"
                                />
                            ))}
                            
                            {/* Y-axis labels */}
                            {[46000, 44000, 42000, 40000, 38000, 36000, 34000, 32000].map((val, i) => (
                                <text 
                                    key={val} 
                                    x="10" 
                                    y={35 + i * 28} 
                                    fill="#9CA3AF" 
                                    fontSize="12"
                                >
                                    {val}
                                </text>
                            ))}

                            {/* Line chart */}
                            <polyline
                                points="50,150 150,130 250,180 350,140 450,160 550,120 650,100"
                                fill="none"
                                stroke="url(#gradient)"
                                strokeWidth="3"
                            />
                            
                            {/* Area under the line */}
                            <polygon
                                points="50,150 150,130 250,180 350,140 450,160 550,120 650,100 650,230 50,230"
                                fill="url(#areaGradient)"
                            />

                            {/* Data points */}
                            {[
                                [50, 150], [150, 130], [250, 180], [350, 140], [450, 160], [550, 120], [650, 100]
                            ].map((point, i) => (
                                <circle 
                                    key={i} 
                                    cx={point[0]} 
                                    cy={point[1]} 
                                    r="4" 
                                    fill="#14B8A6"
                                />
                            ))}

                            {/* X-axis labels */}
                            {['Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'].map((month, i) => (
                                <text 
                                    key={month} 
                                    x={50 + i * 100} 
                                    y="245" 
                                    fill="#9CA3AF" 
                                    fontSize="12" 
                                    textAnchor="middle"
                                >
                                    {month}
                                </text>
                            ))}

                            {/* Gradients */}
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#EC4899" />
                                    <stop offset="50%" stopColor="#14B8A6" />
                                    <stop offset="100%" stopColor="#14B8A6" />
                                </linearGradient>
                                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#14B8A6" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                </div>

                {/* Plan Distribution Pie Chart */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h2 className="text-2xl font-bold mb-6">Distribuição de Planos</h2>
                    <div className="flex items-center justify-center h-64">
                        <div className="relative w-48 h-48">
                            {/* Donut Chart */}
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                {/* Plano Fit - 40% - Teal */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="none"
                                    stroke="#14B8A6"
                                    strokeWidth="20"
                                    strokeDasharray="100.53 251.33"
                                />
                                {/* Plano Gold - 35% - Blue */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="none"
                                    stroke="#3B82F6"
                                    strokeWidth="20"
                                    strokeDasharray="87.96 251.33"
                                    strokeDashoffset="-100.53"
                                />
                                {/* Plano Premium - 25% - Pink */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="none"
                                    stroke="#EC4899"
                                    strokeWidth="20"
                                    strokeDasharray="62.83 251.33"
                                    strokeDashoffset="-188.49"
                                />
                            </svg>
                            {/* Center text */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <p className="text-3xl font-bold">{users.length}</p>
                                    <p className="text-gray-400 text-sm">Membros</p>
                                </div>
                            </div>
                        </div>
                        {/* Legend */}
                        <div className="ml-8 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 rounded bg-teal-400"></div>
                                <span className="text-gray-300">Plano Fit</span>
                                <span className="text-gray-400 ml-auto">40%</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 rounded bg-blue-400"></div>
                                <span className="text-gray-300">Plano Gold</span>
                                <span className="text-gray-400 ml-auto">35%</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 rounded bg-pink-400"></div>
                                <span className="text-gray-300">Plano Premium</span>
                                <span className="text-gray-400 ml-auto">25%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Analytics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Member Growth Chart */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-xl font-bold mb-4">Crescimento de Membros</h3>
                    <div className="space-y-2">
                        {[
                            { month: 'Janeiro', value: 85, percent: 85 },
                            { month: 'Fevereiro', value: 92, percent: 92 },
                            { month: 'Março', value: 88, percent: 88 },
                            { month: 'Abril', value: 95, percent: 95 },
                            { month: 'Maio', value: 100, percent: 100 }
                        ].map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-400">{item.month}</span>
                                    <span className="text-white font-semibold">{item.value}</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-teal-400 to-blue-400 h-2 rounded-full transition-all"
                                        style={{ width: `${item.percent}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Peak Hours Heatmap */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-xl font-bold mb-4">Horários de Pico</h3>
                    <div className="grid grid-cols-4 gap-2">
                        {[
                            { time: '06h', intensity: 60 },
                            { time: '07h', intensity: 85 },
                            { time: '08h', intensity: 70 },
                            { time: '09h', intensity: 45 },
                            { time: '10h', intensity: 40 },
                            { time: '11h', intensity: 35 },
                            { time: '12h', intensity: 55 },
                            { time: '13h', intensity: 50 },
                            { time: '14h', intensity: 30 },
                            { time: '15h', intensity: 35 },
                            { time: '16h', intensity: 40 },
                            { time: '17h', intensity: 60 },
                            { time: '18h', intensity: 95 },
                            { time: '19h', intensity: 100 },
                            { time: '20h', intensity: 80 },
                            { time: '21h', intensity: 55 }
                        ].map((slot, i) => (
                            <div 
                                key={i}
                                className="aspect-square rounded flex flex-col items-center justify-center text-xs"
                                style={{
                                    backgroundColor: slot.intensity > 80 ? '#DC2626' :
                                                    slot.intensity > 60 ? '#F59E0B' :
                                                    slot.intensity > 40 ? '#14B8A6' :
                                                    '#374151'
                                }}
                            >
                                <span className="font-bold">{slot.time}</span>
                                <span className="text-[10px] opacity-80">{slot.intensity}%</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-gray-700 rounded"></div>
                            <span className="text-gray-400">Baixo</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-teal-500 rounded"></div>
                            <span className="text-gray-400">Médio</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-600 rounded"></div>
                            <span className="text-gray-400">Alto</span>
                        </div>
                    </div>
                </div>

                {/* Payment Status */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-xl font-bold mb-4">Status de Pagamentos</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-300">Em Dia</span>
                                <span className="text-green-400 font-semibold">82%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-3">
                                <div className="bg-green-400 h-3 rounded-full" style={{ width: '82%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-300">Vencendo</span>
                                <span className="text-yellow-400 font-semibold">12%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-3">
                                <div className="bg-yellow-400 h-3 rounded-full" style={{ width: '12%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-300">Atrasados</span>
                                <span className="text-red-400 font-semibold">6%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-3">
                                <div className="bg-red-400 h-3 rounded-full" style={{ width: '6%' }}></div>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-gray-700">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Total de Receita</span>
                                <span className="text-white font-bold">R$ {stats?.revenue.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


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
