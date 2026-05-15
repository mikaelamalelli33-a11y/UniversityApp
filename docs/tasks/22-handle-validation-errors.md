# 22 — Handle Validation Errors in CRUD Forms

> **Backlog ref:** nouncheck — handle entity validation errors from backend
> **Priority:** P1 — pairs with backend validation (tasks 12–15)
> **Effort:** ~2h
> **Stack:** React 18, Ant Design 5, Axios
> **Branch:** `<yourname>/handle-validation-errors` (example: `ornela/handle-validation-errors`)
> **Before you start:** Backend tasks 12–15 must be merged. These tasks add 404 validation errors; frontend must catch and display them.

---

## Goal

Update existing CRUD forms (departments, programs, courses) to **catch and display validation errors** from the backend.

The backend now returns **404 EntityNotFoundException** when:
- Department/Program creation fails because faculty doesn't exist
- Course creation fails because department doesn't exist

When this task is done:

- Forms catch 404 errors from failed validation
- Error message is displayed to the user in **Albanian**
- User can see which field caused the error (entity type + ID)
- User can correct and retry
- Form validation works seamlessly with backend validation

---

## Workflow

1. `git checkout main && git pull` (pull backend tasks 12–14)
2. `git checkout -b <yourname>/handle-validation-errors`
3. Update CRUD form components to handle 404 errors
4. Test each form with invalid data (invalid facultyId, departmentId, etc.)
5. Commit per logical step (`error-handling-departments`, etc.)
6. `npm run dev` and test in browser before pushing
7. `npm run build` to verify no build errors
8. Open PR against `main`

---

## Step 1 — Understand the error structure

The backend now returns errors like this:

```json
{
  "status": 404,
  "message": "Entiteti 'Fakultet' me identifikues '99999' nuk u gjet.",
  "entity": "Fakultet"
}
```

Your forms need to:
1. Catch this response
2. Extract the error message
3. Display it to the user in a notification or form error

---

## Step 2 — Update Department CRUD form

**File:** Look for your department form component (likely in `src/pages/Admin/Department*` or `src/components/Department*`)

Add error handling to your form submission:

```jsx
import { message, Form, Input, Select, Button } from 'antd';
import axiosInstance from '@/services/axiosInstance';

export function DepartmentForm({ onSuccess }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axiosInstance.post('/admin/departments', {
        name: values.name,
        faculty_id: values.faculty_id,
      });
      message.success('Departamenti u krijua me sukses.');
      form.resetFields();
      onSuccess?.();
    } catch (error) {
      if (error.response?.status === 404) {
        // Backend validation error — show user-friendly message
        const errorData = error.response.data;
        message.error(errorData.message || 'Gabim: Entiteti nuk u gjet.');
      } else if (error.response?.status === 422) {
        // Form validation error
        message.error('Plotësoni saktësisht të gjitha fushat.');
      } else {
        message.error('Gabim në krijimin e departamentit.');
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
    >
      <Form.Item
        name="name"
        label="Emri i Departamentit"
        rules={[{ required: true, message: 'Emri është i detyrueshëm.' }]}
      >
        <Input placeholder="p.sh. Informatika" />
      </Form.Item>

      <Form.Item
        name="faculty_id"
        label="Fakulteti"
        rules={[{ required: true, message: 'Fakulteti është i detyrueshëm.' }]}
      >
        <Select placeholder="Zgjidh fakultetin" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Krijo Departament
        </Button>
      </Form.Item>
    </Form>
  );
}
```

---

## Step 3 — Update Program CRUD form

**File:** Look for your program form component

Apply the same error handling pattern:

```jsx
const onFinish = async (values) => {
  setLoading(true);
  try {
    await axiosInstance.post('/api/v1/programs', {
      name: values.name,
      faculty_id: values.faculty_id,
    });
    message.success('Programi studim u krijua me sukses.');
    form.resetFields();
    onSuccess?.();
  } catch (error) {
    if (error.response?.status === 404) {
      const errorData = error.response.data;
      message.error(errorData.message || 'Gabim: Fakulteti nuk u gjet.');
    } else {
      message.error('Gabim në krijimin e programit.');
    }
  } finally {
    setLoading(false);
  }
};
```

---

## Step 4 — Update Course CRUD form

**File:** Look for your course form component

Apply error handling:

```jsx
const onFinish = async (values) => {
  setLoading(true);
  try {
    await axiosInstance.post('/api/v1/courses', {
      name: values.name,
      program_id: values.program_id,
    });
    message.success('Lenda u krijua me sukses.');
    form.resetFields();
    onSuccess?.();
  } catch (error) {
    if (error.response?.status === 404) {
      const errorData = error.response.data;
      message.error(errorData.message || 'Gabim: Programi nuk u gjet.');
    } else {
      message.error('Gabim në krijimin e lendës.');
    }
  } finally {
    setLoading(false);
  }
};
```

---

## Step 5 — Apply same pattern to UPDATE forms

For each form, also update the `onUpdate()` or `onFinish()` method when editing (PUT requests):

```jsx
const onUpdateFinish = async (values) => {
  setLoading(true);
  try {
    await axiosInstance.put(`/api/v1/departments/${id}`, {
      name: values.name,
      faculty_id: values.faculty_id,
    });
    message.success('Departamenti u përditësua me sukses.');
    onSuccess?.();
  } catch (error) {
    if (error.response?.status === 404) {
      const errorData = error.response.data;
      message.error(errorData.message || 'Gabim: Entiteti nuk u gjet.');
    } else {
      message.error('Gabim në përditësimin e departamentit.');
    }
  } finally {
    setLoading(false);
  }
};
```

---

## Manual smoke test

After `npm run dev`:

1. **Test invalid faculty_id:**
   - Try to create a department with `faculty_id=99999`
   - Expected: Error message appears: "Entiteti 'Fakultet' me identifikues '99999' nuk u gjet."

2. **Test invalid program_id:**
   - Try to create a course with `program_id=99999`
   - Expected: Error message appears: "Entiteti 'Program Studim' me identifikues '99999' nuk u gjet."

3. **Test invalid student_id (when editing):**
   - Try to update a student with `program_id=99999`
   - Expected: Error message appears

4. **Test valid data:**
   - Create a department/program/course/student with valid IDs
   - Expected: Success message appears, form resets

---

## Acceptance criteria

- [ ] Department form catches 404 errors and displays message to user
- [ ] Program form catches 404 errors and displays message to user
- [ ] Course form catches 404 errors and displays message to user
- [ ] All error messages are in **Albanian**
- [ ] Forms also handle 422 validation errors (from request validation)
- [ ] Forms handle other errors gracefully (500, etc.)
- [ ] Manual smoke tests pass (invalid IDs show errors, valid data creates/updates successfully)
- [ ] `npm run build` succeeds
- [ ] No console errors or warnings
