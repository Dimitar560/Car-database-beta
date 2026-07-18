# Decision: session-based auth, not JWT

**Date:** 2026-07-18
**Status:** Decided, implemented in Phase 1

## Context

While building the auth routes, considered switching from session cookies (what the original app used, imperfectly) to JWT + cookie.

## Options considered

- **Sessions** (chosen): server holds session state in MongoDB via `connect-mongo`; cookie holds only a session ID.
- **JWT in a cookie**: cookie holds a signed, self-contained credential; server holds nothing.

## Decision

Keep sessions.

## Rationale

This app is one client talking to one server, same origin. JWT solves a "many independent services, no shared session store" problem this app doesn't have. Costs of JWT here with no offsetting benefit:
- No easy revocation — a compromised/stale JWT stays valid until it expires, unless you build a refresh-token/blacklist scheme (more moving parts, not less).
- Sessions can be revoked instantly (delete the session document).

## Revisit if

A separate API consumer shows up later (mobile app, third-party integration) that can't share a browser cookie jar with this client.
