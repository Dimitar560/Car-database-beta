import { Schema, model, type InferSchemaType } from "mongoose";

export const FUEL_TYPES = ["petrol", "diesel", "electric"] as const;
export const BODY_STYLES = [
  "sedan",
  "coupe",
  "wagon",
  "hatchback",
  "suv",
  "minivan",
  "pickup",
] as const;

const carSchema = new Schema({
  src: { type: String, required: true },
  title: { type: String, required: true },
  shortDesc: { type: String, required: true },
  priceFrom: { type: Number, required: true },
  priceTo: { type: Number, required: true },
  fuelTypes: { type: [String], enum: FUEL_TYPES, default: [] },
  bodyStyles: { type: [String], enum: BODY_STYLES, default: [] },
});

export type Car = InferSchemaType<typeof carSchema>;

export const CarModel = model("Car", carSchema, "cars");
