import { z } from "zod";
import { FUEL_TYPES, BODY_STYLES } from "../models/Car.js";

export const carSchema = z.object({
  src: z.string().min(1),
  title: z.string().min(1),
  shortDesc: z.string().min(1),
  priceFrom: z.number(),
  priceTo: z.number(),
  fuelTypes: z.array(z.enum(FUEL_TYPES)).default([]),
  bodyStyles: z.array(z.enum(BODY_STYLES)).default([]),
});

export const carUpdateSchema = carSchema.partial();
