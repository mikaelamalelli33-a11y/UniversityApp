import axiosInstance from './axiosInstance';

export const pedagogService = {
  getProfile: (pedagogId) => axiosInstance.get(`/api/v1/pedagogat/${pedagogId}`),
  getKurset: (pedagogId) => axiosInstance.get(`/api/v1/pedagogat/${pedagogId}/kurset`),
  getOrari: (pedagogId) => axiosInstance.get(`/api/v1/pedagogat/${pedagogId}/orari`),
  postNota: (payload) => axiosInstance.post('/api/v1/notat', payload),
};
