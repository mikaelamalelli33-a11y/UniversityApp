# Frontend — Dokumentacion

> **Stack:** React 19 · Vite · Ant Design 5 · React Router v6 · Zustand · Axios
> **API (production):** `https://university-api-production.up.railway.app`
> **API docs (live):** `https://university-api-production.up.railway.app/docs`

---

## ⚠️ Para se të shkruash ndonjë thirrje API — lexo dokumentacionin

Backend-i ka **dokumentacion interaktiv live** në:

```
https://university-api-production.up.railway.app/docs
```

Çdo endpoint është i dokumentuar me:
- Trupin e kërkesës (request body) — fushat e detyrueshme dhe format e tyre
- Formatin e saktë të përgjigjes — emrat e fushave, tipet, nestimi
- Butonin **"Try it out"** — ngjit token-in tënd Sanctum një herë në krye, pastaj ekzekuto çdo endpoint dhe shiko përgjigjen reale

**Nuk ke nevojë të pyesësh backend-in çfarë kthen një endpoint.** Përgjigja është në docs. Nëse diçka mungon ose është gabim, njofto Kriston.

`.env` është konfiguruar të tregojë nga API-ja e prodhimit — `VITE_API_BASE_URL=https://university-api-production.up.railway.app`. Nuk ke nevojë të nisësh backend-in lokalisht për të zhvilluar.

---

## Si ta nisësh projektin

```bash
# 1. Klono repon (nëse nuk e ke ende)
git clone https://github.com/mikaelamalelli33-a11y/UniversityApp.git
cd UniversityApp

# 2. Instalo dependencies
npm install

# 3. Nise serverin e zhvillimit
npm run dev
# Hapet automatikisht në http://localhost:5173
```

> Nuk nevojitet skedar `.env` për të filluar. Aplikacioni lidhet automatikisht me API-në e prodhimit si parazgjedhje. Krijo `.env` vetëm nëse dëshiron të tregosh te një backend lokal (`VITE_API_BASE_URL=http://localhost:8000`).

---

## Struktura e projektit

```
src/
├── assets/
│   └── styles/
│       └── global.css          # Stile globale (reset, font)
│
├── components/
│   └── common/
│       ├── ProtectedRoute.jsx  # Mbron route-t — kërkon login + rol
│       ├── LoadingSpinner.jsx  # Spinner ngarkimi
│       ├── NotFound.jsx        # Faqja 404
│       └── ErrorBoundary.jsx   # Kap gabimet e papritura
│
├── config/
│   └── antdTheme.js            # Ngjyrat dhe fontet e UAMD
│
├── hooks/
│   ├── useAuth.js              # Lexon gjendjen e autentikimit
│   ├── useRole.js              # Kontrollon rolin e përdoruesit
│   └── usePageTitle.js         # Vendos titullin e faqes
│
├── layouts/
│   ├── StudentLayout.jsx       # Shell për studentin (sidebar + content)
│   ├── PedagogLayout.jsx       # Shell për pedagogun
│   └── AdminLayout.jsx         # Shell për adminstratorin
│
├── pages/
│   ├── student/                # Faqet e portalit të studentit
│   │   ├── BallinaPage.jsx
│   │   ├── NotatPage.jsx
│   │   └── OrariPage.jsx
│   ├── pedagog/                # Faqet e portalit të pedagogut
│   │   ├── BallinaPage.jsx
│   │   ├── KursetPage.jsx
│   │   └── OrariPage.jsx
│   └── admin/                  # Faqet e panelit të adminit
│       ├── BallinaPage.jsx
│       ├── StudentatPage.jsx
│       ├── PedagogatPage.jsx
│       ├── LendetPage.jsx
│       └── RaportetPage.jsx
│
├── router/
│   ├── index.jsx               # Të gjitha route-t e aplikacionit
│   ├── routes.js               # Konstantet e path-eve (mos shkruaj strings direkt)
│   └── roleGuards.js           # Funksione ndihmëse për kontrollin e roleve
│
├── services/
│   ├── axiosInstance.js        # Axios i konfiguruar (token, interceptors, gabime)
│   ├── authService.js          # API calls: login, logout, /me
│   ├── studentService.js       # API calls për studentin
│   ├── pedagogService.js       # API calls për pedagogun
│   ├── akademiaService.js      # API calls për fakultetet dhe programet
│   ├── lajmeService.js         # API calls për lajmet
│   └── adminService.js         # API calls CRUD për adminin
│
├── store/
│   ├── authStore.js            # Gjendja globale: user, token, login/logout
│   └── uiStore.js              # Gjendja e UI: sidebar, titulli i faqes
│
├── utils/
│   ├── constants.js            # ROLES, PAGE_SIZE, ROLE_DEFAULT_ROUTES
│   ├── formatters.js           # Formatimi i datave dhe notave
│   ├── validators.js           # Validime të thjeshta (email, required)
│   └── storage.js              # Abstragim i localStorage për token-at
│
├── App.jsx                     # Root: ConfigProvider (tema) + RouterProvider
└── main.jsx                    # Pika hyrëse e aplikacionit
```

