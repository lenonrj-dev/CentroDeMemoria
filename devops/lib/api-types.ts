export type ApiSuccess<T> = { success: true; data: T; meta?: unknown };

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

export type DevopsHealth = {
  status: "OK" | "DEGRADED" | "ERROR";
  server: { status: "OK"; uptimeSec: number; timestamp: string };
  db: { status: "OK" | "DEGRADED" | "ERROR"; readyState: number };
};

export type DevopsMetrics = {
  uptimeSec: number;
  totals: { requests: number; errors: number };
  ratePerMin: number;
  latency: { avgMs: number; p95Ms: number };
  statusCounts: Record<string, number>;
  codeCounts: Record<string, number>;
  topEndpoints: Array<{ path: string; count: number }>;
  memory: { rss: number; heapUsed: number };
};

export type DevopsLog = {
  requestId: string;
  timestamp: string;
  method: string;
  path: string;
  status: number;
  durationMs: number;
  code?: string;
  userId?: string;
  ip?: string;
};

export type DevopsConfig = {
  environment: string;
  version: string;
  buildTime: string | null;
  node: string;
};
