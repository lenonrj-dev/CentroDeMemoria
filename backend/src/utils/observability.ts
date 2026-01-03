type RequestLog = {
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

type MetricsSnapshot = {
  uptimeSec: number;
  totals: { requests: number; errors: number };
  ratePerMin: number;
  latency: { avgMs: number; p95Ms: number };
  statusCounts: Record<string, number>;
  codeCounts: Record<string, number>;
  topEndpoints: Array<{ path: string; count: number }>;
};

const LOG_LIMIT = 240;
const SAMPLE_LIMIT = 600;

const logs: RequestLog[] = [];
const durations: number[] = [];
const recentTimestamps: number[] = [];
const statusCounts: Record<string, number> = {};
const codeCounts: Record<string, number> = {};
const pathCounts: Record<string, number> = {};

let totalRequests = 0;
let totalErrors = 0;
const startedAt = Date.now();

function pushLimited<T>(arr: T[], item: T, limit: number) {
  arr.push(item);
  if (arr.length > limit) arr.splice(0, arr.length - limit);
}

export function recordRequest(entry: RequestLog) {
  totalRequests += 1;
  if (entry.status >= 400) totalErrors += 1;

  statusCounts[String(entry.status)] = (statusCounts[String(entry.status)] || 0) + 1;
  if (entry.code) codeCounts[entry.code] = (codeCounts[entry.code] || 0) + 1;
  pathCounts[entry.path] = (pathCounts[entry.path] || 0) + 1;

  pushLimited(logs, entry, LOG_LIMIT);
  pushLimited(durations, entry.durationMs, SAMPLE_LIMIT);
  pushLimited(recentTimestamps, Date.now(), SAMPLE_LIMIT);
}

export function getLogs(limit = LOG_LIMIT) {
  return logs.slice(-limit).reverse();
}

export function getMetrics(): MetricsSnapshot {
  const uptimeSec = Math.floor((Date.now() - startedAt) / 1000);
  const now = Date.now();
  const windowMs = 60_000;
  const recent = recentTimestamps.filter((t) => now - t <= windowMs);
  const ratePerMin = recent.length;

  const sorted = durations.slice().sort((a, b) => a - b);
  const avgMs = sorted.length ? sorted.reduce((sum, v) => sum + v, 0) / sorted.length : 0;
  const p95Ms = sorted.length ? sorted[Math.floor(sorted.length * 0.95) - 1] || sorted[sorted.length - 1] : 0;

  const topEndpoints = Object.entries(pathCounts)
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return {
    uptimeSec,
    totals: { requests: totalRequests, errors: totalErrors },
    ratePerMin,
    latency: { avgMs: Math.round(avgMs), p95Ms: Math.round(p95Ms) },
    statusCounts: { ...statusCounts },
    codeCounts: { ...codeCounts },
    topEndpoints,
  };
}
