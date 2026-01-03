"use client";

import type { AdminModule } from "../../lib/public-site";
import { ModuleListView } from "./module-list/ModuleList";

export default function ModuleList({ module, title }: { module: AdminModule; title: string }) {
  return <ModuleListView module={module} title={title} />;
}
