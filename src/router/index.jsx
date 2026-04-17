import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import DashboardLayout from '@/layouts/DashboardLayout';
import PublicLayout from '@/layouts/PublicLayout';
import NotFound from '@/components/common/NotFound';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { ROUTES } from './routes';
import { MENU_CONFIG } from './menuConfig';
import { ROLES } from '@/utils/constants';

// Auth
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const OAuthCallbackPage = lazy(() => import('@/pages/auth/OAuthCallbackPage'));

// Shared
const ProfilePage = lazy(() => import('@/pages/shared/ProfilePage'));

// Student pages
const BallinaStudentPage = lazy(() => import('@/pages/student/BallinaPage'));
const NotatPage = lazy(() => import('@/pages/student/NotatPage'));
const FaturePage = lazy(() => import('@/pages/student/FaturePage'));
const OrariStudentPage = lazy(() => import('@/pages/student/OrariPage'));

// Pedagog pages
const BallinaPedagogPage = lazy(() => import('@/pages/pedagog/BallinaPage'));
const RaportetPedagogPage = lazy(() => import('@/pages/pedagog/KursetPage'));
const OrariPedagogPage = lazy(() => import('@/pages/pedagog/OrariPage'));

// Admin pages
const BallinaAdminPage = lazy(() => import('@/pages/admin/BallinaPage'));
const StudentatPage = lazy(() => import('@/pages/admin/StudentatPage'));
const PedagogatPage = lazy(() => import('@/pages/admin/PedagogatPage'));
const LendetPage = lazy(() => import('@/pages/admin/LendetPage'));
const RaportetPage = lazy(() => import('@/pages/admin/RaportetPage'));
const NjoftimetPage = lazy(() => import('@/pages/admin/NjoftimetPage'));

const router = createBrowserRouter([
  { path: ROUTES.HOME, element: <Navigate to={ROUTES.LOGIN} replace /> },
  { path: ROUTES.LOGIN, element: <LoginPage /> },
  { path: ROUTES.AUTH_CALLBACK, element: <OAuthCallbackPage /> },

  {
    path: ROUTES.PUBLIC.ROOT,
    element: <PublicLayout />,
    children: [],
  },

  // Student portal
  {
    path: ROUTES.STUDENT.ROOT,
    element: (
      <ProtectedRoute allowedRoles={[ROLES.STUDENT, ROLES.ADMIN]}>
        <DashboardLayout menuItems={MENU_CONFIG.student} />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <BallinaStudentPage /> },
      { path: 'notat', element: <NotatPage /> },
      { path: 'fatura', element: <FaturePage /> },
      { path: 'orari', element: <OrariStudentPage /> },
      { path: 'profili', element: <ProfilePage /> },
    ],
  },

  // Pedagog portal
  {
    path: ROUTES.PEDAGOG.ROOT,
    element: (
      <ProtectedRoute allowedRoles={[ROLES.PEDAGOG, ROLES.ADMIN]}>
        <DashboardLayout menuItems={MENU_CONFIG.pedagog} />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <BallinaPedagogPage /> },
      { path: 'raportet', element: <RaportetPedagogPage /> },
      { path: 'orari', element: <OrariPedagogPage /> },
      { path: 'profili', element: <ProfilePage /> },
    ],
  },

  // Admin dashboard
  {
    path: ROUTES.ADMIN.ROOT,
    element: (
      <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
        <DashboardLayout menuItems={MENU_CONFIG.admin} />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <BallinaAdminPage /> },
      { path: 'studentat', element: <StudentatPage /> },
      { path: 'pedagogat', element: <PedagogatPage /> },
      { path: 'lendet', element: <LendetPage /> },
      { path: 'raportet', element: <RaportetPage /> },
      { path: 'njoftimet', element: <NjoftimetPage /> },
      { path: 'profili', element: <ProfilePage /> },
    ],
  },

  { path: '*', element: <NotFound /> },
]);

export default function AppRouter() {
  return (
    <Suspense fallback={<LoadingSpinner fullPage />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