---

## Route-t e aplikacionit

| Path | Roli i kërkuar | Çfarë shfaq |
|---|---|---|
| `/` | — | Ridrejton te `/student` |
| `/student` | student, admin | Ballina e studentit |
| `/student/notat` | student, admin | Notat |
| `/student/orari` | student, admin | Orari |
| `/pedagog` | pedagog, admin | Ballina e pedagogut |
| `/pedagog/kurset` | pedagog, admin | Kurset |
| `/pedagog/orari` | pedagog, admin | Orari |
| `/admin` | admin | Ballina e adminit |
| `/admin/studentat` | admin | Menaxhim studentësh |
| `/admin/pedagogat` | admin | Menaxhim pedagogësh |
| `/admin/lendet` | admin | Menaxhim lëndësh |
| `/admin/raportet` | admin | Raporte |
| `/*` | — | Faqja 404 |

> Route-t janë të mbrojtura me `ProtectedRoute`. Nëse nuk je i/e kyçur, ridrejton te `/login`. Nëse ke rol të gabuar, ridrejton te ballina jote.

---

## Si funksionon autentikimi

Autentikimi menaxhohet me **Zustand** (`authStore`) dhe token-at ruhen në **localStorage**.

```
Hapi 1 — Kyçja (pedagog / admin):
  authStore.login({ email, password })
  → dërgon POST /api/v1/auth/login
  → ruan token-in në localStorage
  → vendos user dhe isAuthenticated: true në store

Hapi 1b — Kyçja (student):
  → shflet te GET /api/v1/auth/google/redirect
  → Google ridrejton te callback-u
  → backend kthen { user, token }
  (shih docs/today-plan.md — F3 për detaje të implementimit)

Hapi 2 — Çdo kërkesë API:
  axiosInstance (interceptor)
  → lexon token nga localStorage
  → i bashkëngjit si: Authorization: Bearer <token>

Hapi 3 — Token skadon (401):
  axiosInstance (interceptor)
  → logout() automatik + ridrejton te /login
  → Sanctum nuk ka refresh token — token-i zgjat 24h, pas kësaj ri-kyçja është e detyrueshme

Hapi 4 — Dalja:
  authStore.logout()
  → dërgon POST /api/v1/auth/logout (revokon token-in në server)
  → fshin token-in nga localStorage
  → pastron gjendjen e store-it
```

---

## Si të bësh një thirrje API

Të gjitha thirrjet API bëhen nëpërmjet skedarëve në `services/`. **Mos përdor axios direkt në komponente.**

```jsx
// ✅ E saktë
import { studentService } from '@/services/studentService';

function NotatPage() {
  const [notat, setNotat] = useState([]);

  useEffect(() => {
    studentService.getNotat(studentId).then(setNotat);
  }, []);
}

// ❌ E gabuar — mos e bëj kështu
import axios from 'axios';
axios.get('http://localhost:8000/api/notat');
```

---

## Si të shtosh një faqe të re

**Shembull: shto faqen "Bursa" te portali i studentit**

**1. Krijo skedarin e faqes**

```jsx
// src/pages/student/BursaPage.jsx
export default function BursaPage() {
  return <div>Bursa</div>;
}
```

**2. Shto route-n në router**

