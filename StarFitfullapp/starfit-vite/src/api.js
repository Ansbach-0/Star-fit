// API configuration for backend communication
const API_BASE_URL = 'http://localhost:3001';

// Token management
const TOKEN_KEY = 'starfit_auth_token';

export const tokenManager = {
  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },
  
  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  },
  
  isAuthenticated() {
    return !!this.getToken();
  }
};

// Helper function to add auth header
function getHeaders(includeAuth = false) {
  const headers = { 'Content-Type': 'application/json' };
  
  if (includeAuth) {
    const token = tokenManager.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
}

// Helper function to handle API responses
async function handleResponse(response) {
  if (response.status === 401 || response.status === 403) {
    tokenManager.removeToken();
    window.location.href = '/login';
  }
  return response;
}

export const api = {
  async login(email, password) {
    console.log('API: Attempting login to:', `${API_BASE_URL}/login`);
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
      });
      
      console.log('API: Response status:', response.status);
      console.log('API: Response headers:', response.headers);
      
      // Check content type before parsing
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // Handle non-JSON responses (like rate limit text)
        const text = await response.text();
        console.log('API: Non-JSON response:', text);
        data = { 
          error: response.status === 429 
            ? 'Too many attempts. Please wait a few minutes and try again.' 
            : text || 'Server error' 
        };
      }
      
      console.log('API: Response data:', data);
      
      if (response.ok && data.token) {
        tokenManager.setToken(data.token);
        console.log('API: Token saved successfully');
      }
      
      return { response, data };
    } catch (error) {
      console.error('API: Login error:', error);
      throw error;
    }
  },

  async register(email, password, name, plan = 'Plano Fit', manager_id = null) {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password, name, plan, manager_id }),
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.token) {
        tokenManager.setToken(data.token);
      }
    }
    
    return response;
  },

  async registerManager(email, password, name, gym_name = '', phone = '') {
    const response = await fetch(`${API_BASE_URL}/register/manager`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password, name, gym_name, phone }),
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.token) {
        tokenManager.setToken(data.token);
      }
    }
    
    return response;
  },

  logout() {
    tokenManager.removeToken();
  },

  async getUsers(myClientsOnly = false) {
    const url = myClientsOnly 
      ? `${API_BASE_URL}/users?my_clients=true`
      : `${API_BASE_URL}/users`;
    const response = await fetch(url, {
      headers: getHeaders(true),
    });
    return handleResponse(response);
  },

  async getStats() {
    const response = await fetch(`${API_BASE_URL}/stats`, {
      headers: getHeaders(true),
    });
    return handleResponse(response);
  },

  async getExercises() {
    const response = await fetch(`${API_BASE_URL}/exercises`, {
      headers: getHeaders(true),
    });
    return handleResponse(response);
  },

  async getManagerClients() {
    const response = await fetch(`${API_BASE_URL}/manager/clients`, {
      headers: getHeaders(true),
    });
    return handleResponse(response);
  },

  async assignClientToManager(userId, managerId = null) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/assign-manager`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ manager_id: managerId }),
    });
    return handleResponse(response);
  },

  async createRoutine(user_id, exercise_id, sets, reps) {
    const response = await fetch(`${API_BASE_URL}/routines`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ user_id, exercise_id, sets, reps }),
    });
    return handleResponse(response);
  },

  async getRoutines(user_id) {
    const response = await fetch(`${API_BASE_URL}/routines/${user_id}`, {
      headers: getHeaders(true),
    });
    return handleResponse(response);
  },

  async completeRoutine(routine_id) {
    const response = await fetch(`${API_BASE_URL}/routines/${routine_id}/complete`, {
      method: 'PUT',
      headers: getHeaders(true),
    });
    return handleResponse(response);
  },

  async deleteRoutine(routine_id) {
    const response = await fetch(`${API_BASE_URL}/routines/${routine_id}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    return handleResponse(response);
  },

  async testConnection() {
    try {
      const response = await fetch(`${API_BASE_URL}/stats`, {
        headers: getHeaders(true),
      });
      return response.ok || response.status === 401 || response.status === 403;
    } catch (error) {
      console.error('Backend connection failed:', error);
      return false;
    }
  },
};

export default api;
