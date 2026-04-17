import { Card, Col, Row, Statistic, Typography } from 'antd';
import { ApartmentOutlined, BookOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useAuth } from '@/hooks/useAuth';
import { useApi } from '@/hooks/useApi';
import { adminService } from '@/services/adminService';

const { Title, Text } = Typography;

export default function BallinaAdminPage() {
  usePageTitle('Ballina');
  const { user } = useAuth();

  const { data: facData, loading: facLoading } = useApi(() => adminService.getFaculties(), []);
  const { data: depData, loading: depLoading } = useApi(() => adminService.getDepartments(), []);
  const { data: pedData, loading: pedLoading } = useApi(() => adminService.getPedagogues(), []);
  const { data: crsData, loading: crsLoading } = useApi(() => adminService.getCourses(), []);

  return (
    <div>
      <Title level={4}>Mirë se vini, {user?.emri}!</Title>
      <Text type="secondary">Paneli i Administratorit — UAMD</Text>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Fakultete"
              value={facLoading ? '—' : (facData?.data?.length ?? 0)}
              prefix={<ApartmentOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Departamente"
              value={depLoading ? '—' : (depData?.data?.length ?? 0)}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pedagogë"
              value={pedLoading ? '—' : (pedData?.data?.length ?? 0)}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Lëndë"
              value={crsLoading ? '—' : (crsData?.data?.length ?? 0)}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
