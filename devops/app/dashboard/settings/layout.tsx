// file: app/dashboard/settings/layout.tsx
"use client";

import SettingsSidebar from "../../../components/settings/SettingsSidebar";

export default function SettingsLayout({ children }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-6">
      <aside className="h-fit">
        <SettingsSidebar />
      </aside>
      <main>{children}</main>
    </div>
  );
}
