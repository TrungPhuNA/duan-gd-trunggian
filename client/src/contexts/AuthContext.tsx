import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, LoginForm, RegisterForm } from '../types';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginForm) => Promise<void>;
  register: (data: RegisterForm) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const currentUser = authService.getCurrentUser();
      const token = authService.getToken();

      if (currentUser && token) {
        // Verify token by fetching fresh user data
        const freshUser = await authService.getProfile();
        setUser(freshUser);
      }
    } catch (error) {
      // Token might be expired, clear auth data
      authService.clearAuthData();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      const authData = await authService.login(data);
      setUser(authData.user);
      toast.success('Đăng nhập thành công!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Đăng nhập thất bại';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterForm) => {
    try {
      setIsLoading(true);
      const authData = await authService.register(data);
      setUser(authData.user);
      toast.success('Đăng ký thành công!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Đăng ký thất bại';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      toast.success('Đăng xuất thành công!');
    } catch (error) {
      // Ignore logout errors
      setUser(null);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const updatedUser = await authService.updateProfile(data);
      setUser(updatedUser);
      toast.success('Cập nhật thông tin thành công!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Cập nhật thất bại';
      toast.error(message);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const freshUser = await authService.getProfile();
      setUser(freshUser);
    } catch (error) {
      // Handle error silently or logout user
      console.error('Failed to refresh user:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
