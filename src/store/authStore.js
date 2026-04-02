import { create } from 'zustand';
import { storage } from '@/utils/storage';
import { authService } from '@/services/authService';

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (credentials) => {
    set({ isLoading: true });
    const data = await authService.login(credentials);
    storage.setToken(data.access_token);
    storage.setRefreshToken(data.refresh_token);
    set({
      user: data.user,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      isAuthenticated: true,
      isLoading: false,
    });
    return data.user;
  },

  logout: () => {
    storage.clearAllTokens();
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  setTokens: (accessToken, refreshToken) => {
    storage.setToken(accessToken);
    if (refreshToken) storage.setRefreshToken(refreshToken);
    set({ accessToken, ...(refreshToken && { refreshToken }) });
  },

  // Called on app start — reads token from storage, validates with API
  initializeAuth: async () => {
    const token = storage.getToken();
    if (!token) {
      set({ isLoading: false });
      return;
    }
    set({ isLoading: true });
    try {
      const user = await authService.me();
      set({ user, accessToken: token, isAuthenticated: true, isLoading: false });
    } catch {
      get().logout();
      set({ isLoading: false });
    }
  },
}));
