import type {
  Attachment,
  BaseContent,
  ContentStatus,
  DocumentContent,
  JournalContent,
  PersonalArchiveRecord,
  PhotoArchiveContent,
  ReferenceContent,
  TestimonialContent,
} from "../../../lib/backend-types";
import type { AdminModule, PublicRoute } from "../../../lib/public-site";

export type ModuleKey = AdminModule;

export type AnyContent =
  | DocumentContent
  | TestimonialContent
  | ReferenceContent
  | JournalContent
  | PhotoArchiveContent
  | PersonalArchiveRecord;

export type ListItem = BaseContent & Record<string, unknown>;

export type ListViewMode = "table" | "cards";

export type SortKey =
  | ""
  | "updated_desc"
  | "updated_asc"
  | "created_desc"
  | "created_asc"
  | "published_desc"
  | "published_asc"
  | "title_asc"
  | "title_desc"
  | "featured_desc"
  | "featured_asc"
  | "sortOrder_desc"
  | "sortOrder_asc";

export type ListQuery = {
  page: number;
  limit: number;
  q: string;
  status: "" | ContentStatus;
  tag: string;
  personSlug?: string;
  fundKey?: string;
  featured: "" | "true" | "false";
  sort: SortKey;
};

export type ListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type RowAction = "preview" | "edit" | "publish" | "archive" | "delete";

export type RowActionHandler = (action: RowAction, item: ListItem) => void;

export type BulkAction = "publish" | "archive" | "delete" | "addTag" | "removeTag";

export type BulkActionHandler = (action: BulkAction) => void;

export type PreviewData = {
  item: AnyContent;
  routes: PublicRoute[];
};

export type AttachmentLike = Attachment;
