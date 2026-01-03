"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAdminAuth } from "./AdminAuthProvider";

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { token, ready } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!ready) return;
    if (!token) router.replace(`/admin/login?next=${encodeURIComponent(pathname || "/admin")}`);
  }, [pathname, ready, router, token]);

  if (!ready || !token) return null;
  return <>{children}</>;
}
