import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { stringify } from "yaml";
import { generateOpenApiDocument } from "../src/openapi/document.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, "../openapi.generated.yaml");

writeFileSync(outPath, stringify(generateOpenApiDocument()));
console.log(`Wrote ${outPath}`);
