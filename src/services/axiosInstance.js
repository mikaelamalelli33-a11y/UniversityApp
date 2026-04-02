import axios from 'axios';
import { notification } from 'antd';
import { storage } from '@/utils/storage';
import { ROUTES } from '@/router/routes';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
    // Tell backend to return error messages in Albanian
    'Accept-Language': 'sq',
  },
});

// ─── Request interceptor ────────────────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor ───────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  // Unwrap data so callers get the payload directly
  (response) => response.data,

  async (error) => {
    const originalRequest = error.config;

    // 401 — try to refresh token once, then logout
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = storage.getRefreshToken();

      if (refreshToken) {
        try {
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/refresh`,
            { refresh_token: refreshToken }
          );
          const { useAuthStore } = await import('@/store/authStore');
          useAuthStore.getState().setTokens(data.access_token, data.refresh_token);
          originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
          return axiosInstance(originalRequest);
        } catch {
          // Refresh failed — force logout
          const { useAuthStore } = await import('@/store/authStore');
          useAuthStore.getState().logout();
          window.location.href = ROUTES.LOGIN;
          return Promise.reject(error);
        }
      } else {
        const { useAuthStore } = await import('@/store/authStore');
        useAuthStore.getState().logout();
        window.location.href = ROUTES.LOGIN;
      }
    }

    // 403 — not authorized for this action
    if (error.response?.status === 403) {
      notification.error({ message: 'Nuk keni leje për këtë veprim.' });
    }

    // 5xx — server error
    if (error.response?.status >= 500) {
      notification.error({ message: 'Gabim i serverit. Ju lutem provoni përsëri.' });
    }

    // Network error (no response)
    if (!error.response) {
      notification.error({ message: 'Nuk ka lidhje me serverin.' });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
