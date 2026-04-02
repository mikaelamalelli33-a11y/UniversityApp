# store/ — Global State (Zustand)

## Stores

| Store | Purpose | Persisted? |
|---|---|---|
| `authStore.js` | User session, tokens, login/logout | Yes (tokens only, via localStorage) |
| `uiStore.js` | Sidebar state, page title | No |

## When to Use Global State vs Local State

| Scenario | Use |
|---|---|
| Shared across multiple pages (e.g., user session) | Zustand store |
| Only needed in one component/page (e.g., form input, modal open/close) | React `useState` |
| Derived from a store value (e.g., "is admin?") | Custom hook (`useRole`) |

## Using a Store in a Component

```jsx
import { useAuthStore } from '@/store/authStore';

function MyComponent() {
  // Select only what you need — avoids unnecessary re-renders
  const user = useAuthStore((s) => s.user);
  // ...
}
```

## Adding a New Store

1. Create `src/store/<name>Store.js`
2. Use `create` from Zustand:

```js
import { create } from 'zustand';

export const useExampleStore = create((set) => ({
  items: [],
  setItems: (items) => set({ items }),
}));
```

3. If it needs persistence, wrap with `persist` middleware (see `authStore.js` for reference).
