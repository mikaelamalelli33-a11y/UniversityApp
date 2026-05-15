# 23 — Admin Invoice Management Page

> **Backlog ref:** nouncheck — create CRUD page for student invoices
> **Priority:** P1 — pairs with backend task 15
> **Effort:** ~3h
> **Stack:** React 18, Ant Design 5, Axios, React Router
> **Branch:** `<yourname>/admin-invoices-page` (example: `ornela/admin-invoices-page`)
> **Before you start:** Backend task 15 must be merged. You need the `/api/v1/admin/invoices` endpoints available.

---

## Goal

Build a **new admin page** for managing student invoices with full CRUD functionality:

- **List page:** Table of all invoices with pagination, sort, filter
- **Create form:** Add new invoice with validation (student, amount, status, date)
- **Edit form:** Update existing invoice
- **Delete action:** Remove invoice with confirmation
- **Error handling:** Catch validation errors from backend and display to user

When this task is done, admins can:
- View all student invoices in a paginated table
- Create new invoices (with validations)
- Edit existing invoices
- Delete invoices

---

## Workflow

1. `git checkout main && git pull` (pull backend task 15)
2. `git checkout -b <yourname>/admin-invoices-page`
3. Create component structure: list page → detail page → form component
4. Wire routes into the admin section
5. Implement CRUD operations with error handling
6. Test in browser with real data
7. `npm run build` to verify no errors
8. Open PR against `main`

---

## Step 1 — Create folder structure

Create the following files:

```
src/pages/Admin/
├── Invoices/
│   ├── InvoicesPage.jsx          (list page with table)
│   ├── InvoiceDetailPage.jsx     (view/edit single invoice)
│   ├── InvoiceForm.jsx           (reusable form component)
│   └── useInvoices.js            (custom hook for API calls)
```

---

## Step 2 — Create useInvoices hook

**File:** `src/pages/Admin/Invoices/useInvoices.js`

Custom hook to manage invoice API calls:

```jsx
import { useState } from 'react';
import axiosInstance from '@/services/axiosInstance';

export function useInvoices() {
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });

  const fetchInvoices = async (page = 1, pageSize = 20) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/v1/admin/invoices', {
        params: { page, perPage: pageSize },
      });
      setInvoices(response.data.data);
      setPagination({
        current: page,
        pageSize,
        total: response.data.meta?.total || response.data.data.length,
      });
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createInvoice = async (data) => {
    return axiosInstance.post('/api/v1/admin/invoices', {
      student_id: data.student_id,
      amount: data.amount,
      status: data.status,
      description: data.description,
      issue_date: data.issue_date,
    });
  };

  const updateInvoice = async (id, data) => {
    return axiosInstance.put(`/api/v1/admin/invoices/${id}`, data);
  };

  const deleteInvoice = async (id) => {
    return axiosInstance.delete(`/api/v1/admin/invoices/${id}`);
  };

  const fetchInvoiceById = async (id) => {
    const response = await axiosInstance.get(`/api/v1/admin/invoices/${id}`);
    return response.data.data;
  };

  return {
    invoices,
    loading,
    pagination,
    fetchInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    fetchInvoiceById,
  };
}
```

---

## Step 3 — Create InvoiceForm component

**File:** `src/pages/Admin/Invoices/InvoiceForm.jsx`

Reusable form for creating/editing invoices:

