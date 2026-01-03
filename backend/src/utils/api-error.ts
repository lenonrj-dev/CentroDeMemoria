import type { Request, Response, NextFunction } from "express";

export type ErrorCode =
  | "AUTH_REQUIRED"
  | "INVALID_CREDENTIALS"
  | "FORBIDDEN"
  | "INVALID_PAYLOAD"
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMIT"
  | "DB_ERROR"
  | "EXTERNAL_API_ERROR"
  | "UNSUPPORTED_MEDIA"
  | "INTERNAL_ERROR";

export type ErrorResponse = {
  status: number;
  code: ErrorCode;
  message: string;
  details?: unknown;
  requestId: string;
  timestamp: string;
  path: string;
  method: string;
};

export class ApiError extends Error {
  status: number;
  code: ErrorCode;
  details?: unknown;

  constructor(status: number, code: ErrorCode, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function ok<T>(data: T, meta?: unknown) {
  return meta ? { success: true as const, data, meta } : { success: true as const, data };
}

export function fail(error: ApiError, req: Request): ErrorResponse {
  const requestId = req.requestId || req.header("x-request-id") || "unknown";
  return {
    status: error.status,
    code: error.code,
    message: error.message,
    details: error.details,
    requestId,
    timestamp: new Date().toISOString(),
    path: req.originalUrl || req.url,
    method: req.method,
  };
}

export function assert(condition: unknown, error: ApiError) {
  if (!condition) throw error;
}

export function wrapAsync<TReq extends Request, TRes extends Response>(
  fn: (req: TReq, res: TRes, next: NextFunction) => Promise<unknown>
) {
  return (req: TReq, res: TRes, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
