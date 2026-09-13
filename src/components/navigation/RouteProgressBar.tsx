"use client";

import { useEffect, useState, useRef, useCallback, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Event helper for programmatic triggers if needed
export function triggerRouteProgressStart() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("movie-trails:route-start"));
  }
}

export function triggerRouteProgressDone() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("movie-trails:route-done"));
  }
}

function RouteProgressBarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const startTimerRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const completeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentPathnameRef = useRef(pathname);

  useEffect(() => {
    currentPathnameRef.current = pathname;
  }, [pathname]);

  const startProgress = useCallback(() => {
    if (completeTimerRef.current) {
      clearTimeout(completeTimerRef.current);
      completeTimerRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (startTimerRef.current) {
      clearTimeout(startTimerRef.current);
      startTimerRef.current = null;
    }

    // Small buffer so instant client-cached navigations (< 60ms) don't cause a jarring 1-frame flash
    startTimerRef.current = setTimeout(() => {
      setVisible(true);
      setProgress(25);

      // Natural progressive loading curve
      timerRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev < 60) return prev + 12;
          if (prev < 82) return prev + 4;
          if (prev < 94) return prev + 1;
          return prev;
        });
      }, 120);
    }, 60);
  }, []);

  const completeProgress = useCallback(() => {
    if (startTimerRef.current) {
      clearTimeout(startTimerRef.current);
      startTimerRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setProgress(100);

    completeTimerRef.current = setTimeout(() => {
      setVisible(false);
      completeTimerRef.current = setTimeout(() => {
        setProgress(0);
      }, 200);
    }, 180);
  }, []);

  // Complete progress on pathname or searchParams change
  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      completeProgress();
    });
    return () => cancelAnimationFrame(frameId);
  }, [pathname, searchParams, completeProgress]);

  // Intercept internal link clicks and popstate events
  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      // Ignore modified clicks (cmd, ctrl, shift, alt) or non-left clicks
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.shiftKey
      ) {
        return;
      }

      // Find closest anchor
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");

      if (!anchor) return;

      const href = anchor.getAttribute("href");
      const targetAttr = anchor.getAttribute("target");
      const download = anchor.getAttribute("download");

      if (
        !href ||
        targetAttr === "_blank" ||
        download !== null ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#") ||
        href.startsWith("javascript:")
      ) {
        return;
      }

      try {
        const targetUrl = new URL(href, window.location.href);
        const currentUrl = new URL(window.location.href);

        // Check if internal domain
        if (targetUrl.origin !== currentUrl.origin) {
          return;
        }

        // Check if destination is on the same pathname (e.g. sort, filter, pagination, tabs)
        if (targetUrl.pathname === currentUrl.pathname) {
          return;
        }

        // Do not trigger progress bar for modal login route
        if (targetUrl.pathname === "/login") {
          return;
        }

        startProgress();
      } catch {
        // invalid URL ignore
      }
    };

    const handlePopState = () => {
      const isModalTransition =
        window.location.pathname === "/login" ||
        currentPathnameRef.current === "/login";

      if (
        !isModalTransition &&
        window.location.pathname !== currentPathnameRef.current
      ) {
        startProgress();
      }
    };

    const handleCustomStart = () => startProgress();
    const handleCustomDone = () => completeProgress();

    document.addEventListener("click", handleAnchorClick, { capture: true });
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("movie-trails:route-start", handleCustomStart);
    window.addEventListener("movie-trails:route-done", handleCustomDone);

    return () => {
      document.removeEventListener("click", handleAnchorClick, { capture: true });
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("movie-trails:route-start", handleCustomStart);
      window.removeEventListener("movie-trails:route-done", handleCustomDone);
      if (startTimerRef.current) clearTimeout(startTimerRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
      if (completeTimerRef.current) clearTimeout(completeTimerRef.current);
    };
  }, [startProgress, completeProgress]);

  if (!visible && progress === 0) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none h-[2.5px] overflow-hidden"
    >
      {/* Clean, Theme-Adjusted Progress Bar */}
      <div
        className="h-full bg-trails-red shadow-[0_0_8px_rgba(232,83,85,0.4)] transition-all duration-200 ease-out"
        style={{
          width: `${progress}%`,
          opacity: visible ? 1 : 0,
        }}
      />
    </div>
  );
}

export function RouteProgressBar() {
  return (
    <Suspense fallback={null}>
      <RouteProgressBarContent />
    </Suspense>
  );
}
