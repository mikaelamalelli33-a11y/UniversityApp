# Mirë se vini në University App 👋

Bazohuni tek ky dokument ne menyre qe ta keni me te lehte zhvillimin e applikacionit. 
Fillimisht mund te jete pak e veshtire per tu pershtatur dhe kuptuar cdo pjese. Nuk keni nevojë të kuptoni gjithçka qe ne momentin e pare. Me kalimin e kohes, praktike dhe patjeter bugs, do ti kuptoni me qarte konceptet dhe sesi lidhen pjesezat e aplikacionit me njera-tjeter. 
Ky dokument ju tregon **saktësisht çfarë duhet të dini** për të filluar.

---

## 1. Si ta nisni projektin

### Hapi 1 — Instaloni varësi(dependencies) - bëhet vetëm një herë ose ne rast se ka ndryshime ne package.json file
Hapni terminalin në dosjen `university-app/` dhe shkruani:
```bash
npm install
```

### Hapi 2 — Krijoni skedarin `.env`
Kopjoni skedarin `.env.example` dhe emërtojeni `.env`:
```bash
cp .env.example .env
```

### Hapi 3 — Nisni projektin
```bash
npm run dev
```

Hapni shfletuesin dhe shkoni te `http://localhost:3000`.  
Do të shihni një faqe me tre butona (Student, Pedagog, Admin) — kjo është **dev login**, vetëm për testim. 
Do ta zhvillojme me kalimin e kohes.

---

## 2. Si është organizuar projekti

Mendojeni projektin si një ndërtesë me dhoma:

```
src/
├── pages/          ← KËTU do te shtoni faqet e aplikacionit
├── services/       ← KËTU shtohen thirrjet API (të dhëna nga serveri)
├── components/     ← Pjesë UI të ripërdorshme (butona, tabela, etj.)
├── hooks/          ← Funksione ndihmëse React
├── router/         ← Konfigurimi i URL-ve (rrugëve/paths)
├── store/          ← Gjendja globale (user i kyçur, etj.)
└── layouts/        ← Struktura vizuale (sidebar, header)
```

> **Rregulli i pare:** Ne fillim, punoni kryesisht në `pages/` dhe `services/`.  
> Pjesa tjetër është infrastrukturë — mundohuni te bazoheni tek menyra si eshte ndertuar apo perdorur.

---

## 3. Tre gjërat që do të bëni 90% të kohës

---

### DETYRA 1 — Krijoni një faqe të re

**Shembull:** Duam të shtojmë faqen "Bursa" për studentin, te rruga `/student/bursa`.

**Hapi 1** — Krijoni skedarin e faqes

Krijoni skedarin `src/pages/student/BursaPage.jsx`:

```jsx
import { usePageTitle } from '@/hooks/usePageTitle';

export default function BursaPage() {
  usePageTitle('Bursa'); // vendos titullin e faqes në browser dhe header

  return <div>Bursa</div>;
}
```

> Ky është minimumi. Çdo faqe duhet të ketë:
> - `export default function EmriPage()` — emri duhet t'i përgjigjet skedarit
> - `usePageTitle('Titulli')` — vendos titullin që shfaqet në header

---

**Hapi 2** — Shtoni URL-në (rrugën)

Hapni `src/router/routes.js` dhe shtoni rrugën e re brenda `STUDENT`:

```js
STUDENT: {
  ROOT: '/student',
  NOTAT: '/student/notat',
  ORARI: '/student/orari',
  BURSA: '/student/bursa',  // ← shtoni këtu
},
```

---

**Hapi 3** — Shtoni në menunë anësore *(nëse doni ta shfaqni në sidebar)*

Hapni `src/router/menuConfig.jsx` dhe shtoni një rresht në listën `student`:

```jsx
import { BankOutlined } from '@ant-design/icons'; // importoni ikonën

student: [
  { key: ROUTES.STUDENT.ROOT,   icon: <HomeOutlined />,     label: 'Ballina' },
  { key: ROUTES.STUDENT.NOTAT,  icon: <FileTextOutlined />, label: 'Notat'   },
  { key: ROUTES.STUDENT.ORARI,  icon: <ScheduleOutlined />, label: 'Orari'   },
  { key: ROUTES.STUDENT.BURSA,  icon: <BankOutlined />,     label: 'Bursa'   }, // ← e re
],
```

> Ikona merret nga `@ant-design/icons`. Mund të gjeni ikonat këtu:  
> https://ant.design/components/icon

---

**Hapi 4** — Regjistroni faqen në router

Hapni `src/router/index.jsx`. Gjeni seksionin **"Lazy imports"**:

