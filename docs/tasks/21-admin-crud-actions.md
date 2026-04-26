# 21 — Admin: CRUD Actions on Pedagogat & Lendet Pages

> **Priority:** P3
> **Effort:** ~2h
> **Difficulty:** ⭐⭐⭐ regular
> **Branch:** `<yourname>/admin-crud-ui` (example: `ornela/admin-crud-ui`)
> **Depends on:** BE tasks 08 + 09 merged (write routes for faculties, departments, programs, pedagogues, courses must exist)

---

## Goal

Add **Create**, **Edit**, and **Delete** capability to the **Pedagogat** and **Lëndët** admin pages. Currently both pages are read-only tables. After this task, admins can manage these records directly from the UI.

The pattern is the same for both pages: a toolbar button opens a `Modal` with a `Form`, and each row gets Edit + Delete action buttons.

---

## Workflow

1. `git checkout main && git pull` (after BE tasks 08 + 09 are merged)
2. `git checkout -b <yourname>/admin-crud-ui`
3. Update `adminService.js` first, then `PedagogatPage`, then `LendetPage`
4. `npm run dev`, full manual test for create/edit/delete
5. `npm run lint`
6. Commit: `feat: add crud actions to pedagogat and lendet pages`
7. Open PR against `main`, request review from `kristopapallazo`

---

## Step 1 — Add write methods to `src/services/adminService.js`

```js
// Pedagogues
createPedagogue: (data) => axiosInstance.post('/api/v1/pedagogues', data),
updatePedagogue: (id, data) => axiosInstance.put(`/api/v1/pedagogues/${id}`, data),
deletePedagogue: (id) => axiosInstance.delete(`/api/v1/pedagogues/${id}`),

// Courses
createCourse: (data) => axiosInstance.post('/api/v1/courses', data),
updateCourse: (id, data) => axiosInstance.put(`/api/v1/courses/${id}`, data),
deleteCourse: (id) => axiosInstance.delete(`/api/v1/courses/${id}`),
```

---

## Step 2 — Add CRUD to `src/pages/admin/PedagogatPage.jsx`

### 2a — New imports needed

```js
import { Button, Form, Input, Modal, Popconfirm, Select, notification } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
```

### 2b — State for the modal

Add inside the component:

```js
const [modalOpen,    setModalOpen]    = useState(false);
const [editTarget,   setEditTarget]   = useState(null); // null = creating new
const [saving,       setSaving]       = useState(false);
const [form] = Form.useForm();
```

### 2c — Handlers

```js
const handleOpenCreate = () => {
  setEditTarget(null);
  form.resetFields();
  setModalOpen(true);
};

const handleOpenEdit = (record) => {
  setEditTarget(record);
  form.setFieldsValue({
    firstName:    record.firstName,
    lastName:     record.lastName,
    gender:       record.gender,
    title:        record.title,
    email:        record.email,
    departmentId: record.departmentId,
  });
  setModalOpen(true);
};

const handleSave = async () => {
  const values = await form.validateFields();
  setSaving(true);
  try {
    if (editTarget) {
      await adminService.updatePedagogue(editTarget.id, values);
      notification.success({ message: 'Pedagogu u përditësua.' });
    } else {
      await adminService.createPedagogue(values);
      notification.success({ message: 'Pedagogu u krijua.' });
    }
    setModalOpen(false);
    // Trigger a re-fetch by resetting page (useApi will re-run)
    setPage(1);
  } finally {
    setSaving(false);
  }
};

const handleDelete = async (id) => {
  await adminService.deletePedagogue(id);
  notification.success({ message: 'Pedagogu u fshi.' });
  setPage(1);
};
```

### 2d — Add action column to `columns`

```js
{
  title: '',
  key: 'actions',
  width: 100,
  render: (_, r) => (
    <Space size="small">
      <Button size="small" icon={<EditOutlined />} onClick={() => handleOpenEdit(r)} />
      <Popconfirm
        title="Fshi pedagogun?"
        onConfirm={() => handleDelete(r.id)}
        okText="Po"
        cancelText="Jo"
      >
        <Button size="small" danger icon={<DeleteOutlined />} />
      </Popconfirm>
    </Space>
  ),
},
```

### 2e — Add "Pedagog i ri" button above the table

```jsx
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
  <Space>
    <Search … />
    <Select … {/* department filter */} />
  </Space>
  <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenCreate}>
    Pedagog i ri
  </Button>
</div>
```

### 2f — Add the Modal at the bottom of the return

```jsx
<Modal
  title={editTarget ? 'Ndrysho pedagogun' : 'Pedagog i ri'}
  open={modalOpen}
  onOk={handleSave}
  onCancel={() => setModalOpen(false)}
  confirmLoading={saving}
  okText="Ruaj"
  cancelText="Anulo"
>
  <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
    <Form.Item name="firstName" label="Emri" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    <Form.Item name="lastName" label="Mbiemri" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    <Form.Item name="title" label="Titulli" rules={[{ required: true }]}>
      <Input placeholder="Prof. Dr." />
    </Form.Item>
    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
      <Input disabled={!!editTarget} />
    </Form.Item>
    <Form.Item name="gender" label="Gjinia" rules={[{ required: true }]}>
      <Select options={[{ value: 'M', label: 'Mashkull' }, { value: 'F', label: 'Femër' }]} />
    </Form.Item>
    <Form.Item name="departmentId" label="Departamenti" rules={[{ required: true }]}>
      <Select
        options={departments.map((d) => ({ value: d.id, label: d.name }))}
        placeholder="Zgjidh departamentin"
      />
    </Form.Item>
  </Form>
</Modal>
```

> **Note:** `email` is disabled on edit because changing it would break the auth link (see BE task 09 spec).

---

## Step 3 — Add CRUD to `src/pages/admin/LendetPage.jsx`

Follow the exact same pattern as Step 2, adapted for courses:

**State:** same `modalOpen`, `editTarget`, `saving`, `form`.

**Handlers:** call `adminService.createCourse` / `updateCourse` / `deleteCourse`.

**Action column:** same Edit + Delete buttons.

**Modal form fields:**

```jsx
<Form.Item name="name" label="Emri" rules={[{ required: true }]}>
  <Input />
</Form.Item>
<Form.Item name="code" label="Kodi" rules={[{ required: true }]}>
  <Input placeholder="INF201" disabled={!!editTarget} />
</Form.Item>
<Form.Item name="departmentId" label="Departamenti" rules={[{ required: true }]}>
  <Select
    options={departments.map((d) => ({ value: d.id, label: d.name }))}
    placeholder="Zgjidh departamentin"
  />
</Form.Item>
```

> **Note:** `code` is disabled on edit because it is the unique business key and changing it has downstream effects (it's used in curricula). The BE rejects code changes anyway.

---

## Acceptance criteria

- [ ] "Pedagog i ri" button opens a modal; saving creates the pedagogue and refreshes the list
- [ ] Edit button pre-fills the form with existing data; saving updates and refreshes
- [ ] Delete button shows a confirm dialog; confirming removes the row
- [ ] Email is disabled in the edit form
- [ ] Same three actions work on Lëndët (code disabled on edit)
- [ ] `notification.success` fires on every successful action
- [ ] `npm run lint` passes
