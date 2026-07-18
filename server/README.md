# Car Showroom — Server

Express + TypeScript + Mongoose 8, session-based auth.

## Setup

```
npm install
cp .env.example .env   # fill in a real SESSION_SECRET
```

## Scripts

- `npm run dev` — start with hot reload
- `npm run build` / `npm start` — compile and run the production build
- `npm test` — run the test suite (Vitest + Supertest + mongodb-memory-server, no real DB needed)
- `npm run typecheck` — `tsc --noEmit`
- `npm run seed` — insert sample cars if the `cars` collection is empty
- `npm run migrate` — one-time conversion of legacy boolean-field car documents into the new `fuelTypes`/`bodyStyles` array schema
- `npm run docs:check` — lint the generated OpenAPI spec and verify it covers every registered Express route (fails if they drift)
- `npm run audit` — `npm audit`

## API docs

The OpenAPI spec is generated from the zod validation schemas (`src/validation/`) at runtime — nothing is hand-written. Swagger UI is served at `/api/docs` while the server is running. Adding a route means also registering it in `src/openapi/paths.ts`; `npm run docs:check` catches it if you forget.
