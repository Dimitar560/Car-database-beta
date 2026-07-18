import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";
import { AppError } from "../lib/AppError.js";

export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(new AppError("VALIDATION_ERROR", 400, "Invalid request body", result.error.flatten()));
    }
    req.body = result.data;
    next();
  };
}
