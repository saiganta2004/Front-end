export interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
  token: string;
  name: string;
  studentId: string;
  faceRegistered: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (loginData: LoginRequest) => Promise<void>;
  register: (registerData: RegisterRequest) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface LoginRequest {
  username?: string;
  password?: string;
}

export interface RegisterRequest {
  name?: string;
  studentId?: string;
  username?: string;
  email?: string;
  password?: string;
  faceEmbedding?: number[];
}

export interface AttendanceMarkRequest {
  image: string; 
  periodId: number; 
}