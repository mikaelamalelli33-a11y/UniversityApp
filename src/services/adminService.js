import axiosInstance from './axiosInstance';

export const adminService = {
  getPedagogues: (params) => axiosInstance.get('/pedagogues', { params }),
  getCourses: (params) => axiosInstance.get('/courses', { params }),
  getFaculties: () => axiosInstance.get('/faculties'),
  getDepartments: () => axiosInstance.get('/departments'),
  getPrograms: () => axiosInstance.get('/programs'),
  sendNotification: (payload) => axiosInstance.post('/admin/notifications', payload),
};
