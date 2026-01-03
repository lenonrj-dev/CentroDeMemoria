import type { ContentStatus } from "../types/content";

export type BaseContentFields = {
  title: string;
  slug: string;
  description: string;
  coverImageUrl: string;
  status: ContentStatus;
  tags: string[];
  relatedPersonSlug?: string;
  relatedFundKey?: string;
  featured?: boolean;
  sortOrder?: number;
  publishedAt?: Date | null;
};
