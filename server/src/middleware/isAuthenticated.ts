import type { Request, Response, NextFunction } from "express";
import { AppError } from "../lib/AppError.js";

export function isAuthenticated(req: Request, _res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  next(new AppError("NOT_AUTHENTICATED", 401, "Not authenticated"));
}
