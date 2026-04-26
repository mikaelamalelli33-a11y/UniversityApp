# 17 — Fix Department Name Display in Pedagogat & Lendet Tables

> **Priority:** P2 — polish, no blockers
> **Effort:** ~20 min
> **Difficulty:** ⭐ beginner
> **Branch:** `<yourname>/fix-dep-names` (example: `ornela/fix-dep-names`)
> **Depends on:** nothing — all data is already fetched on these pages

---

## Goal

The **Pedagogat** and **Lëndët** admin tables currently show a raw number in the "Departamenti" column (e.g. `4`). Replace it with the actual department name (e.g. `Departamenti i Informatikës`).

The department data is **already fetched** on both pages — you only need to update one column definition in each file. No new API calls, no new state.

---

## Workflow

1. `git checkout main && git pull`
2. `git checkout -b <yourname>/fix-dep-names`
3. Edit the 2 files below
4. `npm run lint`
5. Commit: `fix: show department name instead of ID in admin tables`
6. Open PR against `main`, request review from `kristopapallazo`

---

## Change 1 — `src/pages/admin/PedagogatPage.jsx`

Find this column definition (around line 20):

```js
{ title: 'ID Departamenti', dataIndex: 'departmentId', key: 'departmentId', width: 160 },
```

Replace it with:

```js
{
  title: 'Departamenti',
  key: 'departmentId',
  render: (_, r) => depMap[r.departmentId] ?? '—',
},
```

Then, just below where `departments` is declared (around line 50), add `depMap`:

```js
const departments = depData?.data ?? [];
const depMap = Object.fromEntries(departments.map((d) => [d.id, d.name])); // ← add this line
```

---

## Change 2 — `src/pages/admin/LendetPage.jsx`

Same two changes in this file.

Find the column:

```js
{ title: 'ID Departamenti', dataIndex: 'departmentId', key: 'departmentId', width: 160 },
```

Replace with:

```js
{
  title: 'Departamenti',
  key: 'departmentId',
  render: (_, r) => depMap[r.departmentId] ?? '—',
},
```

Add `depMap` below where `departments` is declared:

```js
const departments = depData?.data ?? [];
const depMap = Object.fromEntries(departments.map((d) => [d.id, d.name])); // ← add this line
```

---

## How to verify

1. `npm run dev`
2. Log in as admin (`admin@uamd.edu.al`)
3. Navigate to **Pedagogët** — the last column should now show names like `Departamenti i Informatikës` instead of `4`
4. Navigate to **Lëndët** — same check

## Acceptance criteria

- [ ] Pedagogat table shows department name, not ID
- [ ] Lendet table shows department name, not ID
- [ ] If a department ID has no match the cell shows `—` (not a crash)
- [ ] `npm run lint` passes
