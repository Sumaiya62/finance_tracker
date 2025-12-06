import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const signup = (userData) => api.post('/auth/signup', userData);
export const login = (userData) => api.post('/auth/login', userData);

// Transaction APIs
export const getTransactions = () => api.get('/transactions');
export const addTransaction = (data) => api.post('/transactions', data);
export const deleteTransaction = (id) => api.delete(`/transactions/${id}`);
export const getSummary = () => api.get('/transactions/summary');

// Budget APIs
export const getBudgets = () => api.get('/budgets');
export const addBudget = (data) => api.post('/budgets', data);
export const checkBudget = (category) => api.get(`/budgets/check/${category}`);
export const deleteBudget = (id) => api.delete(`/budgets/${id}`);

// Savings APIs
export const getSavings = () => api.get('/savings');
export const addSavings = (data) => api.post('/savings', data);
export const addMoneyToSavings = (id, amount) => api.put(`/savings/${id}/add`, { amount });
export const deleteSavings = (id) => api.delete(`/savings/${id}`);

export default api;