import { z } from "zod";
import { UrlSchema } from "../utils/url";

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const HrefSchema = z
  .string()
  .min(1)
  .refine((value) => value.startsWith("/") || isHttpUrl(value), "URL ou caminho invalido.");

const StatSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

const HeroSchema = z.object({
  label: z.string().optional(),
  name: z.string().min(1),
  roles: z.array(z.string()).optional(),
  summary: z.string().min(1),
  biography: z.string().optional(),
  cover: HrefSchema.optional(),
  portrait: HrefSchema.optional(),
  stats: z.array(StatSchema).optional(),
  primaryCta: z.object({ label: z.string().min(1), href: HrefSchema }).optional(),
  secondaryCta: z.object({ label: z.string().min(1), href: HrefSchema }).optional(),
});

const GallerySchema = z.object({
  src: HrefSchema,
  alt: z.string().min(1),
});

const LinkSchema = z.object({
  label: z.string().min(1),
  href: HrefSchema,
});

const AboutLinkSchema = LinkSchema.extend({
  icon: z.enum(["newspaper", "book"]).optional(),
});

const TimelineSchema = z.object({
  year: z.string().min(1),
  text: z.string().min(1),
});

const QuoteSchema = z.object({
  text: z.string().min(1),
  author: z.string().optional(),
  note: z.string().optional(),
});

const FaqSchema = z.object({
  q: z.string().min(1),
  a: z.string().min(1),
});

const StepSchema = z.object({
  icon: z.enum(["search", "check", "shield"]),
  title: z.string().min(1),
  text: z.string().min(1),
});

const NavigationSchema = z.object({
  backLabel: z.string().min(1),
  backHref: HrefSchema,
  note: z.string().min(1),
  noteLink: LinkSchema,
});

const PersonalArchiveContentSchema = z.object({
  hero: HeroSchema,
  gallery: z.array(GallerySchema).optional(),
  documents: z.array(z.object({ title: z.string().min(1), href: HrefSchema, meta: z.string().min(1) })).optional(),
  interviews: z.array(z.object({ title: z.string().min(1), href: HrefSchema, meta: z.string().min(1) })).optional(),
  timeline: z.array(TimelineSchema).optional(),
  about: z.object({ heading: z.string().min(1), description: z.string().min(1), links: z.array(AboutLinkSchema) }).optional(),
  quote: QuoteSchema.optional(),
  downloads: z.array(LinkSchema).optional(),
  navigation: NavigationSchema.optional(),
  faq: z.array(FaqSchema).optional(),
  steps: z.array(StepSchema).optional(),
});

export const PersonalArchiveCreateSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().min(1),
  coverImageUrl: UrlSchema,
  status: z.enum(["draft", "published", "archived"]).optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  sortOrder: z.number().optional(),
  relatedPersonSlug: z.string().optional(),
  relatedFundKey: z.string().optional(),
  content: PersonalArchiveContentSchema,
});

export const PersonalArchiveUpdateSchema = PersonalArchiveCreateSchema.partial();
