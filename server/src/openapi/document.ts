import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registry } from "./registry.js";
import "./paths.js";

export function generateOpenApiDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: "3.0.3",
    info: {
      title: "Car Showroom API",
      version: "1.0.0",
      description: "Cars catalog + session-based auth. Generated from the zod validation schemas.",
      license: { name: "UNLICENSED" },
    },
    servers: [{ url: "/api" }],
    tags: [
      { name: "Cars", description: "Browse and manage the car catalog" },
      { name: "Auth", description: "Register, log in, log out, and check the current session" },
    ],
  });
}
