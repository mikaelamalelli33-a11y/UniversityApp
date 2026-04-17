import axiosInstance from './axiosInstance';

export const adminService = {
  getPedagogues: (params) => axiosInstance.get('/api/v1/pedagogues', { params }),
  getCourses: (params) => axiosInstance.get('/api/v1/courses', { params }),
  getFaculties: () => axiosInstance.get('/api/v1/faculties'),
  getDepartments: () => axiosInstance.get('/api/v1/departments'),
  getPrograms: () => axiosInstance.get('/api/v1/programs'),
  sendNotification: (payload) => axiosInstance.post('/api/v1/admin/notifications', payload),
};
