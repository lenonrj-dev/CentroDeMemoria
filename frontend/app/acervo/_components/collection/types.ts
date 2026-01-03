import type { AcervoItem, CollectionKey } from "../../api";

export type CardProps = { item: AcervoItem };

export type CollectionIndexProps = {
  collectionKey: CollectionKey;
  initialItems: AcervoItem[];
};

export type ViewMode = "cards" | "list";
