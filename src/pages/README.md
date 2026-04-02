# pages/ — Page Components

## Structure

```
pages/
├── auth/       → Login, registration (shared across roles)
├── student/    → Student portal pages
├── pedagog/    → Pedagogue portal pages
└── admin/      → Admin dashboard pages
```

Each role folder mirrors the sidebar navigation. One file = one route.

## Naming Convention

- File name matches the route: `/admin/studentat` → `pages/admin/StudentatPage.jsx`
- Suffix with `Page` to distinguish from reusable components
- The `BallinaPage.jsx` in each role folder is the landing/home page for that portal

## Creating a New Page

1. Create the file in the correct role folder: `pages/<role>/NewPage.jsx`
2. Export a default function component:

```jsx
export default function NewPage() {
  return <div>New Page Content</div>;
}
```

3. Register the route — see `router/README.md` for the full steps.

## Page Responsibilities

Pages should:
- Call service functions to fetch/mutate data
- Compose Ant Design and shared components for the UI
- Use `usePageTitle('Page Name')` to set the browser tab title

Pages should NOT:
- Call axios directly (use `services/`)
- Define reusable UI pieces (put those in `components/`)
- Contain business logic that other pages also need (extract to `hooks/` or `utils/`)
