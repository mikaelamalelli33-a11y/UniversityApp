import { ROLES } from '@/utils/constants';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  AUTH_CALLBACK: '/auth/callback',

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
    PROFILI: '/student/profili',
  },

  PEDAGOG: {
    ROOT: '/pedagog',
    RAPORTET: '/pedagog/raportet',
    ORARI: '/pedagog/orari',
    PROFILI: '/pedagog/profili',
  },

  ADMIN: {
    ROOT: '/admin',
    STUDENTAT: '/admin/studentat',
    PEDAGOGAT: '/admin/pedagogat',
    LENDET: '/admin/lendet',
    RAPORTET: '/admin/raportet',
    NJOFTIMET: '/admin/njoftimet',
    PROFILI: '/admin/profili',
  },
};

export const ROLE_DEFAULT_ROUTES = {
  [ROLES.ADMIN]: ROUTES.ADMIN.ROOT,
  [ROLES.PEDAGOG]: ROUTES.PEDAGOG.ROOT,
  [ROLES.STUDENT]: ROUTES.STUDENT.ROOT,
};
