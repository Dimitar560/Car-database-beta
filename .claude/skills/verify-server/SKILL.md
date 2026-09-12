---
name: verify-server
description: Run the server's full quality gate (typecheck, tests, OpenAPI docs check, dependency audit) and report results. Use after any change to server/ code, before considering the work done or handing it off for commit-prep. Read-only — never fixes anything itself, only reports.
---

# Verify server

Read-only verification pass for `server/`. Run this after any change under `server/src/` (or `server/scripts/`), before saying the work is done.

## Steps

1. From `server/`, run in order, capturing each result:
   ```
   npm run typecheck
   npm test
   npm run docs:check
   npm run audit
   ```
2. If everything passes: report a short one-line confirmation per check (e.g. "typecheck clean, 14/14 tests, docs:check clean, 0 audit vulnerabilities"). Don't paste full command output unless something failed.
3. If anything fails: report exactly what failed and the relevant error output, but **do not attempt to fix it as part of this skill** — surface it and stop. Fixing is a separate, deliberate step.
4. If the change plausibly affects the running server's behavior (a route, middleware, or auth change — not e.g. a comment or test-only change), also do a quick live check: start the server (`npm run dev`, or a one-off `npx tsx src/index.ts` in the background), hit the relevant endpoint(s) with curl, confirm the response looks right, then stop the process. Skip this step for test-only or docs-only changes — there's nothing new to observe live.

## Notes

- This mirrors the exact sequence already run manually many times during Phase 1 of `REFACTOR_PLAN.md` — packaging it here means it runs the same way every time instead of being re-typed.
- Once `client/` exists (Phase 2+), extend this skill (or add a sibling `verify-client` skill) with the client's equivalent commands (`typecheck`, `test`, `build`) rather than leaving it server-only.
