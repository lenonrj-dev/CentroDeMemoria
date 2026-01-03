import { useEffect, useState } from "react";
import { apiGet } from "../../../lib/backend-client";
import type { AdminModule } from "../../../lib/public-site";
import { useAdminAuth } from "../AdminAuthProvider";
import { useApiErrorHandler } from "../useApiErrorHandler";
import { getSlugStatus } from "../../../lib/slugify";

type SlugCheckState = {
  status: "idle" | "checking" | "available" | "taken" | "error";
  message?: string;
};

type SlugCheckItem = { _id?: string; id?: string; slug?: string };

export function useSlugAvailability(module: AdminModule, slugValue: string | undefined, currentId?: string) {
  const { token } = useAdminAuth();
  const handleApiError = useApiErrorHandler();
  const [state, setState] = useState<SlugCheckState>({ status: "idle" });

  useEffect(() => {
    const { slug, valid } = getSlugStatus(slugValue || "");
    if (!valid || !token) {
      setState({ status: "idle" });
      return;
    }

    let cancelled = false;
    const t = setTimeout(async () => {
      setState({ status: "checking" });
      try {
        const res = await apiGet<SlugCheckItem[]>(
          `/api/admin/${module}?slug=${encodeURIComponent(slug)}&limit=1`,
          token || undefined
        );
        if (cancelled) return;
        const hit = res.data?.[0];
        const hitId = (hit?._id || hit?.id) ? String(hit?._id || hit?.id) : "";
        const same = currentId && hitId && String(currentId) === hitId;
        setState({ status: hit && !same ? "taken" : "available" });
      } catch (err) {
        const normalized = handleApiError(err);
        if (!cancelled) setState({ status: "error", message: normalized.message });
      }
    }, 320);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [module, slugValue, token, currentId]);

  return state;
}
