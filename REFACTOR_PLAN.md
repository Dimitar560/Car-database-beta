# Car Showroom — Restructure & Refactor Plan

Goal: split the CRA monolith into `server/` (Express + Mongoose 8, TypeScript) and `client/` (Vite + React 18, TypeScript), fix known bugs, modernize deps, add tests. Old code stays in place (`server.js`, `src/`) as the porting source; delete it only in the final step.

Already done: `server/package.json` and `server/.env.example` exist. Everything else below is TODO.

**Execution rules for the model running this plan:**
- Work on branch `refactor/split`, never on `master`.
- The plan contains **🛑 CHECKPOINT** blocks. At each one: run the listed verification yourself, commit, then **STOP and end your turn** — tell the user what to test manually and wait for their go-ahead. Do not continue into the next phase in the same turn, even if everything passes.

## Known bugs to fix during the port (do not copy them over)

1. **API is unprotected** — `isAuth` only hides routes in React (`src/App.js:25,27`). Add Express auth middleware (`req.isAuthenticated()`) on all write routes.
2. `POST /database` and `POST /logout` never send a response (requests hang) — `server.js:91-110,146-149`.
3. `passport.0.7` requires `req.logout(callback)`.
4. `deleteAuto` in `src/components/DataBase.jsx:21-25` fires `alert`/`navigate` immediately (they're passed as extra args to `.then`), not on success. Same bug pattern in `Edit.jsx:34` and `UserForm` register flow.
5. Cars are looked up/deleted/updated **by title** — switch to `_id`.
6. `DataBase.jsx` has two identical copy-pasted card lists (filtered vs unfiltered) — render one list from a single derived array.
7. Hardcoded session secret and Mongo URL — use `.env` (see `server/.env.example`).
8. Mongoose 6 callback API is removed in v8 — rewrite all DB calls as async/await.
9. `PATCH` passes `req.body` straight into `$set` (`server.js:133-135`) — mass-assignment risk. Validate and whitelist body fields on every write route (see zod note in Phase 1).

## Phase 1 — Server (`server/`)

**TypeScript**: update the existing `server/package.json` — add `typescript`, `tsx`, `@types/express`, `@types/cors`, `@types/express-session`, `@types/passport`, `@types/passport-local` (dev). Scripts: `"dev": "tsx watch src/index.ts"`, `"build": "tsc"`, `"start": "node dist/index.js"`. Add `tsconfig.json` (strict: true, outDir dist, module NodeNext).

Structure (ESM, `type: module` already set):
```
server/src/
  index.ts          # express app, middleware, mount routes, listen
  config/db.ts      # mongoose.connect(process.env.MONGO_URI)
  config/passport.ts
  models/Car.ts     # exports the Mongoose model AND the Car interface
  models/User.ts
  middleware/isAuthenticated.ts
  routes/cars.ts    # /api/cars
  routes/auth.ts    # /api/auth (register, login, logout, me)
  tests/            # vitest + supertest
```

**New Car schema** (replaces 10 boolean-ish String fields):
```js
{
  src: String,
  title: { type: String, required: true },
  shortDesc: String,
  priceFrom: Number,
  priceTo: Number,
  fuelTypes: [{ type: String, enum: ["petrol", "diesel", "electric"] }],
  bodyStyles: [{ type: String, enum: ["sedan", "coupe", "wagon", "hatchback", "suv", "minivan", "pickup"] }],
}
```

**Routes** (all responses JSON, proper status codes, try/catch → 500):
- `GET /api/cars`, `GET /api/cars/:id`
- `POST /api/cars`, `PATCH /api/cars/:id`, `DELETE /api/cars/:id` — all behind `isAuthenticated`
- `POST /api/auth/register`, `POST /api/auth/login` (passport local), `POST /api/auth/logout`, `GET /api/auth/me` (returns `{ user }` or 401 — client uses this for auth state)

Session: `express-session` + `connect-mongo` store, secret from env. CORS: `origin: process.env.CLIENT_ORIGIN, credentials: true`.

**Validation**: add `zod` (server dep). Define `carSchema` in `src/validation/car.ts`; a tiny `validate(schema)` middleware parses `req.body` on POST/PATCH and returns 400 with the issues. Never spread raw `req.body` into a query.

**Seed script** `server/scripts/seed.ts`: inserts 3–4 sample cars (reuse data shapes from `src/javaScript/carouselItems.js`) so a fresh DB isn't empty; script `"seed": "tsx scripts/seed.ts"`.

**Existing DB state** (local MongoDB service, `autoDB`): collections `cars` (7 docs), `users` (13), plus `cars_copy` (old manual backup) and `specialusers` (from dead commented-out code). **Ignore `cars_copy` and `specialusers` entirely** — don't migrate, don't drop, don't model them; they stay untouched until the user decides to delete them.

**Migration script** `server/scripts/migrate.js`: read existing `autoDB.cars` docs, convert old fields (`petrol: "true"/true` etc.) into `fuelTypes`/`bodyStyles` arrays, cast prices to Number, write back. Run once, verify with a find, keep script in repo.

**🛑 CHECKPOINT 1 — server done.** Verify: `tsc --noEmit` clean, server tests pass, migration + seed run against local DB. Demonstrate with curl: GET cars list, 401 on unauthenticated POST, register→login→POST car→DELETE it with a session cookie. Commit. STOP — user tests the API before client work begins.

## Phase 2 — Client (`client/`)

Scaffold: `npm create vite@latest client -- --template react-ts` (TypeScript template; all files below are `.ts`/`.tsx`, strict mode on). Runtime deps — only three: `axios`, `react-router-dom@^6`, `@tanstack/react-query@^5`.

**Libraries dropped — build these ourselves:**
- **Redux** — the store (`src/store/store.js`) only holds `isAuthenticated`; replace with a `useAuth()` hook backed by React Query fetching `/api/auth/me`.
- **bootstrap + react-bootstrap** — only used for `Card`/`Row`/`Col` in `DataBase.jsx` and the navbar. Replace with own `<CarCard>` (plain markup + CSS Module) and a CSS grid (`repeat(auto-fill, minmax(18rem, 1fr))`) for the responsive card layout; hand-roll the navbar (it's ~50 lines already). This also deletes the global bootstrap.min.css import.
- **swiper** — `CarouselCar.jsx` is a 33-line image carousel. Replace with a small own `<Carousel>` using CSS `scroll-snap` + prev/next buttons (~60 lines total). No JS library needed.
- **react-hook-form** — not added; `CarForm` is one form, controlled state is enough.

`vite.config.js`: proxy `/api` → `http://localhost:8000` so components use relative URLs (removes all hardcoded `http://localhost:8000`).

New src layout — **feature-based**, so a feature (or a dependency behind it) can be swapped without touching the rest:
```
client/src/
  types/index.ts         # Car, User, auth payloads — mirror server/src/models types
  lib/http.ts            # the ONLY file that imports axios: exports get/post/patch/del
                         # wrappers. Swapping axios for fetch = editing this one file.
  features/
    cars/
      api.js             # getCars, getCar, createCar, updateCar, deleteCar (uses lib/http)
      hooks.js           # useCars, useCar, useCreateCar... (the ONLY place React Query
                         # touches car data — components never call useQuery directly)
      components/        # CarCard, CarForm, CarFilters, DetailedInfo, ExtraDetails
      pages/             # DatabasePage, PostCarPage, EditCarPage
    auth/
      api.js  hooks.js   # useAuth, useLogin, useLogout
      components/        # ProtectedRoute
      pages/             # UserFormPage
  components/            # shared, feature-agnostic only: NavBar, Footer, ErrorPage,
                         #   CarouselCar, FancyImages, SelectBrand
  pages/                 # Home, About, ErrorPage routes
  styles/  assets/
```

Dependency-abstraction rules (apply everywhere):
- Components import only from their feature's `hooks.js`/`api.js` — never axios, never raw URLs, never React Query directly. Each 3rd-party dep is wrapped in exactly one module (`lib/http.ts` for axios; `features/*/hooks.ts` for React Query).
- Features don't import from other features; shared code lives in `lib/` or top-level `components/`.
- Same idea server-side: routes call model methods only; `config/db.js` is the only file knowing the connection; session store config isolated in `index.js`.

Port order (old → new, mostly copy + fix):
1. Static: `NavBar`, `Footer`, `ErrorPage`, `About`, `FancyImages`, `CarouselCar` (rewrite on the own `<Carousel>` component, no swiper), `SelectBrand`, `Home`, all CSS from `src/styles/`, images/icons/`javaScript` data files.
2. `useFetch` → delete; use `useQuery` from React Query instead.
3. `DataBase.jsx` — single card list, filter with `useMemo`, delete via `useMutation` + query invalidation (fixes bug 4/6), link by `_id`.
4. `DetailedInfo` + `ExtraDetails` — fetch by `_id`, render `fuelTypes`/`bodyStyles` arrays.
5. `PostAuto` + `Edit` — these are 95% duplicated; merge into one `CarForm` component (props: initial values + onSubmit) used by both pages. Replace the 15 `useRef`s with controlled state or `FormData`; checkboxes build the two arrays. Consider `react-hook-form` (optional).
6. `UserForm` — becomes `features/auth/pages/UserFormPage`; call `features/auth/hooks.js`, invalidate the `me` query on login/logout. Note: the input is `type="email"` but the server field is `username` — keep as is, it works.
7. `SpecialLogin.jsx` is dead/commented-out code (matching commented server routes) — do not port.
8. `App.js` routes: keep public routes; for `postauto`/`edit` render a `<ProtectedRoute>` that redirects to `/userform` when `useAuth()` says logged out (server middleware is the real guard).

**🛑 CHECKPOINT 2 — client ported.** Verify: `tsc --noEmit` clean, `vite build` succeeds, app runs against the dev server. Commit. STOP — user clicks through the whole app (browse, search, detail page, register/login, create/edit/delete, logout) before tests/automations are added.

### Tests

Server (`vitest` + `supertest` + `mongodb-memory-server`, all dev deps; script `"test": "vitest run"`):
- `routes/cars.test.ts`: GET list/one; POST/PATCH/DELETE return 401 unauthenticated and succeed with a logged-in agent (supertest agent keeps the session cookie); 404 on unknown id.
- `routes/auth.test.ts`: register → login → `GET /me` returns user → logout → `me` returns 401; wrong password → 401.
- Migration script gets a unit test on its field-conversion function (old boolean strings → arrays).

Client (`vitest` + `@testing-library/react` + `@testing-library/user-event` + `msw` for API mocking; script `"test": "vitest run"`):
- `CarForm`: renders initial values, submits the correct `fuelTypes`/`bodyStyles` arrays from checked boxes.
- `DatabasePage`: renders cars from mocked API, search input filters the list, delete button hidden when logged out.
- `ProtectedRoute`: redirects to `/userform` when `me` returns 401.
- Keep it lean — test the refactored/logic-bearing pieces above, not every presentational component.

End-to-end (`@playwright/test`, root-level `e2e/` package; script `"e2e": "playwright test"`):
- Runs against the real stack (start server + client, or `webServer` config in `playwright.config.ts` boots both). Use a throwaway test DB, not `autoDB`.
- One happy-path spec: register → login → add a car via the form → see it in the list → open its detail page → edit → delete → logout. Plus one guard check: logged-out user can't reach `/postauto` (redirected).
- In CI: add a job that installs Playwright browsers (`npx playwright install --with-deps`) and runs `e2e` after build. Keep to the flows above — E2E is slow, so don't duplicate what unit/integration tests already cover.

### Styling pass (after everything works)

- Convert per-component CSS files to **CSS Modules** (`DataBase.module.css` etc.) so class names stop being global.
- Deduplicate shared rules (form inputs, buttons, page titles like `.title-label`) into `src/styles/global.css` with a few CSS variables (colors, spacing) at `:root`.
- Card grid, navbar, buttons, form controls are own components styled with CSS Modules (no bootstrap); no inline `style` props.
- Do not redesign — same look, cleaner code. Visual redesign is a separate future task.

**🛑 CHECKPOINT 3 — tests + styling done.** Verify: all client/server tests green, styling pass applied with no visual regressions. Commit. STOP — user confirms the app still looks right.

## Phase 2.5 — Automations

1. **Root workspaces**: reduce root `package.json` to `"workspaces": ["client", "server"]` with scripts `dev` (run both via `concurrently`), `test`, `lint`, `typecheck` fanning out to both packages.
2. **Lint/format**: ESLint (flat config, typescript-eslint) + Prettier in both packages; `lint` and `format` scripts. Fix everything it flags during the port, not after.
3. **Pre-commit hook**: `husky` + `lint-staged` at the root — on commit run Prettier + ESLint on staged files and `tsc --noEmit` per touched package.
4. **Storybook** (client): `npx storybook@latest init` (auto-detects Vite). Write stories only for the hand-rolled shared UI components — `CarCard`, `Carousel`, `CarForm`, `NavBar`, buttons/inputs — one story per meaningful state (e.g. CarCard logged-in vs logged-out, CarForm empty vs prefilled for edit). No stories for pages or route-level components; they need routing/API context and aren't worth mocking. Script `"storybook": "storybook dev -p 6006"`.
5. **CI**: `.github/workflows/ci.yml` — on push/PR: checkout, setup-node 22 with npm cache, `npm ci`, then per package: lint, `tsc --noEmit`, `vitest run`, and `vite build` for the client. Matrix or two jobs (client/server) — keep it under ~40 lines.

**🛑 CHECKPOINT 4 — automations done.** Verify: pre-commit hook fires, CI green on the pushed branch, Storybook opens. Commit. STOP — Phase 3 deletes the legacy code, so the user must explicitly approve continuing.

## Phase 3 — Cleanup & verify

1. Root `.gitignore`: add `server/.env`, `**/node_modules`.
2. Verify: `npm test` and `tsc --noEmit` pass in both `server/` and `client/`; then end-to-end: `cd server && npm i && npm run dev` + `cd client && npm i && npm run dev`; register, login, create/edit/delete a car, search/filter, logout, confirm write routes return 401 when logged out (curl).
3. Delete legacy: root `server.js`, `src/`, `public/`, root `package.json` CRA deps (either delete root package.json or reduce it to workspace scripts).
4. Update/write root `README.md` with run instructions.

Keep commits small: one per phase minimum. Do not commit `.env` or `node_modules`.

## Future work — explicitly OUT of scope for this refactor

Do not implement any of these; they are planned as separate tasks after the refactor ships:

- **Admin portal**: add a `role` field to User ("admin" | "user"), restrict car writes to admins, dashboard page under `features/admin/`. Currently any logged-in user can write — acceptable for now.
- **Image upload** (multer or cloud storage) — images stay URL strings for now.
- **Visual redesign** + replace `alert()` with toasts.
- **Deployment** (hosting, Atlas, env per stage).
- **Real car data import**: `server/scripts/import.ts` pulling from the free NHTSA vPIC API (makes/models/body types/fuel types, no key needed) and/or a Kaggle dataset CSV; images from openly licensed sources (Wikimedia Commons). Validate rows through the same zod car schema before insert. Prefer these over scraping listing sites (ToS/anti-bot problems). Add a small delay between API calls (e.g. ~1 req/sec) to be polite to the free public API and stay within any published rate limits — throttle out of courtesy, and respect each source's ToS/robots. Once the script works as a one-shot, it can be automated to refresh on a schedule (GitHub Actions cron, or a cron job on the deploy host) — idempotent upserts keyed on make+model+year so re-runs update rather than duplicate.
