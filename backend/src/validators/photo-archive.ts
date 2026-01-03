import { z } from "zod";
import { UrlSchema } from "../utils/url";

const PhotoSchema = z.object({
  imageUrl: UrlSchema,
  caption: z.string().optional(),
  date: z.string().optional(),
  location: z.string().optional(),
});

export const PhotoArchiveCreateSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().min(1),
  coverImageUrl: UrlSchema,
  status: z.enum(["draft", "published", "archived"]).optional(),
  tags: z.array(z.string()).optional(),
  relatedPersonSlug: z.string().optional(),
  relatedFundKey: z.string().optional(),
  featured: z.boolean().optional(),
  sortOrder: z.number().optional(),
  photos: z.array(PhotoSchema).optional(),
  photographer: z.string().optional(),
  collection: z.string().optional(),
});

export const PhotoArchiveUpdateSchema = PhotoArchiveCreateSchema.partial();
