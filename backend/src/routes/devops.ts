import { Router } from "express";
import { requireAdmin } from "../middlewares/require-admin";
import { wrapAsync } from "../utils/api-error";
import { devopsConfig, devopsHealth, devopsLogs, devopsMetrics } from "../controllers/devops";

export const devopsRoutes = Router();

devopsRoutes.use(requireAdmin);

devopsRoutes.get("/health", wrapAsync(devopsHealth));
devopsRoutes.get("/metrics", wrapAsync(devopsMetrics));
devopsRoutes.get("/logs", wrapAsync(devopsLogs));
devopsRoutes.get("/config", wrapAsync(devopsConfig));
