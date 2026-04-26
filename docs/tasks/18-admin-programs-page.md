# 18 — Admin: Programs Page

> **Priority:** P2 — no blockers
> **Effort:** ~30 min
> **Difficulty:** ⭐ beginner
> **Branch:** `<yourname>/admin-programs` (example: `ornela/admin-programs`)
> **Depends on:** nothing — `adminService.getPrograms()` already exists

---

## Goal

Add a **Programet** (study programs) page to the admin portal. Students and pedagogues can see what programs exist, but only admins have this overview table.

You will copy the exact pattern from `src/pages/admin/LendetPage.jsx` and wire it into the router and sidebar. The API call (`adminService.getPrograms()`) already exists.

---

## Workflow

1. `git checkout main && git pull`
2. `git checkout -b <yourname>/admin-programs`
3. Create the page file, then wire the route, then add the sidebar entry — in that order
4. `npm run dev` and verify the page appears
5. `npm run lint`
6. Commit: `feat: add admin programs page`
7. Open PR against `main`, request review from `kristopapallazo`

---

## Step 1 — Create `src/pages/admin/ProgrametPage.jsx`

```jsx
import { Select, Space, Table, Tag, Typography } from 'antd';
import { useState } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useApi } from '@/hooks/useApi';
import { adminService } from '@/services/adminService';

const { Title } = Typography;

const levelColors = {
  Bachelor:     'blue',
  Master:       'purple',
  Doktorature:  'gold',
  '2-Vjecar':   'orange',
};

const columns = [
  { title: 'Emri', dataIndex: 'name', key: 'name', sorter: true },
  {
    title: 'Niveli',
    dataIndex: 'level',
    key: 'level',
    render: (val) => <Tag color={levelColors[val] ?? 'default'}>{val}</Tag>,
    width: 140,
  },
  { title: 'Kredite', dataIndex: 'credits', key: 'credits', width: 100, sorter: true },
  { title: 'Departamenti', key: 'dep', render: (_, r) => depMap[r.departmentId] ?? '—' },
];

// depMap is built in the component — column defined here to avoid re-creation on render
// The `depMap` reference below is resolved inside the component via closure

export default function ProgrametPage() {
  usePageTitle('Programet');
  const [levelFilter, setLevelFilter] = useState(null);

  const { data: prgData, loading } = useApi(() => adminService.getPrograms(), []);
  const { data: depData }           = useApi(() => adminService.getDepartments(), []);

  const programs    = prgData?.data ?? [];
  const departments = depData?.data ?? [];
  const depMap      = Object.fromEntries(departments.map((d) => [d.id, d.name]));

  const filtered = levelFilter
    ? programs.filter((p) => p.level === levelFilter)
    : programs;

  return (
    <div>
      <Title level={4}>Programet e studimit</Title>
      <Space style={{ marginBottom: 16 }}>
        <Select
          placeholder="Filtro sipas nivelit"
          allowClear
          style={{ width: 200 }}
          onChange={setLevelFilter}
          options={[
            { value: 'Bachelor',    label: 'Bachelor' },
            { value: 'Master',      label: 'Master' },
            { value: 'Doktorature', label: 'Doktoraturë' },
            { value: '2-Vjecar',    label: '2-vjeçar' },
          ]}
        />
      </Space>
      <Table
        columns={columns}
        dataSource={filtered}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 15 }}
      />
    </div>
  );
}
```

> **Note on `depMap` in columns:** The `columns` array is defined outside the component to avoid re-creating it on every render, but `depMap` must come from inside the component (because it depends on fetched data). The `render: (_, r) => depMap[r.departmentId] ?? '—'` closure captures `depMap` from the component scope. Move the `columns` array **inside** the component if ESLint warns about `depMap` being undefined — that's fine for a page this size.

---

## Step 2 — Add route in `src/router/index.jsx`

**2a.** Add the lazy import alongside the other admin page imports:

```js
const ProgrametPage = lazy(() => import('@/pages/admin/ProgrametPage'));
```

**2b.** Add the route inside the admin portal's `children` array:

```jsx
{ path: 'programet', element: <ProgrametPage /> },
```

---

## Step 3 — Add constant in `src/router/routes.js`

Inside `ROUTES.ADMIN`, add:

```js
ADMIN: {
  ROOT:       '/admin',
  STUDENTAT:  '/admin/studentat',
  PEDAGOGAT:  '/admin/pedagogat',
  LENDET:     '/admin/lendet',
  PROGRAMET:  '/admin/programet',   // ← add this
  RAPORTET:   '/admin/raportet',
  NJOFTIMET:  '/admin/njoftimet',
  PROFILI:    '/admin/profili',
},
```

---

## Step 4 — Add sidebar entry in `src/router/menuConfig.jsx`

Add `ReadOutlined` to the imports (if not already there):

```js
import {
  // … existing …
  ReadOutlined,   // ← add if missing
} from '@ant-design/icons';
```

Add to the `admin` menu array, between Lëndët and Raportet:

```js
{ key: ROUTES.ADMIN.LENDET,    icon: <BookOutlined />,    label: 'Lëndët' },
{ key: ROUTES.ADMIN.PROGRAMET, icon: <ReadOutlined />,    label: 'Programet' },  // ← add
{ key: ROUTES.ADMIN.RAPORTET,  icon: <BarChartOutlined />, label: 'Raportet' },
```

---

## How to verify

1. `npm run dev`, log in as admin
2. Sidebar now shows **Programet** with a book icon
3. Click it — table loads with program names, levels (as colored tags), credits, and department names
4. Level filter works — selecting "Bachelor" shows only Bachelor programs

## Acceptance criteria

- [ ] `/admin/programet` loads a table of all programs
- [ ] Level column shows colored tags (Bachelor = blue, Master = purple, etc.)
- [ ] Department column shows name, not raw ID
- [ ] Level filter dropdown works
- [ ] "Programet" appears in the admin sidebar
- [ ] `npm run lint` passes
