/**
 * Helper to determine if a route is a protected user collection or profile route.
 * Protected routes include:
 * - /:id/favorite (and /favorite)
 * - /:id/watchlist (and /watchlist)
 * - /:id/rating (and /rating)
 * - /:id/profile (and /profile)
 * - /:id/list (and /list) [User's personal lists dashboard]
 *
 * Public routes include:
 * - /list/:listId
 * - /lists/:listId
 * - /:id/list/:listId (redirects to anonymous /list/:listId)
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

  // Handle /list/:listId or /lists/:listId -> public list view
  if ((segments[0] === "list" || segments[0] === "lists") && segments.length >= 2) {
    return false;
  }

  // Handle /:id/list/:listId -> specific list (redirects to anonymous /list/:listId, so not protected)
  if (segments.length >= 3 && (segments[1] === "list" || segments[1] === "lists")) {
    return false;
  }

  // Handle direct /favorite, /profile, /list (overview without listId) if accessed without user param
  if (segments.length === 1 && (protectedSubRoutes.has(segments[0]) || segments[0] === "list" || segments[0] === "lists")) {
    return true;
  }

  // Handle /:id/favorite, /:id/watchlist, /:id/rating, /:id/profile
  if (segments.length >= 2 && protectedSubRoutes.has(segments[1])) {
    return true;
  }

  // Handle /:id/list (user's personal list dashboard)
  if (segments.length === 2 && (segments[1] === "list" || segments[1] === "lists")) {
    return true;
  }

  return false;
}
