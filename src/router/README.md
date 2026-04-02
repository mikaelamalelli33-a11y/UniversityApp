# router/ — Routing System

## Files

| File | Purpose |
|---|---|
| `routes.js` | **Single source of truth** for all URL paths. Nested by role. |
| `menuConfig.jsx` | Sidebar menu items per role. References `routes.js` for paths. |
| `roleGuards.js` | Helper functions for role-based access checks. |
| `index.jsx` | React Router configuration. Connects paths → layouts → page components. |

## How Routes Work

```
routes.js (paths)  →  menuConfig.jsx (sidebar items)
                   →  index.jsx (router tree)
                   →  roleGuards.js (redirects)
```

`routes.js` is the single source. Everything else imports from it.

## Adding a New Sub-Route

Example: adding `/admin/perdoruesit`

**Step 1** — Add the path in `routes.js`:
```js
ADMIN: {
  ROOT: '/admin',
  STUDENTAT: '/admin/studentat',
  PERDORUESIT: '/admin/perdoruesit',  // ← new
},
```

**Step 2** — Add the menu item in `menuConfig.jsx`:
```js
admin: [
  ...existing items,
  { key: ROUTES.ADMIN.PERDORUESIT, icon: <UserOutlined />, label: 'Përdoruesit' },
],
```

**Step 3** — Create the page: `pages/admin/PerdoruesitPage.jsx`

**Step 4** — Register in `index.jsx` under the admin children:
```js
{ path: 'perdoruesit', element: <PerdoruesitPage /> },
```

## Role Access

Each route group in `index.jsx` is wrapped with `<ProtectedRoute allowedRoles={[...]}>`.
Roles are defined in `utils/constants.js` — always use `ROLES.ADMIN`, never the string `'admin'`.
