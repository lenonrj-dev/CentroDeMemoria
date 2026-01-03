import { z } from "zod";

export const UrlSchema = z
  .string()
  .min(1)
  .refine((v) => {
    try {
      const u = new URL(v);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  }, "URL inválida");

