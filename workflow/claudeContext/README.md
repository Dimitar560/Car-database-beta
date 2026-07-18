# Claude context folder

A scaled-down version of a system used at the project owner's workplace, for a much larger team/monorepo. This is sized for one dev, one project — no portal categories, no JIRA-style ticket folders, no date subfolders unless this actually grows enough to need them.

**Do not delete this folder or its contents without asking first** — it's cross-session continuity, same as `REFACTOR_PLAN.md`/`AGENTS.md`.

## Folders

- **`decisions/`** — one file per non-obvious architectural call, with the reasoning. Permanent; referenced across sessions instead of re-litigated. Example: why sessions over JWT.
- **`sessions/`** — one short summary per work session: what got done, what got decided, what's next. Cheap to write, saves re-deriving context from a long chat transcript later.
- **`ongoing/`** — active work not big enough to need its own section in `REFACTOR_PLAN.md`, or extra detail on a phase that's in flight.
- **`done/`** — the `ongoing/` equivalent once finished, kept for history rather than deleted.
- **`ideas/`** — rarely used; a place for "maybe later" notes so they're not lost, not something to actively maintain.

## Naming

Same prefix idea as the workplace system, just without the portal/date folder nesting:

- `decision-<topic>.md`
- `session-YYYY-MM-DD.md` (add a short suffix if more than one that day: `session-YYYY-MM-DD-topic.md`)
- `investigation-<topic>.md`, `plan-<topic>.md`, `issue-<topic>.md` — as needed in `ongoing/`

## Relationship to other project docs

- **`REFACTOR_PLAN.md`** is still the single source of truth for the phased rebuild — this folder doesn't duplicate it.
- **`AGENTS.md` / `LEARNING.md` / `DEVOPS.md`** are teaching/reference docs — stable, not session-by-session.
- **Claude's memory** (`~/.claude/projects/.../memory/`) is separate and self-contained — it doesn't point into this folder. If something here should shape Claude's behavior across sessions (not just record history), it likely belongs in memory too, not only here.

## Growing this later

If `sessions/` or `ongoing/` ever get past ~15-20 files and become hard to scan, add `YYYY-MM/` subfolders then — not preemptively.
