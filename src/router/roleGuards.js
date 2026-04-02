import { ROUTES, ROLE_DEFAULT_ROUTES } from '@/router/routes';

export const getRoleDefaultRoute = (role) => {
  return ROLE_DEFAULT_ROUTES[role] ?? ROUTES.LOGIN;
};

export const canAccess = (userRole, allowedRoles) => {
  if (!allowedRoles || allowedRoles.length === 0) return true;
  return allowedRoles.includes(userRole);
};
