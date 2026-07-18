import type { ZodTypeAny } from "zod";
import { z } from "../lib/zod.js";
import { registry } from "./registry.js";
import { carSchema, carUpdateSchema, carResponseSchema } from "../validation/car.js";
import { credentialsSchema, userResponseSchema } from "../validation/auth.js";
import { errorResponseSchema } from "../validation/error.js";

const idParam = z.object({ id: z.string().openapi({ example: "665f1c2e8b3a1a2b3c4d5e6f" }) });

const json = (schema: ZodTypeAny) => ({
  "application/json": { schema },
});

registry.registerPath({
  method: "get",
  path: "/cars",
  summary: "List all cars",
  security: [],
  responses: {
    200: { description: "OK", content: json(z.array(carResponseSchema)) },
  },
});

registry.registerPath({
  method: "post",
  path: "/cars",
  summary: "Create a car",
  security: [{ sessionCookie: [] }],
  request: { body: { content: json(carSchema) } },
  responses: {
    201: { description: "Created", content: json(carResponseSchema) },
    400: { description: "Validation error (code: VALIDATION_ERROR)", content: json(errorResponseSchema) },
    401: { description: "Not authenticated (code: NOT_AUTHENTICATED)", content: json(errorResponseSchema) },
  },
});

registry.registerPath({
  method: "get",
  path: "/cars/{id}",
  summary: "Get a car by id",
  security: [],
  request: { params: idParam },
  responses: {
    200: { description: "OK", content: json(carResponseSchema) },
    400: { description: "Malformed id (code: INVALID_ID)", content: json(errorResponseSchema) },
    404: { description: "Not found (code: NOT_FOUND)", content: json(errorResponseSchema) },
  },
});

registry.registerPath({
  method: "patch",
  path: "/cars/{id}",
  summary: "Update a car",
  security: [{ sessionCookie: [] }],
  request: { params: idParam, body: { content: json(carUpdateSchema) } },
  responses: {
    200: { description: "OK", content: json(carResponseSchema) },
    400: {
      description: "Validation error or malformed id (code: VALIDATION_ERROR / INVALID_ID)",
      content: json(errorResponseSchema),
    },
    401: { description: "Not authenticated (code: NOT_AUTHENTICATED)", content: json(errorResponseSchema) },
    404: { description: "Not found (code: NOT_FOUND)", content: json(errorResponseSchema) },
  },
});

registry.registerPath({
  method: "delete",
  path: "/cars/{id}",
  summary: "Delete a car",
  security: [{ sessionCookie: [] }],
  request: { params: idParam },
  responses: {
    204: { description: "Deleted" },
    400: { description: "Malformed id (code: INVALID_ID)", content: json(errorResponseSchema) },
    401: { description: "Not authenticated (code: NOT_AUTHENTICATED)", content: json(errorResponseSchema) },
    404: { description: "Not found (code: NOT_FOUND)", content: json(errorResponseSchema) },
  },
});

registry.registerPath({
  method: "post",
  path: "/auth/register",
  summary: "Register a new user and log them in",
  security: [],
  request: { body: { content: json(credentialsSchema) } },
  responses: {
    201: {
      description: "Created",
      content: json(z.object({ user: userResponseSchema })),
    },
    400: { description: "Validation error (code: VALIDATION_ERROR)", content: json(errorResponseSchema) },
    409: { description: "Username already exists (code: USERNAME_TAKEN)", content: json(errorResponseSchema) },
  },
});

registry.registerPath({
  method: "post",
  path: "/auth/login",
  summary: "Log in",
  security: [],
  request: { body: { content: json(credentialsSchema) } },
  responses: {
    200: { description: "OK", content: json(z.object({ user: userResponseSchema })) },
    400: { description: "Validation error (code: VALIDATION_ERROR)", content: json(errorResponseSchema) },
    401: {
      description:
        "Wrong username or password (code: INVALID_CREDENTIALS) — deliberately generic to avoid revealing which usernames exist",
      content: json(errorResponseSchema),
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/auth/logout",
  summary: "Log out (no-op if not currently authenticated)",
  security: [],
  responses: {
    204: { description: "Logged out" },
  },
});

registry.registerPath({
  method: "get",
  path: "/auth/me",
  summary: "Get the current session's user",
  security: [{ sessionCookie: [] }],
  responses: {
    200: { description: "OK", content: json(z.object({ user: userResponseSchema })) },
    401: { description: "Not authenticated (code: NOT_AUTHENTICATED)", content: json(errorResponseSchema) },
  },
});
