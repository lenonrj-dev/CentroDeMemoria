import { z } from "zod";

const RoutePathSchema = z
  .string()
  .min(1)
  .refine((value) => value.startsWith("/"), "A rota deve iniciar com '/'.")
  .refine((value) => !value.includes(" "), "A rota nao pode conter espacos.");

const ContentTypeSchema = z.enum([
  "documentos",
  "depoimentos",
  "jornais",
  "referencias",
  "acervo-fotografico",
  "acervos-pessoais",
]);

export const SiteRouteCreateSchema = z.object({
  routePath: RoutePathSchema,
  label: z.string().min(1),
  routeType: z.string().min(1),
  contentTypes: z.array(ContentTypeSchema).optional(),
  query: z.record(z.string(), z.unknown()).optional(),
  enabled: z.boolean().optional(),
});

export const SiteRouteUpdateSchema = SiteRouteCreateSchema.partial();
