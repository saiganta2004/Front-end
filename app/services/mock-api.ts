// Mock API Service for Demo Purposes
import { LoginRequest, RegisterRequest, AttendanceMarkRequest } from '../types';

// Simulate API delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'student' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'student' },
  { id: '3', name: 'Admin User', email: 'admin@example.com', role: 'admin' }
];

const mockAttendanceData = [
  { date: '2025-07-01', periodNumber: 1, status: 'PRESENT', userId: '1' },
  { date: '2025-07-01', periodNumber: 2, status: 'PRESENT', userId: '1' },
  { date: '2025-07-02', periodNumber: 1, status: 'ABSENT', userId: '1' },
];

// Mock API Service
export const mockApiService = {
  async makeRequest(endpoint: string, method: string, data?: any) {
    await delay(500); // Simulate network delay
    
    console.log(`Mock API Call: ${method} ${endpoint}`, data);
    
    // Mock successful responses
    return {
      success: true,
      data: this.getMockData(endpoint, method, data),
      message: 'Success'
    };
  },

  getMockData(endpoint: string, method: string, data?: any) {
    // Login endpoint
    if (endpoint === '/api/auth/signin' && method === 'POST') {
      const user = mockUsers.find(u => u.email === data?.email);
      if (user) {
        return {
          user,
          accessToken: 'mock-jwt-token-' + user.id,
          refreshToken: 'mock-refresh-token'
        };
      }
      throw new Error('Invalid credentials');
    }
    
    // Register endpoint
    if (endpoint === '/api/auth/register' && method === 'POST') {
      const newUser = {
        id: Date.now().toString(),
        name: data?.name || 'New User',
        email: data?.email,
        role: 'student'
      };
      return {
        user: newUser,
        accessToken: 'mock-jwt-token-' + newUser.id,
        refreshToken: 'mock-refresh-token'
      };
    }
    
    // Periods endpoint
    if (endpoint === '/api/attendance/periods') {
      return [
        { id: 1, name: 'Period 1', startTime: '09:00', endTime: '10:00' },
        { id: 2, name: 'Period 2', startTime: '10:15', endTime: '11:15' },
        { id: 3, name: 'Period 3', startTime: '11:30', endTime: '12:30' },
        { id: 4, name: 'Period 4', startTime: '13:30', endTime: '14:30' },
      ];
    }
    
    // Mark attendance
    if (endpoint === '/api/attendance/mark' && method === 'POST') {
      return {
        id: Date.now().toString(),
        success: true,
        message: 'Attendance marked successfully'
      };
    }
    
    // Today's attendance
    if (endpoint === '/api/attendance/today') {
      return mockAttendanceData.filter(a => a.date === new Date().toISOString().split('T')[0]);
    }
    
    // Calendar data
    if (endpoint.includes('/api/attendance/calendar')) {
      return mockAttendanceData;
    }
    
    // Stats
    if (endpoint.includes('/api/attendance/stats')) {
      return {
        totalDays: 30,
        presentDays: 25,
        absentDays: 5,
        attendancePercentage: 83.33,
        periodsToday: 4,
        periodsAttended: 3
      };
    }
    
    return { message: 'Mock data not configured for this endpoint' };
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
    return this.makeRequest('/api/attendance/calendar', 'GET');
  },

  async getAttendanceStats(startDate?: string, endDate?: string) {
    return this.makeRequest('/api/attendance/stats', 'GET');
  },

  async getUserAttendanceStats(userId: string, startDate: string, endDate: string) {
    return this.makeRequest('/api/attendance/user-stats', 'GET');
  },
};

export { mockApiService as apiService };
