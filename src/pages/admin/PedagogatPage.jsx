import { Input, Select, Space, Table, Tag, Typography } from 'antd';
import { useState } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useApi } from '@/hooks/useApi';
import { adminService } from '@/services/adminService';

const { Title } = Typography;
const { Search } = Input;

const columns = [
  {
    title: 'Emri',
    key: 'name',
    render: (_, r) => `${r.title ? r.title + ' ' : ''}${r.firstName} ${r.lastName}`,
  },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  {
    title: 'Gjinia',
    dataIndex: 'gender',
    key: 'gender',
    render: (val) => (
      <Tag color={val === 'M' ? 'blue' : 'pink'}>{val === 'M' ? 'Mashkull' : 'Femër'}</Tag>
    ),
    width: 100,
  },
  { title: 'ID Departamenti', dataIndex: 'departmentId', key: 'departmentId', width: 160 },
];

export default function PedagogatPage() {
  usePageTitle('Pedagogët');
  const [search, setSearch] = useState('');
  const [depFilter, setDepFilter] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  const fieldToBackend = { name: 'PED_EMER', email: 'PED_MBIEMER' };

  const { data: pedData, loading } = useApi(
    () => adminService.getPedagogues({ page, perPage, sortBy, sortOrder }),
    [page, perPage, sortBy, sortOrder]
  );
  const { data: depData } = useApi(() => adminService.getDepartments(), []);

  const pedagogues = pedData?.data ?? [];
  const pagination = pedData?.pagination ?? {};
  const departments = depData?.data ?? [];

  const filtered = pedagogues.filter((p) => {
    const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
    const matchSearch =
      fullName.includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase());
    const matchDep = depFilter ? p.departmentId === depFilter : true;
    return matchSearch && matchDep;
  });

  const handleTableChange = (_, __, sorter) => {
    setPage(1);
    if (sorter.field) {
      setSortBy(fieldToBackend[sorter.field]);
      setSortOrder(sorter.order === 'descend' ? 'desc' : 'asc');
    } else {
      setSortBy(null);
      setSortOrder('asc');
    }
  };

  return (
    <div>
      <Title level={4}>Pedagogët</Title>
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Kërko pedagog..."
          allowClear
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 240 }}
        />
        <Select
          placeholder="Filtro sipas departamentit"
          allowClear
          style={{ width: 220 }}
          onChange={setDepFilter}
          options={departments.map((d) => ({ value: d.id, label: d.name }))}
        />
      </Space>
      <Table
        columns={columns}
        dataSource={filtered}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: (p, ps) => {
            setPage(p);
            setPerPage(ps);
          },
        }}
        onChange={handleTableChange}
      />
    </div>
  );
}
