import type { IncomingMessage, ServerResponse } from "node:http";
import type { NextFunction, Request, Response } from "express";

const DEFAULT_ALLOWED_HEADERS = "authorization,content-type,x-request-id,x-requested-with";
const EXPOSE_HEADERS = "X-Request-Id,x-request-id";
const ALLOW_METHODS = "GET,POST,PUT,PATCH,DELETE,OPTIONS";

const REQUIRED_ORIGINS = ["https://admin-cmodrm.vercel.app"];
const PRODUCTION_ORIGINS = ["https://devops-cmodrm.vercel.app", "https://frontend-cmodrm.vercel.app"];

const LOCAL_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:4000",
  "http://localhost:4001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "http://127.0.0.1:3002",
  "http://127.0.0.1:4000",
  "http://127.0.0.1:4001",
];

function stripOrigin(value: string) {
  return value.trim().replace(/^['"]+|['"]+$/g, "").replace(/\/+$/, "");
}

function normalizeOrigin(value: string) {
  return stripOrigin(value).toLowerCase();
}

function getAllowedOrigins() {
  const raw = process.env.CORS_ORIGIN || "";
  const fromEnv = raw
    .split(",")
    .map((value) => normalizeOrigin(value))
    .filter(Boolean);
  const base = [
    ...fromEnv,
    ...REQUIRED_ORIGINS.map((value) => normalizeOrigin(value)),
    ...PRODUCTION_ORIGINS.map((value) => normalizeOrigin(value)),
  ];
  const allowed = process.env.NODE_ENV === "production" ? base : [...base, ...LOCAL_ORIGINS.map(normalizeOrigin)];
  return Array.from(new Set(allowed));
}

function resolveOrigin(origin?: string | string[]) {
  const raw = Array.isArray(origin) ? origin[0] : origin || "";
  const cleaned = stripOrigin(raw);
  if (!cleaned) return "";
  const normalized = normalizeOrigin(cleaned);
  const allowed = getAllowedOrigins();
  return allowed.includes(normalized) ? cleaned : "";
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
