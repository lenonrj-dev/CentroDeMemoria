const { spawn } = require("node:child_process");
const path = require("node:path");

const rootDir = path.resolve(__dirname, "..");
const backendDir = path.join(rootDir, "backend");
const devopsDir = path.join(rootDir, "devops");
const isWin = process.platform === "win32";

function runNpm(cwd, args) {
  if (isWin) {
    const cmd = `npm ${args.join(" ")}`;
    return spawn("cmd.exe", ["/d", "/s", "/c", cmd], {
      cwd,
      stdio: "inherit",
      env: process.env,
      windowsHide: true,
    });
  }

  return spawn("npm", args, {
    cwd,
    stdio: "inherit",
    env: process.env,
  });
}

const backend = runNpm(backendDir, ["run", "dev"]);
const devops = runNpm(devopsDir, ["run", "dev"]);

let exiting = false;
const shutdown = (code) => {
  if (exiting) return;
  exiting = true;
  if (backend && !backend.killed) backend.kill("SIGINT");
  if (devops && !devops.killed) devops.kill("SIGINT");
  process.exit(code || 0);
};

backend.on("exit", (code) => shutdown(code ?? 0));
backend.on("error", () => shutdown(1));

devops.on("exit", (code) => shutdown(code ?? 0));
devops.on("error", () => shutdown(1));

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
