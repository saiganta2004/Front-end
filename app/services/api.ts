import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { LoginRequest, RegisterRequest, AttendanceMarkRequest } from '../types';

// For demo purposes, you can switch between real API and mock API
const USE_MOCK_API = process.env.NODE_ENV === 'production' || !process.env.NEXT_PUBLIC_BACKEND_URL;

// Mock API import
import { mockApiService } from './mock-api';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in all requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log('Request Interceptor Triggered');
    try {
      const userStr = localStorage.getItem('user');
      console.log('userStr from localStorage:', userStr);
      if (userStr) {
        const user = JSON.parse(userStr);
        const token = user?.accessToken;
        console.log('Token:', token);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('Authorization header set:', config.headers.Authorization);
        }
      }
    } catch (error) {
      console.error("Error setting auth header:", error);
    }
    console.log('Final headers:', config.headers);
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Add any response interceptors here
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Unauthorized, token may be invalid or expired
      console.log('Unauthorized access, logging out.');
      localStorage.removeItem('user');
      // Reload the page to clear state and prompt for login
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

const apiService = {
  async makeRequest(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: any
  ) {
    // Use mock API in production or when backend URL is not set
    if (USE_MOCK_API) {
      return mockApiService.makeRequest(endpoint, method, data);
    }

    try {
      // The interceptor now handles the Authorization header automatically
      const response = await api({ url: endpoint, method, data });
      return response.data;
    } catch (error) {
      console.error(`API ${method} Error:`, error);
      throw error;
    }
  },

  async login(request: LoginRequest) {
    return this.makeRequest('/api/auth/signin', 'POST', request);
  },

  async register(request: RegisterRequest) {
    return this.makeRequest('/api/auth/register', 'POST', request);
  },

  async getPeriods() {
    return this.makeRequest('/api/attendance/periods', 'GET');
  },

  async markAttendance(request: AttendanceMarkRequest) {
    return this.makeRequest('/api/attendance/mark', 'POST', request);
  },

  async getTodayAttendance() {
    return this.makeRequest('/api/attendance/today', 'GET');
  },

  async getAttendanceCalendar(startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return this.makeRequest(`/api/attendance/calendar?${params.toString()}`, 'GET');
  },

  async getAttendanceStats(startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return this.makeRequest(`/api/attendance/stats?${params.toString()}`, 'GET');
  },

  async getUserAttendanceStats(userId: string, startDate: string, endDate: string) {
    const params = new URLSearchParams();
    params.append('userId', userId);
    params.append('startDate', startDate);
    params.append('endDate', endDate);
    return this.makeRequest(`/api/attendance/user-stats?${params.toString()}`, 'GET');
  },
};

export { apiService };
