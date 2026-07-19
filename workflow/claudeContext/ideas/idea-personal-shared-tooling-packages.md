# Idea: personal shared "engine" / "dev tools" packages

**Date:** 2026-07-18
**Status:** Parked — not for this refactor

## The idea (clarified — mostly package.json, plus lint rules)

Not a published/imported npm package for the dependency list — narrower and simpler: a personal **template `package.json`** (known-good devDependency versions + scripts: typescript, vitest, biome, tsx, etc.) to copy into a new project's `package.json` and adjust, instead of re-picking/re-vetting the same set of dev tools from scratch each time. A template to copy-and-tweak, not a dependency another project installs — avoids the versioning/"does my other project need updating" overhead a real shared package would introduce.

**Lint rules and TypeScript config are a different case, worth treating separately.** Both Biome and TypeScript natively support `"extends"` pointing at another config — a file path, or a published package that exports one. TypeScript's version of this is actually the most established example in the ecosystem (the community `@tsconfig/bases` project — `@tsconfig/node20`, `@tsconfig/strictest`, etc. are exactly this: published base configs other projects extend). Biome's `extends` follows the same idea. Unlike dependency versions (which just get copied and diverge), lint/compiler rules rarely need to differ per-project, so real shared `@username/biome-config` and `@username/tsconfig-base` packages are a legitimately better fit than copy-paste for these two specifically — no version-coupling risk the way sharing actual runtime deps would have.

## Why not now

Car-database is the only project actually being (re)built right now — capturing a "known-good starter" from a sample size of one means guessing at what's actually reusable vs. specific to this project. Better to extract it once car-database's Phase 2.5 (TypeScript + Biome + tests + CI, all planned) is actually built and proven, so the template reflects a real working setup, not a guess.

## When to revisit

Once car-database's Phase 2.5 automations are done (real `package.json`s for both `server/` and `client/`, with Biome/Vitest/CI actually working):
- Pull the devDependency list + scripts out into a template file (personal "starter templates" folder/repo, not inside car-database) for the next project to copy from.
- Publish the working `biome.json` and `tsconfig.json` as small shared packages (`@username/biome-config`, `@username/tsconfig-base`) that this project and future ones `extend` from, rather than copying them.

## Related

Conversation 2026-07-18 — user wants to rework other old projects and build new ones long-term, workplace `commons`-style packages were the inspiration.
