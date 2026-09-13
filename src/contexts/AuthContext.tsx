"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useTransition,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  loginWithTmdb,
  logoutFromTmdb,
  getCurrentUser,
  type AuthResponse,
} from "@/actions/auth";
import type { TmdbAccount } from "@/lib/tmdb/auth";
import { useUserCollectionsStore } from "@/stores/useUserCollectionsStore";
import { isProtectedRoute } from "@/lib/auth-routes";
import {
  triggerRouteProgressStart,
  triggerRouteProgressDone,
} from "@/components/navigation/RouteProgressBar";

interface AuthContextType {
  user: TmdbAccount | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<TmdbAccount | null>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
  initialUser = null,
}: {
  children: React.ReactNode;
  initialUser?: TmdbAccount | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<TmdbAccount | null>(initialUser ?? null);
  const [isLoading, setIsLoading] = useState(initialUser === undefined);
  const [prevInitialUser, setPrevInitialUser] = useState(initialUser);
  const [, startTransition] = useTransition();

  if (initialUser !== prevInitialUser) {
    setPrevInitialUser(initialUser);
    setUser(initialUser ?? null);
    setIsLoading(false);
  }

  const refreshUser = useCallback(async (): Promise<TmdbAccount | null> => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        useUserCollectionsStore.getState().syncAllFromTmdb();
      }
      return currentUser;
    } catch {
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialUser === undefined) {
      startTransition(() => {
        refreshUser();
      });
    }
  }, [initialUser, refreshUser]);

  useEffect(() => {
    let broadcastChannel: BroadcastChannel | null = null;
    try {
      broadcastChannel = new BroadcastChannel("tmdb_auth_channel");
      broadcastChannel.onmessage = (event) => {
        if (event.data?.type === "TMDB_AUTH_SUCCESS") {
          refreshUser();
        }
      };
    } catch {}

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "tmdb_auth_event" && event.newValue) {
        try {
          const data = JSON.parse(event.newValue);
          if (data.type === "TMDB_AUTH_SUCCESS") {
            refreshUser();
          }
        } catch {}
      }
    };
    window.addEventListener("storage", handleStorage);

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === "TMDB_AUTH_SUCCESS") {
        refreshUser();
      }
    };
    window.addEventListener("message", handleMessage);

    return () => {
      try {
        broadcastChannel?.close();
      } catch {}
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("message", handleMessage);
    };
  }, [refreshUser]);

  const login = useCallback(
    async (username: string, password: string): Promise<AuthResponse> => {
      setIsLoading(true);
      try {
        const response = await loginWithTmdb(null, { username, password });
        if (response.success && response.user) {
          setUser(response.user);
          useUserCollectionsStore.getState().syncAllFromTmdb(true);
        }
        return response;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "An error occurred during login.";
        return { success: false, error: message };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    triggerRouteProgressStart();
    const currentPath =
      typeof window !== "undefined" ? window.location.pathname : pathname;
    const wasProtected = isProtectedRoute(currentPath) || isProtectedRoute(pathname);

    try {
      await logoutFromTmdb();
    } catch {
      // Continue cleanup on network or TMDB error
    }

    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("tmdb_account_info");
        localStorage.removeItem("movie_trails_user_collections");
      } catch {}
    }

    setUser(null);
    useUserCollectionsStore.getState().reset();
    setIsLoading(false);

    if (wasProtected) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("last_app_url", "/");
        document.cookie = "last_app_url=/; path=/; max-age=2592000; SameSite=Lax";
      }
      router.replace("/");
    } else {
      router.refresh();
    }

    triggerRouteProgressDone();
  }, [router, pathname]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
