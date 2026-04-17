import axiosInstance from './axiosInstance';

export const pedagogService = {
  getSections: () => axiosInstance.get('/api/v1/pedagog/sections'),
  getSectionGrades: (sectionId) =>
    axiosInstance.get(`/api/v1/pedagog/sections/${sectionId}/grades`),
};
