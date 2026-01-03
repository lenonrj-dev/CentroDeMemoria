import type { AdminTokenPayload } from "../middlewares/require-admin";

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      admin?: AdminTokenPayload;
    }

    interface Locals {
      requestId?: string;
      startTime?: bigint;
      errorCode?: string;
    }
  }
}

export {};