"Lazy loading" apo "Dynamic import" mund te jete nje koncept pak i avancuar per momentin, 
por i nevojshem per performancen e aplikacionit. 

Ndiqni shembujt qe jane perdorur dhe shtoni componentin e ri si me poshte  

```js
// Student pages
const BallinaStudentPage = lazy(() => import('@/pages/student/BallinaPage'));
const NotatPage          = lazy(() => import('@/pages/student/NotatPage'));
const OrariStudentPage   = lazy(() => import('@/pages/student/OrariPage'));
const BursaPage          = lazy(() => import('@/pages/student/BursaPage')); // ← e re
```

Pastaj gjeni seksionin **"Student portal"** dhe shtoni child-in:

```js
children: [
  { index: true, element: <BallinaStudentPage /> },
  { path: 'notat',  element: <NotatPage /> },
  { path: 'orari',  element: <OrariStudentPage /> },
  { path: 'bursa',  element: <BursaPage /> },  // ← e re (vetëm segmenti, jo /student/bursa)
],
```

> ⚠️ Vini re: child path është `'bursa'`, jo `'/student/bursa'`.  
> React Router e bashkon vetë me parent path-in.

✅ **Gati!** Shkoni te `http://localhost:3000/student/bursa` dhe faqja juaj shfaqet.

---

### DETYRA 2 — Merrni të dhëna nga API 

**Nese backend API nuk eshte ndertuar akoma anashkaloje kete hap per momentin**

**Shembull:** Doni të shfaqni listën e notave të studentit.

**Hapi 1** — Sigurohuni që thirrja API ekziston

Hapni `src/services/studentService.js`. Nëse thirrja nuk ekziston, shtojeni:

```js
export const studentService = {
  // ...thirrjet ekzistuese...
  getBursa: (studentId) => axiosInstance.get(`/api/v1/studentat/${studentId}/bursa`),
};
```

> Mos e importoni `axios` direkt. Gjithmonë përdorni `axiosInstance` —  
> ai menaxhon automatikisht token-in, gabimet dhe logout-in.

---

**Hapi 2** — Përdoreni në faqe me `useApi`

```jsx
import { Table, Alert } from 'antd';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useAuth } from '@/hooks/useAuth';
import { useApi } from '@/hooks/useApi';
import { studentService } from '@/services/studentService';

export default function BursaPage() {
  usePageTitle('Bursa');

  const { user } = useAuth(); // merrni user-in e kyçur

  const { data, loading, error } = useApi(
    () => studentService.getBursa(user.id), // thirrja API
    [user?.id]                              // ri-ekzekutohet kur ndryshon user.id
  );

  if (error) {
    return <Alert type="error" message="Ndodhi një gabim. Provoni përsëri." />;
  }

  return (
    <Table
      rowKey="id"
      columns={[
        { title: 'Lloji', dataIndex: 'lloji' },
        { title: 'Shuma', dataIndex: 'shuma' },
      ]}
      dataSource={data ?? []}
      loading={loading}
    />
  );
}
```

> `useApi` menaxhon automatikisht:
> - `loading: true` ndërsa pret përgjigjen
> - `data` kur përgjigja vjen
> - `error` nëse diçka shkon gabim

---

### DETYRA 3 — Shfaqni të dhëna statike *(pa API)*

Nëse faqja nuk ka nevojë për API (p.sh. një faqe informacioni), thjesht ktheni JSX:

```jsx
import { usePageTitle } from '@/hooks/usePageTitle';
import { Card, Typography } from 'antd';

export default function RregullorePage() {
  usePageTitle('Rregullore');

  return (
    <Card title="Rregullore e Universitetit">
      <Typography.Paragraph>
        Teksti i rregullores...
      </Typography.Paragraph>
    </Card>
  );
}
```

---

## 4. Çfarë të MOS prekni

Këto skedarë janë "infrastruktura" e projektit. Janë shkruar me kujdes dhe prekja e tyre pa e kuptuar mirë mund të thyejë gjëra që nuk kanë lidhje me punën tuaj.

| Skedari | Pse mos e prekni |
|---|---|
| `src/services/axiosInstance.js` | Menaxhon token-in dhe gabimet globale |
| `src/store/authStore.js` | Menaxhon sesionin e user-it |
| `src/router/roleGuards.js` | Kontrollon aksesin sipas rolit |
| `src/components/common/ProtectedRoute.jsx` | Mbron rrugët nga aksesi i paautorizuar |
| `src/App.jsx` | Pikënisja e aplikacionit |

> Nëse mendoni se duhet të ndryshoni diçka nga lista, **konsultohuni fillimisht me studentet e tjere**.

