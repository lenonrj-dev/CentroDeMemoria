const { spawn } = require("node:child_process");
const path = require("node:path");

const rootDir = path.resolve(__dirname, "..");
const isWin = process.platform === "win32";

function runNpm(cwd, args, env) {
  if (isWin) {
    const cmd = `npm ${args.join(" ")}`;
    return spawn("cmd.exe", ["/d", "/s", "/c", cmd], {
      cwd,
      stdio: "inherit",
      env,
      windowsHide: true,
    });
  }

  return spawn("npm", args, {
    cwd,
    stdio: "inherit",
    env,
  });
}

const backend = runNpm(rootDir, ["run", "dev:server"], process.env);

let exiting = false;
const shutdown = (code) => {
  if (exiting) return;
  exiting = true;
  if (backend && !backend.killed) backend.kill("SIGINT");
  process.exit(code || 0);
};

backend.on("exit", (code) => shutdown(code ?? 0));
backend.on("error", () => shutdown(1));

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
