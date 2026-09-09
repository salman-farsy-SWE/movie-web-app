import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSession } from "@/lib/tmdb/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestToken = searchParams.get("request_token");
  const approved = searchParams.get("approved");
  const denied = searchParams.get("denied");

  if (denied === "true" || !requestToken || (approved !== null && approved !== "true")) {
    const errorMsg = "Authorization was denied or cancelled.";
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Authentication Cancelled - Movie Trails</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; background: #0b0c10; color: #fff; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 16px; box-sizing: border-box; text-align: center; }
            .card { background: #1f2833; padding: 32px 24px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); max-width: 380px; width: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
            h3 { margin: 0 0 8px 0; font-size: 18px; }
            p { color: #c5c6c7; font-size: 14px; margin: 0 0 20px 0; }
            .btn { display: inline-block; width: 100%; box-sizing: border-box; padding: 10px 20px; background: #e11d48; color: #fff; text-decoration: none; border: none; border-radius: 9999px; font-weight: 600; font-size: 14px; cursor: pointer; transition: opacity 0.2s; }
            .btn:hover { opacity: 0.9; }
          </style>
        </head>
        <body>
          <div class="card">
            <h3>Authorization Cancelled</h3>
            <p>You can close this window or return to the login page.</p>
            <a href="/login" class="btn" onclick="window.close();">Return to Login</a>
          </div>
          <script>
            try {
              var channel = new BroadcastChannel('tmdb_auth_channel');
              channel.postMessage({ type: 'TMDB_AUTH_ERROR', error: ${JSON.stringify(errorMsg)} });
              channel.close();
            } catch (e) {}

            try {
              localStorage.setItem('tmdb_auth_event', JSON.stringify({ type: 'TMDB_AUTH_ERROR', error: ${JSON.stringify(errorMsg)}, time: Date.now() }));
            } catch (e) {}

            if (window.opener) {
              try {
                window.opener.postMessage({ type: 'TMDB_AUTH_ERROR', error: ${JSON.stringify(errorMsg)} }, '*');
              } catch (e) {}
              setTimeout(function() { window.close(); }, 800);
            }
          </script>
        </body>
      </html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  }

  try {
    const sessionId = await createSession(requestToken);

    const cookieStore = await cookies();
    cookieStore.set("tmdb_session_id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 2, // 2 days
    });

    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Authentication Successful - Movie Trails</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; background: #0b0c10; color: #fff; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 16px; box-sizing: border-box; text-align: center; }
            .card { background: #1f2833; padding: 32px 24px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); max-width: 380px; width: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
            .spinner { border: 3px solid rgba(255,255,255,0.2); border-top: 3px solid #e11d48; border-radius: 50%; width: 32px; height: 32px; animation: spin 0.8s linear infinite; margin: 0 auto 16px auto; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            h3 { margin: 0 0 8px 0; font-size: 18px; color: #fff; }
            p { color: #c5c6c7; font-size: 14px; margin: 0 0 20px 0; }
            .btn { display: inline-block; width: 100%; box-sizing: border-box; padding: 10px 20px; background: #e11d48; color: #fff; text-decoration: none; border: none; border-radius: 9999px; font-weight: 600; font-size: 14px; cursor: pointer; transition: opacity 0.2s; }
            .btn:hover { opacity: 0.9; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="spinner"></div>
            <h3>Authentication Successful!</h3>
            <p>Logging you in and redirecting to Movie Trails...</p>
            <a href="/" class="btn" id="continue-btn" onclick="window.close();">Continue to Movie Trails</a>
          </div>
          <script>
            try {
              var channel = new BroadcastChannel('tmdb_auth_channel');
              channel.postMessage({ type: 'TMDB_AUTH_SUCCESS' });
            } catch (e) {}

            try {
              localStorage.setItem('tmdb_auth_event', JSON.stringify({ type: 'TMDB_AUTH_SUCCESS', time: Date.now() }));
            } catch (e) {}

            if (window.opener) {
              try {
                window.opener.postMessage({ type: 'TMDB_AUTH_SUCCESS' }, '*');
              } catch (e) {}
            }

            setTimeout(function() {
              try {
                window.close();
              } catch (e) {}
              setTimeout(function() {
                window.location.href = '/';
              }, 400);
            }, 300);
          </script>
        </body>
      </html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to complete TMDB login.";

    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Authentication Error - Movie Trails</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; background: #0b0c10; color: #fff; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 16px; box-sizing: border-box; text-align: center; }
            .card { background: #1f2833; padding: 32px 24px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); max-width: 380px; width: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
            h3 { margin: 0 0 8px 0; font-size: 18px; color: #f87171; }
            p { color: #c5c6c7; font-size: 14px; margin: 0 0 20px 0; }
            .btn { display: inline-block; width: 100%; box-sizing: border-box; padding: 10px 20px; background: #e11d48; color: #fff; text-decoration: none; border: none; border-radius: 9999px; font-weight: 600; font-size: 14px; cursor: pointer; transition: opacity 0.2s; }
            .btn:hover { opacity: 0.9; }
          </style>
        </head>
        <body>
          <div class="card">
            <h3>Login Error</h3>
            <p>${message}</p>
            <a href="/login" class="btn" onclick="window.close();">Return to Login</a>
          </div>
          <script>
            try {
              var channel = new BroadcastChannel('tmdb_auth_channel');
              channel.postMessage({ type: 'TMDB_AUTH_ERROR', error: ${JSON.stringify(message)} });
            } catch (e) {}

            try {
              localStorage.setItem('tmdb_auth_event', JSON.stringify({ type: 'TMDB_AUTH_ERROR', error: ${JSON.stringify(message)}, time: Date.now() }));
            } catch (e) {}

            if (window.opener) {
              try {
                window.opener.postMessage({ type: 'TMDB_AUTH_ERROR', error: ${JSON.stringify(message)} }, '*');
              } catch (e) {}
            }

            setTimeout(function() {
              try {
                window.close();
              } catch (e) {}
            }, 1000);
          </script>
        </body>
      </html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  }
}
