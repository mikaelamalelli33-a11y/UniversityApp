import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { canAccess, getRoleDefaultRoute } from '@/router/roleGuards';
import LoadingSpinner from './LoadingSpinner';

/**
 * Wraps a route to enforce authentication and optional role-based access.
 *
 * Usage:
 *   <ProtectedRoute allowedRoles={['admin', 'student']}>
 *     <StudentLayout />
 *   </ProtectedRoute>
 */
export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner fullPage />;
  }

  // Not logged in — redirect to login and remember where they came from
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but wrong role — redirect to their default route
  if (!canAccess(user?.role, allowedRoles)) {
    return <Navigate to={getRoleDefaultRoute(user?.role)} replace />;
  }

  return children;
}
