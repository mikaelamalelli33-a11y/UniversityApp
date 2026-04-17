import axiosInstance from './axiosInstance';

export const njoftimService = {
  getAll: () => axiosInstance.get('/api/v1/notifications'),
  getUnreadCount: () => axiosInstance.get('/api/v1/notifications/unread-count'),
  markAsRead: (id) => axiosInstance.put(`/api/v1/notifications/${id}/read`),
  markAllAsRead: () => axiosInstance.put('/api/v1/notifications/read-all'),
};
