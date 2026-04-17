import { Card, Col, Row, Statistic, Typography } from 'antd';
import { BookOutlined, ScheduleOutlined } from '@ant-design/icons';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useAuth } from '@/hooks/useAuth';
import { useApi } from '@/hooks/useApi';
import { pedagogService } from '@/services/pedagogService';

const { Title, Text } = Typography;

export default function BallinaPedagogPage() {
  usePageTitle('Ballina');
  const { user } = useAuth();

  const { data, loading } = useApi(() => pedagogService.getSections(), []);
  const sections = data?.data ?? [];
  const uniqueCourses = new Set(sections.map((s) => s.courseId)).size;

  return (
    <div>
      <Title level={4}>Mirë se vini, {user?.name}!</Title>
      <Text type="secondary">Portali i Pedagogut — UAMD</Text>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Seksione aktive"
              value={loading ? '—' : sections.length}
              prefix={<ScheduleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Lëndë të ndryshme"
              value={loading ? '—' : uniqueCourses}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
