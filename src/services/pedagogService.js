import axiosInstance from './axiosInstance';

export const pedagogService = {
  getSections: () => axiosInstance.get('/pedagog/sections'),
  getSectionGrades: (sectionId) => axiosInstance.get(`/pedagog/sections/${sectionId}/grades`),
};
