export type ContentStatus = "draft" | "published" | "archived";

export type ApiSuccess<T> = { success: true; data: T; meta?: unknown };
export type ApiError = { success: false; message: string; code?: string; details?: unknown };

