import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import { errorHandler } from "./middlewares/error";
import { notFound } from "./middlewares/not-found";
import { requestContext } from "./middlewares/request-context";
import { requestLogger } from "./middlewares/request-logger";
import { requireJsonBody } from "./middlewares/require-json";
import { publicRoutes } from "./routes/public";
import { adminRoutes } from "./routes/admin";
import { devopsRoutes } from "./routes/devops";
import { ApiError, fail, ok } from "./utils/api-error";

export const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.set("etag", false);
app.use(requestContext);
app.use(requestLogger);
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN_LIST,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-Id", "x-request-id"],
    exposedHeaders: ["X-Request-Id", "x-request-id"],
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => {
  res.json(ok({ ok: true }));
});

app.use("/api", publicRoutes);

app.use(
  "/api/admin",
  (req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    next();
  },
  requireJsonBody,
  rateLimit({
    windowMs: 60_000,
    limit: 120,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      const error = new ApiError(429, "RATE_LIMIT", "Limite de requisicoes excedido.");
      res.locals.errorCode = error.code;
      res.status(error.status).json(fail(error, req));
    },
  }),
  adminRoutes
);

app.use(
  "/api/devops",
  (req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    next();
  },
  devopsRoutes
);

app.use(notFound);
app.use(errorHandler);
