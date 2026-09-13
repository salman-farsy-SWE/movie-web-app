"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ChevronLeft,
  CircleAlert,
  Eye,
  EyeOff,
  X,
  User,
  Lock,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { isProtectedRoute } from "@/lib/auth-routes";
import { hasInternalHistory } from "@/components/navigation/NavigationTracker";

interface LoginFormProps {
  isModal?: boolean;
}

function getSafePublicUrl(fallback = "/"): string {
  if (typeof window !== "undefined") {
    try {
      const stored = sessionStorage.getItem("last_app_url");
      if (
        stored &&
        stored.startsWith("/") &&
        !stored.startsWith("//") &&
        stored !== "/login" &&
        !stored.startsWith("/login?") &&
        !stored.startsWith("/api/") &&
        !isProtectedRoute(stored)
      ) {
        return stored;
      }
    } catch {}

    try {
      const match = document.cookie.match(new RegExp("(^| )last_app_url=([^;]+)"));
      if (match) {
        const cookieUrl = decodeURIComponent(match[2]);
        if (
          cookieUrl &&
          cookieUrl.startsWith("/") &&
          !cookieUrl.startsWith("//") &&
          cookieUrl !== "/login" &&
          !cookieUrl.startsWith("/login?") &&
          !cookieUrl.startsWith("/api/") &&
          !isProtectedRoute(cookieUrl)
        ) {
          return cookieUrl;
        }
      }
    } catch {}

    if (document.referrer) {
      try {
        const refUrl = new URL(document.referrer);
        if (
          refUrl.origin === window.location.origin &&
          refUrl.pathname !== "/login" &&
          !refUrl.pathname.startsWith("/login") &&
          !refUrl.pathname.startsWith("/api/") &&
          !isProtectedRoute(refUrl.pathname)
        ) {
          return refUrl.pathname + refUrl.search;
        }
      } catch {}
    }
  }

  return fallback;
}

function getSafeReturnUrl(paramUrl: string | null, fallback = "/"): string {
  if (paramUrl) {
    try {
      const decoded = decodeURIComponent(paramUrl);
      if (
        decoded.startsWith("/") &&
        !decoded.startsWith("//") &&
        decoded !== "/login" &&
        !decoded.startsWith("/login?") &&
        !decoded.startsWith("/api/")
      ) {
        return decoded;
      }
    } catch {}
  }

  if (typeof window !== "undefined") {
    try {
      const stored = sessionStorage.getItem("last_app_url");
      if (
        stored &&
        stored.startsWith("/") &&
        !stored.startsWith("//") &&
        stored !== "/login" &&
        !stored.startsWith("/login?") &&
        !stored.startsWith("/api/")
      ) {
        return stored;
      }
    } catch {}

    try {
      const match = document.cookie.match(new RegExp("(^| )last_app_url=([^;]+)"));
      if (match) {
        const cookieUrl = decodeURIComponent(match[2]);
        if (
          cookieUrl &&
          cookieUrl.startsWith("/") &&
          !cookieUrl.startsWith("//") &&
          cookieUrl !== "/login" &&
          !cookieUrl.startsWith("/login?") &&
          !cookieUrl.startsWith("/api/")
        ) {
          return cookieUrl;
        }
      }
    } catch {}

    if (document.referrer) {
      try {
        const refUrl = new URL(document.referrer);
        if (
          refUrl.origin === window.location.origin &&
          refUrl.pathname !== "/login" &&
          !refUrl.pathname.startsWith("/login") &&
          !refUrl.pathname.startsWith("/api/")
        ) {
          return refUrl.pathname + refUrl.search;
        }
      } catch {}
    }
  }

  return fallback;
}

