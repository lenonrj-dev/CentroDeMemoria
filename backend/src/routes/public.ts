import { Router } from "express";
import {
  documentsPublic,
  testimonialsPublic,
  referencesPublic,
  journalsPublic,
  photosPublic,
  personalArchivesPublic,
} from "../controllers/modules";
import { wrapAsync } from "../utils/api-error";

export const publicRoutes = Router();

publicRoutes.get("/documentos", wrapAsync(documentsPublic.list));
publicRoutes.get("/documentos/:slug", wrapAsync(documentsPublic.bySlug));

publicRoutes.get("/depoimentos", wrapAsync(testimonialsPublic.list));
publicRoutes.get("/depoimentos/:slug", wrapAsync(testimonialsPublic.bySlug));

publicRoutes.get("/entrevistas", wrapAsync(testimonialsPublic.list));
publicRoutes.get("/entrevistas/:slug", wrapAsync(testimonialsPublic.bySlug));

publicRoutes.get("/referencias", wrapAsync(referencesPublic.list));
publicRoutes.get("/referencias/:slug", wrapAsync(referencesPublic.bySlug));

publicRoutes.get("/jornais", wrapAsync(journalsPublic.list));
publicRoutes.get("/jornais/:slug", wrapAsync(journalsPublic.bySlug));

publicRoutes.get("/acervo-fotografico", wrapAsync(photosPublic.list));
publicRoutes.get("/acervo-fotografico/:slug", wrapAsync(photosPublic.bySlug));

publicRoutes.get("/acervos-pessoais", wrapAsync(personalArchivesPublic.list));
publicRoutes.get("/acervos-pessoais/:slug", wrapAsync(personalArchivesPublic.bySlug));
