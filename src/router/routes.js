import { ROLES } from '@/utils/constants';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',

  PUBLIC: {
    ROOT: '/public',
    LAJME: '/public/lajme',
    AKADEMIA: '/public/akademia',
  },

  STUDENT: {
    ROOT: '/student',
    NOTAT: '/student/notat',
    FATURA: '/student/fatura',
    ORARI: '/student/orari',
  },

  PEDAGOG: {
    ROOT: '/pedagog',
    KURSET: '/pedagog/kurset',
    ORARI: '/pedagog/orari',
  },

  ADMIN: {
    ROOT: '/admin',
    STUDENTAT: '/admin/studentat',
    PEDAGOGAT: '/admin/pedagogat',
    LENDET: '/admin/lendet',
    RAPORTET: '/admin/raportet',
    NJOFTIMET: '/admin/njoftimet',
  },
};

export const ROLE_DEFAULT_ROUTES = {
  [ROLES.ADMIN]: ROUTES.ADMIN.ROOT,
  [ROLES.PEDAGOG]: ROUTES.PEDAGOG.ROOT,
  [ROLES.STUDENT]: ROUTES.STUDENT.ROOT,
};
