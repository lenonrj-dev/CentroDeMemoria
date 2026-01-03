"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { normalizeApiError, type NormalizedApiError } from "../../lib/api-errors";
import { useAdminAuth } from "./AdminAuthProvider";
import { setFlashToast } from "./ToastProvider";

export function useApiErrorHandler() {
  const router = useRouter();
  const { clearToken } = useAdminAuth();

  return useCallback(
    (error: unknown): NormalizedApiError => {
      const normalized = normalizeApiError(error);
      if (normalized.status === 401 || normalized.code === "AUTH_REQUIRED") {
        clearToken();
        setFlashToast({
          type: "error",
          title: "Sessao expirada",
          message: "Sua sessao expirou. Faca login novamente.",
        });
        router.replace("/admin/login");
      }
      return normalized;
    },
    [clearToken, router]
  );
}