```jsx
import { Form, Input, InputNumber, Select, DatePicker, Button, message } from 'antd';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import axiosInstance from '@/services/axiosInstance';

const INVOICE_STATUSES = [
  { label: 'E papaguar', value: 'E papaguar' },
  { label: 'E paguar', value: 'E paguar' },
  { label: 'E vonuar', value: 'E vonuar' },
];

export function InvoiceForm({ initialData, onSuccess }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Fetch students list for the select dropdown
    axiosInstance.get('/api/v1/admin/students')
      .then(res => {
        setStudents(res.data.data.map(s => ({
          label: s.name || `${s.id}`,
          value: s.id,
        })));
      });
  }, []);

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        student_id: initialData.STU_ID,
        amount: initialData.FAT_SHUMA,
        status: initialData.FAT_STATUSI,
        description: initialData.FAT_PERSHKRIM,
        issue_date: dayjs(initialData.FAT_DAT_LESHIM),
      });
    }
  }, [initialData, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        student_id: values.student_id,
        amount: values.amount,
        status: values.status,
        description: values.description,
        issue_date: values.issue_date.format('YYYY-MM-DD'),
      };

      if (initialData) {
        // Update existing
        await axiosInstance.put(`/api/v1/admin/invoices/${initialData.FAT_ID}`, payload);
        message.success('Fatura u përditësua me sukses.');
      } else {
        // Create new
        await axiosInstance.post('/api/v1/admin/invoices', payload);
        message.success('Fatura u krijua me sukses.');
        form.resetFields();
      }

      onSuccess?.();
    } catch (error) {
      if (error.response?.status === 404) {
        message.error(error.response.data.message || 'Gabim: Studenti nuk u gjet.');
      } else if (error.response?.status === 422) {
        message.error('Plotësoni saktësisht të gjitha fushat.');
      } else {
        message.error('Gabim në ruajtjen e faturës.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      className="invoice-form"
    >
      <Form.Item
        name="student_id"
        label="Studenti"
        rules={[{ required: true, message: 'Studenti është i detyrueshëm.' }]}
      >
        <Select placeholder="Zgjidh studentIn" options={students} />
      </Form.Item>

      <Form.Item
        name="amount"
        label="Shuma (€)"
        rules={[
          { required: true, message: 'Shuma është e detyrueshme.' },
          { type: 'number', min: 0.01, message: 'Shuma duhet të jetë pozitive.' },
        ]}
      >
        <InputNumber step={0.01} placeholder="100.00" />
      </Form.Item>

      <Form.Item
        name="status"
        label="Statusi"
        rules={[{ required: true, message: 'Statusi është i detyrueshëm.' }]}
      >
        <Select placeholder="Zgjidh statusin" options={INVOICE_STATUSES} />
      </Form.Item>

      <Form.Item
        name="issue_date"
        label="Data e Lëshimit"
        rules={[{ required: true, message: 'Data është e detyrueshme.' }]}
      >
        <DatePicker />
      </Form.Item>

      <Form.Item
        name="description"
        label="Përshkrimi (opsional)"
        rules={[{ max: 200, message: 'Përshkrimi nuk duhet të kalojë 200 karaktere.' }]}
      >
        <Input.TextArea placeholder="p.sh. Tarifë për semestrin 1" rows={3} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          {initialData ? 'Përditëso Faturën' : 'Krijo Faturën'}
        </Button>
      </Form.Item>
    </Form>
  );
}
```

---

## Step 4 — Create InvoicesPage (list)

**File:** `src/pages/Admin/Invoices/InvoicesPage.jsx`

