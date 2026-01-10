const origin = "https://admin-cmodrm.vercel.app";
const port = process.env.BACKEND_PORT || process.env.PORT || 3001;
const baseUrl = process.env.BACKEND_BASE_URL || `http://127.0.0.1:${port}`;

async function check(path) {
  const res = await fetch(`${baseUrl}${path}`, {
    method: "OPTIONS",
    headers: {
      Origin: origin,
      "Access-Control-Request-Method": "GET",
      "Access-Control-Request-Headers": "authorization,content-type,x-requested-with",
    },
  });
  const allowOrigin = res.headers.get("access-control-allow-origin");
  if (res.status === 404) {
    throw new Error(`Preflight 404 for ${path}`);
  }
  if (![200, 204].includes(res.status)) {
    throw new Error(`Preflight status ${res.status} for ${path}`);
  }
  if (allowOrigin !== origin) {
    const snapshot = [
      `status=${res.status}`,
      `allow-origin=${allowOrigin}`,
      `allow-methods=${res.headers.get("access-control-allow-methods")}`,
      `allow-headers=${res.headers.get("access-control-allow-headers")}`,
      `vary=${res.headers.get("vary")}`,
    ].join(" ");
    throw new Error(`CORS allow-origin mismatch for ${path}: ${snapshot}`);
  }
}

async function main() {
  await check("/api/backend/admin/overview");
  await check("/api/backend/admin/documentos?page=1&limit=1");
  // eslint-disable-next-line no-console
  console.log("[verify] preflight ok");
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("[verify] preflight failed", error);
  process.exit(1);
});
