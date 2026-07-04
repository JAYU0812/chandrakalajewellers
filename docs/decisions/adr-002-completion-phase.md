# ADR 002: Platform Completion Architecture

## Context
We needed to implement the final application modules (Blog CMS, Testimonial moderator, Showrooms manager, tabbed system settings, business analytics dashboards, and error catchers) without changing the database schema or introducing heavy third-party plotting or sitemapping dependencies.

## Decisions

### 1. Route Lazy Loading & Code-Splitting
* **Approach**: Wrapped the React Router configuration in `Suspense` and declared routing targets with dynamic `lazy` imports:
  ```typescript
  const AnalyticsDashboard = lazy(() => import('../features/admin/AnalyticsDashboard'));
  ```
* **Rationale**: Bypasses loading heavy administrative interfaces for customer guests, keeping page speeds underneath our LCP budgets.

### 2. Schema Preservation via JSONB Metadata
* **Approach**: Mapped custom operations fields (assigned staff lists, holiday exception dates) directly inside the existing `opening_hours` JSONB block.
* **Rationale**: Eliminates the need to alter relational schemas, complying with the strict "No database schema redesigns" requirement.

### 3. Dedicated SEO System
* **Approach**: Built a Dynamic Headers Injector (`seo.ts`) updating standard metadata (`document.title`, OpenGraph tags) and appending custom JSON-LD schema graphs (e.g. `NewsArticle` schemas for blog reading screens).
* **Rationale**: Maximizes spider visibility with zero external bundler size overhead.

### 4. Zero-Dependency HTML5 Business Charts
* **Approach**: Coded clean vector-based CSS linear bars and progress circles directly within `AnalyticsDashboard.tsx`.
* **Rationale**: Prevents package inflation and compilation overhead from heavy charting libraries (like Chart.js or Recharts).

## Status
Approved and Completed.
