import axiosInstance from './axiosInstance';

export const studentService = {
  getProfile: (studentId) => axiosInstance.get(`/api/v1/studentat/${studentId}`),
  getNotat: (studentId) => axiosInstance.get(`/api/v1/studentat/${studentId}/notat`),
  getOraret: (studentId) => axiosInstance.get(`/api/v1/studentat/${studentId}/oraret`),
  getFatura: (studentId) => axiosInstance.get(`/api/v1/studentat/${studentId}/fatura`),
};
