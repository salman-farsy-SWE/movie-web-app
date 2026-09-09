import { NextResponse } from "next/server";
import { createRequestToken } from "@/lib/tmdb/auth";

export async function GET(request: Request) {
  try {
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    const proto = request.headers.get("x-forwarded-proto") || "http";
    const origin = host ? `${proto}://${host}` : new URL(request.url).origin;

    const requestToken = await createRequestToken();

    // Clean callback URL without query parameters so TMDB can safely append ?request_token=...&approved=true
    const callbackUrl = `${origin}/api/auth/tmdb/callback`;

    const tmdbAuthUrl = `https://www.themoviedb.org/authenticate/${requestToken}?redirect_to=${encodeURIComponent(
      callbackUrl
    )}`;

    return NextResponse.redirect(tmdbAuthUrl);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to initiate TMDB login.";
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Login Error</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
            .card { background: #1e293b; padding: 32px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); max-width: 360px; }
            button { margin-top: 16px; padding: 8px 20px; background: #e11d48; color: #fff; border: none; border-radius: 9999px; font-weight: 600; cursor: pointer; }
          </style>
        </head>
        <body>
          <div class="card">
            <h3>Unable to start TMDB Login</h3>
            <p style="color: #f87171; font-size: 14px;">${message}</p>
            <button onclick="window.close()">Close Window</button>
          </div>
        </body>
      </html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  }
}
