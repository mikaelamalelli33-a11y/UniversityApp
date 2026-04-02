import { useAuthStore } from '@/store/authStore';
import { ROLES } from '@/utils/constants';

/* Hook to get the current user's role and role-based flags */
export const useRole = () => {
  const user = useAuthStore((s) => s.user);
  const role = user?.role ?? null;

  return {
    role,
    isAdmin: role === ROLES.ADMIN,
    isPedagogu: role === ROLES.PEDAGOG,
    isStudent: role === ROLES.STUDENT,
  };
};