---

## 5. Gabime të zakonshme

**"Faqja ime nuk shfaqet"**
→ Kontrolloni nëse e keni shtuar në `router/index.jsx` (hapi 4 i Detyrës 1)

**"Linku i menusë nuk funksionon"**
→ Kontrolloni nëse URL-ja në `routes.js` dhe `menuConfig.jsx` janë identike

**"API po kthen 401"**
→ Token-i ka skaduar. Dilni dhe hyni përsëri nga dev login

**"Ikona nuk shfaqet"**
→ Kontrolloni nëse e keni importuar nga `@ant-design/icons`

---

## 6. Cheat sheet

```
Faqe e re          →  src/pages/<role>/EmriPage.jsx
URL e re           →  src/router/routes.js
Menu item i ri     →  src/router/menuConfig.jsx
Regjistrim route   →  src/router/index.jsx
Thirrje API e re   →  src/services/<domain>Service.js
Të dhëna në faqe   →  useApi() hook
User i kyçur       →  useAuth() hook
Titull faqeje      →  usePageTitle('Titulli')
```

---

## 7. Pyetje?

**Aplikacioni permban skedare dokumentacion, jane skedaret me prapashtese .md (Markdown files)**

Disa prej type:
1. `src/router/README.md` — si funksionon routing
2. `src/services/README.md` — si funksionojnë shërbimet API
3. `src/pages/README.md` — si krijohen faqet
4. `src/hooks/useApi.js` — komente të detajuara për data fetching
5. etj. 

**Për çdo pyetje, paqartësi, apo diskutim të mundshëm mos hezitoni të pyesni pjesëtarët e tjerë — mund t'i ndihmoni edhe ata me pyetjet tuaja!**

---

## 8. Extensions të VSCode (të rekomanduara)

Extensions janë shtesa që e bëjnë VSCode-in shumë më të fuqishëm.  
Instaloni këto para se të filloni — do t'ju kursejnë shumë kohë.

### Si të instaloni një extension
1. Hapni VSCode
2. Shtypni `Ctrl + Shift + X`
3. Kërkoni emrin e extension-it
4. Klikoni **Install**

---

### Extensions të detyrueshme

| Extension | Pse | Emri për kërkim |
|---|---|---|
| **ESLint** | Ju tregon gabimet në kod ndërsa shkruani | `ESLint` nga Microsoft |
| **Prettier** | Formon kodin automatikisht kur ruani skedarin | `Prettier - Code formatter` |
| **ES7+ React Snippets** | Shkurtesa për React — p.sh. `rafce` + Tab krijon një komponent të plotë | `ES7+ React/Redux/React-Native snippets` |
| **Error Lens** | Shfaq gabimet direkt pranë rreshtit, jo vetëm në panel | `Error Lens` |

---

### Extensions shumë të dobishme

| Extension | Pse | Emri për kërkim |
|---|---|---|
| **Auto Rename Tag** | Kur ndryshoni `<div>` e hap, ndryshon automatikisht edhe `</div>` e mbyllur | `Auto Rename Tag` |
| **Path Intellisense** | Sugjerime automatike për rrugët e skedarëve gjatë importeve | `Path Intellisense` |
| **GitLens** | Shfaq kush e ka shkruar çdo rresht dhe kur — i dobishëm për të kuptuar kodin | `GitLens` |
| **Material Icon Theme** | Ikonë të ndryshme për çdo lloj skedari — e bën sidebar-in e VSCode shumë më të lexueshëm | `Material Icon Theme` |
| **Thunder Client** | Testoni API-n direkt nga VSCode pa programe të tjera | `Thunder Client` |

---

### Konfigurimi i Prettier (bëhet një herë)

Pasi të keni instaluar Prettier, konfiguroni VSCode-in ta ekzekutojë automatikisht kur ruani:

1. Shtypni `Ctrl + Shift + P`
2. Shkruani `Open User Settings (JSON)` dhe shtypni Enter
3. Shtoni këto rreshta:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

> Tani çdo herë që shtypni `Ctrl + S`, kodi formohet automatikisht.

---

### Snippet i dobishëm — React component i shpejtë

Me extension **ES7+ React Snippets** të instaluar, hapni çdo skedar `.jsx` dhe shkruani:

```
rafce
```

Pastaj shtypni `Tab` — gjenerohet automatikisht:

```jsx
import React from 'react'

const EmriSkedarit = () => {
  return (
    <div>EmriSkedarit</div>
  )
}

export default EmriSkedarit
```

> 💡 Kjo ju kursen të shkruani të njëjtën strukturë çdo herë që krijoni një komponent të ri.




