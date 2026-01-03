"use client";

import { useState, type ReactNode } from "react";
import Sidebar from "./Sidebar.tsx";
import Topbar from "./Topbar.tsx";
import { ToastProvider } from "../providers/ToastProvider";
import { PreferencesProvider } from "../providers/PreferencesProvider";
import { AuthProvider } from "../devops/AuthProvider";
import { AuthGate } from "../devops/AuthGate";

export default function AppShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <ToastProvider>
      <PreferencesProvider>
        <AuthProvider>
          <AuthGate>
            <div className="flex">
              <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />
              <div className="flex-1 min-w-0">
                <Topbar onToggleSidebar={() => setSidebarOpen((v) => !v)} />
                <main className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">{children}</main>
              </div>
            </div>
          </AuthGate>
        </AuthProvider>
      </PreferencesProvider>
    </ToastProvider>
  );
}
