---
name: verify-client
description: Run the client's quality gate (typecheck, production build) and report results. Use after any change to client/ code, before considering the work done or handing it off for commit-prep. Read-only — never fixes anything itself, only reports.
---

# Verify client

Read-only verification pass for `client/`. Run this after any change under `client/src/`.

## Steps

1. From `client/`, run in order, capturing each result:
   ```
   npx tsc -b --noEmit
   npm run build
   ```
2. If everything passes: report a short one-line confirmation (e.g. "typecheck clean, build succeeded"). Don't paste full output unless something failed.
3. If anything fails: report exactly what failed and the relevant error output, but **do not attempt to fix it as part of this skill** — surface it and stop.
4. For a change that plausibly affects runtime behavior (not a comment/type-only change): start the dev server (`npx vite --port 5173` in the background) alongside the backend server (`verify-server`'s dev step, or assume it's already running on 8000), curl the affected route(s) to confirm they return 200 without transform errors in the dev server log, then stop both processes. Skip for build-only or type-only changes.

## Notes

- No client test suite exists yet (Phase 2's "Tests" section in `REFACTOR_PLAN.md` is still pending) — once Vitest + Testing Library are added, extend step 1 with `npm test`.
- After restructuring/moving files, the running dev server can hold stale module-graph references from before the change (shows as "Pre-transform error: Failed to load url..." even though the code is correct) — if seen, kill the dev server, delete `client/node_modules/.vite`, and restart before trusting further live checks.
