const baseUrl = process.env.BACKEND_BASE_URL
  || `http://127.0.0.1:${process.env.BACKEND_PORT || process.env.PORT || 3001}`;
const origin = "https://devops-cmodrm.vercel.app";

const routes = [
  "/api/backend/devops/health",
  "/api/backend/devops/metrics",
  "/api/backend/devops/logs",
  "/api/backend/devops/config",
];

async function checkOptions(pathValue) {
  const res = await fetch(`${baseUrl}${pathValue}`, {
    method: "OPTIONS",
    headers: {
      Origin: origin,
      "Access-Control-Request-Method": "GET",
      "Access-Control-Request-Headers": "authorization,content-type,x-requested-with",
    },
  });
  if (res.status === 404) {
    throw new Error(`OPTIONS 404 ${pathValue}`);
  }
  const allowOrigin = res.headers.get("access-control-allow-origin");
  if (allowOrigin !== origin) {
    throw new Error(`CORS allow-origin mismatch ${pathValue}: ${allowOrigin}`);
  }
}

async function checkGet(pathValue) {
  const res = await fetch(`${baseUrl}${pathValue}`, {
    method: "GET",
    headers: { Origin: origin },
  });
  if (res.status === 404) {
    throw new Error(`GET 404 ${pathValue}`);
  }
  const allowOrigin = res.headers.get("access-control-allow-origin");
  if (allowOrigin !== origin) {
    throw new Error(`CORS allow-origin mismatch ${pathValue}: ${allowOrigin}`);
  }
}

async function main() {
  for (const pathValue of routes) {
    await checkOptions(pathValue);
    await checkGet(pathValue);
  }
  // eslint-disable-next-line no-console
  console.log("[verify] devops routes ok");
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("[verify] devops routes failed", error);
  process.exit(1);
});
