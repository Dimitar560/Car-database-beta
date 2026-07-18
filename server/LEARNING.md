# Server refresher — how this all works

You wrote the original app with minimal Node experience. This document explains what got built in the refactor, concept by concept, using the actual code in `src/` as the example. Read it top to bottom once, then keep it as a reference.

---

## 1. The shape of a Node/Express backend

Node.js runs JavaScript (here, TypeScript that compiles to JavaScript) outside a browser. Express is a library that makes it easy to answer HTTP requests: "when a `GET` request comes in for `/api/cars`, run this function and send back JSON."

Everything in `server/src/` exists to answer HTTP requests about cars and users, backed by a MongoDB database.

### The request lifecycle, in order

1. A request arrives (e.g. `POST /api/cars` from the browser, or from curl).
2. It passes through **middleware** — functions that run before the actual route handler, each able to inspect/modify the request, reject it, or pass it along.
3. It reaches a **route handler** — the function that actually does the work (e.g. "look up cars in the database, send them back").
4. A response goes back.

You can see this whole pipeline assembled in `src/app.ts`:

```ts
app.use(express.json());        // middleware: parse JSON request bodies
app.use(cors({ ... }));         // middleware: allow the browser to call this API
app.use(session({ ... }));      // middleware: attach session data to each request
app.use(passport.initialize()); // middleware: auth framework setup
app.use(passport.session());    // middleware: read who's logged in, if anyone

app.use("/api/cars", carsRouter);  // route handlers, only for /api/cars/*
app.use("/api/auth", authRouter);  // route handlers, only for /api/auth/*
```

`app.use(path, middlewareOrRouter)` means "run this for every request whose path starts with `path`." Order matters — middleware registered first runs first.

---

## 2. TypeScript, quickly

TypeScript is JavaScript plus a type system checked *before* the code runs (`npm run typecheck`, or automatically as you type in an editor). It doesn't change what the code does at runtime — it's a second pass that catches "you passed a string where a number was expected" before you ever hit that bug live.

Things you'll see everywhere in this codebase:

- `function foo(x: string): number { ... }` — `x` must be a string, the function returns a number.
- `interface`/`type` — describes the shape of an object, e.g. `{ id: string, username: string }`.
- `strict: true` in `tsconfig.json` — the strictest setting; e.g. it won't let a variable silently be `undefined` unless you say so explicitly. This is why the code has patterns like `if (!SESSION_SECRET) { throw new Error(...) }` in `src/index.ts` — TypeScript won't trust the value is defined otherwise.
- Most types here are *inferred* automatically rather than hand-written — e.g. `CarModel.find()` already knows it returns cars, because Mongoose + our schema tell it so.

You mostly don't need to become a TypeScript expert; you need to recognize `: SomeType` as "this must be shaped like `SomeType`," and trust the red squiggly lines in your editor when they show up.

---

## 3. Dependencies — what each one does and why it's here

