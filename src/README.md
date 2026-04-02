# src/ — Source Code Overview

## Folder Structure

```
src/
├── assets/         → Static assets (CSS, images, fonts)
├── components/     → Reusable UI components (not tied to a specific page)
├── config/         → App-wide configuration (theme, feature flags)
├── hooks/          → Custom React hooks
├── layouts/        → Page layout shells (sidebar, header, footer)
├── pages/          → Route-level page components (one folder per role)
├── router/         → Route definitions, menu config, guards
├── services/       → API call functions (one file per domain)
├── store/          → Zustand global state stores
├── utils/          → Pure utility functions and constants
├── App.jsx         → Root component (providers, router)
└── main.jsx        → Entry point (renders App into DOM)
```

## Key Conventions

1. **Imports** — Always use the `@/` alias: `import { useAuth } from '@/hooks/useAuth'`
2. **Language** — All UI text is in Albanian. No English strings in the UI.
3. **API calls** — Never call axios directly. Use the service files in `services/`.
4. **State** — Use Zustand stores for global state. Use React `useState` for local/component state.
5. **Routes** — All paths are defined in `router/routes.js`. Never hardcode a path string.
6. **Styling** — Use Ant Design components and the theme in `config/antdTheme.js`. No inline color values.
7. **Environment** — Variables start with `VITE_` and are accessed via `import.meta.env.VITE_*`.

## Adding a New Feature — Checklist

1. Define the route path in `router/routes.js`
2. Add the menu entry in `router/menuConfig.jsx`
3. Create the page component in `pages/<role>/`
4. Register the route in `router/index.jsx`
5. If it needs API data, add the endpoint in the appropriate `services/` file
