# Decision: design tokens now, dark mode later (if ever)

**Date:** 2026-07-18
**Status:** Decided, not yet implemented (part of Phase 2 styling pass)

## Context

User wants styles separated into proper categories — colors, spacing, widths, layout, themes — instead of scattered literals across per-component CSS files.

## Decision

Build a real design-token structure (`client/src/styles/tokens/{colors,spacing,layout}.css`) as part of the already-planned styling pass, using **semantic** variable names (`--color-bg`, not `--color-white`) so a second theme could be added later by only overriding the token file. Do **not** build an actual dark theme, toggle, or theme-switching logic now.

## Rationale

Semantic tokens cost nothing extra to set up correctly the first time, and prevent needing to rename every variable later if a second theme is ever wanted. But building the actual second theme now would be scope growth beyond "extract what's already there" — this pass is explicitly *not* a redesign.

## Related

`REFACTOR_PLAN.md` → Phase 2 → Styling pass.
