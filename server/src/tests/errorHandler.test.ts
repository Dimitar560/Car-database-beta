import { describe, it, expect, vi } from "vitest";
import type { Request, Response } from "express";
import { errorHandler } from "../middleware/errorHandler.js";
import { AppError } from "../lib/AppError.js";

function mockRes() {
  const res: Partial<Response> = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res as Response & { status: ReturnType<typeof vi.fn>; json: ReturnType<typeof vi.fn> };
}

describe("errorHandler", () => {
  it("formats an AppError with its own code and status", () => {
    const res = mockRes();
    const err = new AppError("NOT_FOUND", 404, "Car not found");

    errorHandler(err, {} as Request, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: { code: "NOT_FOUND", message: "Car not found" },
    });
  });

  it("hides internal details behind a generic 500, but includes a requestId for correlation", () => {
    const res = mockRes();
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const req = { id: "test-request-id" } as Request;

    errorHandler(new Error("connection refused at db.internal:27017"), req, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    const body = res.json.mock.calls[0][0];
    expect(body.error.code).toBe("INTERNAL_ERROR");
    expect(body.error.message).not.toContain("db.internal");
    expect(body.error.requestId).toBe("test-request-id");
    consoleSpy.mockRestore();
  });
});
