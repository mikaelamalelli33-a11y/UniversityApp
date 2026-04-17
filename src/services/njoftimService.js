import axiosInstance from './axiosInstance';

export const njoftimService = {
  getAll: () => axiosInstance.get('/notifications'),
  getUnreadCount: () => axiosInstance.get('/notifications/unread-count'),
  markAsRead: (id) => axiosInstance.put(`/notifications/${id}/read`),
  markAllAsRead: () => axiosInstance.put('/notifications/read-all'),
};
