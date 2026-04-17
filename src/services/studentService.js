import axiosInstance from './axiosInstance';

export const studentService = {
  getGrades: () => axiosInstance.get('/student/grades'),
  getInvoices: () => axiosInstance.get('/student/invoices'),
};
