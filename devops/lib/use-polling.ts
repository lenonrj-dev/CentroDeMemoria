"use client";

import { useEffect, useRef, useState } from "react";
import { clearStoredToken } from "./auth";
import { normalizeApiError, type NormalizedApiError } from "./api-errors";

type Options = {
  intervalMs: number;
  errorIntervalMs?: number;
  enabled?: boolean;
};

export function usePolling<T>(fetcher: () => Promise<T>, deps: unknown[], options: Options) {
  const { intervalMs, errorIntervalMs = Math.max(intervalMs * 2, 4000), enabled = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<NormalizedApiError | null>(null);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const run = async () => {
      try {
        const result = await fetcher();
        if (!mounted.current) return;
        setData(result);
        setError(null);
        setLoading(false);
        timer = setTimeout(run, intervalMs);
      } catch (err) {
        if (!mounted.current) return;
        const normalized = normalizeApiError(err);
        if (normalized.status === 401 || normalized.code === "AUTH_REQUIRED") {
          clearStoredToken();
        }
        setError(normalized);
        setLoading(false);
        timer = setTimeout(run, errorIntervalMs);
      }
    };

    run();
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, deps);

  return { data, error, loading, setData };
}
