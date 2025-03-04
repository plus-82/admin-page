import axios from 'axios';
import storage from '../utils/storage';
import { logError } from '../utils/errorHandler';

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = storage.get<string>('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    logError(error, 'API Request');
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle token expiration
    if (error.response && error.response.status === 401) {
      storage.remove('accessToken');
      storage.remove('tokenExpiry');
      window.location.href = '/login';
    }
    
    // Log error for debugging
    logError(error, 'API Response');
    
    return Promise.reject(error);
  }
);

export default api;