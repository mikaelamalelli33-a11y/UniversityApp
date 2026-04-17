import { Table, Tag, Typography } from 'antd';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useApi } from '@/hooks/useApi';
import { studentService } from '@/services/studentService';

const { Title } = Typography;

const columns = [
  {
    title: 'Lënda',
    dataIndex: 'course',
    key: 'course',
  },
  {
    title: 'Nota',
    dataIndex: 'value',
    key: 'value',
    render: (val) => {
      const color = val >= 9 ? 'green' : val >= 6 ? 'blue' : 'red';
      return <Tag color={color}>{val}</Tag>;
    },
    sorter: (a, b) => a.value - b.value,
  },
  {
    title: 'Lloji provimit',
    dataIndex: 'examType',
    key: 'examType',
  },
  {
    title: 'Data provimit',
    dataIndex: 'examDate',
    key: 'examDate',
  },
  {
    title: 'Data notës',
    dataIndex: 'date',
    key: 'date',
  },
];

export default function NotatPage() {
  usePageTitle('Notat');

  const { data, loading } = useApi(() => studentService.getGrades(), []);
  const grades = data?.data ?? [];

  return (
    <div>
      <Title level={4}>Notat e mia</Title>
      <Table
        columns={columns}
        dataSource={grades}
        rowKey="gradeId"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}
