# DevOps notes

You've seen CI/Docker on other projects but haven't configured one yourself — this skips the "what is CI" basics and covers what's actually built in this repo, and why. It'll grow as Phase 2.5 of `REFACTOR_PLAN.md` adds CI, Dependabot, and pre-commit hooks; for now it covers what Phase 1 already put in place, since all of that is the foundation those automations will run.

---

## 1. Secrets never touch git

`server/.env.example` is committed (a template with placeholder values); `server/.env` is not (it's in `.gitignore`). The real `.env` — with an actual `SESSION_SECRET` and `MONGO_URI` — only ever exists on your machine.

```
PORT=8000
MONGO_URI=mongodb://localhost:27017/autoDB
SESSION_SECRET=<generated once, stays local>
CLIENT_ORIGIN=http://localhost:5173
```

`dotenv` loads this file into `process.env` at startup (`src/index.ts`). This is the same pattern any CI/deployment setup uses later — instead of a `.env` file, a real deployment platform (Railway, Fly, a Docker host, GitHub Actions secrets) injects the same variable names as actual environment variables. The code doesn't change; only *where* the values come from does. That's the entire point of reading config from `process.env` instead of hardcoding it — which is also why the original app's hardcoded Mongo URL and session secret were a problem worth fixing, not just style.

## 2. The lockfile is what makes builds reproducible

`server/package-lock.json` is committed. `package.json` says "I need `express@^4.21.2`" (any compatible 4.x); the lockfile pins the *exact* resolved version tree, including every transitive dependency, so `npm ci` (what CI/deployment will run, not `npm install`) produces byte-identical `node_modules` every time, on any machine. Without a committed lockfile, "works on my machine" is a real risk — two installs a week apart could silently resolve different dependency versions.

## 3. Dependency auditing (the precursor to Dependabot)

`npm audit` checks every installed package against a public vulnerability database. Already run and clean during Phase 1 (we caught and fixed one real advisory — bumped `vitest` to clear a moderate esbuild dev-server issue). Run it any time with:

```
npm run audit
```

This is manual right now. Phase 2.5 adds `Dependabot` (GitHub-native, free, no separate service to run) — it periodically re-checks the same thing and opens a PR automatically when a fix is available, so vulnerabilities don't sit undetected between manual checks like they did in the original app (CRA + years-old deps, never audited).

## 4. The "quality gate" scripts — what CI will actually run

Nothing here is CI yet — CI is just a service that automatically runs the same commands you can already run locally, on every push, so a broken change can't merge silently. The commands themselves already exist:

```
npm run typecheck   # tsc --noEmit — catches type errors without producing output
npm test             # the Vitest suite (14 tests) against an in-memory MongoDB
npm run docs:check   # OpenAPI spec lint + coverage diff against real Express routes
npm run audit         # dependency vulnerability check
```

When Phase 2.5 adds `.github/workflows/ci.yml`, it will do nothing more than check out the repo and run exactly these four commands (plus the client's equivalents) on GitHub's servers, on every push and PR. Understanding what each command does *before* CI exists is what makes reading a red CI run later straightforward — a failed CI job is just "one of these four commands exited non-zero," and you already know how to run each one yourself to reproduce it locally.

## 5. Why `app.ts` doesn't call `listen()` — a DevOps-relevant design choice, not just a testing one

`src/app.ts` builds and returns an Express app from plain config parameters; only `src/index.ts` reads real environment variables and actually starts listening on a port. This is why the test suite can spin up a real (in-memory) app per test file without ever touching a real network port or a real database — see `server/LEARNING.md` section 9 for the testing angle.

The DevOps angle: this same separation is what will let the app run inside a container later (Phase 2.5/deployment) without code changes — a Dockerfile's `CMD` would just be `node dist/index.js`, i.e. exactly `index.ts`'s job, with `createApp()` fed different environment variables per environment (dev/staging/prod) without touching `app.ts` at all.

---

## What's still ahead (Phase 2.5 / future work in `REFACTOR_PLAN.md`)

- **CI** (`.github/workflows/ci.yml`) — runs the section-4 commands automatically on every push
- **Dependabot** — automates section 3
- **Pre-commit hooks** (husky + lint-staged) — runs formatting/lint/typecheck locally before a commit can even be made, catching issues before they reach CI at all
- **Deployment** — explicitly deferred past this refactor; this is where containers, a real hosting platform, and environment-specific secrets (section 1, for real this time) come in
