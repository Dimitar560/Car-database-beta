# Manual QA checklist — server

Run against `http://localhost:8000/api/docs` (Swagger "Try it out") or curl. Start the server first: `cd server && npm run dev`.

Use a throwaway username each pass (e.g. `qatest1`, `qatest2`, ...) — running this twice with the same username will hit the "duplicate registration" case early, which is fine, but a fresh username gives a cleaner first run.

## Cars — reads (no auth needed)

- [ ] `GET /cars` → 200, returns an array (your 7 real cars if the DB hasn't changed)
- [ ] `GET /cars/{id}` with a real id from the list above → 200, matching car
- [ ] `GET /cars/665f1c2e8b3a1a2b3c4d5e6f` (well-formed id, doesn't exist) → 404, `code: NOT_FOUND`
- [ ] `GET /cars/not-a-real-id` (garbage, not a valid Mongo id) → 400, `code: INVALID_ID`

## Cars — writes without logging in (should all be blocked)

- [ ] `POST /cars` with any body, no session → 401, `code: NOT_AUTHENTICATED`
- [ ] `PATCH /cars/{id}` on a real id, no session → 401, `code: NOT_AUTHENTICATED`
- [ ] `DELETE /cars/{id}` on a real id, no session → 401, `code: NOT_AUTHENTICATED`

## Auth

- [ ] `GET /auth/me` with no session → 401, `code: NOT_AUTHENTICATED`
- [ ] `POST /auth/register` with `{"username": "qatestN", "password": "testpass123"}` → 201, returns `{ user: { id, username } }`
- [ ] `POST /auth/register` again with the **same** username → 409, `code: USERNAME_TAKEN`
- [ ] `GET /auth/me` (same session as registration, Swagger keeps cookies automatically) → 200, shows the user you just registered
- [ ] `POST /auth/login` with the same username but a **wrong** password → 401, `code: INVALID_CREDENTIALS` (message must NOT reveal whether the username exists)
- [ ] `POST /auth/login` with correct username + password → 200, returns the user
- [ ] `POST /auth/logout` → 204
- [ ] `GET /auth/me` again after logout → 401, `code: NOT_AUTHENTICATED`

## Cars — writes while logged in

Register/login first (above), then in the same session:

- [ ] `POST /cars` with a complete, valid body → 201, returns the created car with an `_id`
- [ ] `POST /cars` with an incomplete body (e.g. only `{"title": "x"}`) → 400, `code: VALIDATION_ERROR`, `details` shows which fields failed
- [ ] `PATCH /cars/{id}` on the car you just created, changing `title` → 200, updated car returned
- [ ] `DELETE /cars/{id}` on that same car → 204
- [ ] `GET /cars/{id}` on the now-deleted id → 404, `code: NOT_FOUND` (confirms the delete actually happened)
- [ ] `GET /cars` → count is back to what it was before (no leftover test data)

## Sanity

- [ ] `GET /cars` still shows exactly your 7 real cars at the end of a full pass (nothing from testing leaked into the real dataset)
- [ ] Every response above came back with an `x-request-id` header (visible in Swagger's "Response headers")
- [ ] `/api/docs` loads and shows two sections, **Cars** and **Auth**, not one flat list

If everything above checks out, the server is solid — any remaining bugs would show up during Phase 2 (client) integration, not from testing the API directly.
