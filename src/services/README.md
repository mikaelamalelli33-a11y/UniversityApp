# services/ — API Service Layer

## Architecture

```
Page component
  → calls service function (e.g., adminService.getStudentat())
    → goes through axiosInstance (adds token, handles errors)
      → hits the backend API
```

**Rule: Pages never import axios directly.** All API calls go through a service file.

## Files

| File | Domain | Used by |
|---|---|---|
| `axiosInstance.js` | Base axios config, interceptors | All other services |
| `authService.js` | Login, logout, refresh, me | Auth store |
| `adminService.js` | CRUD for students, pedagogues, courses | Admin pages |
| `studentService.js` | Student profile, grades, schedule, billing | Student pages |
| `pedagogService.js` | Pedagog profile, courses, schedule, grading | Pedagog pages |
| `akademiaService.js` | Faculties, programs | Public/shared pages |
| `lajmeService.js` | News articles | Public pages |

## Adding a New Service

1. Create `src/services/<domain>Service.js`
2. Import `axiosInstance` (not raw axios)
3. Export an object with named methods:

```js
import axiosInstance from './axiosInstance';

export const exampleService = {
  getAll: (params) => axiosInstance.get('/api/v1/examples', { params }),
  getById: (id) => axiosInstance.get(`/api/v1/examples/${id}`),
  create: (payload) => axiosInstance.post('/api/v1/examples', payload),
  update: (id, payload) => axiosInstance.put(`/api/v1/examples/${id}`, payload),
  delete: (id) => axiosInstance.delete(`/api/v1/examples/${id}`),
};
```

## What axiosInstance Handles Automatically

- Injects the `Authorization: Bearer <token>` header
- Shows Albanian error notifications for 403, 5xx, and network errors
- Attempts token refresh on 401, then retries the original request
- Unwraps `response.data` so you get the payload directly
