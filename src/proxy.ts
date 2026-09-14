import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isProtectedRoute } from "@/lib/auth-routes";

const SESSION_COOKIE_NAME = "tmdb_session_id";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const sessionId = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  // Track last visited public page for redirect after login
  const isPublicPage =
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/login") &&
    !pathname.includes(".");

  // Add x-pathname and x-url headers for server components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);
  requestHeaders.set("x-url", `${pathname}${search}`);

  // Redirect user-scoped list URLs (e.g. /:id/list/:listId) to anonymous /list/:listId
  const userListMatch = pathname.match(/^\/([^/]+)\/list\/([^/?#]+)/);
  if (userListMatch && userListMatch[2]) {
    const listId = userListMatch[2];
    const targetUrl = new URL(`/list/${listId}${search}`, request.url);
    return NextResponse.redirect(targetUrl);
  }

  // Redirect /lists/:listId to /list/:listId
  const pluralListMatch = pathname.match(/^\/lists\/([^/?#]+)/);
  if (pluralListMatch && pluralListMatch[1]) {
    const listId = pluralListMatch[1];
    const targetUrl = new URL(`/list/${listId}${search}`, request.url);
    return NextResponse.redirect(targetUrl);
  }

  // Check if the user is visiting a protected user collection or profile page
  if (isProtectedRoute(pathname)) {
    if (!sessionId) {
      const returnUrl = `${pathname}${search}`;
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", returnUrl);
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  if (isPublicPage && !isProtectedRoute(pathname)) {
    const fullUrl = search ? `${pathname}${search}` : pathname;
    response.cookies.set("last_app_url", encodeURIComponent(fullUrl), {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - assets (public assets)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    "/((?!api|_next/static|_next/image|assets|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
