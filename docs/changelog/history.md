# Project AURUM Release Changelog

## [1.2.0] - 2026-07-04
### Added
* Developed Global Search synonym expansion mappings matching traditional tags (kada, anguthi, sona) inside `concierge.ts`.
* Created Wishlist context tracking item metadata (added date, source, sync state) and automating database syncing (`WishlistContext.tsx`).
* Developed Product Compare context with an increased capacity limit supporting up to 4 items (`CompareContext.tsx`).
* Created reusable recently viewed histories hook (`useRecentlyViewed.ts`) capped at 8 items.
* Coded floating chat concierge helper widget (`WhatsAppConcierge.tsx`) with prefilled message templates.
* Built public compare page `/compare` rendering side-by-side comparison tables.
* Built public wishlist page `/wishlist` visual grid.
* Connected homepage showroom appointments scheduler directly to real Supabase database writes.
* Integrated related products similarity algorithms, breadcrumb navigation, and sharing actions to public PDP screens.

## [1.1.0] - 2026-07-04
### Added
* Constructed Categories taxonomy manager display trees (`CategoryList`) and form validation overlays (`CategoryForm`).
* Developed Editorial Collections panel (`CollectionList`) with banner image uploads via FileUploader and checkboxes mapping products (`CollectionForm`).
* Coded Daily Rate Manager (`RateManager`) allowing store managers to override commodity rate indexes (Gold 24K, 22K, 18K, and Silver) to trigger live product calculations.
* Built visual Homepage Builder (`HomepageBuilder`) mapping taglines and layouts.
* Created repository `/docs` directories housing system specification baselines, schema maps, components catalogs, and deployment protocols.
* Linked routing contexts and expanded authorization checks.

## [1.0.0] - 2026-07-04
### Added
* Scaffolded React 19, Vite, and TypeScript.
* Customized TailwindCSS v4 with luxury gold, obsidian, and pearl color tokens.
* Developed Homepage Module v1 containing the Rates Marquee and Booking scheduler.
* Coded Authentication Module v1 implementing session managers, guards, and mock login fallbacks.
* Programmed Supabase Database Module v1 migrations schema tables, views, and RLS policies.
* Developed client-side canvas WebP compressions and the Media Resource Library.
* Designed responsive console Layout wrappers (`AdminLayout`) and nested router outlets.
* Developed public PLP/PDP visual catalogs and Admin product list tables and forms.
