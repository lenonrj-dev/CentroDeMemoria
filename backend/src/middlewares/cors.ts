import type { IncomingMessage, ServerResponse } from "node:http";
import type { NextFunction, Request, Response } from "express";

const DEFAULT_ALLOWED_HEADERS = "authorization,content-type,x-request-id,x-requested-with";
const EXPOSE_HEADERS = "X-Request-Id,x-request-id";
const ALLOW_METHODS = "GET,POST,PUT,PATCH,DELETE,OPTIONS";
const MAX_AGE = "86400";

function resolveOrigin(origin?: string | string[]) {
  const raw = Array.isArray(origin) ? origin[0] : origin || "";
  const value = typeof raw === "string" ? raw.trim() : "";
  return value || "";
}

function appendVary(res: ServerResponse, header: string) {
  const current = res.getHeader("Vary");
  if (!current) {
    res.setHeader("Vary", header);
    return;
  }
  const value = Array.isArray(current) ? current.join(", ") : String(current);
  if (value.toLowerCase().includes(header.toLowerCase())) return;
  res.setHeader("Vary", `${value}, ${header}`);
}

export function applyCors(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Access-Control-Allow-Methods", ALLOW_METHODS);
  res.setHeader("Access-Control-Allow-Headers", DEFAULT_ALLOWED_HEADERS);
  res.setHeader("Access-Control-Expose-Headers", EXPOSE_HEADERS);
  res.setHeader("Access-Control-Max-Age", MAX_AGE);

  const origin = resolveOrigin(req.headers.origin);
  if (!origin) return false;
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  appendVary(res, "Origin");
  return true;
}

export function handlePreflight(req: IncomingMessage, res: ServerResponse) {
  if ((req.method || "").toUpperCase() !== "OPTIONS") return false;
  applyCors(req, res);
  res.statusCode = 204;
  res.end();
  return true;
}

export function corsMiddleware(req: Request, res: Response, next: NextFunction) {
  applyCors(req, res);
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  next();
}
