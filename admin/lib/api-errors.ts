import { ApiClientError } from "./backend-client";

export type FieldErrors = Record<string, string>;

export type NormalizedApiError = {
  message: string;
  status?: number;
  code?: string;
  requestId?: string;
  fieldErrors?: FieldErrors;
};

function normalizeFieldErrors(details: unknown): FieldErrors | undefined {
  if (!details || typeof details !== "object") return undefined;
  const raw = (details as any).fieldErrors;
  if (!raw || typeof raw !== "object") return undefined;

  const out: FieldErrors = {};
  Object.entries(raw as Record<string, unknown>).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      const first = value.find((v) => typeof v === "string");
      if (first) out[key] = first;
    } else if (typeof value === "string") {
      out[key] = value;
    }
  });

  return Object.keys(out).length ? out : undefined;
}

export function normalizeApiError(error: unknown): NormalizedApiError {
  if (error instanceof ApiClientError) {
    return {
      message: error.message || "Erro ao processar a requisicao.",
      status: error.status,
      code: error.code,
      requestId: error.requestId,
      fieldErrors: normalizeFieldErrors(error.details),
    };
  }

  if (error instanceof Error) {
    return { message: error.message || "Erro ao processar a requisicao." };
  }

  return { message: "Erro inesperado. Tente novamente." };
}
