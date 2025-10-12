// API configuration for backend communication
const API_BASE_URL = 'http://localhost:4000';

export const api = {
  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response;
  },

  async register(email, password, role = 'user', name = '', plan = 'Plano Fit') {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role, name, plan }),
    });
    return response;
  },

  async getUsers() {
    const response = await fetch(`${API_BASE_URL}/users`);
    return response;
  },

  async getStats() {
    const response = await fetch(`${API_BASE_URL}/stats`);
    return response;
  },

  async getExercises() {
    const response = await fetch(`${API_BASE_URL}/exercises`);
    return response;
  },

  async createRoutine(user_id, exercise_id, sets, reps) {
    const response = await fetch(`${API_BASE_URL}/routines`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, exercise_id, sets, reps }),
    });
    return response;
  },

  async getRoutines(user_id) {
    const response = await fetch(`${API_BASE_URL}/routines/${user_id}`);
    return response;
  },

  async completeRoutine(routine_id) {
    const response = await fetch(`${API_BASE_URL}/routines/${routine_id}/complete`, {
      method: 'PUT',
    });
    return response;
  },

  async deleteRoutine(routine_id) {
    const response = await fetch(`${API_BASE_URL}/routines/${routine_id}`, {
      method: 'DELETE',
    });
    return response;
  },

  async testConnection() {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test', password: 'test' }),
      });
      return response.ok || response.status === 401; // Connection works if we get any response
    } catch (error) {
      console.error('Backend connection failed:', error);
      return false;
    }
  },
};

export default api;
