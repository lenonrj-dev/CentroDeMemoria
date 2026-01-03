import { Router } from "express";
import { login } from "../controllers/auth";
import { requireAdmin } from "../middlewares/require-admin";
import { adminOverview } from "../controllers/admin-overview";
import {
  documentsAdmin,
  testimonialsAdmin,
  referencesAdmin,
  journalsAdmin,
  photosAdmin,
  personalArchivesAdmin,
} from "../controllers/modules";
import { createSiteRoute, listSiteRoutes, removeSiteRoute, updateSiteRoute } from "../controllers/site-route";
import { wrapAsync } from "../utils/api-error";

export const adminRoutes = Router();

adminRoutes.post("/auth/login", wrapAsync(login));
adminRoutes.get("/overview", requireAdmin, wrapAsync(adminOverview));

adminRoutes.get("/documentos", requireAdmin, wrapAsync(documentsAdmin.list));
adminRoutes.post("/documentos", requireAdmin, wrapAsync(documentsAdmin.create));
adminRoutes.get("/documentos/:id", requireAdmin, wrapAsync(documentsAdmin.byId));
adminRoutes.patch("/documentos/:id", requireAdmin, wrapAsync(documentsAdmin.update));
adminRoutes.delete("/documentos/:id", requireAdmin, wrapAsync(documentsAdmin.remove));
adminRoutes.patch("/documentos/:id/status", requireAdmin, wrapAsync(documentsAdmin.updateStatus));

adminRoutes.get("/depoimentos", requireAdmin, wrapAsync(testimonialsAdmin.list));
adminRoutes.post("/depoimentos", requireAdmin, wrapAsync(testimonialsAdmin.create));
adminRoutes.get("/depoimentos/:id", requireAdmin, wrapAsync(testimonialsAdmin.byId));
adminRoutes.patch("/depoimentos/:id", requireAdmin, wrapAsync(testimonialsAdmin.update));
adminRoutes.delete("/depoimentos/:id", requireAdmin, wrapAsync(testimonialsAdmin.remove));
adminRoutes.patch("/depoimentos/:id/status", requireAdmin, wrapAsync(testimonialsAdmin.updateStatus));

adminRoutes.get("/entrevistas", requireAdmin, wrapAsync(testimonialsAdmin.list));
adminRoutes.post("/entrevistas", requireAdmin, wrapAsync(testimonialsAdmin.create));
adminRoutes.get("/entrevistas/:id", requireAdmin, wrapAsync(testimonialsAdmin.byId));
adminRoutes.patch("/entrevistas/:id", requireAdmin, wrapAsync(testimonialsAdmin.update));
adminRoutes.delete("/entrevistas/:id", requireAdmin, wrapAsync(testimonialsAdmin.remove));
adminRoutes.patch("/entrevistas/:id/status", requireAdmin, wrapAsync(testimonialsAdmin.updateStatus));

adminRoutes.get("/referencias", requireAdmin, wrapAsync(referencesAdmin.list));
adminRoutes.post("/referencias", requireAdmin, wrapAsync(referencesAdmin.create));
adminRoutes.get("/referencias/:id", requireAdmin, wrapAsync(referencesAdmin.byId));
adminRoutes.patch("/referencias/:id", requireAdmin, wrapAsync(referencesAdmin.update));
adminRoutes.delete("/referencias/:id", requireAdmin, wrapAsync(referencesAdmin.remove));
adminRoutes.patch("/referencias/:id/status", requireAdmin, wrapAsync(referencesAdmin.updateStatus));

adminRoutes.get("/jornais", requireAdmin, wrapAsync(journalsAdmin.list));
adminRoutes.post("/jornais", requireAdmin, wrapAsync(journalsAdmin.create));
adminRoutes.get("/jornais/:id", requireAdmin, wrapAsync(journalsAdmin.byId));
adminRoutes.patch("/jornais/:id", requireAdmin, wrapAsync(journalsAdmin.update));
adminRoutes.delete("/jornais/:id", requireAdmin, wrapAsync(journalsAdmin.remove));
adminRoutes.patch("/jornais/:id/status", requireAdmin, wrapAsync(journalsAdmin.updateStatus));

adminRoutes.get("/acervo-fotografico", requireAdmin, wrapAsync(photosAdmin.list));
adminRoutes.post("/acervo-fotografico", requireAdmin, wrapAsync(photosAdmin.create));
adminRoutes.get("/acervo-fotografico/:id", requireAdmin, wrapAsync(photosAdmin.byId));
adminRoutes.patch("/acervo-fotografico/:id", requireAdmin, wrapAsync(photosAdmin.update));
adminRoutes.delete("/acervo-fotografico/:id", requireAdmin, wrapAsync(photosAdmin.remove));
adminRoutes.patch("/acervo-fotografico/:id/status", requireAdmin, wrapAsync(photosAdmin.updateStatus));

adminRoutes.get("/acervos-pessoais", requireAdmin, wrapAsync(personalArchivesAdmin.list));
adminRoutes.post("/acervos-pessoais", requireAdmin, wrapAsync(personalArchivesAdmin.create));
adminRoutes.get("/acervos-pessoais/:id", requireAdmin, wrapAsync(personalArchivesAdmin.byId));
adminRoutes.patch("/acervos-pessoais/:id", requireAdmin, wrapAsync(personalArchivesAdmin.update));
adminRoutes.delete("/acervos-pessoais/:id", requireAdmin, wrapAsync(personalArchivesAdmin.remove));
adminRoutes.patch("/acervos-pessoais/:id/status", requireAdmin, wrapAsync(personalArchivesAdmin.updateStatus));

adminRoutes.get("/rotas", requireAdmin, wrapAsync(listSiteRoutes));
adminRoutes.post("/rotas", requireAdmin, wrapAsync(createSiteRoute));
adminRoutes.patch("/rotas/:id", requireAdmin, wrapAsync(updateSiteRoute));
adminRoutes.delete("/rotas/:id", requireAdmin, wrapAsync(removeSiteRoute));
