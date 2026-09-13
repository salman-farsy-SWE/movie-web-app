/**
 * Helper to determine if a route is a protected user collection or profile route.
 * Protected routes include:
 * - /:id/favorite
 * - /:id/watchlist
 * - /:id/rating
 * - /:id/profile
 * - /:id/list
 * - /:id/list/:listId
 */
export function isProtectedRoute(pathname: string): boolean {
  if (!pathname || pathname === "/") return false;

  // Strip query string and hashes if any
  const cleanPath = pathname.split("?")[0].split("#")[0];
  const segments = cleanPath.split("/").filter(Boolean);

  if (segments.length === 0) return false;

  const protectedSubRoutes = new Set([
    "favorite",
    "watchlist",
    "rating",
    "profile",
    "list",
  ]);

  // Handle /:id/favorite, /:id/list/:listId, etc.
  if (segments.length >= 2 && protectedSubRoutes.has(segments[1])) {
    return true;
  }

  // Handle direct /favorite, /profile, etc. if accessed without user param
  if (segments.length === 1 && protectedSubRoutes.has(segments[0])) {
    return true;
  }

  return false;
}


