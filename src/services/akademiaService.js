import axiosInstance from './axiosInstance';

export const akademiaService = {
  getFakultetet: () => axiosInstance.get('/api/v1/fakultetet'),
  getFakulteti: (id) => axiosInstance.get(`/api/v1/fakultetet/${id}`),
  getProgramet: () => axiosInstance.get('/api/v1/programet'),
  getProgrami: (id) => axiosInstance.get(`/api/v1/programet/${id}`),
};
