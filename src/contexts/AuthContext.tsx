
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/authService';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Checking stored auth data...');
    const storedToken = authService.getToken();
    const storedUser = authService.getUser();

    console.log('Stored token:', storedToken ? 'exists' : 'not found');
    console.log('Stored user:', storedUser);

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
      console.log('AuthProvider: User authenticated from storage');
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Attempting login for:', email);
      const response = await authService.login({ email, password });
      console.log('AuthContext: Login response:', response);
      
      setToken(response.token);
      setUser(response.user);
      authService.setAuthData(response.token, response.user);
      
      console.log('AuthContext: Login successful, user set:', response.user);
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      console.log('AuthContext: Attempting register for:', email);
      const response = await authService.register({ name, email, password });
      console.log('AuthContext: Register response:', response);
      
      setToken(response.token);
      setUser(response.user);
      authService.setAuthData(response.token, response.user);
      
      console.log('AuthContext: Register successful, user set:', response.user);
    } catch (error) {
      console.error('AuthContext: Register error:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('AuthContext: Logging out');
    authService.logout();
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token && !!user;
  
  console.log('AuthContext state:', {
    isAuthenticated,
    hasToken: !!token,
    hasUser: !!user,
    isLoading,
    userName: user?.name
  });

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
