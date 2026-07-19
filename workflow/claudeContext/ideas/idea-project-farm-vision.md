# Idea: "project farm" — a personal portfolio system

**Date:** 2026-07-18
**Status:** Vision-level, parked

## The idea

Long-term: turn the collection of built/reworked personal projects into something more systematic than a pile of unrelated repos — a "farm." Not yet decided what shape.

## Two shapes to choose between later

- **Monorepo**: all projects in one repo (Nx/Turborepo-style). Atomic cross-project commits, easy local linking of shared packages. Cost: real tooling setup complexity, one repo becomes a single point of failure/mess.
- **Separate repos + shared tooling** (what's already parked in [[idea-personal-shared-tooling-packages]]): each project stays independent and simple; a thin shared thread (`tsconfig-base`, `biome-config`, a starter template) ties them together without coupling their codebases.

Leaning toward the second for a solo portfolio, but not decided — revisit once there's an actual second/third project to test the idea against.

## Related

[[idea-personal-shared-tooling-packages]] — the shared-config piece of this is already scoped there.
