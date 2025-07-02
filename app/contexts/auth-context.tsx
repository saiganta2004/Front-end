"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/api'; // Using relative path
import { LoginRequest, RegisterRequest, User, AuthContextType } from '../types'; // Using relative path


// Create the context with a default undefined value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On initial load, check for a user session in localStorage
  useEffect(() => {
    // Force logout on every visit
    localStorage.removeItem('user');
    setUser(null);
    setIsLoading(false);
  }, []);

  const login = async (loginData: LoginRequest) => {
    try {
      const userData = await apiService.login(loginData);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Login failed:', error);
      throw error; // Re-throw error to be handled by the form
    }
  };

  const register = async (registerData: RegisterRequest) => {
    try {
      await apiService.register(registerData);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error; // Re-throw error to be handled by the form
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // The context value that will be supplied to consuming components
  const value = { user, login, register, logout, isLoading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create a custom hook for easy access to the context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