| Package | What it is | Why we use it |
|---|---|---|
| `express` | The HTTP server / routing framework | The foundation everything else sits on |
| `mongoose` | An ODM (Object-Document Mapper) for MongoDB | Lets you define a `Schema` in JS/TS and get a `Model` with `.find()`, `.create()`, etc., instead of writing raw MongoDB queries |
| `passport` + `passport-local` + `passport-local-mongoose` | Authentication framework | `passport` is a generic "plug in a login strategy" system; `passport-local` is the "username + password" strategy; `passport-local-mongoose` bolts password hashing and a ready-made strategy directly onto your Mongoose `User` model, so you never handle raw passwords yourself |
| `express-session` | Tracks "who is logged in" across requests | HTTP itself is stateless — session middleware issues a cookie with a session ID, and remembers who that ID belongs to |
| `connect-mongo` | A session *store* — where session data actually lives | Without this, sessions live in server memory and vanish on every restart. This stores them in MongoDB instead |
| `cors` | Loosens the browser's default same-origin restriction | Your React client (a different port, e.g. `:5173`) needs explicit permission to call this API (`:8000`) |
| `dotenv` | Loads `.env` file values into `process.env` | Keeps secrets (DB URL, session secret) out of the source code |
| `zod` | Runtime validation — checks that request data actually matches the shape you expect | TypeScript types disappear at runtime (they're compile-time only!); zod is what actually rejects a malformed request body at 2am when TypeScript isn't there to help |
| `@asteasolutions/zod-to-openapi` | Generates API documentation from the same zod schemas | Explained in section 6 |
| `swagger-ui-express` | Serves an interactive documentation page | Turns the generated spec into the browsable page at `/api/docs` |
| `tsx` | Runs TypeScript files directly, without a separate compile step | Used for `npm run dev` and one-off scripts |
| `typescript` | The TypeScript compiler itself | Used for `npm run build` (produces real `.js` files in `dist/`) and `npm run typecheck` |
| `vitest` | Test runner | Explained in section 7 |
| `supertest` | Simulates HTTP requests against your Express app in tests, without a real network/port | Explained in section 7 |
| `mongodb-memory-server` | Spins up a real (but temporary, in-process) MongoDB for tests | So tests don't touch your real `autoDB` and don't need MongoDB installed to run in CI |
| `@redocly/cli` | Lints the generated OpenAPI spec for correctness | Catches things like "this operation has no error responses documented" |
| `express-list-endpoints` | Introspects a live Express app and lists every route it actually has registered | Used only by `scripts/check-openapi-coverage.ts`, to catch routes that exist in code but aren't documented |

Every one of these is free/open-source (npm packages, MIT-style licenses) — nothing here costs money or needs an API key.

---

## 4. MongoDB and Mongoose

MongoDB stores data as JSON-like documents in collections (roughly: collection = table, document = row, but far less rigid — no fixed columns).

A **schema** (`src/models/Car.ts`) declares what shape you *expect* documents in a collection to have:

```ts
const carSchema = new Schema({
  title: { type: String, required: true },
  priceFrom: { type: Number, required: true },
  fuelTypes: { type: [String], enum: FUEL_TYPES, default: [] },
  // ...
});

export const CarModel = model("Car", carSchema, "cars");
```

`model("Car", carSchema, "cars")` gives you `CarModel` — an object with methods like `CarModel.find()`, `CarModel.findById(id)`, `CarModel.create(data)`, `CarModel.findByIdAndUpdate(id, data)`. These all return **Promises** (see section 5) because talking to a database takes time.

`InferSchemaType<typeof carSchema>` is a TypeScript trick that reads the *runtime* schema definition and produces a matching *compile-time* type automatically — so you don't have to write the `Car` interface by hand and keep it in sync manually.

### Why the schema changed from the original app

The original app had 15 separate fields like `petrol: String`, `diesel: String`, `sedan: String` (using strings like `"true"`/`"false"` instead of real booleans). The new schema uses two arrays instead:

```ts
fuelTypes: ["petrol", "diesel"]
bodyStyles: ["suv", "coupe"]
```

This is both more correct (a car can have multiple fuel types cleanly) and much smaller to work with in the UI — one checkbox group loop instead of 15 hand-written checkboxes. `scripts/migrate.ts` is the one-time script that converted your real, existing data from the old shape to the new one (already run — see section 8).

---

## 5. Promises, `async`/`await`, and why routes look the way they do

Almost everything that takes time in Node — database calls, reading files, network requests — is **asynchronous**: you ask for it, and get the answer *later*, without freezing the whole server while you wait.

A `Promise` is a placeholder for "a value that will exist eventually." `async`/`await` is syntax that lets you write asynchronous code that *reads* like ordinary top-to-bottom code:

```ts
router.get("/", async (_req, res) => {
  const cars = await CarModel.find();  // pause here until the DB responds, without blocking other requests
  res.json(cars);
});
```

Compare to the original app's callback style:

```js
Cars.find(function (err, car) {
  if (!err) { res.send(car); }
});
```

Both do the same thing conceptually, but `async`/`await` is the modern, far more readable way to write it — and it's required anyway, because Mongoose 8 (the version we're on now) removed callback support entirely.

---

## 6. Validation with zod, and how it also builds the API docs

### Validation

A request body arriving over HTTP is just untrusted JSON — nothing guarantees it has the fields you expect, or the right types. `zod` lets you describe the expected shape once, and either get back clean, typed data, or a clear rejection:

```ts
export const carSchema = z.object({
  src: z.string().min(1),
  title: z.string().min(1),
  priceFrom: z.number(),
  fuelTypes: z.array(z.enum(FUEL_TYPES)).default([]),
});
```

`src/middleware/validate.ts` is a small reusable middleware that takes any zod schema and applies it to `req.body`:

```ts
export function validate(schema: ZodSchema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.flatten() });
    }
    req.body = result.data;  // now guaranteed to match the schema
    next();
  };
}
```

Routes use it like: `router.post("/", isAuthenticated, validate(carSchema), async (req, res) => { ... })`. By the time the actual handler runs, `req.body` is guaranteed safe to use directly.

This also fixes a real bug from the original app: the old `PATCH` route did `Cars.updateOne({ title }, { $set: req.body })` — passing the *entire, unvalidated* request body straight into a database write. Anyone could have sent extra fields to overwrite things they shouldn't. Validation whitelists exactly what's allowed.

### The same schemas generate the documentation

Rather than hand-writing a separate description of the API (which inevitably drifts out of sync with the real code over time), `@asteasolutions/zod-to-openapi` reads the same zod schemas and produces an OpenAPI document from them:

