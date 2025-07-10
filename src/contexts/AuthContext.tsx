
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
  const storedToken = authService.getToken();
  const storedUser = authService.getUser();
  if (storedToken && storedUser) {
    setToken(storedToken);
    setUser(storedUser);
  }
  setIsLoading(false);
}, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await authService.login({ email, password });
      console.log('AuthContext login: Received data from API:', data);

      if (!data || !data.token || !data.user) {
        throw new Error('Resposta inválida do servidor');
      }

      // Set auth data in localStorage first
      authService.setAuthData(data.token, data.user);

      // Then update state
      setToken(data.token);
      setUser(data.user);

      console.log('AuthContext: Login successful, auth state updated');
    } catch (error) {
      console.error('AuthContext login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
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
