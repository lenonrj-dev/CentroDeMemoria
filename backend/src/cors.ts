import type { IncomingMessage, ServerResponse } from "node:http";
import { env } from "./config/env";

// Origens oficiais em produção (Vercel) — manter aqui para garantir CORS mesmo se o env estiver ausente/mal formatado.
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
  const base = env.CORS_ORIGIN_LIST || [];
  const prod = [...base, ...PRODUCTION_ORIGINS];

  if (env.NODE_ENV === "production") return Array.from(new Set(prod));

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

  const requested = req.headers["access-control-request-headers"];
  const allowHeaders = requested
    ? Array.isArray(requested)
      ? requested.join(",")
      : requested
    : "Content-Type, Authorization, X-Request-Id";
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
