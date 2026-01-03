import crypto from "node:crypto";
import type { NextFunction, Request, Response } from "express";

function safeRequestId(value?: string | null) {
  const trimmed = (value || "").trim();
  if (!trimmed) return "";
  return trimmed.slice(0, 128);
}

export function requestContext(req: Request, res: Response, next: NextFunction) {
  const incoming = safeRequestId(req.header("x-request-id"));
  const requestId = incoming || crypto.randomUUID();
  req.requestId = requestId;
  res.locals.requestId = requestId;
  res.locals.startTime = process.hrtime.bigint();
  res.setHeader("x-request-id", requestId);
  next();
}
