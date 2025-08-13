import { apiService } from './api';
import { User, AuthResponse, LoginForm, RegisterForm, UserStats } from '../types';

export const authService = {
  // Register new user
  async register(data: RegisterForm): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/register', data);
    if (response.success && response.data) {
      this.setAuthData(response.data);
    }
    return response.data!;
  },

  // Login user
  async login(data: LoginForm): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/login', data);
    if (response.success && response.data) {
      this.setAuthData(response.data);
    }
    return response.data!;
  },

  // Get current user profile
  async getProfile(): Promise<User> {
    const response = await apiService.get<{ user: User }>('/auth/profile');
    if (response.success && response.data) {
      localStorage.setItem('safetrade_user', JSON.stringify(response.data.user));
      return response.data.user;
    }
    throw new Error('Failed to get profile');
  },

  // Update user profile
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await apiService.put<{ user: User }>('/auth/profile', data);
    if (response.success && response.data) {
      localStorage.setItem('safetrade_user', JSON.stringify(response.data.user));
      return response.data.user;
    }
    throw new Error('Failed to update profile');
  },

  // Change password
  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
    const response = await apiService.put('/auth/change-password', data);
    if (!response.success) {
      throw new Error(response.message || 'Failed to change password');
    }
  },

  // Refresh token
  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem('safetrade_refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiService.post<AuthResponse>('/auth/refresh', {
      refreshToken,
    });

    if (response.success && response.data) {
      this.setAuthData(response.data);
      return response.data;
    }
    throw new Error('Failed to refresh token');
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout');
    } catch (error) {
      // Ignore logout errors
    } finally {
      this.clearAuthData();
    }
  },

  // Get user statistics
  async getStats(): Promise<UserStats> {
    const response = await apiService.get<UserStats>('/auth/stats');
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error('Failed to get user stats');
  },

  // Helper methods
  setAuthData(authData: AuthResponse): void {
    localStorage.setItem('safetrade_token', authData.token);
    localStorage.setItem('safetrade_refresh_token', authData.refreshToken);
    localStorage.setItem('safetrade_user', JSON.stringify(authData.user));
    apiService.setAuthToken(authData.token);
  },

  clearAuthData(): void {
    localStorage.removeItem('safetrade_token');
    localStorage.removeItem('safetrade_refresh_token');
    localStorage.removeItem('safetrade_user');
    apiService.removeAuthToken();
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('safetrade_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  getToken(): string | null {
    return localStorage.getItem('safetrade_token');
  },

  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  },

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  },
};
