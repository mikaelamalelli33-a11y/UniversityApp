# UAMD University App — Frontend

Portali web i Universitetit Aleksander Moisiu Durrës.  
Projekt akademik për lëndët **Database** dhe **Advanced Web**.

> **Stack:** React 19 · Vite · Ant Design 5 · React Router v6 · Zustand · Axios

---

## Kërkesat paraprake

Para se të nisësh, sigurohu që ke të instaluar:

- [Node.js](https://nodejs.org/) v18 ose më i ri
- npm v9 ose më i ri (vjen me Node.js)
- Git

---

## Si të nisësh

```bash
# 1. Klono repon
git clone https://github.com/mikaelamalelli33-a11y/UniversityApp.git
cd UniversityApp

# 2. Instalo dependencies
npm install

# 3. Krijo skedarin e variablave të mjedisit
cp .env.example .env.local

# 4. Nise serverin e zhvillimit
npm run dev
# Hapet në http://localhost:3000
```

---

## Komandat

```bash
npm run dev          # Server zhvillimi (me hot reload)
npm run build        # Build për prodhim
npm run preview      # Shiko build-in lokalisht para deploy
npm run lint         # Kontrollo gabimet e kodit
npm run lint:fix     # Korrigjo gabimet automatikisht
npm run format       # Formato të gjithë kodin
```

---

## Shënime të rëndësishme

### Gjuha
E gjithë UI është **në shqip**. Të gjitha label-et, mesazhet dhe navigimi shkruhen në shqip.

### Importet — aliaz `@`
Gjithmonë përdor `@/` në vend të paths relative:
```js
// ✅ E saktë
import { useAuth } from '@/hooks/useAuth';

// ❌ E gabuar
import { useAuth } from '../../../hooks/useAuth';
```

### Thirrjet API
Bëhen vetëm nëpërmjet skedarëve në `src/services/`. Mos importo `axios` direkt në komponente.

### Variablat e mjedisit
Të gjitha variablat duhet të fillojnë me `VITE_`. Shiko `.env.example` për listën e plotë.  
**Kurrë** mos commito skedarin `.env.local`.

### Commit-et
Çdo commit duhet të ndjekë formatin:
```
feat(scope): përshkrim
fix(scope): përshkrim
docs(scope): përshkrim
```
Husky do të bllokojë commit-in nëse formati nuk është i saktë.

### Rolet
Aplikacioni ka tre role: `admin`, `pedagog`, `student`.  
Çdo rol ka layout dhe route-t e veta. Route-t janë të mbrojtura — pa login ridrejton te `/login`.

---

## Struktura (e shkurtër)

```
src/
├── pages/        # Faqet — një dosje për çdo rol (student/, pedagog/, admin/)
├── layouts/      # Shell-et me sidebar për çdo rol
├── services/     # Të gjitha thirrjet API
├── store/        # Gjendja globale (Zustand)
├── hooks/        # Custom hooks
├── router/       # Route-t dhe mbrojtja me role
├── utils/        # Funksione ndihmëse dhe konstante
└── config/       # Tema e Ant Design
```

---

## Dokumentacion i plotë

Shiko [docs/frontend.md](docs/frontend.md) për:
- Strukturën e plotë të projektit
- Si funksionon autentikimi
- Si të shtosh faqe dhe route të reja
- Konventat e emërtimit
- Listën e detyrave për ekipin
