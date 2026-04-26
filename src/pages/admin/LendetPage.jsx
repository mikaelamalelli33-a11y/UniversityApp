import { Input, Select, Space, Table, Typography } from 'antd';
import { useState } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useApi } from '@/hooks/useApi';
import { adminService } from '@/services/adminService';

const { Title } = Typography;
const { Search } = Input;

const columns = [
  { title: 'Kodi', dataIndex: 'code', key: 'code', width: 100, sorter: true },
  { title: 'Emri', dataIndex: 'name', key: 'name', sorter: true },
  { title: 'ID Departamenti', dataIndex: 'departmentId', key: 'departmentId', width: 160 },
];

export default function LendetPage() {
  usePageTitle('Lëndët');
  const [search, setSearch] = useState('');
  const [depFilter, setDepFilter] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  const fieldToBackend = { code: 'LEND_KOD', name: 'LEND_EM' };

  const { data: crsData, loading } = useApi(
    () => adminService.getCourses({ page, perPage, sortBy, sortOrder }),
    [page, perPage, sortBy, sortOrder]
  );
  const { data: depData } = useApi(() => adminService.getDepartments(), []);

  const courses = crsData?.data ?? [];
  const pagination = crsData?.pagination ?? {};
  const departments = depData?.data ?? [];

  const filtered = courses.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase());
    const matchDep = depFilter ? c.departmentId === depFilter : true;
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
      <Title level={4}>Lëndët</Title>
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Kërko lëndë..."
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
