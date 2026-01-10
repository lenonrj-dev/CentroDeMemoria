import type { IncomingMessage, ServerResponse } from "node:http";

// Official production origins (Vercel); safe fallback if env is missing.
const PRODUCTION_ORIGINS = [
  "https://admin-cmodrm.vercel.app",
  "https://devops-cmodrm.vercel.app",
  "https://frontend-cmodrm.vercel.app",
];

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

function getAllowedOrigins() {
  const raw = process.env.CORS_ORIGIN || "";
  const base = raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const prod = [...base, ...PRODUCTION_ORIGINS];

  if (process.env.NODE_ENV === "production") return Array.from(new Set(prod));

  return Array.from(new Set([...prod, ...LOCAL_ORIGINS]));
}

function resolveOrigin(origin?: string | string[]) {
  const value = Array.isArray(origin) ? origin[0] : origin;
  if (!value) return "";
  const allowed = getAllowedOrigins();
  return allowed.includes(value) ? value : "";
}

function appendVary(res: ServerResponse, header: string) {
  const current = res.getHeader("Vary");
  const next = current ? `${current}, ${header}` : header;
  res.setHeader("Vary", next);
}

export function applyCors(req: IncomingMessage, res: ServerResponse) {
  const origin = resolveOrigin(req.headers.origin);
  if (!origin) return false;

  res.setHeader("Access-Control-Allow-Origin", origin);
  appendVary(res, "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  const requested = req.headers["access-control-request-headers"];
  const allowHeaders = requested
    ? Array.isArray(requested)
      ? requested.join(",")
      : requested
    : "Content-Type, Authorization, X-Request-Id, X-Requested-With";
  res.setHeader("Access-Control-Allow-Headers", allowHeaders);
  res.setHeader("Access-Control-Max-Age", "86400");
  return true;
}

export function handlePreflight(req: IncomingMessage, res: ServerResponse) {
  if ((req.method || "").toUpperCase() !== "OPTIONS") return false;
  applyCors(req, res);
  res.statusCode = 204;
  res.end();
  return true;
}
