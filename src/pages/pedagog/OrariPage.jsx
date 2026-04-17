import { Table, Typography, Tag } from 'antd';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useApi } from '@/hooks/useApi';
import { pedagogService } from '@/services/pedagogService';

const { Title } = Typography;

const dayLabels = {
  E_HENE: 'E Hënë',
  E_MARTE: 'E Martë',
  E_MERKURE: 'E Mërkurë',
  E_ENJTE: 'E Enjte',
  E_PREMTE: 'E Premte',
};

const dayOrder = ['E_HENE', 'E_MARTE', 'E_MERKURE', 'E_ENJTE', 'E_PREMTE'];

const columns = [
  {
    title: 'Dita',
    dataIndex: 'day',
    key: 'day',
    render: (val) => <Tag color="blue">{dayLabels[val] ?? val}</Tag>,
    sorter: (a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day),
    defaultSortOrder: 'ascend',
  },
  { title: 'Lënda', dataIndex: 'course', key: 'course' },
  { title: 'Ora fillimit', dataIndex: 'timeStart', key: 'timeStart' },
  { title: 'Ora mbarimit', dataIndex: 'timeEnd', key: 'timeEnd' },
];

export default function OrariPedagogPage() {
  usePageTitle('Orari');

  const { data, loading } = useApi(() => pedagogService.getSections(), []);
  const sections = data?.data ?? [];

  return (
    <div>
      <Title level={4}>Orari im</Title>
      <Table
        columns={columns}
        dataSource={sections}
        rowKey="id"
        loading={loading}
        pagination={false}
      />
    </div>
  );
}
