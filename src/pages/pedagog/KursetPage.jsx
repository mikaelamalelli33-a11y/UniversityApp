import { useState } from 'react';
import { Card, Col, Row, Table, Tag, Typography, Button, Drawer } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useApi } from '@/hooks/useApi';
import { pedagogService } from '@/services/pedagogService';

const { Title, Text } = Typography;

const dayLabels = {
  E_HENE: 'E Hënë',
  E_MARTE: 'E Martë',
  E_MERKURE: 'E Mërkurë',
  E_ENJTE: 'E Enjte',
  E_PREMTE: 'E Premte',
};

const gradeColumns = [
  {
    title: 'Studenti',
    key: 'student',
    render: (_, r) => `${r.student.firstName} ${r.student.lastName}`,
  },
  { title: 'Nr. Matrikull', dataIndex: ['student', 'matriculationNumber'], key: 'mat' },
  {
    title: 'Nota',
    dataIndex: 'value',
    key: 'value',
    render: (val) => {
      const color = val >= 9 ? 'green' : val >= 6 ? 'blue' : 'red';
      return <Tag color={color}>{val}</Tag>;
    },
  },
  { title: 'Lloji', dataIndex: 'examType', key: 'examType' },
  { title: 'Data', dataIndex: 'date', key: 'date' },
];

function SectionGradesDrawer({ section, onClose }) {
  const { data, loading } = useApi(() => pedagogService.getSectionGrades(section.id), [section.id]);
  const grades = data?.data ?? [];

  return (
    <Drawer title={`Notat — ${section.course}`} open onClose={onClose} width={640}>
      <Table
        columns={gradeColumns}
        dataSource={grades}
        rowKey="gradeId"
        loading={loading}
        pagination={{ pageSize: 10 }}
        size="small"
      />
    </Drawer>
  );
}

export default function KursetPage() {
  usePageTitle('Kurset');
  const [selectedSection, setSelectedSection] = useState(null);

  const { data, loading } = useApi(() => pedagogService.getSections(), []);
  const sections = data?.data ?? [];

  return (
    <div>
      <Title level={4}>Seksionet e mia</Title>

      {loading ? (
        <Text type="secondary">Duke ngarkuar...</Text>
      ) : sections.length === 0 ? (
        <Text type="secondary">Nuk keni seksione të regjistruara.</Text>
      ) : (
        <Row gutter={[16, 16]}>
          {sections.map((s) => (
            <Col xs={24} sm={12} lg={8} key={s.id}>
              <Card
                title={s.course}
                extra={
                  <Button size="small" icon={<EyeOutlined />} onClick={() => setSelectedSection(s)}>
                    Notat
                  </Button>
                }
              >
                <Text>{dayLabels[s.day] ?? s.day}</Text>
                <br />
                <Text type="secondary">
                  {s.timeStart} — {s.timeEnd}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {selectedSection && (
        <SectionGradesDrawer section={selectedSection} onClose={() => setSelectedSection(null)} />
      )}
    </div>
  );
}
