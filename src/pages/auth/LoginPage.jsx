import { Button, Space, Card, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { ROLE_DEFAULT_ROUTES } from '@/router/routes';
import { ROLES } from '@/utils/constants';

const { Title, Text } = Typography;

// DEV ONLY — simulates login per role without a real API call.
// Replace this entire file once the real login form is built.
const DEV_USERS = {
  [ROLES.STUDENT]: { id: 1, emri: 'Andi', mbiemri: 'Marku', role: ROLES.STUDENT },
  [ROLES.PEDAGOG]: { id: 2, emri: 'Prof. Genta', mbiemri: 'Hoxha', role: ROLES.PEDAGOG },
  [ROLES.ADMIN]: { id: 3, emri: 'Admin', mbiemri: 'UAMD', role: ROLES.ADMIN },
};

export default function LoginPage() {
  const navigate = useNavigate();
  const simulateLogin = (role) => {
    useAuthStore.setState({
      user: DEV_USERS[role],
      accessToken: 'dev-token',
      isAuthenticated: true,
    });
    navigate(ROLE_DEFAULT_ROUTES[role]);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f0f2f5',
      }}
    >
      <Card style={{ width: 360, textAlign: 'center' }}>
        <Title level={3}>UAMD</Title>
        <Text type="secondary">Dev login — zgjedh rolin për testim</Text>
        <Space direction="vertical" style={{ width: '100%', marginTop: 24 }}>
          <Button block type="primary" onClick={() => simulateLogin(ROLES.STUDENT)}>
            Hyr si Student
          </Button>
          <Button block onClick={() => simulateLogin(ROLES.PEDAGOG)}>
            Hyr si Pedagog
          </Button>
          <Button block danger onClick={() => simulateLogin(ROLES.ADMIN)}>
            Hyr si Admin
          </Button>
        </Space>
      </Card>
    </div>
  );
}