```jsx
// src/router/index.jsx
import BursaPage from '@/pages/student/BursaPage';

// brenda /student children:
{ path: 'bursa', element: <BursaPage /> }
```

**3. Shto konstantën e path-it**

```js
// src/router/routes.js
STUDENT_BURSA: '/student/bursa',
```

**4. Shto item-in në menu (opsionale)**

```jsx
// src/layouts/StudentLayout.jsx
{ key: ROUTES.STUDENT_BURSA, icon: <BankOutlined />, label: 'Bursa' }
```

---

## Si të lexosh dhe ndryshosh gjendjen globale (Zustand)

```jsx
import { useAuthStore } from '@/store/authStore';

// Lexo
const user = useAuthStore((s) => s.user);
const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

// Vepro
const logout = useAuthStore((s) => s.logout);
logout();
```

Ose përdor hook-un e gatshëm:

```jsx
import { useAuth } from '@/hooks/useAuth';

const { user, isAuthenticated, login, logout } = useAuth();
```

---

## Importet — mos përdor paths relative të gjata

Projekti ka konfiguruar aliaz `@` → `src/`. Gjithmonë importo kështu:

```js
// ✅ E saktë
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/router/routes';

// ❌ E gabuar
import { useAuth } from '../../../hooks/useAuth';
```

---

## Konventat e emërtimit

| Tip skedari | Format | Shembull |
|---|---|---|
| Komponent / Faqe | PascalCase | `NotatPage.jsx` |
| Hook | camelCase + `use` | `useAuth.js` |
| Store | camelCase + `Store` | `authStore.js` |
| Service | camelCase + `Service` | `studentService.js` |
| Konstante route | SCREAMING_SNAKE | `ROUTES.STUDENT_NOTAT` |

---

## Komandat e disponueshme

```bash
npm run dev           # Nis serverin e zhvillimit (localhost:3000)
npm run build         # Build për prodhim
npm run preview       # Shiko build-in e prodhimit lokalisht
npm run lint          # Kontrollo gabimet e kodit
npm run lint:fix      # Korrigjo gabimet automatikisht
npm run format        # Formato të gjithë kodin
npm run format:check  # Kontrollo nëse kodi është i formatuar
```

---

## Konventat e commit-eve

Çdo commit duhet të ndjekë këtë format:

```
<tip>(<scope>): <përshkrim në shqip>
```

**Tipet e lejuara:**

| Tip | Kur përdoret |
|---|---|
| `feat` | Veçori e re |
| `fix` | Korrigjim gabimi |
| `docs` | Ndryshime në dokumentacion |
| `style` | Formatim, nuk ndryshon logjikën |
| `refactor` | Ristrukturim kodi |
| `chore` | Mirëmbajtje (dependencies, config) |

**Shembuj:**
```bash
git commit -m "feat(notat): shto tabelën e notave për studentin"
git commit -m "fix(orari): korrigjo shfaqjen e orarit në mobile"
git commit -m "docs(readme): perditeso udhëzimet e instalimit"
```

> Husky do të bllokojë commit-in nëse mesazhi nuk ndjek këtë format.

---

## Çfarë mbetet për t'u bërë

Faqet aktuale janë **stub** — kthejnë vetëm tekstin e tyre. Detyra e ekipit FE është t'i ndërtojë ato me UI dhe të dhëna reale.

| Faqe | Team | Status |
|---|---|---|
| `/student` — Ballina | FE | 🔲 Në pritje |
| `/student/notat` | FE | 🔲 Në pritje |
| `/student/orari` | FE | 🔲 Në pritje |
| `/pedagog` — Ballina | FE | 🔲 Në pritje |
| `/pedagog/kurset` | FE | 🔲 Në pritje |
| `/pedagog/orari` | FE | 🔲 Në pritje |
| `/admin` — Ballina | FE | 🔲 Në pritje |
| `/admin/studentat` | FE | 🔲 Në pritje |
| `/admin/pedagogat` | FE | 🔲 Në pritje |
| `/admin/lendet` | FE | 🔲 Në pritje |
| `/admin/raportet` | FE | 🔲 Në pritje |
| Login Page | FE | 🔲 Në pritje (pas BE) |
