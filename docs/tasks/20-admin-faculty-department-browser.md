# 20 — Admin: Faculty & Department Browser

> **Priority:** P3
> **Effort:** ~1.5h
> **Difficulty:** ⭐⭐⭐ regular
> **Branch:** `<yourname>/admin-faculties` (example: `ornela/admin-faculties`)
> **Depends on:** nothing — `adminService.getFaculties()` and `getDepartments()` already exist

---

## Goal

Add a **Fakultetet** page to the admin portal. It shows all 6 UAMD faculties as expandable rows — click a row to see the departments that belong to it. Also shows the total number of pedagogues per department using data already available.

This is a read-only reference page. No create/edit/delete yet (those come in a later task).

---

## Workflow

1. `git checkout main && git pull`
2. `git checkout -b <yourname>/admin-faculties`
3. Create the page, add route, add sidebar entry
4. `npm run dev` and verify
5. `npm run lint`
6. Commit: `feat: add admin faculties and departments browser`
7. Open PR against `main`, request review from `kristopapallazo`

---

## Step 1 — Create `src/pages/admin/FakultetetPage.jsx`

This page uses Ant Design's `Table` with **expandable rows**. The outer table lists faculties; expanding a row shows a nested table of departments.

```jsx
import { Table, Tag, Typography } from 'antd';
import { ApartmentOutlined } from '@ant-design/icons';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useApi } from '@/hooks/useApi';
import { adminService } from '@/services/adminService';

const { Title, Text } = Typography;

export default function FakultetetPage() {
  usePageTitle('Fakultetet');

  const { data: facData, loading: facLoading } = useApi(() => adminService.getFaculties(), []);
  const { data: depData }                       = useApi(() => adminService.getDepartments(), []);
  const { data: pedData }                       = useApi(() => adminService.getPedagogues(), []);

  const faculties   = facData?.data ?? [];
  const departments = depData?.data ?? [];
  const pedagogues  = pedData?.data ?? [];

  // Pre-group data to avoid filtering inside render
  const depsByFaculty = departments.reduce((acc, d) => {
    if (!acc[d.facultyId]) acc[d.facultyId] = [];
    acc[d.facultyId].push(d);
    return acc;
  }, {});

  const pedsByDep = pedagogues.reduce((acc, p) => {
    acc[p.departmentId] = (acc[p.departmentId] ?? 0) + 1;
    return acc;
  }, {});

  // ── Outer columns: Faculties ────────────────────────────────────
  const facultyColumns = [
    {
      title: 'Fakulteti',
      dataIndex: 'name',
      key: 'name',
      render: (name) => (
        <span>
          <ApartmentOutlined style={{ marginRight: 8, color: '#1677ff' }} />
          {name}
        </span>
      ),
    },
    {
      title: 'Departamente',
      key: 'depsCount',
      width: 140,
      render: (_, r) => (
        <Tag color="blue">{depsByFaculty[r.id]?.length ?? 0}</Tag>
      ),
    },
  ];

  // ── Inner columns: Departments (per faculty) ────────────────────
  const departmentColumns = [
    { title: 'Departamenti', dataIndex: 'name', key: 'name' },
    {
      title: 'Pedagogë',
      key: 'peds',
      width: 110,
      render: (_, r) => pedsByDep[r.id] ?? 0,
    },
  ];

  // ── Expandable row config ───────────────────────────────────────
  const expandable = {
    expandedRowRender: (faculty) => {
      const deps = depsByFaculty[faculty.id] ?? [];
      return deps.length === 0 ? (
        <Text type="secondary" style={{ paddingLeft: 48 }}>
          Nuk ka departamente.
        </Text>
      ) : (
        <Table
          columns={departmentColumns}
          dataSource={deps}
          rowKey="id"
          pagination={false}
          size="small"
          style={{ marginLeft: 48 }}
          showHeader={deps.length > 0}
        />
      );
    },
    rowExpandable: () => true,
  };

  return (
    <div>
      <Title level={4}>Fakultetet & Departamentet</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
        Klikoni një fakultet për të shfaqur departamentet e tij.
      </Text>
      <Table
        columns={facultyColumns}
        dataSource={faculties}
        rowKey="id"
        loading={facLoading}
        pagination={false}
        expandable={expandable}
      />
    </div>
  );
}
```

---

## Step 2 — Add constant to `src/router/routes.js`

```js
ADMIN: {
  ROOT:        '/admin',
  STUDENTAT:   '/admin/studentat',
  PEDAGOGAT:   '/admin/pedagogat',
  LENDET:      '/admin/lendet',
  PROGRAMET:   '/admin/programet',
  FAKULTETET:  '/admin/fakultetet',   // ← add this
  RAPORTET:    '/admin/raportet',
  NJOFTIMET:   '/admin/njoftimet',
  PROFILI:     '/admin/profili',
},
```

---

## Step 3 — Add lazy import + route in `src/router/index.jsx`

```js
const FakultetetPage = lazy(() => import('@/pages/admin/FakultetetPage'));
```

Inside the admin portal children:

```jsx
{ path: 'fakultetet', element: <FakultetetPage /> },
```

---

## Step 4 — Add sidebar entry in `src/router/menuConfig.jsx`

Add `BankOutlined` import if missing. Add the menu item between Studentat and Pedagogat:

```js
{ key: ROUTES.ADMIN.STUDENTAT,  icon: <TeamOutlined />,     label: 'Studentat' },
{ key: ROUTES.ADMIN.FAKULTETET, icon: <BankOutlined />,     label: 'Fakultetet' },  // ← add
{ key: ROUTES.ADMIN.PEDAGOGAT,  icon: <UserOutlined />,     label: 'Pedagogët' },
```

---

## How to verify

1. Log in as admin → Sidebar shows **Fakultetet**
2. Navigate to it → table lists all 6 faculties with department counts
3. Click the expand arrow on a faculty → departments appear in a nested table with pedagogue counts
4. A faculty with 0 departments shows the empty message

## Acceptance criteria

- [ ] All 6 faculties load and display
- [ ] Expanding a row shows the correct departments for that faculty
- [ ] Department rows show how many pedagogues belong to them
- [ ] Page works with no crashes if a faculty has no departments
- [ ] `npm run lint` passes
