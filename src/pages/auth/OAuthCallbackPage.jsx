import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Spin, Typography } from 'antd';
import { useAuthStore } from '@/store/authStore';
import { ROLE_DEFAULT_ROUTES, ROUTES } from '@/router/routes';

const { Text } = Typography;

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const loginWithToken = useAuthStore((s) => s.loginWithToken);
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const token = searchParams.get('token');

    if (!token) {
      navigate(`${ROUTES.LOGIN}?error=oauth_failed`, { replace: true });
      return;
    }

    loginWithToken(token)
      .then((user) => {
        navigate(ROLE_DEFAULT_ROUTES[user.role] ?? ROUTES.STUDENT.ROOT, { replace: true });
      })
      .catch(() => {
        navigate(`${ROUTES.LOGIN}?error=oauth_failed`, { replace: true });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 16,
      }}
    >
      <Spin size="large" />
      <Text type="secondary">Duke u autentikuar...</Text>
    </div>
  );
}
