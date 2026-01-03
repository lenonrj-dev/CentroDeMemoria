import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || "http://localhost:3001")
  .replace(/\/+$/, "");

const TIMEOUT_MS = 10_000;

function buildTarget(req: NextRequest, segments: string[]) {
  const url = new URL(req.url);
  const path = segments.length ? `/api/${segments.join("/")}` : "/api";
  const target = new URL(`${BACKEND_URL}${path}`);
  target.search = url.search;
  return target.toString();
}

function ensureRequestId(req: NextRequest) {
  return req.headers.get("x-request-id")
    || (typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`);
}

function stripUnsafeHeaders(headers: Headers) {
  headers.delete("host");
  headers.delete("cookie");
  headers.delete("connection");
  headers.delete("content-length");
  return headers;
}

function stripResponseHeaders(headers: Headers) {
  headers.delete("set-cookie");
  headers.set("cache-control", "no-store");
  return headers;
}

function errorResponse(req: NextRequest, status: number, code: string, message: string, requestId: string) {
  return NextResponse.json(
    {
      status,
      code,
      message,
      requestId,
      timestamp: new Date().toISOString(),
      path: new URL(req.url).pathname,
      method: req.method,
    },
    { status }
  );
}

async function proxy(req: NextRequest, pathParts: string[]) {
  const requestId = ensureRequestId(req);
  const target = buildTarget(req, pathParts);
  const headers = stripUnsafeHeaders(new Headers(req.headers));
  if (!headers.has("x-request-id")) headers.set("x-request-id", requestId);
  const body = req.method === "GET" || req.method === "HEAD" ? undefined : await req.arrayBuffer();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(target, {
      method: req.method,
      headers,
      body,
      redirect: "manual",
      signal: controller.signal,
    });

    clearTimeout(timeout);
    const responseHeaders = stripResponseHeaders(new Headers(res.headers));
    return new NextResponse(res.body, { status: res.status, statusText: res.statusText, headers: responseHeaders });
  } catch (error) {
    clearTimeout(timeout);
    const status = error instanceof Error && error.name === "AbortError" ? 504 : 502;
    const code = status === 504 ? "UPSTREAM_TIMEOUT" : "UPSTREAM_ERROR";
    const message = status === 504
      ? "Tempo limite ao conectar com o backend."
      : "Nao foi possivel conectar com o backend.";
    return errorResponse(req, status, code, message, requestId);
  }
}

type RouteContext = {
  params: { path?: string[] } | Promise<{ path?: string[] }>;
};

async function resolvePath(context: RouteContext) {
  const resolved = await Promise.resolve(context.params);
  return resolved?.path ?? [];
}

export async function GET(req: NextRequest, context: RouteContext) {
  const pathParts = await resolvePath(context);
  return proxy(req, pathParts);
}

export async function POST(req: NextRequest, context: RouteContext) {
  const pathParts = await resolvePath(context);
  return proxy(req, pathParts);
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  const pathParts = await resolvePath(context);
  return proxy(req, pathParts);
}

export async function PUT(req: NextRequest, context: RouteContext) {
  const pathParts = await resolvePath(context);
  return proxy(req, pathParts);
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  const pathParts = await resolvePath(context);
  return proxy(req, pathParts);
}
