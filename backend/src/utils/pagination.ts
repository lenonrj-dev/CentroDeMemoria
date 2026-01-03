import { z } from "zod";

const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
});

export function parsePagination(query: unknown) {
  const parsed = PaginationSchema.safeParse(query);
  const page = parsed.success ? parsed.data.page : 1;
  const limit = parsed.success ? parsed.data.limit : 12;
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

