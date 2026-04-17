import { Alert, Card, Col, Row, Statistic, Typography } from 'antd';
import { BookOutlined, EuroOutlined, FileTextOutlined } from '@ant-design/icons';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useAuth } from '@/hooks/useAuth';
import { useApi } from '@/hooks/useApi';
import { studentService } from '@/services/studentService';

const { Title, Text } = Typography;

export default function BallinaStudentPage() {
  usePageTitle('Ballina');
  const { user } = useAuth();

  const { data: gradesData, loading: gradesLoading } = useApi(() => studentService.getGrades(), []);
  const { data: invoicesData, loading: invoicesLoading } = useApi(
    () => studentService.getInvoices(),
    []
  );

  const grades = gradesData?.data ?? [];
  const invoices = invoicesData?.data ?? [];
  const unpaidCount = invoices.filter((i) => i.status !== 'E paguar').length;
  const avgGrade = grades.length
    ? (grades.reduce((sum, g) => sum + g.value, 0) / grades.length).toFixed(1)
    : null;

  return (
    <div>
      <Title level={4}>Mirë se vini, {user?.name}!</Title>
      <Text type="secondary">Portali Studentor — UAMD</Text>

      {unpaidCount > 0 && (
        <Alert
          style={{ marginTop: 16, marginBottom: 16 }}
          type="warning"
          showIcon
          message={`Keni ${unpaidCount} faturë të papaguar.`}
        />
      )}

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Notat totale"
              value={gradesLoading ? '—' : grades.length}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Mesatarja"
              value={gradesLoading ? '—' : (avgGrade ?? 'N/A')}
              prefix={<BookOutlined />}
              suffix={avgGrade ? ' / 10' : ''}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Fatura të papaguara"
              value={invoicesLoading ? '—' : unpaidCount}
              prefix={<EuroOutlined />}
              valueStyle={unpaidCount > 0 ? { color: '#cf1322' } : undefined}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
