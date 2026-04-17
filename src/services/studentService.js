import axiosInstance from './axiosInstance';

export const studentService = {
  getGrades: () => axiosInstance.get('/api/v1/student/grades'),
  getInvoices: () => axiosInstance.get('/api/v1/student/invoices'),
};
