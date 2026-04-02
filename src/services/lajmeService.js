import axiosInstance from './axiosInstance';

export const lajmeService = {
  getLajmet: (params) => axiosInstance.get('/api/v1/lajme', { params }),
  getLajmi: (id) => axiosInstance.get(`/api/v1/lajme/${id}`),
};
