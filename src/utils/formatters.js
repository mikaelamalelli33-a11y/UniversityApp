import dayjs from 'dayjs';
import 'dayjs/locale/sq';

dayjs.locale('sq');

export const formatDate = (date, format = 'DD/MM/YYYY') => {
  if (!date) return '-';
  return dayjs(date).format(format);
};

export const formatDateTime = (date) => {
  if (!date) return '-';
  return dayjs(date).format('DD/MM/YYYY HH:mm');
};

export const formatGrade = (value) => {
  if (value === null || value === undefined) return '-';
  return Number(value).toFixed(2);
};
