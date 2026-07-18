import "dotenv/config";
import mongoose from "mongoose";
import { CarModel, FUEL_TYPES, BODY_STYLES } from "../src/models/Car.js";

const MONGO_URI = process.env.MONGO_URI ?? "mongodb://localhost:27017/autoDB";

const LEGACY_FUEL_FIELDS = FUEL_TYPES;
const LEGACY_BODY_FIELDS = BODY_STYLES;

function truthy(value: unknown): boolean {
  return value === true || value === "true";
}

export function convertLegacyCar(doc: Record<string, unknown>) {
  const fuelTypes = LEGACY_FUEL_FIELDS.filter((field) => truthy(doc[field]));
  const bodyStyles = LEGACY_BODY_FIELDS.filter((field) => truthy(doc[field]));

  return {
    fuelTypes,
    bodyStyles,
    priceFrom: Number(doc.priceFrom) || 0,
    priceTo: Number(doc.priceTo) || 0,
  };
}

async function main() {
  await mongoose.connect(MONGO_URI);
  const collection = mongoose.connection.collection("cars");
  const docs = await collection.find({ fuelTypes: { $exists: false } }).toArray();

  console.log(`Found ${docs.length} legacy car documents to migrate.`);

  for (const doc of docs) {
    const converted = convertLegacyCar(doc as Record<string, unknown>);
    await collection.updateOne(
      { _id: doc._id },
      {
        $set: converted,
        $unset: Object.fromEntries(
          [...LEGACY_FUEL_FIELDS, ...LEGACY_BODY_FIELDS].map((f) => [f, ""])
        ),
      }
    );
  }

  console.log("Migration complete.");
  await mongoose.disconnect();
}

if (process.argv[1]?.endsWith("migrate.ts")) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
