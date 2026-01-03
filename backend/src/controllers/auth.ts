import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env";
import { ApiError, ok } from "../utils/api-error";

const LoginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

export async function login(req: Request, res: Response) {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    throw new ApiError(400, "INVALID_PAYLOAD", "Corpo da requisicao invalido.");
  }

  const { email, password } = LoginSchema.parse(req.body);
  if (email.toLowerCase() !== env.ADMIN_EMAIL.toLowerCase()) {
    throw new ApiError(401, "INVALID_CREDENTIALS", "Credenciais invalidas.");
  }

  const isValid =
    // DEV UX: permite usar o hash como "senha" em ambiente nao-prod.
    (env.NODE_ENV !== "production" && password === env.ADMIN_PASSWORD_HASH) ||
    (await bcrypt.compare(password, env.ADMIN_PASSWORD_HASH));

  if (!isValid) throw new ApiError(401, "INVALID_CREDENTIALS", "Credenciais invalidas.");

  const token = jwt.sign({ email: env.ADMIN_EMAIL, role: "admin" }, env.JWT_SECRET, { expiresIn: "2h" });
  res.json(ok({ token }));
}
