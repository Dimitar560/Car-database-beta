# Decision: structured error codes everywhere, except login

**Date:** 2026-07-18
**Status:** Decided, implemented in Phase 1

## Context

Original ask: make errors more distinguished (e.g. tell the user whether it was a wrong username or wrong password). Needed to weigh specificity against a real security tradeoff.

## Decision

- Every error response is `{ error: { code, message, details? } }` with a stable `code` string, via a central `AppError` class + `errorHandler` middleware.
- Distinguished specific cases: `INVALID_ID` (malformed id) vs `NOT_FOUND` (well-formed id, no such doc) — previously both were the same generic 404. Also `VALIDATION_ERROR`, `NOT_AUTHENTICATED`, `USERNAME_TAKEN`, `INTERNAL_ERROR`.
- **Exception, on purpose:** login always returns one generic `INVALID_CREDENTIALS` whether the username doesn't exist or the password is wrong.

## Rationale

Telling an attacker specifically "no such user" vs "wrong password" enables username enumeration — trying many usernames and learning which ones are real accounts from the error alone. Every other error case in the API has no such tradeoff, so those are as specific as possible. Login is the one deliberate exception.

500s (unexpected errors) go a step further in the other direction: the client only ever sees a generic `INTERNAL_ERROR` with a `requestId`, never the real error text (could leak DB internals) — full detail is logged server-side only, matched to the client-visible `requestId` for support/debugging.

## Related

`server/src/lib/AppError.ts`, `server/src/middleware/errorHandler.ts`, `server/LEARNING.md` section 6b.
