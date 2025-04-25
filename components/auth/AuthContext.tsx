'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    // Mock authentication check
    const checkAuth = () => {
      // In a real app, you would check for a token in localStorage/cookies
      // and validate it with your backend
      const savedUser = localStorage.getItem('user');
      
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Mock login - in a real app, this would be an API call
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      const user = {
        id: '1',
        name: 'Demo User',
        email: email
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    
    // Mock logout - in a real app, this would involve more cleanup
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      localStorage.removeItem('user');
      setUser(null);
      
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
} 