import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { ApiError } from "../utils/api-error";

export type AdminTokenPayload = { email: string; role: "admin" };

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  const header = req.header("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) throw new ApiError(401, "AUTH_REQUIRED", "Sessao expirada. Faca login novamente.");

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AdminTokenPayload;
    if (!payload || payload.role !== "admin") {
      throw new ApiError(403, "FORBIDDEN", "Acesso negado.");
    }
    req.admin = payload;
    return next();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(401, "AUTH_REQUIRED", "Token invalido. Faca login novamente.");
  }
}
