import type { IncomingMessage, ServerResponse } from "node:http";
import { app } from "../src/app";
import { connectDb } from "../src/config/db";
import { ensurePersonalArchivesSeeded } from "../src/seed/personal-archives";
import { ensureSiteRoutesSeeded } from "../src/seed/site-routes";

let initialized = false;
let initializing: Promise<void> | null = null;

async function ensureReady() {
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

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  await ensureReady();
  return app(req as any, res as any);
}
