# Idea: personal shared "engine" / "dev tools" packages

**Date:** 2026-07-18
**Status:** Parked — not for this refactor

## The idea (clarified — mostly package.json)

Not a published/imported npm package — narrower and simpler: a personal **template `package.json`** (known-good devDependency versions + scripts: typescript, vitest, biome, tsx, etc.) to copy into a new project's `package.json` and adjust, instead of re-picking/re-vetting the same set of dev tools from scratch each time. Possibly paired with template `tsconfig.json`/`biome.json` files alongside it. A template to copy-and-tweak, not a dependency another project installs — avoids all the versioning/"does my other project need updating" overhead a real shared package would introduce.

## Why not now

Car-database is the only project actually being (re)built right now — capturing a "known-good starter" from a sample size of one means guessing at what's actually reusable vs. specific to this project. Better to extract it once car-database's Phase 2.5 (TypeScript + Biome + tests + CI, all planned) is actually built and proven, so the template reflects a real working setup, not a guess.

## When to revisit

Once car-database's Phase 2.5 automations are done (real `package.json`s for both `server/` and `client/`, with Biome/Vitest/CI actually working) — pull the devDependency list + scripts out into a template file (e.g. in a personal "starter templates" folder/repo, not inside car-database) for the next project to copy from.

## Related

Conversation 2026-07-18 — user wants to rework other old projects and build new ones long-term, workplace `commons`-style packages were the inspiration.