```ts
// src/validation/car.ts
export const carSchema = z.object({ ... }).openapi("CarInput");

// src/openapi/paths.ts
registry.registerPath({
  method: "post",
  path: "/cars",
  request: { body: { content: json(carSchema) } },
  responses: { 201: { content: json(carResponseSchema) } },
});
```

`src/openapi/document.ts` assembles everything the routes registered into one document, served as an interactive page at `/api/docs` (via `swagger-ui-express`). Because it's the *same* schema object doing validation and documentation, they cannot silently drift apart — and `npm run docs:check` double-checks that every real Express route actually got registered.

---

## 7. Authentication with sessions

**Sessions**, at a glance: the server creates a record ("session") saying "this browser is logged in as user X," stores it in MongoDB (via `connect-mongo`), and gives the browser a cookie containing only the session's ID. On every later request, the browser sends that cookie back, and the server looks up the session to know who's asking.

```ts
app.use(session({
  secret: opts.sessionSecret,       // signs the cookie so it can't be tampered with
  store: MongoStore.create({ mongoUrl: opts.mongoUri }),  // where sessions actually live
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },  // 7 days
}));
app.use(passport.initialize());
app.use(passport.session());
```

`passport-local-mongoose` (plugged into `src/models/User.ts`) adds password hashing and comparison to the `User` model automatically — you never see or store a plain-text password anywhere.

`src/middleware/isAuthenticated.ts` is the gatekeeper used on every write route:

```ts
export function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {   // provided by passport
    return next();
  }
  res.status(401).json({ error: "Not authenticated" });
}
```

This fixes another real bug from the original app: previously, "is the user allowed to post/delete a car" was decided **only in the React frontend** (hiding buttons). The actual server had no such check — anyone could `curl -X DELETE` any car without logging in at all. Now the check lives in `isAuthenticated`, on the server, where it can't be bypassed by skipping the UI.

We considered JWTs (JSON Web Tokens — a stateless alternative where the cookie holds the actual signed credential instead of just an ID) and deliberately didn't switch. JWTs solve a "many separate services, no shared session store" problem. This app is one client talking to one server — sessions are simpler and, unlike a JWT, can be instantly revoked (just delete the session document) rather than needing a refresh-token/expiry scheme.

---

## 8. The one-time data scripts

- `scripts/migrate.ts` — converts your **real** existing `autoDB.cars` documents from the old 15-boolean-field shape into the new `fuelTypes`/`bodyStyles` arrays. Already run once against your actual local database (7 cars converted, verified via curl).
- `scripts/seed.ts` — inserts a handful of sample cars, but only if the `cars` collection is empty. Useful for a fresh clone of the repo with no data yet; it's a no-op against your current DB since it already has data.

Both connect to whatever `MONGO_URI` is in your `.env` — never hardcoded.

---

## 9. Testing

`src/tests/*.test.ts`, run with `npm test` (powered by `vitest`).

The trick that makes these tests fast and safe (they never touch your real `autoDB`):

```ts
mongod = await MongoMemoryServer.create();  // a real, temporary MongoDB, running in-process
await mongoose.connect(mongod.getUri());
app = createApp({ ...pointing at that temporary database... });
```

`supertest` then lets you make fake HTTP requests directly against `app` without actually opening a network port:

```ts
const res = await request(app).get("/api/cars");
expect(res.status).toBe(200);
```

For anything requiring login, `request.agent(app)` remembers cookies between calls, just like a real browser session:

```ts
const agent = request.agent(app);
await agent.post("/api/auth/register").send({ username, password });
await agent.post("/api/cars").send(carData);  // this request is "logged in"
```

This is *why* `src/app.ts` was written as a plain function that builds and returns an app, rather than a script that immediately connects to a real database and starts listening — it makes the whole thing swappable for a test database in one line, with zero code duplication between "real server" and "test server."

---

## 10. Reading `package.json` scripts

```json
"dev": "tsx watch src/index.ts",       // run + hot-reload during development
"build": "tsc",                        // compile TypeScript -> real JavaScript in dist/
"start": "node dist/index.js",         // run the compiled output (production)
"test": "vitest run",                  // run the test suite once
"typecheck": "tsc --noEmit",           // check types without producing output files
"seed": "tsx scripts/seed.ts",
"migrate": "tsx scripts/migrate.ts",
"docs:check": "npm run docs:lint && npm run docs:coverage",
"audit": "npm audit"                   // check installed dependencies for known vulnerabilities
```

`npm run <script>` is how you invoke any of these.

---

## Where to go from here

If you want to build intuition rather than just read: try adding a trivial new field to a car (e.g. `mileage: Number`), and follow it through every layer that needs to know about it — `src/models/Car.ts`, `src/validation/car.ts`, and watch `/api/docs` update itself automatically once you restart the dev server. That round trip touches almost everything explained above.
