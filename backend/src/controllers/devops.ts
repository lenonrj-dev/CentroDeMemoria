import type { Request, Response } from "express";
import mongoose from "mongoose";
import { ok } from "../utils/api-error";
import { getLogs, getMetrics } from "../utils/observability";
import { env } from "../config/env";

function dbStatus() {
  const state = mongoose.connection.readyState;
  if (state === 1) return { state, status: "OK" as const };
  if (state === 2 || state === 3) return { state, status: "DEGRADED" as const };
  return { state, status: "ERROR" as const };
}

export async function devopsHealth(_req: Request, res: Response) {
  const db = dbStatus();
  const status = db.status === "OK" ? "OK" : db.status === "DEGRADED" ? "DEGRADED" : "ERROR";

  res.json(
    ok({
      status,
      server: {
        status: "OK",
        uptimeSec: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
      },
      db: {
        status: db.status,
        readyState: db.state,
      },
    })
  );
}

export async function devopsMetrics(_req: Request, res: Response) {
  const metrics = getMetrics();
  res.json(
    ok({
      ...metrics,
      memory: {
        rss: process.memoryUsage().rss,
        heapUsed: process.memoryUsage().heapUsed,
      },
    })
  );
}

export async function devopsLogs(req: Request, res: Response) {
  const raw = typeof req.query.limit === "string" ? Number(req.query.limit) : NaN;
  const limit = Number.isFinite(raw) ? Math.min(Math.max(raw, 1), 240) : 120;
  res.json(ok(getLogs(limit)));
}

export async function devopsConfig(_req: Request, res: Response) {
  res.json(
    ok({
      environment: env.NODE_ENV,
      version: process.env.APP_VERSION || "dev",
      buildTime: process.env.BUILD_TIME || null,
      node: process.version,
    })
  );
}
