import type { IncomingMessage, ServerResponse } from "node:http";
import { app } from "./app";
import { connectDb } from "./config/db";
import { applyCors, handlePreflight } from "./cors";
import { ensurePersonalArchivesSeeded } from "./seed/personal-archives";
import { ensureSiteRoutesSeeded } from "./seed/site-routes";

let initialized = false;
let initializing: Promise<void> | null = null;

async function ensureReady() {
  if (process.env.NODE_ENV === "test") {
    initialized = true;
    return;
  }
  if (initialized) return;
  if (!initializing) {
    initializing = (async () => {
      await connectDb();
      try {
        await ensureSiteRoutesSeeded();
        await ensurePersonalArchivesSeeded();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn("[backend] seed skipped", error);
      }
      initialized = true;
    })();
  }
  await initializing;
}

function normalizeUrl(rawUrl?: string | null) {
  const url = new URL(rawUrl || "/", "http://localhost");
  let path = url.pathname || "/";
  if (path === "/api") {
    path = "";
  } else if (path.startsWith("/api/")) {
    path = path.slice(4);
  }

  if (!path.startsWith("/")) path = `/${path}`;
  const normalized = `/api${path}`;
  return `${normalized}${url.search}`;
}

export async function handleRequest(req: IncomingMessage, res: ServerResponse) {
  if (handlePreflight(req, res)) return;
  applyCors(req, res);
  req.url = normalizeUrl(req.url);
  await ensureReady();
  return app(req as any, res as any);
}
