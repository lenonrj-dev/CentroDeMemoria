import { ApiClientError } from "./api-client";

export type NormalizedApiError = {
  message: string;
  status?: number;
  code?: string;
  requestId?: string;
};

export function normalizeApiError(error: unknown): NormalizedApiError {
  if (error instanceof ApiClientError) {
    return {
      message: error.message || "Erro ao processar a requisicao.",
      status: error.status,
      code: error.code,
      requestId: error.requestId,
    };
  }

  if (error instanceof Error) {
    return { message: error.message || "Erro ao processar a requisicao." };
  }

  return { message: "Erro inesperado. Tente novamente." };
}

export function formatErrorMessage(error: NormalizedApiError | null) {
  if (!error) return "";
  return error.requestId ? `${error.message} (ID: ${error.requestId})` : error.message;
}
