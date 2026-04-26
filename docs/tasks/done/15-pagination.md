# 15 — Server-side Pagination on List Pages

> **Priority:** P2 — enhancement
> **Effort:** ~1h
> **Blocked by:** BE-04 (pagination) must be merged first
> **Stack:** React, Ant Design Table, Axios
> **Branch:** `<yourname>/fe-pagination` (example: `ana/fe-pagination`)
> **Backend ref:** `university-api/docs/tasks/04-pagination.md`

---

## Goal

Switch admin list pages from **client-side pagination** (load all rows, slice locally) to **server-side pagination** (load page X with 15 items, server controls the total).

The backend now returns a new response shape:
```json
{
  "data": [...items],
  "pagination": {
    "current": 1,
    "pageSize": 15,
    "total": 45
  },
  "message": "OK",
  "status": 200
}
```

Update the two admin list pages to consume this shape and use Ant Design Table's server-side pagination.

---

## Workflow

1. Pull latest `main` **after BE-04 is merged**: `git checkout main && git pull`
2. Create branch: `<yourname>/fe-pagination`
3. Implement both pages in one commit
4. Run `npm run dev` and test both pages manually
5. Open PR against `main`, request review from `kristopapallazo`
6. Link this doc in the PR description

---

## Implementation

### Pattern

Add server-side pagination state to pages and pass it to service calls.

```jsx
const [page, setPage] = useState(1);
const [perPage, setPerPage] = useState(15);

const { data, loading } = useApi(
  () => serviceMethod({ page, perPage }),
  [page, perPage]  // re-fetch when these change
);

const items = data?.data ?? [];
const pagination = data?.pagination ?? {};

<Table
  dataSource={items}
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
/>
```

### P1-A — LendetPage

**File:** `src/pages/admin/LendetPage.jsx`

- Add `page`, `perPage` state
- Pass `{ page, perPage }` to `adminService.getCourses({ page, perPage })`
- Update useApi deps: `[page, perPage]`
- Read `data.pagination` and use it in Table's pagination prop
- Callback `onChange` updates `page` and `perPage`
- Client-side search stays as-is (filters current page only — acceptable limitation)

### P1-B — PedagogatPage

**File:** `src/pages/admin/PedagogatPage.jsx`

Same pattern as P1-A.

---

## Acceptance criteria

- [ ] `LendetPage` loads page 1 of courses with correct pagination controls
- [ ] Clicking page 2 fires API call with `?page=2&perPage=15`, new rows load
- [ ] Changing perPage fires API call with `?page=1&perPage=<new>`, API recalculates rows
- [ ] `PedagogatPage` does the same for pedagogues
- [ ] Search filter still works (client-side on current page)
- [ ] Department filter still works (client-side on current page)
- [ ] No console errors
