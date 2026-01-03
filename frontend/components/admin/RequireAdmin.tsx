"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAdminAuth } from "./AdminAuthProvider";

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { token } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!token) router.replace(`/admin/login?next=${encodeURIComponent(pathname || "/admin")}`);
  }, [pathname, router, token]);

  if (!token) return null;
  return <>{children}</>;
}

