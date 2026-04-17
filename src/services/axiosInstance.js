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
// Global error handling: any API error surfaces as an antd notification using
// the backend's `message` field, with a role-appropriate severity. Callers that
// want to handle errors inline (e.g. login form, change password form) can pass
// `{ skipErrorNotification: true }` in the axios config to opt out.
axiosInstance.interceptors.response.use(
  // Unwrap data so callers get the payload directly
  (response) => response.data,

  async (error) => {
    const status = error.response?.status;
    const backendMessage = error.response?.data?.message;
    const skipNotification = error.config?.skipErrorNotification === true;
    const isLoginRequest = error.config?.url?.includes('/auth/login');

    // 401 — token expired or invalid, force logout
    // NOTE: Sanctum does not have refresh tokens. When the token expires (24h),
    // the user must log in again. If refresh tokens are added in the future,
    // implement them here.
    // Skip redirect if this IS the login request (wrong credentials).
    if (status === 401 && !isLoginRequest) {
      const { useAuthStore } = await import('@/store/authStore');
      useAuthStore.getState().logout();
      window.location.href = ROUTES.LOGIN;
      return Promise.reject(error);
    }

    if (skipNotification) {
      return Promise.reject(error);
    }

    // Decide severity + fallback message
    let type = 'error';
    let fallback = 'Ndodhi një gabim. Ju lutem provoni përsëri.';

    if (!error.response) {
      fallback = 'Nuk ka lidhje me serverin.';
    } else if (status === 403) {
      fallback = 'Nuk keni leje për këtë veprim.';
    } else if (status === 404) {
      type = 'warning';
      fallback = 'Burimi i kërkuar nuk u gjet.';
    } else if (status === 422) {
      type = 'warning';
      fallback = 'Të dhënat nuk janë të vlefshme.';
    } else if (status >= 500) {
      fallback = 'Gabim i serverit. Ju lutem provoni përsëri.';
    }

    notification[type]({ message: backendMessage ?? fallback });

    return Promise.reject(error);
  }
);

export default axiosInstance;
