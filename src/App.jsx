import { useEffect } from 'react';
import { ConfigProvider, App as AntdApp } from 'antd';
import AppRouter from '@/router';
import { antdTheme } from '@/config/antdTheme';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { useAuthStore } from '@/store/authStore';
import '@/assets/styles/global.css';

export default function App() {
  const initializeAuth = useAuthStore((s) => s.initializeAuth);

  // On every page load, check if a token exists in storage and restore the session.
  // Without this, users are logged out on every refresh.
  // initializeAuth sets isLoading=true while it runs — ProtectedRoute shows a
  // spinner until it resolves, then either restores the session or redirects to login.
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <ErrorBoundary>
      <ConfigProvider theme={antdTheme}>
        <AntdApp>
          <AppRouter />
        </AntdApp>
      </ConfigProvider>
    </ErrorBoundary>
  );
}
