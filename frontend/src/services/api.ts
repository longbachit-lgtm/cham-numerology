import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface SignupRequest {
  email: string;
  password?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ProfileRequest {
  fullName: string;
  dob: string;
  gender?: 'male' | 'female' | 'other';
  jobField?: string;
  jobRole?: string;
  tz?: string;
}

export interface TodoRequest {
  text: string;
  dueAt?: string;
  sourceTag?: string;
}

export interface ReminderRequest {
  todoId: string;
  remindAt: string;
  channel?: 'push' | 'email';
}

// Auth
export const signup = (data: SignupRequest) => api.post('/auth/signup', data);
export const login = (data: LoginRequest) => api.post('/auth/login', data);

// Profile
export const getProfile = () => api.get('/profile');
export const updateProfile = (data: ProfileRequest) => api.put('/profile', data);
export const computeNumerology = () => api.post('/profile/compute-numerology');
export const getNumerology = () => api.get('/profile/numerology');

// Feed
export const getTodayFeed = (lang = 'en') => api.get('/feed/today', { params: { lang } });
export const getTomorrowFeed = (lang = 'en') => api.get('/feed/next', { params: { lang } });
export const getPeriodFeed = (scope: 'week' | 'month' | 'year', lang = 'en') => 
  api.get('/feed/period', { params: { scope, lang } });

// Todos
export const getTodos = () => api.get('/todos');
export const createTodo = (data: TodoRequest) => api.post('/todos', data);
export const updateTodo = (id: string, data: Partial<TodoRequest>) => api.patch(`/todos/${id}`, data);
export const deleteTodo = (id: string) => api.delete(`/todos/${id}`);

// Reminders
export const createReminder = (data: ReminderRequest) => api.post('/todos/reminders', data);

export default api;
