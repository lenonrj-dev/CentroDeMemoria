import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api-error";

const JSON_METHODS = new Set(["POST", "PUT", "PATCH"]);

export function requireJsonBody(req: Request, _res: Response, next: NextFunction) {
  if (!JSON_METHODS.has(req.method.toUpperCase())) return next();

  const contentType = (req.headers["content-type"] || "").toString();
  if (contentType && !contentType.includes("application/json")) {
    throw new ApiError(415, "UNSUPPORTED_MEDIA", "Content-Type deve ser application/json.");
  }

  if (!req.body || (typeof req.body === "object" && !Array.isArray(req.body) && Object.keys(req.body).length === 0)) {
    throw new ApiError(400, "INVALID_PAYLOAD", "Corpo da requisicao vazio.");
  }

  return next();
}
