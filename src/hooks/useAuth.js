import { useAuthStore } from '@/store/authStore';

// Convenience hook — wraps authStore selectors so components
// don't need to import the store directly.
export const useAuth = () => {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);

  return { user, isAuthenticated, isLoading, login, logout };
};
