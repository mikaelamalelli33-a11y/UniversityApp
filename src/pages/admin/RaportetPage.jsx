import { Col, Row, Card, Statistic, Typography, Divider, Table, Tag } from 'antd';
import {
  BankOutlined,
  ApartmentOutlined,
  BookOutlined,
  ReadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useApi } from '@/hooks/useApi';
import { adminService } from '@/services/adminService';

const { Title, Text } = Typography;

const levelColors = {
  '2-Vjecar': 'orange',
  Bachelor: 'blue',
  Master: 'purple',
};

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

  // Programs grouped by level
  const programsByLevel = programs.reduce((acc, p) => {
    acc[p.level] = (acc[p.level] || 0) + 1;
    return acc;
  }, {});

  // Departments per faculty
  const depsPerFaculty = departments.reduce((acc, d) => {
    acc[d.facultyId] = (acc[d.facultyId] || 0) + 1;
    return acc;
  }, {});

  // Pedagogues per department
  const pedsPerDep = pedagogues.reduce((acc, p) => {
    acc[p.departmentId] = (acc[p.departmentId] || 0) + 1;
    return acc;
  }, {});

  // Courses per department
  const coursesPerDep = courses.reduce((acc, c) => {
    acc[c.departmentId] = (acc[c.departmentId] || 0) + 1;
    return acc;
  }, {});

  const depMap = Object.fromEntries(departments.map((d) => [d.id, d.name]));

  // Faculty table
  const facultyColumns = [
    { title: 'Fakulteti', dataIndex: 'name', key: 'name' },
    {
      title: 'Departamente',
      key: 'deps',
      render: (_, r) => depsPerFaculty[r.id] ?? 0,
      sorter: (a, b) => (depsPerFaculty[a.id] ?? 0) - (depsPerFaculty[b.id] ?? 0),
    },
  ];

  // Department table
  const departmentColumns = [
    { title: 'Departamenti', dataIndex: 'name', key: 'name' },
    {
      title: 'Pedagogë',
      key: 'peds',
      render: (_, r) => pedsPerDep[r.id] ?? 0,
      sorter: (a, b) => (pedsPerDep[a.id] ?? 0) - (pedsPerDep[b.id] ?? 0),
    },
    {
      title: 'Lëndë',
      key: 'courses',
      render: (_, r) => coursesPerDep[r.id] ?? 0,
      sorter: (a, b) => (coursesPerDep[a.id] ?? 0) - (coursesPerDep[b.id] ?? 0),
    },
  ];

  // Programs table
  const programColumns = [
    { title: 'Programi', dataIndex: 'name', key: 'name' },
    {
      title: 'Niveli',
      dataIndex: 'level',
      key: 'level',
      render: (val) => <Tag color={levelColors[val] ?? 'default'}>{val}</Tag>,
      filters: Object.keys(programsByLevel).map((l) => ({ text: l, value: l })),
      onFilter: (value, record) => record.level === value,
    },
    {
      title: 'Kredite',
      dataIndex: 'credits',
      key: 'credits',
      sorter: (a, b) => a.credits - b.credits,
    },
    {
      title: 'Departamenti',
      key: 'dep',
      render: (_, r) => depMap[r.departmentId] ?? '—',
    },
  ];

  return (
    <div>
      <Title level={4}>Raportet e Universitetit</Title>
      <Text type="secondary">Pasqyrë e përgjithshme e të dhënave akademike</Text>

      {/* Summary cards */}
      <Divider orientation="left">Përmbledhje</Divider>
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic
              title="Fakultete"
              value={facLoading ? '—' : faculties.length}
              prefix={<BankOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic
              title="Departamente"
              value={depLoading ? '—' : departments.length}
              prefix={<ApartmentOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic
              title="Programe"
              value={prgLoading ? '—' : programs.length}
              prefix={<ReadOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic
              title="Lëndë"
              value={crsLoading ? '—' : courses.length}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic
              title="Pedagogë"
              value={pedLoading ? '—' : pedagogues.length}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        {Object.entries(programsByLevel).map(([level, count]) => (
          <Col xs={12} sm={8} lg={4} key={level}>
            <Card>
              <Statistic
                title={level}
                value={count}
                valueStyle={{
                  color:
                    levelColors[level] === 'blue'
                      ? '#1677ff'
                      : levelColors[level] === 'purple'
                        ? '#722ed1'
                        : '#fa8c16',
                }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Faculties breakdown */}
      <Divider orientation="left">Fakultetet</Divider>
      <Table
        columns={facultyColumns}
        dataSource={faculties}
        rowKey="id"
        loading={facLoading}
        pagination={false}
        size="small"
      />

      {/* Departments breakdown */}
      <Divider orientation="left">Departamentet</Divider>
      <Table
        columns={departmentColumns}
        dataSource={departments}
        rowKey="id"
        loading={depLoading}
        pagination={false}
        size="small"
      />

      {/* Programs breakdown */}
      <Divider orientation="left">Programet e studimit</Divider>
      <Table
        columns={programColumns}
        dataSource={programs}
        rowKey="id"
        loading={prgLoading}
        pagination={{ pageSize: 10 }}
        size="small"
      />
    </div>
  );
}
