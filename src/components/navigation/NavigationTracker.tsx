"use client";

import { useEffect, Suspense, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { isProtectedRoute } from "@/lib/auth-routes";

function NavigationTrackerContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstMount = useRef(true);
  const prevPathnameRef = useRef<string | null>(null);
  const prevPageRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      try {
        window.history.scrollRestoration = "manual";
      } catch {}
    }

    let scrollTimeout: NodeJS.Timeout | null = null;
    const saveScroll = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (typeof window !== "undefined" && window.location.pathname) {
          try {
            sessionStorage.setItem(`scroll_${window.location.pathname}`, String(window.scrollY));
          } catch {}
        }
      }, 100);
    };

    window.addEventListener("scroll", saveScroll, { passive: true });
    return () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      window.removeEventListener("scroll", saveScroll);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentDepth = parseInt(sessionStorage.getItem("app_history_depth") || "0", 10);
      const isInitial = isFirstMount.current;
      if (isInitial) {
        isFirstMount.current = false;
        if (currentDepth === 0) {
          sessionStorage.setItem("app_history_depth", "1");
        }
      } else {
        sessionStorage.setItem("app_history_depth", String(currentDepth + 1));
      }

      const currentPageParam = searchParams?.get("page") || "1";
      const isPageChange =
        !isInitial &&
        prevPathnameRef.current === pathname &&
        prevPageRef.current !== null &&
        prevPageRef.current !== currentPageParam;

      prevPathnameRef.current = pathname;
      prevPageRef.current = currentPageParam;

      if (isPageChange) {
        try {
          sessionStorage.removeItem(`scroll_${pathname}`);
        } catch {}
        requestAnimationFrame(() => {
          window.scrollTo({ top: 0, behavior: "instant" });
        });
      } else {
        const savedScroll = sessionStorage.getItem(`scroll_${pathname}`);
        if (savedScroll !== null) {
          const targetY = parseInt(savedScroll, 10);
          if (!isNaN(targetY)) {
            requestAnimationFrame(() => {
              window.scrollTo({ top: targetY, behavior: "instant" });
            });
          } else {
            requestAnimationFrame(() => {
              window.scrollTo({ top: 0, behavior: "instant" });
            });
          }
        } else {
          requestAnimationFrame(() => {
            window.scrollTo({ top: 0, behavior: "instant" });
          });
        }
      }
    }

    if (
      pathname &&
      pathname !== "/login" &&
      !pathname.startsWith("/login") &&
      !pathname.startsWith("/api/") &&
      !isProtectedRoute(pathname)
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

export function hasInternalHistory(): boolean {
  if (typeof window === "undefined") return false;
  const depth = parseInt(sessionStorage.getItem("app_history_depth") || "0", 10);
  if (depth > 1) return true;
  if (document.referrer && document.referrer.includes(window.location.host)) return true;
  return false;
}

export function NavigationTracker() {
  return (
    <Suspense fallback={null}>
      <NavigationTrackerContent />
    </Suspense>
  );
}
