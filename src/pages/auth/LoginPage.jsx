import { useState } from 'react';
import { Button, Space, Card, Typography, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { ROLE_DEFAULT_ROUTES } from '@/router/routes';
import { ROLES } from '@/utils/constants';
import axiosInstance from '@/services/axiosInstance';

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
  const [apiStatus, setApiStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const simulateLogin = (role) => {
    useAuthStore.setState({
      user: DEV_USERS[role],
      accessToken: 'dev-token',
      isAuthenticated: true,
    });
    navigate(ROLE_DEFAULT_ROUTES[role]);
  };

  const testApi = async () => {
    setLoading(true);
    setApiStatus(null);
    try {
      const res = await axiosInstance.get('/api/v1/faculties');
      setApiStatus({
        type: 'success',
        message: `✅ API works — ${res.data.length} faculties returned`,
      });
    } catch (err) {
      setApiStatus({ type: 'error', message: `❌ ${err.response?.data?.message || err.message}` });
    } finally {
      setLoading(false);
    }
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
          <Button block type="dashed" loading={loading} onClick={testApi}>
            Test API connection
          </Button>
          {apiStatus && <Alert message={apiStatus.message} type={apiStatus.type} showIcon />}
        </Space>
      </Card>
    </div>
  );
}
