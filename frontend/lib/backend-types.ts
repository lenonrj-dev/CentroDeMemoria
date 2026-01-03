export type ContentStatus = "draft" | "published" | "archived";

export type BaseContent = {
  _id: string;
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
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type DocumentContent = BaseContent & {
  documentType: "pdf" | "image" | "mixed";
  fileUrl?: string | null;
  images?: string[];
  source?: string;
  collection?: string;
  year?: number;
  authors?: string[];
};

export type Attachment = { type: "pdf" | "image" | "link"; url: string; label?: string };

export type TestimonialContent = Omit<BaseContent, "coverImageUrl"> & {
  coverImageUrl?: string;
  authorName: string;
  authorRole?: string;
  testimonialText: string;
  attachments?: Attachment[];
  date?: string;
  location?: string;
  mediaType?: "youtube" | "image" | "text";
  youtubeId?: string;
  imageUrl?: string;
};

export type ReferenceContent = BaseContent & {
  citation: string;
  authors: string[];
  year: number;
  publisher?: string;
  isbn?: string;
  externalUrl?: string;
  attachments?: Attachment[];
};

export type JournalPage = { pageNumber: number; imageUrl: string; thumbUrl?: string };

export type JournalContent = BaseContent & {
  issueDate: string;
  edition?: string;
  city?: string;
  pdfUrl?: string;
  pages: JournalPage[];
  pagesCount?: number;
};

export type PhotoEntry = { imageUrl: string; caption?: string; date?: string; location?: string };

export type PhotoArchiveContent = BaseContent & {
  photos: PhotoEntry[];
  photographer?: string;
  collection?: string;
};

export type PersonalArchiveRecord = BaseContent & {
  content: Record<string, unknown>;
};

export type PaginatedMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};
