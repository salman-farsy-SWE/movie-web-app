"use client";

const PREFIX = "trails_base_page:";

/**
 * Saves the baseline (unfiltered / unsorted) page for a given pathname into sessionStorage.
 */
export function saveBasePage(pathname: string, page: number): void {
  if (typeof window === "undefined") return;
  try {
    if (page > 1) {
      sessionStorage.setItem(`${PREFIX}${pathname}`, String(page));
    } else {
      sessionStorage.removeItem(`${PREFIX}${pathname}`);
    }
  } catch {
    // Ignore storage errors (e.g. private mode quota)
  }
}

/**
 * Retrieves the saved baseline page for a given pathname from sessionStorage.
 * If no saved page or page is 1, returns the provided fallback (default 1).
 */
export function getBasePage(pathname: string, fallback: number = 1): number {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = sessionStorage.getItem(`${PREFIX}${pathname}`);
    if (raw) {
      const parsed = parseInt(raw, 10);
      if (!isNaN(parsed) && parsed >= 1) {
        return parsed;
      }
    }
  } catch {
    // Ignore storage errors
  }
  return fallback;
}

/**
 * Clears the saved baseline page for a given pathname from sessionStorage.
 */
export function clearBasePage(pathname: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(`${PREFIX}${pathname}`);
  } catch {
    // Ignore storage errors
  }
}

