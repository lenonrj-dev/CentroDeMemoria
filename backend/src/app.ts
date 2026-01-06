import express from "express";
import type { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import { errorHandler } from "./middlewares/error";
import { notFound } from "./middlewares/not-found";
import { requestContext } from "./middlewares/request-context";
import { requestLogger } from "./middlewares/request-logger";
import { requireJsonBody } from "./middlewares/require-json";
import { publicRoutes } from "./routes/public";
import { adminRoutes } from "./routes/admin";
import { devopsRoutes } from "./routes/devops";
import { ApiError, fail, ok, wrapAsync } from "./utils/api-error";

export const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.set("etag", false);
app.use(requestContext);
app.use(requestLogger);
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN_LIST,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-Id", "x-request-id"],
    exposedHeaders: ["X-Request-Id", "x-request-id"],
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

const API_BASES = ["/api", "/api/backend"] as const;

const adminLimiter = rateLimit({
  windowMs: 60_000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const error = new ApiError(429, "RATE_LIMIT", "Limite de requisicoes excedido.");
    res.locals.errorCode = error.code;
    res.status(error.status).json(fail(error, req));
  },
});

function getOrigin(req: Request) {
  const protoHeader = req.headers["x-forwarded-proto"];
  const hostHeader = req.headers["x-forwarded-host"] || req.headers.host;
  const proto = (Array.isArray(protoHeader) ? protoHeader[0] : protoHeader) || req.protocol || "http";
  const host = Array.isArray(hostHeader) ? hostHeader[0] : hostHeader || "localhost";
  return `${proto}://${host}`;
}

function envStatus() {
  const required = ["NODE_ENV", "MONGODB_URI", "JWT_SECRET", "CORS_ORIGIN", "ADMIN_EMAIL", "ADMIN_PASSWORD_HASH"];
  return required.map((name) => ({ name, ok: Boolean(process.env[name]) }));
}

type RouteCheck = { label: string; method: "GET" | "POST"; path: string; body?: string };