```jsx
import { Table, Button, Space, Modal, message, Drawer } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useInvoices } from './useInvoices';
import { InvoiceForm } from './InvoiceForm';

export function InvoicesPage() {
  const { invoices, loading, pagination, fetchInvoices, deleteInvoice, fetchInvoiceById } = useInvoices();
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleCreate = () => {
    setSelectedInvoice(null);
    setDrawerVisible(true);
  };

  const handleEdit = async (id) => {
    const invoice = await fetchInvoiceById(id);
    setSelectedInvoice(invoice);
    setDrawerVisible(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Fshi Faturën',
      content: 'A je i sigurt që dëshiron ta fshish këtë faturë?',
      okText: 'Po',
      cancelText: 'Jo',
      onOk: async () => {
        try {
          await deleteInvoice(id);
          message.success('Fatura u fshi me sukses.');
          fetchInvoices(pagination.current);
        } catch (error) {
          message.error('Gabim në fshirjen e faturës.');
        }
      },
    });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'FAT_ID',
      key: 'id',
      width: 60,
    },
    {
      title: 'Studenti',
      dataIndex: ['student', 'name'],
      key: 'student',
      render: (text, record) => record.STU_ID,
    },
    {
      title: 'Shuma (€)',
      dataIndex: 'FAT_SHUMA',
      key: 'amount',
      align: 'right',
      render: (amount) => amount.toFixed(2),
    },
    {
      title: 'Statusi',
      dataIndex: 'FAT_STATUSI',
      key: 'status',
      filters: [
        { text: 'E papaguar', value: 'E papaguar' },
        { text: 'E paguar', value: 'E paguar' },
        { text: 'E vonuar', value: 'E vonuar' },
      ],
      onFilter: (value, record) => record.FAT_STATUSI === value,
    },
    {
      title: 'Data',
      dataIndex: 'FAT_DAT_LESHIM',
      key: 'date',
      sorter: (a, b) => new Date(a.FAT_DAT_LESHIM) - new Date(b.FAT_DAT_LESHIM),
    },
    {
      title: 'Aksionet',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record.FAT_ID)}
          >
            Redakto
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDelete(record.FAT_ID)}
          >
            Fshi
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="invoices-page">
      <h1>Menaxhimi i Faturave</h1>
      
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Fatura e Re
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={invoices}
        loading={loading}
        pagination={pagination}
        onChange={(newPagination) => fetchInvoices(newPagination.current, newPagination.pageSize)}
        rowKey="FAT_ID"
      />

      <Drawer
        title={selectedInvoice ? 'Redakto Faturën' : 'Fatura e Re'}
        placement="right"
        width={500}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        <InvoiceForm
          initialData={selectedInvoice}
          onSuccess={() => {
            setDrawerVisible(false);
            fetchInvoices(pagination.current);
          }}
        />
      </Drawer>
    </div>
  );
}
```

---

## Step 5 — Wire into admin routes

**File:** Look for your admin routing file (likely `src/pages/Admin/index.jsx` or similar)

Add the route:

```jsx
import { InvoicesPage } from './Invoices/InvoicesPage';

// In your routes array/config:
{
  path: 'invoices',
  element: <InvoicesPage />,
  label: 'Fatura',  // In Albanian: Invoices
}
```

---

## Manual smoke test

After `npm run dev`:

1. **Navigate to Admin → Invoices**
   - Expected: Empty table or list of invoices (if any exist from backend seeding)

2. **Click "Fatura e Re" (Create new)**
   - Expected: Drawer opens with form

3. **Try to create with invalid student_id**
   - Expected: Error message: "Entiteti 'Student' me identifikues '99999' nuk u gjet."

4. **Try to create with amount < 0**
   - Expected: Form validation error

5. **Create with valid data**
   - Pick a real student ID
   - Set amount, status, date
   - Expected: Success message, invoice appears in table

6. **Click Edit on an invoice**
   - Expected: Drawer opens with form populated

7. **Update invoice**
   - Change status to 'E paguar'
   - Expected: Success message, table updates

8. **Delete invoice**
   - Click Delete
   - Expected: Confirmation modal, then success message

---

## Acceptance criteria

- [ ] `InvoicesPage` component lists all invoices in a table
- [ ] Table has pagination support
- [ ] Table has status filter
- [ ] Create button opens a drawer with `InvoiceForm`
- [ ] Edit button opens drawer with pre-populated form
- [ ] Delete button shows confirmation and deletes invoice
- [ ] Form validates: student required, amount > 0, status from list, date valid
- [ ] Form catches 404 errors (invalid student) and displays message
- [ ] Form catches 422 errors (validation) and displays message
- [ ] All text is in **Albanian**
- [ ] Manual smoke tests pass
- [ ] `npm run build` succeeds
- [ ] No console errors or warnings
