# 16 — Sorting on List Pages

> **Priority:** P2 — enhancement
> **Effort:** ~1h
> **Blocked by:** BE-05 (sorting) must be merged first
> **Stack:** React, Ant Design Table, Axios
> **Branch:** `<yourname>/fe-sorting` (example: `ana/fe-sorting`)
> **Backend ref:** `university-api/docs/tasks/05-sorting.md`

---

## Goal

Add sortable columns to admin list pages. When the user clicks a column header, the table re-fetches with `?sortBy=FIELD&sortOrder=asc|desc` params.

---

## Workflow

1. Pull latest `main` **after BE-05 is merged**: `git checkout main && git pull`
2. Create branch: `<yourname>/fe-sorting`
3. Implement both pages in one commit
4. Run `npm run dev` and test both pages manually
5. Open PR against `main`, request review from `kristopapallazo`
6. Link this doc in the PR description

---

## Implementation

### Pattern

Add sort state, map FE column keys to BE field names, and update Table's `onChange` handler.

```jsx
const [sortBy, setSortBy] = useState(null);
const [sortOrder, setSortOrder] = useState('asc');

// Map FE column key → BE field name
const fieldToBackend = { name: 'LEND_EM', code: 'LEND_KOD' };

const { data } = useApi(
  () => service({ page, perPage, sortBy, sortOrder }),
  [page, perPage, sortBy, sortOrder]
);

const handleTableChange = (_, __, sorter) => {
  setPage(1);  // reset to page 1 when sorting changes
  if (sorter.field) {
    setSortBy(fieldToBackend[sorter.field]);
    setSortOrder(sorter.order === 'descend' ? 'desc' : 'asc');
  } else {
    setSortBy(null);
    setSortOrder('asc');
  }
};

<Table
  onChange={handleTableChange}
  columns={[
    { title: 'Name', dataIndex: 'name', sorter: true },
    // ^— sorter: true makes this column clickable
  ]}
/>
```

### S1-A — LendetPage

**File:** `src/pages/admin/LendetPage.jsx`

- Add `sortBy`, `sortOrder` state
- Map columns: `code` → `LEND_KOD`, `name` → `LEND_EM`
- Add `sorter: true` to Kodi and Emri columns (Code and Name)
- Add `onChange` handler that maps sorter.field to backend field
- Include `sortBy`, `sortOrder` in useApi deps

### S1-B — PedagogatPage

**File:** `src/pages/admin/PedagogatPage.jsx`

Note: The Emri column is composite (renders `${firstName} ${lastName}`), and the backend only allows sorting by `PED_EMER` (first name) or `PED_MBIEMER` (last name) individually, not both. Email is not a sortable backend field.

**Limitation:** No sortable columns added for PedagogatPage in this release. A future task can add individual firstName/lastName sort controls if needed.

---

## Acceptance criteria

- [ ] `LendetPage` Kodi column header is clickable and sorts by `LEND_KOD`
- [ ] `LendetPage` Emri column header is clickable and sorts by `LEND_EM`
- [ ] Clicking a column fires API call with `?sortBy=<field>&sortOrder=asc` or `?sortOrder=desc`
- [ ] Rows are re-sorted and page resets to 1
- [ ] Clicking the column again toggles sort order (asc ↔ desc)
- [ ] `PedagogatPage` tables loads and functions (sorting limitation noted)
- [ ] No console errors
