# Plan: Phase 2 — client (Vite + React)

**Status:** Not started
**Master reference:** `REFACTOR_PLAN.md`, Phase 2 section — this file tracks execution-level detail/notes as they come up; the plan itself lives there, not duplicated here.

## Scope (from REFACTOR_PLAN.md)

- Scaffold `client/` with Vite's `react-ts` template
- Only 3 runtime deps: axios, react-router-dom, @tanstack/react-query
- Hand-roll what bootstrap/swiper/react-bootstrap did (CarCard, grid, navbar, scroll-snap Carousel) — no Redux, replaced by a `useAuth()` hook against `/api/auth/me`
- Feature-based folders: `features/cars/`, `features/auth/`, each with `api.ts`/`hooks.ts`/`components/`/`pages/`
- One-wrapper-per-dependency rule: `lib/http.ts` is the only axios import, `features/*/hooks.ts` the only React Query usage
- Port order: static components first, then `DataBase` → `DetailedInfo` → merge `PostAuto`/`Edit` into one `CarForm` → `UserForm` → routes/`ProtectedRoute`
- Checkpoint 2: `tsc --noEmit` clean, `vite build` succeeds, manual click-through before Phase 2.5

## Notes / decisions as they come up during execution

*(empty — fill in during the actual Phase 2 session; this is the pattern other `plan-` docs in `ongoing/` should follow: link back to REFACTOR_PLAN.md for the "what", capture only new-since-planning detail here)*
