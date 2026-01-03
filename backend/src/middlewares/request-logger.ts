import type { NextFunction, Request, Response } from "express";
import { recordRequest } from "../utils/observability";

function getIp(req: Request) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length) return forwarded.split(",")[0].trim();
  return req.ip;
}

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  res.on("finish", () => {
    const start = res.locals.startTime;
    const durationMs =
      typeof start === "bigint" ? Number(process.hrtime.bigint() - start) / 1_000_000 : 0;
    const entry = {
      requestId: res.locals.requestId || req.requestId || "unknown",
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.originalUrl || req.url,
      status: res.statusCode,
      durationMs: Number.isFinite(durationMs) ? Math.round(durationMs) : 0,
      code: res.locals.errorCode,
      userId: req.admin?.email,
      ip: getIp(req),
    };
    recordRequest(entry);

    const base = `[req] ${entry.method} ${entry.path} ${entry.status} ${entry.durationMs}ms`;
    const extras = `requestId=${entry.requestId}` +
      (entry.code ? ` code=${entry.code}` : "") +
      (entry.userId ? ` user=${entry.userId}` : "");
    // eslint-disable-next-line no-console
    console.log(`${base} ${extras}`);
  });

  next();
}
