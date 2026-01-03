import mongoose, { Schema } from "mongoose";
import type { BaseContentFields } from "./common";

export type PersonalArchiveContent = BaseContentFields & {
  content: Record<string, unknown>;
  relatedPersonSlug?: string;
  relatedFundKey?: string;
};

const PersonalArchiveSchema = new Schema<PersonalArchiveContent>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    description: { type: String, required: true, trim: true },
    coverImageUrl: { type: String, required: true, trim: true },
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft", index: true },
    tags: { type: [String], default: [], index: true },
    relatedPersonSlug: { type: String, index: true },
    relatedFundKey: { type: String, index: true },
    featured: { type: Boolean, default: false, index: true },
    sortOrder: { type: Number, default: 0, index: true },
    publishedAt: { type: Date, default: null, index: true },
    content: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

PersonalArchiveSchema.index({ title: "text", description: "text" });

export const PersonalArchiveModel =
  mongoose.models.PersonalArchive || mongoose.model<PersonalArchiveContent>("PersonalArchive", PersonalArchiveSchema);
