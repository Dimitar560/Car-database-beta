import { z } from "../lib/zod.js";

export const errorResponseSchema = z
  .object({
    error: z.object({
      code: z.string().openapi({ example: "NOT_FOUND" }),
      message: z.string().openapi({ example: "Car not found" }),
      details: z
        .object({
          formErrors: z.array(z.string()),
          fieldErrors: z.record(z.string(), z.array(z.string())),
        })
        .optional()
        .openapi({ description: "Present on VALIDATION_ERROR only (zod's flatten() output)" }),
      requestId: z
        .string()
        .optional()
        .openapi({ description: "Present on 500s only, for support/log correlation" }),
    }),
  })
  .openapi("Error");
