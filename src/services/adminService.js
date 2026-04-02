import axiosInstance from './axiosInstance';

export const adminService = {
  // Students
  getStudentat: (params) => axiosInstance.get('/api/v1/studentat', { params }),
  createStudent: (payload) => axiosInstance.post('/api/v1/studentat', payload),
  updateStudent: (id, payload) => axiosInstance.put(`/api/v1/studentat/${id}`, payload),
  deleteStudent: (id) => axiosInstance.delete(`/api/v1/studentat/${id}`),

  // Pedagogues
  getPedagoget: (params) => axiosInstance.get('/api/v1/pedagogat', { params }),
  createPedagogu: (payload) => axiosInstance.post('/api/v1/pedagogat', payload),
  updatePedagogu: (id, payload) => axiosInstance.put(`/api/v1/pedagogat/${id}`, payload),
  deletePedagogu: (id) => axiosInstance.delete(`/api/v1/pedagogat/${id}`),

  // Courses
  getLendet: (params) => axiosInstance.get('/api/v1/lendet', { params }),
  createLenda: (payload) => axiosInstance.post('/api/v1/lendet', payload),
  updateLenda: (id, payload) => axiosInstance.put(`/api/v1/lendet/${id}`, payload),
  deleteLenda: (id) => axiosInstance.delete(`/api/v1/lendet/${id}`),
};
