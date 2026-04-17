import axiosInstance from './axiosInstance';

export const authService = {
  login: (credentials) => axiosInstance.post('/api/v1/auth/login', credentials),
  logout: () => axiosInstance.post('/api/v1/auth/logout'),
  me: () => axiosInstance.get('/api/v1/auth/me'),
  changePassword: (payload) => axiosInstance.put('/api/v1/auth/password', payload),
};
