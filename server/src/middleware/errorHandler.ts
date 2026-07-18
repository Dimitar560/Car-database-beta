import mongoose from "mongoose";
import type { NextFunction, Request, Response } from "express";
import { AppError } from "../lib/AppError.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.status).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err.details !== undefined ? { details: err.details } : {}),
      },
    });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      error: { code: "INVALID_ID", message: `Invalid id: ${err.value}` },
    });
  }

  // Unexpected error: log full detail server-side (with the request id for correlation),
  // but never leak internals (stack trace, DB error text) to the client.
  console.error(`[${req.id}]`, err);
  res.status(500).json({
    error: { code: "INTERNAL_ERROR", message: "Something went wrong", requestId: req.id },
  });
}
