# 19 — Admin: Students List Page

> **Priority:** P2
> **Effort:** ~1.5h
> **Difficulty:** ⭐⭐⭐ regular
> **Branch:** `<yourname>/admin-students` (example: `ornela/admin-students`)
> **Depends on:** BE task 11 merged (`GET /api/v1/admin/students` must exist)

---

## Goal

Replace the `StudentatPage` placeholder with a real, searchable list of students. The page shows all students in a paginated table, lets the admin search by name or matrikull number, and filter by status.

Before starting: run `curl -s -H "Authorization: Bearer <token>" http://localhost:8000/api/v1/admin/students | jq .` to confirm the BE endpoint is live and see the exact response shape.

---

## Workflow

1. `git checkout main && git pull` (after BE task 11 is merged)
2. `git checkout -b <yourname>/admin-students`
3. Update `adminService.js`, then rewrite `StudentatPage.jsx`
4. `npm run dev`, full manual test
5. `npm run lint`
6. Commit: `feat: wire admin students list page`
7. Open PR against `main`, request review from `kristopapallazo`

---

## Step 1 — Add method to `src/services/adminService.js`

```js
getStudents: (params) => axiosInstance.get('/api/v1/admin/students', { params }),
```

---

## Step 2 — Rewrite `src/pages/admin/StudentatPage.jsx`

**Response shape from the API (from BE task 11):**

```json
{
  "data": [
    {
      "id": 1,
      "firstName": "Test",
      "lastName": "Student",
      "fathersName": "Agim",
      "gender": "M",
      "birthDate": "2003-05-10",
      "matriculation": "2021010001",
      "email": "test.student@students.uamd.edu.al",
      "phone": null,
      "enrolledAt": "2021-10-01",
      "status": "Aktiv",
      "dormRoomId": null
    }
  ],
  "pagination": { "current": 1, "pageSize": 15, "total": 120 }
}
```

**Status values and colors:**

| Status           | Color   |
| ---------------- | ------- |
| `Aktiv`          | `green` |
| `Pezulluar`      | `orange`|
| `I diplomuar`    | `blue`  |
| `Ç'regjistruar`  | `red`   |

```jsx
import { Input, Select, Space, Table, Tag, Typography } from 'antd';
import { useState } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useApi } from '@/hooks/useApi';
import { adminService } from '@/services/adminService';

const { Title } = Typography;
const { Search } = Input;

const statusColor = {
  'Aktiv':         'green',
  'Pezulluar':     'orange',
  'I diplomuar':   'blue',
  "Ç'regjistruar": 'red',
};

const columns = [
  {
    title: 'Emri',
    key: 'name',
    render: (_, r) => `${r.firstName} ${r.lastName}`,
    sorter: true,
  },
  { title: 'Nr. Matrikull', dataIndex: 'matriculation', key: 'matriculation', width: 160 },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  {
    title: 'Gjinia',
    dataIndex: 'gender',
    key: 'gender',
    width: 90,
    render: (val) => <Tag color={val === 'M' ? 'blue' : 'pink'}>{val === 'M' ? 'Mashkull' : 'Femër'}</Tag>,
  },
  {
    title: 'Statusi',
    dataIndex: 'status',
    key: 'status',
    width: 130,
    render: (val) => <Tag color={statusColor[val] ?? 'default'}>{val}</Tag>,
  },
  { title: 'Regjistruar', dataIndex: 'enrolledAt', key: 'enrolledAt', width: 130 },
];

export default function StudentatPage() {
  usePageTitle('Studentat');

  const [search,    setSearch]    = useState('');
  const [status,    setStatus]    = useState(null);
  const [page,      setPage]      = useState(1);
  const [perPage,   setPerPage]   = useState(15);
  const [sortBy,    setSortBy]    = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  const { data, loading } = useApi(
    () => adminService.getStudents({ page, perPage, sortBy, sortOrder, status }),
    [page, perPage, sortBy, sortOrder, status]
  );

  const students   = data?.data ?? [];
  const pagination = data?.pagination ?? {};

  // Client-side search on the current page (name + matrikull)
  const filtered = search
    ? students.filter((s) => {
        const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
        return (
          fullName.includes(search.toLowerCase()) ||
          s.matriculation.toLowerCase().includes(search.toLowerCase())
        );
      })
    : students;

  const handleTableChange = (pag, _, sorter) => {
    setPage(pag.current);
    setPerPage(pag.pageSize);
    if (sorter.field) {
      setSortBy(sorter.field === 'name' ? 'STU_MB' : sorter.field);
      setSortOrder(sorter.order === 'descend' ? 'desc' : 'asc');
    } else {
      setSortBy(null);
    }
  };

  return (
    <div>
      <Title level={4}>Studentat</Title>
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Kërko me emër ose nr. matrikull..."
          allowClear
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          style={{ width: 280 }}
        />
        <Select
          placeholder="Filtro sipas statusit"
          allowClear
          style={{ width: 200 }}
          onChange={(val) => { setStatus(val); setPage(1); }}
          options={[
            { value: 'Aktiv',         label: 'Aktiv' },
            { value: 'Pezulluar',     label: 'Pezulluar' },
            { value: 'I diplomuar',   label: 'I diplomuar' },
            { value: "Ç'regjistruar", label: "Ç'regjistruar" },
          ]}
        />
      </Space>
      <Table
        columns={columns}
        dataSource={filtered}
        rowKey="id"
        loading={loading}
        pagination={{
          current:  pagination.current,
          pageSize: pagination.pageSize,
          total:    pagination.total,
          showSizeChanger: true,
          pageSizeOptions: ['15', '30', '50'],
          onChange: (p, ps) => { setPage(p); setPerPage(ps); },
        }}
        onChange={handleTableChange}
      />
    </div>
  );
}
```

---

## Acceptance criteria

- [ ] Table loads all students from `GET /api/v1/admin/students`
- [ ] Status filter (`?status=Aktiv`) reduces the list correctly
- [ ] Search by name or matrikull filters the current page
- [ ] Pagination controls (page + page size) work
- [ ] Status column shows colored tags
- [ ] `npm run lint` passes