function LoginFormContent({ isModal = false }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPopupLoading, setIsPopupLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userNameRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, login, refreshUser } = useAuth();

  const queryError = searchParams.get("error");
  const displayError = error || queryError;

  const queryRedirect =
    searchParams.get("redirect") ||
    searchParams.get("returnTo") ||
    searchParams.get("from");
  const returnUrl = getSafeReturnUrl(queryRedirect, "/");
  const hasNavigatedRef = useRef(false);

  const navigateBackOrReturn = useCallback(() => {
    if (hasNavigatedRef.current) return;
    hasNavigatedRef.current = true;

    if (isModal) {
      if (typeof window !== "undefined" && window.history.length > 1) {
        router.back();
      } else {
        router.push(returnUrl || "/");
      }
    } else {
      if (returnUrl && returnUrl !== "/login") {
        window.location.href = returnUrl;
      } else {
        window.location.href = "/";
      }
    }
  }, [isModal, returnUrl, router]);

  const handleGoBack = useCallback(() => {
    if (isModal) {
      router.back();
      return;
    }

    const safePublicUrl = getSafePublicUrl("/");

    // If redirected from a protected route, user was unauthenticated.
    // Never navigate back to the protected route without login.
    if (queryRedirect && isProtectedRoute(queryRedirect)) {
      router.push(safePublicUrl);
      return;
    }

    if (returnUrl && returnUrl !== "/login" && returnUrl !== "/" && !isProtectedRoute(returnUrl)) {
      router.push(returnUrl);
      return;
    }

    if (safePublicUrl && safePublicUrl !== "/login" && !isProtectedRoute(safePublicUrl)) {
      router.push(safePublicUrl);
      return;
    }

    if (hasInternalHistory()) {
      router.back();
    } else {
      router.push("/");
    }
  }, [isModal, queryRedirect, returnUrl, router]);

  useEffect(() => {
    userNameRef.current?.focus({ preventScroll: true });
  }, []);

  // Automatically redirect / close modal once authenticated
  useEffect(() => {
    if (isAuthenticated || user) {
      navigateBackOrReturn();
    }
  }, [isAuthenticated, user, navigateBackOrReturn]);

  const handleTmdbPopupLogin = () => {
    setError(null);
    setIsPopupLoading(true);

    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      "/api/auth/tmdb/login",
      "tmdb_login_popup",
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,status=no`
    );

    if (!popup) {
      window.location.href = "/api/auth/tmdb/login";
      return;
    }

    let isHandled = false;
    let broadcastChannel: BroadcastChannel | null = null;
    let pollTimer: NodeJS.Timeout | null = null;
    let sessionCheckTimer: NodeJS.Timeout | null = null;

    const cleanup = () => {
      if (pollTimer) clearInterval(pollTimer);
      if (sessionCheckTimer) clearInterval(sessionCheckTimer);
      window.removeEventListener("message", handleMessage);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleFocusOrVisible);
      document.removeEventListener("visibilitychange", handleFocusOrVisible);
      try {
        broadcastChannel?.close();
      } catch {}
      setIsPopupLoading(false);
    };

    const handleSuccess = async () => {
      if (isHandled) return;
      isHandled = true;
      cleanup();
      try {
        if (popup && !popup.closed) {
          popup.close();
        }
      } catch {}

      // Refresh user with retries in case session cookie is in transit
      let authenticatedUser = await refreshUser();
      if (!authenticatedUser) {
        for (let i = 0; i < 3; i++) {
          await new Promise((resolve) => setTimeout(resolve, 300));
          authenticatedUser = await refreshUser();
          if (authenticatedUser) break;
        }
      }

      router.refresh();
      navigateBackOrReturn();
    };

    const handleError = (msg: string) => {
      if (isHandled) return;
      isHandled = true;
      cleanup();
      setError(msg || "Authentication was cancelled or failed.");
    };

    // 1. BroadcastChannel listener
    try {
      broadcastChannel = new BroadcastChannel("tmdb_auth_channel");
      broadcastChannel.onmessage = (event) => {
        if (event.data?.type === "TMDB_AUTH_SUCCESS") {
          handleSuccess();
        } else if (event.data?.type === "TMDB_AUTH_ERROR") {
          handleError(event.data.error);
        }
      };
    } catch {}

    // 2. Storage event listener (fallback)
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "tmdb_auth_event" && event.newValue) {
        try {
          const data = JSON.parse(event.newValue);
          if (data.type === "TMDB_AUTH_SUCCESS") {
            handleSuccess();
          } else if (data.type === "TMDB_AUTH_ERROR") {
            handleError(data.error);
          }
        } catch {}
      }
    };
    window.addEventListener("storage", handleStorage);

    // 3. postMessage listener
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === "TMDB_AUTH_SUCCESS") {
        handleSuccess();
      } else if (event.data?.type === "TMDB_AUTH_ERROR") {
        handleError(event.data.error);
      }
    };
    window.addEventListener("message", handleMessage);

    // 4. Window Focus & Visibility Check (auto-detect login when user switches back)
    const handleFocusOrVisible = async () => {
      if (isHandled) return;
      const currentUser = await refreshUser();
      if (currentUser) {
        handleSuccess();
      }
    };
    window.addEventListener("focus", handleFocusOrVisible);
    document.addEventListener("visibilitychange", handleFocusOrVisible);

    // 5. Active Session Polling (every 1s check if session cookie is active)
    sessionCheckTimer = setInterval(async () => {
      if (isHandled) return;
      const currentUser = await refreshUser();
      if (currentUser) {
        handleSuccess();
      }
    }, 1000);

    // 6. Poll popup closure with retry attempts before giving up
    pollTimer = setInterval(() => {
      if (popup.closed) {
        if (pollTimer) clearInterval(pollTimer);
        let retries = 0;
        const maxRetries = 5;
        const checkAfterClose = async () => {
          if (isHandled) return;
          const currentUser = await refreshUser();
          if (currentUser) {
            handleSuccess();
          } else if (retries < maxRetries) {
            retries++;
            setTimeout(checkAfterClose, 500);
          } else {
            cleanup();
          }
        };
        setTimeout(checkAfterClose, 300);
      }
    }, 500);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    if (!trimmedUser) {
      setError("Username is required");
      return;
    }
    if (!trimmedPass) {
      setError("Password is required");
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(trimmedUser, trimmedPass);
      if (result.success) {
        navigateBackOrReturn();
      } else {
        setError(result.error || "Invalid username or password");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated || user) {
    return null;
  }

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center w-full",
        !isModal && "min-h-screen px-4 py-8"
      )}
    >
      {/* Standalone Back Button */}
      {!isModal && (
        <div className="fixed top-6 left-6 sm:top-8 sm:left-8 z-20">
          <button
            type="button"
            onClick={handleGoBack}
            className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-dropdown/80 hover:bg-white dark:hover:bg-dropdown border border-black/10 dark:border-white/10 shadow-sm backdrop-blur-md text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white transition-all duration-200 cursor-pointer text-sm font-medium font-akshar focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trails-red"
          >
            <ChevronLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Back</span>
          </button>
        </div>
      )}

      {/* Login Card */}
      <div
        className={cn(
          "relative w-full max-w-[420px] sm:max-w-[440px] rounded-2xl p-6 sm:p-8 transition-all z-10",
          "bg-white dark:bg-dropdown",
          "border border-black/10 dark:border-white/10",
          "shadow-xl dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
        )}
      >
        {/* Modal Close Button */}
        {isModal && (
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Close modal"
            className="absolute top-4 right-4 sm:top-5 sm:right-5 p-1.5 rounded-full text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Brand Logo */}
        <div className="flex flex-col items-center text-center">
          <Link
            href="/"
            className="flex items-center font-poppins font-semibold text-2xl sm:text-[26px] tracking-tight transition-transform duration-200 hover:scale-[1.02]"
          >
            <span className="text-black dark:text-white">Movie</span>
            <span className="text-trails-red dark:text-blue1 ml-1.5">Trails</span>
          </Link>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="mt-6 flex flex-col gap-4">
          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="username"
              className="text-xs sm:text-sm font-medium font-inter text-black/85 dark:text-white/85"
            >
              TMDB Username
            </Label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 w-4 h-4 text-black/40 dark:text-white/40 pointer-events-none" />
              <Input
                ref={userNameRef}
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Enter TMDB Username"
                autoComplete="username"
                className="w-full h-10 sm:h-11 pl-10 pr-4 rounded-lg text-sm font-inter bg-light-dropdown/60 dark:bg-plus-btn/80 border border-light-stroke/30 dark:border-white/20 text-black dark:text-white placeholder:text-light-input-font focus:border-trails-red dark:focus:border-blue1 focus-visible:ring-1 focus-visible:ring-trails-red/30 transition-all"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="password"
              className="text-xs sm:text-sm font-medium font-inter text-black/85 dark:text-white/85"
            >
              Password
            </Label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-4 h-4 text-black/40 dark:text-white/40 pointer-events-none" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Enter Password"
                autoComplete="current-password"
                className="w-full h-10 sm:h-11 pl-10 pr-10 rounded-lg text-sm font-inter bg-light-dropdown/60 dark:bg-plus-btn/80 border border-light-stroke/30 dark:border-white/20 text-black dark:text-white placeholder:text-light-input-font focus:border-trails-red dark:focus:border-blue1 focus-visible:ring-1 focus-visible:ring-trails-red/30 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 p-1 rounded-md text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {displayError && (
            <div className="flex items-center gap-2 pt-1 text-red-500">
              <CircleAlert className="w-4 h-4 shrink-0 text-red-500" />
              <p className="text-xs sm:text-sm font-inter">{displayError}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 sm:h-11 mt-1 rounded-full font-poppins text-sm sm:text-base font-semibold tracking-wide text-white dark:text-black bg-black dark:bg-white hover:bg-black/85 dark:hover:bg-white/85 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Logging in...
              </span>
            ) : (
              "Login with TMDB Password"
            )}
          </Button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-1">
            <div className="border-t border-black/10 dark:border-white/10 w-full" />
            <span className="bg-white dark:bg-dropdown px-3 text-xs font-inter text-black/50 dark:text-white/50 uppercase tracking-wider">
              or
            </span>
            <div className="border-t border-black/10 dark:border-white/10 w-full" />
          </div>

          {/* TMDB / Google Web Login Button */}
          <button
            type="button"
            onClick={handleTmdbPopupLogin}
            disabled={isLoading || isPopupLoading}
            className="w-full h-10 sm:h-11 rounded-full font-poppins text-xs sm:text-sm font-medium tracking-wide text-black dark:text-white bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 border border-black/10 dark:border-white/10 transition-all cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPopupLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Authorizing with TMDB...
              </span>
            ) : (
              <>
                <Globe className="w-4 h-4 text-trails-red dark:text-blue1" />
                <span>Continue with TMDB (Google / Web)</span>
              </>
            )}
          </button>

          {/* TMDB Sign Up Link */}
          <div className="mt-2 text-center text-xs sm:text-sm font-inter text-black/65 dark:text-white/65">
            Don&apos;t have a TMDB account?{" "}
            <button
              type="button"
              onClick={handleTmdbPopupLogin}
              disabled={isLoading || isPopupLoading}
              className="font-semibold text-trails-red dark:text-blue1 hover:underline transition-colors cursor-pointer bg-transparent border-0 p-0 inline font-inter disabled:opacity-50"
            >
              Sign up on TMDB
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LoginForm(props: LoginFormProps) {
  return (
    <Suspense fallback={null}>
      <LoginFormContent {...props} />
    </Suspense>
  );
}
