import { z } from "../lib/zod.js";
import { FUEL_TYPES, BODY_STYLES } from "../models/Car.js";

export const carSchema = z
  .object({
    src: z.string().min(1).openapi({ example: "https://example.com/car.jpg" }),
    title: z.string().min(1).openapi({ example: "Mazda CX-5" }),
    shortDesc: z.string().min(1),
    priceFrom: z.number().openapi({ example: 28000 }),
    priceTo: z.number().openapi({ example: 38000 }),
    fuelTypes: z.array(z.enum(FUEL_TYPES)).default([]),
    bodyStyles: z.array(z.enum(BODY_STYLES)).default([]),
  })
  .openapi("CarInput");

export const carUpdateSchema = carSchema.partial().openapi("CarUpdateInput");

export const carResponseSchema = carSchema
  .extend({
    _id: z.string(),
  })
  .openapi("Car");
