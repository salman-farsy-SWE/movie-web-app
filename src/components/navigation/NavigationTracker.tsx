"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function NavigationTrackerContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (
      pathname &&
      pathname !== "/login" &&
      !pathname.startsWith("/login") &&
      !pathname.startsWith("/api/")
    ) {
      const query = searchParams?.toString();
      const fullUrl = query ? `${pathname}?${query}` : pathname;
      try {
        sessionStorage.setItem("last_app_url", fullUrl);
        document.cookie = `last_app_url=${encodeURIComponent(
          fullUrl
        )}; path=/; max-age=2592000; SameSite=Lax`;
      } catch {}
    }
  }, [pathname, searchParams]);

  return null;
}

export function NavigationTracker() {
  return (
    <Suspense fallback={null}>
      <NavigationTrackerContent />
    </Suspense>
  );
}

