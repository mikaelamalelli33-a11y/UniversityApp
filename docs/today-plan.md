# Frontend — Today's Tasks

> **Date:** 2026-04-09
> **Lead:** Kristo
> **Stack:** React 18, Vite, Ant Design 5, Zustand
> **API base:** `https://university-api-production.up.railway.app`
> **API docs:** `https://university-api-production.up.railway.app/docs`

---

## ⚠️ Important — use the API docs, don't guess

The backend has **live interactive API documentation** at:

```
https://university-api-production.up.railway.app/docs
```

Before writing any service call or building any form, **open the docs first**. Every endpoint is documented there with:
- The exact request body shape and required fields
- The exact response shape — field names, types, nesting
- A **"Try it out"** button — paste your Sanctum token once at the top, then execute any endpoint and see the real response

**You never need to ask the backend developer what an endpoint returns.** The answer is in the docs. If something is missing or wrong in the docs, flag it to Kristo — the docs are auto-generated from the code and should always be accurate.

The No `.env` needed. The app defaults to the production API automatically. Only create `.env` if you want to point at a local backend (`VITE_API_BASE_URL=http://localhost:8000`).

---

## F1 — Fix authStore + authService to match real API (start here)

**Why:** the store currently expects `access_token` and `refresh_token` — the API returns `token` only. Sanctum does not have refresh tokens. Nothing will work until this is fixed.

**Files:**
- `src/services/authService.js`
- `src/store/authStore.js`

**Changes:**

`authService.js` — remove `refreshToken`, it doesn't exist:
```js
export const authService = {
  login: (credentials) => axiosInstance.post('/api/v1/auth/login', credentials),
  logout: () => axiosInstance.post('/api/v1/auth/logout'),
  me: () => axiosInstance.get('/api/v1/auth/me'),
  // remove refreshToken entirely
};
```

`authStore.js` — fix field names and wire up real logout:
```js
// data.access_token  →  data.token
// data.refresh_token →  remove entirely
// logout() must call authService.logout() to revoke token server-side, then clear storage
```

**Acceptance:**
- `useAuthStore.login({ email, password })` with real pedagog/admin credentials returns the user and stores the token
- `useAuthStore.logout()` calls `POST /api/v1/auth/logout` and clears local state
- `initializeAuth()` on app start reads token from storage, calls `/api/v1/auth/me`, sets user

---

## F2 — Real login form (after F1)

**Goal:** replace `LoginPage.jsx`. The file itself says "DEV ONLY — replace once the real login form is built." That's now.

**File:** `src/pages/auth/LoginPage.jsx`

**What to build:**
- Ant Design `Form` with `email` + `password` fields (Albanian labels: `Email`, `Fjalëkalimi`)
- Submit button: `Hyr` 
- On success → `navigate(ROLE_DEFAULT_ROUTES[user.role])`
- On error → show the Albanian error message from `response.data.message`
- Loading state on the button while the request is in flight
- Below the form: a `"Hyr me Google"` button for students (see F3)

**Real credentials to test with** (ask Kristo — he has seeded admin credentials).

**Acceptance:**
- Pedagog/admin can log in with real credentials and land on the correct dashboard
- Wrong credentials show the Albanian error from the API (e.g. "Email ose fjalëkalimi i gabuar.")
- Button shows loading state during the request
- No console errors

---

## F3 — Google OAuth button (talk to Kristo before starting)

**Goal:** wire the "Hyr me Google" button from F2.

⚠️ **This task has an open design decision** — after Google redirects back to the API callback, how does the token get to the SPA? This needs to be decided with Kristo first. Do **not** start implementation until that conversation happens.

**What you can do today without that decision:**
- Add the "Hyr me Google" button to the login page
- On click: `window.location.href = '{API_BASE}/api/v1/auth/google/redirect'`
- This opens Google's consent screen — that part works in production right now

**Acceptance for today:** clicking the button opens Google's consent screen. Token handoff comes in the next task once the design decision is made.

---

## Task order

```
F1 → F2 → F3 (in order, each depends on the previous)
```

F1 is ~30 minutes. F2 is the main task for today. F3 is partially blocked — do what you can.

---

## Useful references

- API docs (live): `https://university-api-production.up.railway.app/docs`
- Auth plan (backend): `university-api/docs/auth-plan.md`
- Axios instance: `src/services/axiosInstance.js`
- Routes config: `src/router/routes.js`
- Constants (ROLES): `src/utils/constants.js`
