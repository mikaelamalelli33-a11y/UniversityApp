import { Col, Row, Card, Statistic, Typography, Divider } from 'antd';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useApi } from '@/hooks/useApi';
import { adminService } from '@/services/adminService';

const { Title, Text } = Typography;

export default function RaportetPage() {
  usePageTitle('Raportet');

  const { data: facData, loading: facLoading } = useApi(() => adminService.getFaculties(), []);
  const { data: depData, loading: depLoading } = useApi(() => adminService.getDepartments(), []);
  const { data: pedData, loading: pedLoading } = useApi(() => adminService.getPedagogues(), []);
  const { data: crsData, loading: crsLoading } = useApi(() => adminService.getCourses(), []);
  const { data: prgData, loading: prgLoading } = useApi(() => adminService.getPrograms(), []);

  const faculties = facData?.data ?? [];
  const departments = depData?.data ?? [];
  const pedagogues = pedData?.data ?? [];
  const courses = crsData?.data ?? [];
  const programs = prgData?.data ?? [];

  return (
    <div>
      <Title level={4}>Raportet e Universitetit</Title>
      <Text type="secondary">Pasqyrë e të dhënave aktuale</Text>

      <Divider orientation="left">Struktura akademike</Divider>
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic title="Fakultete" value={facLoading ? '—' : faculties.length} />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic title="Departamente" value={depLoading ? '—' : departments.length} />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic title="Programe" value={prgLoading ? '—' : programs.length} />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic title="Lëndë" value={crsLoading ? '—' : courses.length} />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic title="Pedagogë" value={pedLoading ? '—' : pedagogues.length} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
