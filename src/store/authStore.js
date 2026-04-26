import { create } from 'zustand';
import { storage } from '@/utils/storage';
import { authService } from '@/services/authService';

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (credentials) => {
    set({ isLoading: true });
    // Backend: { data: { user: {...}, token: "..." }, message, status }
    const res = await authService.login(credentials);
    const { user, token } = res.data;
    storage.setToken(token);
    set({ user, accessToken: token, isAuthenticated: true, isLoading: false });
    return user;
  },

  // Called by OAuthCallbackPage after token arrives in URL
  loginWithToken: async (token) => {
    // Store token temporarily so axios interceptor can use it for /auth/me request
    storage.setToken(token);
    try {
      const res = await authService.me();
      const user = res.data;
      set({ user, accessToken: token, isAuthenticated: true, isLoading: false });
      return user;
    } catch (error) {
      // Token validation failed — clear it from storage to prevent loop on reload
      storage.clearToken();
      throw error;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch {
      // ignore — token may already be invalid
    }
    storage.clearAllTokens();
    set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
  },

  initializeAuth: async () => {
    const token = storage.getToken();
    if (!token) {
      set({ isLoading: false });
      return;
    }
    set({ isLoading: true });
    try {
      const res = await authService.me();
      set({ user: res.data, accessToken: token, isAuthenticated: true, isLoading: false });
    } catch {
      get().logout();
      set({ isLoading: false });
    }
  },
}));
