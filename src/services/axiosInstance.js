import axios from 'axios';
import { notification } from 'antd';
import { storage } from '@/utils/storage';
import { ROUTES } from '@/router/routes';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://university-api-production.up.railway.app',
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
    // 401 — token expired or invalid, force logout
    // NOTE: Sanctum does not have refresh tokens. When the token expires (24h),
    // the user must log in again. If refresh tokens are added in the future,
    // implement them here.
    if (error.response?.status === 401) {
      const { useAuthStore } = await import('@/store/authStore');
      useAuthStore.getState().logout();
      window.location.href = ROUTES.LOGIN;
      return Promise.reject(error);
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
