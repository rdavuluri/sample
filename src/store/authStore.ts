import { create } from 'zustand';
import { User, LoginCredentials, RegisterCredentials, ResetPasswordCredentials } from '../types/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  resetPassword: (credentials: ResetPasswordCredentials) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockUser = {
        id: '1',
        email: credentials.email,
        name: credentials.email.split('@')[0],
      };
      set({ user: mockUser, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({
        error: 'Invalid credentials',
        isLoading: false,
      });
      throw error;
    }
  },
  register: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockUser = {
        id: '1',
        email: credentials.email,
        name: credentials.name,
      };
      set({ user: mockUser, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({
        error: 'Registration failed',
        isLoading: false,
      });
      throw error;
    }
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
  resetPassword: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      set({ isLoading: false });
    } catch (error) {
      set({
        error: 'Password reset failed',
        isLoading: false,
      });
      throw error;
    }
  },
  clearError: () => set({ error: null }),
}));
