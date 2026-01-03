import mongoose, { Schema } from "mongoose";

export type SiteRoute = {
  routePath: string;
  label: string;
  routeType: string;
  contentTypes: string[];
  query?: Record<string, unknown>;
  enabled?: boolean;
};

const SiteRouteSchema = new Schema<SiteRoute>(
  {
    routePath: { type: String, required: true, unique: true, trim: true, index: true },
    label: { type: String, required: true, trim: true },
    routeType: { type: String, required: true, trim: true, index: true },
    contentTypes: { type: [String], default: [] },
    query: { type: Schema.Types.Mixed },
    enabled: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const SiteRouteModel = mongoose.models.SiteRoute || mongoose.model<SiteRoute>("SiteRoute", SiteRouteSchema);
