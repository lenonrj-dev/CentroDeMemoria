"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiGet } from "../../lib/backend-client";
import type { NormalizedApiError } from "../../lib/api-errors";
import { useAdminAuth } from "./AdminAuthProvider";
import { useApiErrorHandler } from "./useApiErrorHandler";
import type { AdminModule } from "../../lib/public-site";

export type OverviewItemRef = {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published" | "archived";
  updatedAt?: string;
  publishedAt?: string | null;
};

export type OverviewCount = {
  key: string;
  module: AdminModule;
  total: number;
  published: number;
  drafts: number;
  archived: number;
  lastUpdated: OverviewItemRef | null;
  lastPublished: OverviewItemRef | null;
};

export type OverviewQualityBucket = {
  key: string;
  module: AdminModule;
  count: number;
  items: OverviewItemRef[];
};

export type Overview = {
  counts: OverviewCount[];
  alerts: {
    missingCover: Array<{ key: string; count: number }>;
    shortDescriptions: Array<{ key: string; count: number }>;
    documentsWithoutFileOrImages?: number;
    journalsWithoutPagesOrPdf: number;
    photoArchivesWithFewPhotos: number;
    referencesMissingYearOrCitation: number;
    testimonialsMissingAuthorOrShortText?: number;
  };
  quality?: {
    missingCover: OverviewQualityBucket[];
    shortDescriptions: OverviewQualityBucket[];
    documentsWithoutFileOrImages: { count: number; items: OverviewItemRef[] };
    journalsWithoutPagesOrPdf: { count: number; items: OverviewItemRef[] };
    photoArchivesWithFewPhotos: { count: number; items: OverviewItemRef[] };
    referencesMissingYearOrCitation: { count: number; items: OverviewItemRef[] };
    testimonialsMissingAuthorOrShortText: { count: number; items: OverviewItemRef[] };
  };
  suggestions: string[];
};

type Ctx = {
  data: Overview | null;
  loading: boolean;
  error: NormalizedApiError | null;
  refresh: () => void;
};

const AdminOverviewContext = createContext<Ctx | null>(null);

export function AdminOverviewProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAdminAuth();
  const handleApiError = useApiErrorHandler();
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<NormalizedApiError | null>(null);
  const [bump, setBump] = useState(0);

  const refresh = () => setBump((n) => n + 1);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiGet<Overview>("/api/admin/overview", token || undefined);
        if (!cancelled) setData(res.data);
      } catch (err) {
        if (!cancelled) setError(handleApiError(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [bump, token]);

  const value = useMemo<Ctx>(() => ({ data, loading, error, refresh }), [data, error, loading]);

  return <AdminOverviewContext.Provider value={value}>{children}</AdminOverviewContext.Provider>;
}

export function useAdminOverview() {
  const ctx = useContext(AdminOverviewContext);
  if (!ctx) throw new Error("useAdminOverview must be used within AdminOverviewProvider");
  return ctx;
}
