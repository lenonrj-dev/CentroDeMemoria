import type { PaginatedMeta } from "./backend-types";

export type ApiSuccess<T> = { success: true; data: T; meta?: PaginatedMeta };
export type ApiErrorResponse = {
  status: number;
  code: string;
  message: string;
  details?: unknown;
  requestId: string;
  timestamp: string;
  path: string;
  method: string;
};

type ApiClientErrorInit = {
  message: string;
  status: number;
  code?: string;
  details?: unknown;
  requestId?: string;
  timestamp?: string;
  path?: string;
  method?: string;
};

type ApiRequestConfig = {
  baseUrl?: string;
};

export class ApiClientError extends Error {
  status: number;
  code?: string;
  details?: unknown;
  requestId?: string;
  timestamp?: string;
  path?: string;
  method?: string;

  constructor(init: ApiClientErrorInit) {
    super(init.message);
    this.status = init.status;
    this.code = init.code;
    this.details = init.details;
    this.requestId = init.requestId;
    this.timestamp = init.timestamp;
    this.path = init.path;
    this.method = init.method;
  }
}

export const API_BASE_URL =
  (process.env.NEXT_PUBLIC_API_BASE_URL || "/api/backend").replace(/\/+$/, "");

function normalizePath(path: string, baseUrl: string) {
  if (!baseUrl.startsWith("/api/backend")) return path;
  if (path === "/api") return "";
  if (path.startsWith("/api/backend")) return path.replace(/^\/api\/backend/, "");
  if (path.startsWith("/api/")) return path.slice(4);
  return path;
}

function safeJsonParse(text: string) {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

function looksLikeHtml(text: string) {
  const snippet = text.trim().slice(0, 40).toLowerCase();
  return snippet.startsWith("<!doctype") || snippet.startsWith("<html");
}

function ensureRequestId(headers: Headers) {
  if (headers.has("x-request-id")) return;
  const requestId = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  headers.set("x-request-id", requestId);
}

function toApiError(value: unknown): ApiErrorResponse | null {
  if (!value || typeof value !== "object") return null;
  const obj = value as Record<string, unknown>;
  if (typeof obj.status !== "number" || typeof obj.code !== "string" || typeof obj.message !== "string") return null;
  return obj as ApiErrorResponse;
}

function buildUnknownError(res: Response, text: string) {
  const requestId = res.headers.get("x-request-id") || undefined;
  const message = looksLikeHtml(text) ? "Resposta invalida do servidor." : (text || `Erro HTTP ${res.status}.`);
  return new ApiClientError({
    message,
    status: res.status,
    code: "UNKNOWN_RESPONSE",
    requestId,
  });
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
  config: ApiRequestConfig = {}
): Promise<ApiSuccess<T>> {
  const headers = new Headers(options.headers);
  if (!headers.has("content-type") && options.body != null) headers.set("content-type", "application/json");
  if (token) headers.set("authorization", `Bearer ${token}`);
  ensureRequestId(headers);

  const baseUrl = config.baseUrl ?? API_BASE_URL;
  const normalized = normalizePath(path, baseUrl);
  const res = await fetch(`${baseUrl}${normalized}`, { ...options, headers });

  if (res.status === 204) {
    return { success: true, data: null as T };
  }

  const text = await res.text();
  const json = text ? safeJsonParse(text) : null;

  if (res.ok) {
    if (json && typeof json === "object" && (json as any).success === true) {
      return json as ApiSuccess<T>;
    }
    if (json != null) {
      return { success: true, data: json as T };
    }
    throw buildUnknownError(res, text);
  }

  const apiError = toApiError(json);
  if (apiError) {
    throw new ApiClientError({
      message: apiError.message,
      status: apiError.status || res.status,
      code: apiError.code,
      details: apiError.details,
      requestId: apiError.requestId || res.headers.get("x-request-id") || undefined,
      timestamp: apiError.timestamp,
      path: apiError.path,
      method: apiError.method,
    });
  }

  throw buildUnknownError(res, text);
}

export async function apiGet<T>(path: string, token?: string, config?: ApiRequestConfig) {
  return apiRequest<T>(path, { method: "GET" }, token, config);
}

export async function apiPost<T>(path: string, body: unknown, token?: string, config?: ApiRequestConfig) {
  return apiRequest<T>(path, { method: "POST", body: JSON.stringify(body) }, token, config);
}

export async function apiPatch<T>(path: string, body: unknown, token?: string, config?: ApiRequestConfig) {
  return apiRequest<T>(path, { method: "PATCH", body: JSON.stringify(body) }, token, config);
}

export async function apiDelete<T>(path: string, token?: string, config?: ApiRequestConfig) {
  return apiRequest<T>(path, { method: "DELETE" }, token, config);
}
