# AGENTS.md

Guidance for AI coding agents (and humans) working in this repo. See `REFACTOR_PLAN.md` for the full rebuild plan and its execution status.

**Architecture goal: scalability and maintainability, not just "make it work."** This is why the codebase leans on the boundary conventions below (one wrapper per dependency, feature module layering, folder-per-component) even at a size where they're not strictly required yet. It's also why a couple of calls in this repo trade "wait for a second real use case" for "promote to a shared location now, cheaply, because the shape is already clear" — e.g. `client/src/hooks/useCarousel.ts` was promoted out of `Carousel/`'s own folder before a second carousel component existed. That's a deliberate exception, not the default: still wait for real need before adding structure, but when a move is cheap and reversible and clearly supports where the codebase is headed, don't feel bound to wait.

**Cross-session/cross-project context lives outside this repo**, at `Development\claudeContext\` (a separate git repo, sibling to this project's parent folder) — not nested here on purpose, since it also covers other projects. Check `Development\claudeContext\car-database\` for this project's decisions/sessions/ongoing work, and the top-level `reminders/`/`ideas/` for cross-project conventions, before assuming a clean slate.

## Layout

Two independent npm packages, no shared code between them:

- `server/` — Express + TypeScript + Mongoose. Session auth via Passport.
- `client/` — Vite + React + TypeScript. Ported in Phase 2 of `REFACTOR_PLAN.md`; tests/styling pass/automations still pending (Checkpoint 2 stage).

Legacy pre-refactor code (`server.js`, `src/`) still sits at the repo root until Phase 3 deletes it — treat it as read-only reference for porting, not as something to extend.

## Core rule: one wrapper per third-party dependency

Every external library is used from exactly one module; the rest of the codebase imports that module, never the library directly. This is what makes a dependency swappable later without touching call sites.

Server examples: `src/lib/zod.ts` is the only place `zod` is imported and extended (with `zod-to-openapi`); `src/config/db.ts` is the only file that knows the Mongoose connection string; `src/config/passport.ts` is the only file configuring Passport strategies.

Client: `lib/http.ts` wraps axios; `features/*/hooks.ts` is the only place React Query is called from — components never import axios or `useQuery` directly.

## Server (`server/`)

- Routes (`src/routes/`) → middleware (`src/middleware/`) → models (`src/models/`). No service/repository layer — the app is small enough that one would be premature.
- `src/app.ts` builds the Express app from plain config params and does no I/O itself (no `listen`, no `connect`) — that's what makes it testable with Supertest without a real port or real Mongo. `src/index.ts` is the only file that reads `process.env` and actually starts things.
- All car/auth request bodies are validated with zod schemas in `src/validation/`, applied via the `validate()` middleware. Never read `req.body` fields without going through validation first — the original app's mass-assignment bug (`$set: req.body`) is exactly what this prevents.
- **Errors are structured, not loose strings.** Throw `new AppError(code, status, message, details?)` from `src/lib/AppError.ts` (or `next()` it) instead of calling `res.status().json()` directly for an error case; the central `errorHandler` middleware (mounted last in `app.ts`) formats it as `{ error: { code, message, details? } }`. Async route handlers must be wrapped in `asyncHandler` (`src/lib/asyncHandler.ts`) so a rejected promise reaches `errorHandler` instead of hanging the request. Unexpected (non-`AppError`) errors always get a generic `INTERNAL_ERROR` 500 with a `requestId` for log correlation — never leak internal error text to the client. Login deliberately returns one generic `INVALID_CREDENTIALS` for both "no such user" and "wrong password", to avoid username enumeration; every other error case should be as specific as possible.
- **API docs are generated from code, not hand-written.** `src/validation/*.ts` schemas carry `.openapi(...)` metadata; `src/openapi/paths.ts` registers each route against them; `src/openapi/document.ts` builds the OpenAPI document at runtime, served at `/api/docs`. If you add or change a route, register it in `src/openapi/paths.ts` in the same change — `npm run docs:check` (spec lint + a coverage diff against the real Express route table) fails otherwise, in CI and locally.
- Scripts: `npm run seed` (fill an empty DB with sample cars), `npm run migrate` (one-time legacy-schema conversion, already run against the real dev DB), `npm run docs:check`, `npm run audit`.

## Client (`client/`)

- **Every component lives in its own folder**: `ComponentName/ComponentName.tsx` + co-located `ComponentName.module.css` (if it has one) + `index.ts` barrel (`export { ComponentName } from './ComponentName'`). Importers use `'../components/ComponentName'` regardless — the barrel means that path resolves the same whether the component is a flat file or a folder, so no other file's imports change when a component is added or restructured. New components get scaffolded into this shape from the start, not flattened "for now."
- Feature-based: `features/cars/`, `features/auth/`, each with `api.ts` (the only place that calls `lib/http.ts`), `hooks.ts` (the only place React Query is used for that feature's data), `components/`, `pages/`. Features don't import from each other; shared code lives in top-level `components/`, `lib/`, or `hooks/`.
- `hooks/` (top-level) is for hooks genuinely shared across components — not the default; component-specific hook logic still co-locates inside that component's own folder first (see `react-component-split` / `code-boundary-conventions` skills).
- `routes.tsx` holds the route table (`<Routes>`/`<Route>`); `App.tsx` just renders it — mirrors the server's `app.ts`/`routes/*.ts` split. Keep `App.tsx` minimal.
- `types/index.ts` mirrors the server's `Car`/`User` shapes (including `FUEL_TYPES`/`BODY_STYLES` as the same string-literal arrays) — keep the two in sync by hand for now; a shared-types package is only worth it once a second consumer exists.
- Design tokens (`styles/tokens/{colors,spacing,layout}.css`) are the only place raw color/spacing/radius values are defined; component CSS Modules reference the `var(--...)` tokens, never hardcode a value a token already covers. Ported CSS keeps its original percentage-based layout values as-is (extraction pass, not a redesign) — tokens replace repeated *values* (colors, radii), not every layout number.
- `ProtectedRoute` (in `features/auth/components/`) is a client-side UX nicety (redirect to `/userform` when logged out) — the server's `isAuthenticated` middleware is the real guard; never treat the client-side check as the security boundary.

## Quality gate

Before considering a change done, run (from the relevant package):

```
npm run typecheck
npm test              # no client tests yet (Phase 2 tests section, pending)
npm run docs:check    # server only
npm run build          # client only
npm audit
```

These are the same checks CI runs (Phase 2.5 of the plan). No dependency gets added without checking `npm audit` afterward — see the plan's "Dependency sanitization" note.

## What not to do

- Don't add a new library without wrapping it per the rule above.
- Don't hand-edit `server/openapi.generated.yaml` — it's a build artifact (gitignored), regenerated by `npm run docs:generate`.
- Don't touch the legacy root `server.js`/`src/` except to read them as a porting reference.
- Don't implement anything listed under "Future work — explicitly OUT of scope" in `REFACTOR_PLAN.md` (admin portal, image upload, redesign, deployment, data import) unless specifically asked — they're intentionally deferred past this refactor.
