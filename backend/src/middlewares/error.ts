import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import mongoose from "mongoose";
import { ApiError, fail } from "../utils/api-error";

function isJsonParseError(error: unknown) {
  return error instanceof SyntaxError && (error as any).type === "entity.parse.failed";
}

function asApiError(error: unknown, req: Request) {
  if (error instanceof ApiError) return error;

  if (isJsonParseError(error)) {
    return new ApiError(400, "INVALID_PAYLOAD", "JSON invalido. Verifique o corpo da requisicao.");
  }

  if (error instanceof ZodError) {
    const flat = error.flatten();
    return new ApiError(422, "VALIDATION_ERROR", "Campos invalidos. Corrija e tente novamente.", {
      fieldErrors: flat.fieldErrors,
      formErrors: flat.formErrors,
    });
  }

  if (error instanceof mongoose.Error.ValidationError) {
    const fieldErrors: Record<string, string> = {};
    Object.keys(error.errors || {}).forEach((key) => {
      fieldErrors[key] = error.errors[key]?.message || "Valor invalido";
    });
    return new ApiError(422, "VALIDATION_ERROR", "Falha de validacao no banco.", { fieldErrors });
  }

  if (error instanceof mongoose.Error.CastError) {
    return new ApiError(422, "VALIDATION_ERROR", "Parametro invalido.", {
      fieldErrors: { [error.path]: "Formato invalido" },
    });
  }

  if ((error as any)?.code === 11000) {
    return new ApiError(409, "CONFLICT", "Registro ja existe.", { fieldErrors: (error as any)?.keyValue });
  }

  // eslint-disable-next-line no-console
  console.error("[error]", {
    requestId: req.requestId,
    path: req.originalUrl,
    method: req.method,
    error,
  });
  return new ApiError(500, "INTERNAL_ERROR", "Erro interno. Tente novamente.");
}

export function errorHandler(error: unknown, req: Request, res: Response, _next: NextFunction) {
  const apiError = asApiError(error, req);
  res.locals.errorCode = apiError.code;
  return res.status(apiError.status).json(fail(apiError, req));
}
