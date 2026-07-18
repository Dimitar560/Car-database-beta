import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { parse } from "yaml";
import listEndpoints from "express-list-endpoints";
import { createApp } from "../src/app.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

type Route = { method: string; path: string };

function normalizePath(path: string): string {
  return path.replace(/:[^/]+/g, ":param").replace(/\{[^}]+\}/g, ":param");
}

const app = createApp({
  sessionSecret: "coverage-check",
  mongoUri: "mongodb://localhost:27017/coverage-check-unused",
  clientOrigin: "http://localhost:5173",
});

const expressRoutes: Route[] = listEndpoints(app)
  .filter((r) => r.path.startsWith("/api/") && !r.path.startsWith("/api/docs"))
  .flatMap((r) =>
    r.methods.map((method) => ({
      method: method.toUpperCase(),
      path: normalizePath(r.path.replace(/^\/api/, "")),
    }))
  );

const openapiSpec = parse(readFileSync(join(__dirname, "../src/openapi.yaml"), "utf-8")) as {
  paths: Record<string, Record<string, unknown>>;
};

const openapiRoutes: Route[] = Object.entries(openapiSpec.paths).flatMap(([path, methods]) =>
  Object.keys(methods).map((method) => ({
    method: method.toUpperCase(),
    path: normalizePath(path),
  }))
);

const toKey = (r: Route) => `${r.method} ${r.path}`;
const expressKeys = new Set(expressRoutes.map(toKey));
const openapiKeys = new Set(openapiRoutes.map(toKey));

const undocumented = [...expressKeys].filter((k) => !openapiKeys.has(k));
const stale = [...openapiKeys].filter((k) => !expressKeys.has(k));

if (undocumented.length || stale.length) {
  if (undocumented.length) {
    console.error("Routes missing from openapi.yaml:");
    undocumented.forEach((k) => console.error(`  ${k}`));
  }
  if (stale.length) {
    console.error("openapi.yaml documents routes that no longer exist:");
    stale.forEach((k) => console.error(`  ${k}`));
  }
  process.exit(1);
}

console.log(`OpenAPI spec covers all ${expressKeys.size} routes.`);
