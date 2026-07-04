# Project AURUM System Architecture Specification

## 1. System Design Goals
* **Premium Digital Showroom:** Immersive visual experience utilizing elegant gradients, custom micro-animations, and glassmorphism.
* **Strict Role Gating:** Multi-tenant access controls for `super_admin`, `catalog_manager`, and `store_manager`.
* **Dynamic Valuation Engines:** Client pricing calculations linked to daily commodity indexes.

## 2. Technology Stack
* **Frontend Framework:** React 19, TypeScript, Vite
* **Styling & Motion:** TailwindCSS v4, Framer Motion, Lucide Icons
* **Query & Data State:** TanStack React Query, React Hook Form, Zod Schemas
* **Database Backend:** Supabase Auth, Supabase Storage, Supabase PostgreSQL

## 3. Directory Layout Guidelines
```
project-aurum/
├── docs/                      # Living documentation repository
├── src/
│   ├── components/            # Reusable UI & Common Layout primitives
│   │   ├── common/
│   │   └── ui/
│   ├── context/               # Global states & providers
│   ├── features/              # Feature modules (admin, products, homepage)
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Supabase clients & media helpers
│   └── routes/                # Central routing table maps
```

## 4. Coding Conventions
* **Strict TypeScript:** No `any` declarations. All type interfaces explicitly defined.
* **Separation of Concerns:** Component views decoupled from calculations or data-fetching logic.
* **Accessibility:** Semantic HTML, ARIA labels, keyboard focus highlights.
