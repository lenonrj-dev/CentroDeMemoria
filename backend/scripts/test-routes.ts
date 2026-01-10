import assert from "node:assert/strict";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import bcrypt from "bcryptjs";

process.env.NODE_ENV = "test";
process.env.MONGODB_URI = "mongodb://localhost:27017/test";
process.env.JWT_SECRET = "test-secret-1234567890";
process.env.CORS_ORIGIN = "http://localhost:3002";
process.env.ADMIN_EMAIL = "admin@example.com";
process.env.ADMIN_PASSWORD_HASH = bcrypt.hashSync("test123", 10);

const { handleRequest } = require("../src/serverless");
const { applyCors } = require("../src/cors");

async function startServer() {
  const server = createServer((req, res) => handleRequest(req, res));
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address() as AddressInfo;
  const baseUrl = `http://127.0.0.1:${address.port}`;
  return { server, baseUrl };
}

async function request(url: string, init?: RequestInit) {
  const res = await fetch(url, init);
  const text = await res.text();
  return { res, text };
}

async function main() {
  const origin = "http://localhost:3002";

  // Unit check: allowlist applies origin
  const headers = new Map<string, string>();
  const mockReq = { headers: { origin } };
  const mockRes = {
    getHeader: (name: string) => headers.get(name),
    setHeader: (name: string, value: string) => headers.set(name, value),
  };
  const allowed = applyCors(mockReq as any, mockRes as any);
  assert.equal(allowed, true);
  assert.equal(headers.get("Access-Control-Allow-Origin"), origin);

  const { server, baseUrl } = await startServer();
  try {
    const health = await request(`${baseUrl}/api/backend/health`);
    assert.notEqual(health.res.status, 404);
    assert.equal(health.res.status, 200);

    const ping = await request(`${baseUrl}/api/backend/admin/auth/ping`);
    assert.notEqual(ping.res.status, 404);
    assert.equal(ping.res.status, 200);

    const optionsOverview = await request(`${baseUrl}/api/backend/admin/overview`, {
      method: "OPTIONS",
      headers: {
        Origin: origin,
        "Access-Control-Request-Method": "GET",
        "Access-Control-Request-Headers": "content-type, authorization, x-request-id",
      },
    });
    assert.equal(optionsOverview.res.status, 204);
    assert.equal(optionsOverview.res.headers.get("access-control-allow-origin"), origin);

    const optionsDocs = await request(`${baseUrl}/api/backend/admin/documentos`, {
      method: "OPTIONS",
      headers: {
        Origin: origin,
        "Access-Control-Request-Method": "GET",
        "Access-Control-Request-Headers": "content-type, authorization, x-request-id",
      },
    });
    assert.equal(optionsDocs.res.status, 204);
    assert.equal(optionsDocs.res.headers.get("access-control-allow-origin"), origin);

    const overview = await request(`${baseUrl}/api/backend/admin/overview`);
    assert.notEqual(overview.res.status, 404);

    const documentos = await request(`${baseUrl}/api/backend/admin/documentos`);
    assert.notEqual(documentos.res.status, 404);

    const login = await request(`${baseUrl}/api/backend/admin/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: origin,
      },
      body: JSON.stringify({ email: "admin@example.com", password: "wrong" }),
    });
    assert.notEqual(login.res.status, 404);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
}

main()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("[test] routes ok");
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error("[test] routes failed", error);
    process.exit(1);
  });
