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

// ─── Lazy imports ─────────────────────────────────────────────────────────────
// Each page is loaded only when the user first navigates to it.
// Vite automatically splits each lazy() call into its own JS chunk.
//
// HOW TO ADD A NEW PAGE:
//   1. Add the path to router/routes.js
//   2. Add the menu entry to router/menuConfig.jsx  (if it needs a sidebar item)
//   3. Create the page component in pages/<role>/YourPage.jsx
//   4. Add a lazy() import below in the correct role section
//   5. Register the route in the router array below, under the correct portal
//
// PATTERN:
//   const MyPage = lazy(() => import('@/pages/<role>/MyPage'));

// Auth
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));

// Student pages
const BallinaStudentPage = lazy(() => import('@/pages/student/BallinaPage'));
const NotatPage = lazy(() => import('@/pages/student/NotatPage'));
const OrariStudentPage = lazy(() => import('@/pages/student/OrariPage'));

// Pedagog pages
const BallinaPedagogPage = lazy(() => import('@/pages/pedagog/BallinaPage'));
const KursetPage = lazy(() => import('@/pages/pedagog/KursetPage'));
const OrariPedagogPage = lazy(() => import('@/pages/pedagog/OrariPage'));

// Admin pages
const BallinaAdminPage = lazy(() => import('@/pages/admin/BallinaPage'));
const StudentatPage = lazy(() => import('@/pages/admin/StudentatPage'));
const PedagogatPage = lazy(() => import('@/pages/admin/PedagogatPage'));
const LendetPage = lazy(() => import('@/pages/admin/LendetPage'));
const RaportetPage = lazy(() => import('@/pages/admin/RaportetPage'));

// ─── Router ───────────────────────────────────────────────────────────────────
// Parent paths use ROUTES constants (full path, e.g. '/student').
// Child paths are relative segments only (e.g. 'notat', not '/student/notat').
// React Router joins them automatically — do NOT use ROUTES constants for children.

const router = createBrowserRouter([
  // TODO: when public pages are built, replace this redirect with PublicLayout at ROUTES.HOME
  { path: ROUTES.HOME, element: <Navigate to={ROUTES.STUDENT.ROOT} replace /> },
  { path: ROUTES.LOGIN, element: <LoginPage /> },

  // Public section — Lajme, Akademia, UAMD info (no auth required)
  // Add public page children here as they are built
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
      { index: true, element: <BallinaStudentPage /> }, // renders at /student
      { path: 'notat', element: <NotatPage /> }, // renders at /student/notat
      { path: 'orari', element: <OrariStudentPage /> }, // renders at /student/orari
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
      { path: 'kurset', element: <KursetPage /> },
      { path: 'orari', element: <OrariPedagogPage /> },
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
    ],
  },

  { path: '*', element: <NotFound /> },
]);

// ─── App Router ───────────────────────────────────────────────────────────────
// Suspense shows a loading spinner while a lazy page chunk is being downloaded.
// This is the only Suspense boundary needed — it covers the entire app.

export default function AppRouter() {
  return (
    <Suspense fallback={<LoadingSpinner fullPage />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
