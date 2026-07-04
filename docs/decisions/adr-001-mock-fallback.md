# ADR-001: Autonomic Mock Fallback Authorization

## Context
During initial development, physical cloud database servers or Supabase API credentials are often not fully provisioned. However, visual checking of layouts, routes, and admin panels is required immediately.

## Decision
We implemented a local sandbox fallback inside `AuthContext.tsx`. If default placeholder settings are detected:
1. The app bypasses cloud auth checks.
2. Form submits check against a predefined admin credentials structure (`admin@chandrakalajewellers.com` / `Password123`).
3. If matches are found, it generates a mock User object and signs them in, storing the session token locally.

## Consequences
* **Pros:** Allows running and testing the app instantly out-of-the-box.
* **Cons:** Must be disabled before deploying to production configurations to prevent security bypasses.
