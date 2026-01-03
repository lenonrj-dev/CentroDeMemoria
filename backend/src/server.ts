import { createServer } from "node:http";
import { app } from "./app";
import { env } from "./config/env";
import { connectDb } from "./config/db";
import { ensurePersonalArchivesSeeded } from "./seed/personal-archives";
import { ensureSiteRoutesSeeded } from "./seed/site-routes";

async function main() {
  await connectDb();
  try {
    await ensureSiteRoutesSeeded();
    await ensurePersonalArchivesSeeded();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn("[backend] seed skipped", error);
  }
  const server = createServer(app);
  server.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`[backend] listening on :${env.PORT}`);
  });
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("[backend] failed to start", error);
  process.exit(1);
});
