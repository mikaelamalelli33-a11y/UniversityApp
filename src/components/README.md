# components/ — Reusable Components

## Structure

```
components/
└── common/         → Shared across the entire app (any role, any page)
    ├── ErrorBoundary.jsx    → Catches React render errors, shows fallback UI
    ├── LoadingSpinner.jsx   → Full-page or inline loading indicator
    ├── NotFound.jsx         → 404 page
    └── ProtectedRoute.jsx   → Auth + role guard wrapper for routes
```

## Where to Put New Components

| Type | Location | Example |
|---|---|---|
| Used across multiple pages/roles | `components/common/` | DataTable, PageHeader, ConfirmModal |
| Used only within one role's pages | `components/<role>/` | StudentGradeCard, AdminUserForm |
| Used only within a single page | Keep it in the page file or a subfolder next to it | — |

## Guidelines

- One component per file
- Default export the component
- Name the file the same as the component: `DataTable.jsx` exports `DataTable`
- Ant Design is the UI library — compose with its components rather than building from scratch
- Avoid prop drilling beyond 2 levels — use a Zustand store or React context instead
