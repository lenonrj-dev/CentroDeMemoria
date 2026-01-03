import type { NextFunction, Request, Response } from "express";
import { ApiError, fail } from "../utils/api-error";

export function notFound(req: Request, res: Response, _next: NextFunction) {
  const error = new ApiError(404, "NOT_FOUND", "Rota nao encontrada.");
  res.locals.errorCode = error.code;
  res.status(error.status).json(fail(error, req));
}