async function runCheck(origin: string, check: RouteCheck) {
  const fetchFn = (globalThis as typeof globalThis & {
    fetch?: (input: string, init?: any) => Promise<{ status: number }>;
  }).fetch;
  if (!fetchFn) {
    return { ...check, ok: false, status: 0, message: "Fetch indisponivel" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);
  try {
    const res = await fetchFn(`${origin}${check.path}`, {
      method: check.method,
      headers: check.method === "POST" ? { "content-type": "application/json" } : undefined,
      body: check.body,
      signal: controller.signal,
      cache: "no-store",
    });
    const okStatus = res.status !== 404 && res.status < 500;
    return { ...check, ok: okStatus, status: res.status };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    return { ...check, ok: false, status: 0, message };
  } finally {
    clearTimeout(timeout);
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderPanelHtml(params: {
  basePath: string;
  timestamp: string;
  uptimeSec: number;
  env: Array<{ name: string; ok: boolean }>;
  routes: Array<{ label: string; method: string; path: string; ok: boolean; status: number; message?: string }>;
}) {
  const envRows = params.env
    .map((item) => `
      <div class="row">
        <span class="label">${escapeHtml(item.name)}</span>
        <span class="pill ${item.ok ? "ok" : "err"}">${item.ok ? "OK" : "MISSING"}</span>
      </div>
    `)
    .join("");

  const routeRows = params.routes
    .map((item) => `
      <div class="row">
        <div class="route">
          <span class="method">${escapeHtml(item.method)}</span>
          <span class="path">${escapeHtml(item.path)}</span>
        </div>
        <span class="pill ${item.ok ? "ok" : "err"}">${item.ok ? "OK" : "ERR"} ${item.status || ""}</span>
      </div>
    `)
    .join("");

  return `<!doctype html>
  <html lang="pt-br">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Backend status</title>
      <style>
        :root { color-scheme: dark; }
        * { box-sizing: border-box; }
        body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif; background: #0b0b0b; color: #f5f5f5; }
        .wrap { max-width: 900px; margin: 0 auto; padding: 32px 20px 48px; }
        .card { border: 1px solid #1f1f1f; background: #121212; border-radius: 16px; padding: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.35); }
        h1 { font-size: 24px; margin: 0 0 6px; }
        .meta { color: #bdbdbd; font-size: 13px; display: flex; gap: 16px; flex-wrap: wrap; }
        .grid { display: grid; gap: 16px; margin-top: 20px; }
        .section-title { font-size: 14px; text-transform: uppercase; letter-spacing: 0.18em; color: #8c8c8c; margin-bottom: 10px; }
        .row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #1e1e1e; }
        .row:last-child { border-bottom: none; }
        .pill { padding: 4px 10px; border-radius: 999px; font-size: 12px; border: 1px solid transparent; }
        .pill.ok { background: rgba(34,197,94,0.15); color: #a6f4c5; border-color: rgba(34,197,94,0.3); }
        .pill.err { background: rgba(239,68,68,0.15); color: #fecaca; border-color: rgba(239,68,68,0.3); }
        .route { display: flex; gap: 10px; align-items: center; }
        .method { font-size: 11px; padding: 2px 6px; border-radius: 6px; background: #1f1f1f; color: #d4d4d4; }
        .path { font-size: 13px; color: #e6e6e6; }
      </style>
    </head>
    <body>
      <div class="wrap">
        <div class="card">
          <h1>Backend online</h1>
          <div class="meta">
            <div>Base: ${escapeHtml(params.basePath)}</div>
            <div>Uptime: ${params.uptimeSec}s</div>
            <div>Timestamp: ${escapeHtml(params.timestamp)}</div>
            <div>Env: ${escapeHtml(process.env.NODE_ENV || "unknown")}</div>
          </div>
          <div class="grid">
            <div>
              <div class="section-title">Variaveis essenciais</div>
              ${envRows}
            </div>
            <div>
              <div class="section-title">Rotas criticas</div>
              ${routeRows}
            </div>
          </div>
        </div>
      </div>
    </body>
  </html>`;
}

function buildHealth(basePath: string) {
  return {
    ok: true,
    uptimeSec: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    env: envStatus(),
    routes: [
      { method: "GET", path: `${basePath}/health` },
      { method: "GET", path: `${basePath}/admin/auth/ping` },
      { method: "POST", path: `${basePath}/admin/auth/login` },
    ],
  };
}

async function panelHandler(req: Request, res: Response, basePath: string) {
  const origin = getOrigin(req);
  const checks: RouteCheck[] = [
    { label: "Health", method: "GET", path: `${basePath}/health` },
    { label: "Auth ping", method: "GET", path: `${basePath}/admin/auth/ping` },
    { label: "Login endpoint", method: "POST", path: `${basePath}/admin/auth/login`, body: "{}" },
  ];
  const results = await Promise.all(checks.map((check) => runCheck(origin, check)));
  const timestamp = new Date().toISOString();
  const html = renderPanelHtml({
    basePath,
    timestamp,
    uptimeSec: Math.floor(process.uptime()),
    env: envStatus(),
    routes: results.map((item) => ({
      label: item.label,
      method: item.method,
      path: item.path,
      ok: item.ok,
      status: item.status,
      message: (item as any).message,
    })),
  });
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.send(html);
}

function registerApiBase(basePath: string) {
  app.get(basePath, wrapAsync((req, res) => panelHandler(req, res, basePath)));
  app.get(`${basePath}/health`, (_req, res) => {
    res.json(ok(buildHealth(basePath)));
  });
  app.get(`${basePath}/admin/auth/ping`, (_req, res) => {
    res.json(ok({ ok: true }));
  });

  app.use(basePath, publicRoutes);

  app.use(
    `${basePath}/admin`,
    (req, res, next) => {
      res.setHeader("Cache-Control", "no-store");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      next();
    },
    requireJsonBody,
    adminLimiter,
    adminRoutes
  );

  app.use(
    `${basePath}/devops`,
    (req, res, next) => {
      res.setHeader("Cache-Control", "no-store");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      next();
    },
    devopsRoutes
  );
}

API_BASES.forEach((basePath) => {
  registerApiBase(basePath);
});

app.use(notFound);
app.use(errorHandler);
