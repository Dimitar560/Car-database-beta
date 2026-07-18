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
- `npm run docs:check` — verify `src/openapi.yaml` is valid and covers every registered route (fails the build if they drift)
- `npm run audit` — `npm audit`

## API docs

Swagger UI is served at `/api/docs` while the server is running.
