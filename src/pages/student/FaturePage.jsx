import { Table, Tag, Typography } from 'antd';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useApi } from '@/hooks/useApi';
import { studentService } from '@/services/studentService';

const { Title } = Typography;

const statusColor = (status) => {
  if (status === 'E paguar') return 'green';
  if (status === 'E anuluar') return 'default';
  return 'red';
};

const columns = [
  {
    title: 'Përshkrimi',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Shuma (ALL)',
    dataIndex: 'amount',
    key: 'amount',
    render: (val) => val.toLocaleString('sq-AL'),
    sorter: (a, b) => a.amount - b.amount,
  },
  {
    title: 'Statusi',
    dataIndex: 'status',
    key: 'status',
    render: (val) => <Tag color={statusColor(val)}>{val}</Tag>,
  },
  {
    title: 'Data lëshimit',
    dataIndex: 'issuedDate',
    key: 'issuedDate',
  },
];

export default function FaturePage() {
  usePageTitle('Faturat');

  const { data, loading } = useApi(() => studentService.getInvoices(), []);
  const invoices = data?.data ?? [];

  return (
    <div>
      <Title level={4}>Faturat e mia</Title>
      <Table
        columns={columns}
        dataSource={invoices}
        rowKey="invoiceId"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}
