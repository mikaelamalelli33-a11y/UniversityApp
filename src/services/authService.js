import axiosInstance from './axiosInstance';

// Auth endpoints opt out of the global error notification — the login form,
// change-password form, and initializeAuth() all handle errors inline.
const skipErrorNotification = { skipErrorNotification: true };

export const authService = {
  login: (credentials) =>
    axiosInstance.post('/api/v1/auth/login', credentials, skipErrorNotification),
  logout: () => axiosInstance.post('/api/v1/auth/logout', null, skipErrorNotification),
  me: () => axiosInstance.get('/api/v1/auth/me', skipErrorNotification),
  changePassword: (payload) =>
    axiosInstance.put('/api/v1/auth/password', payload, skipErrorNotification),
};
