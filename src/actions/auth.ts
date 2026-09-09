"use server";

import { cookies } from "next/headers";
import {
  createRequestToken,
  validateWithLogin,
  createSession,
  getAccountDetails,
  deleteSession,
  type TmdbAccount,
} from "@/lib/tmdb/auth";

const SESSION_COOKIE_NAME = "tmdb_session_id";

export interface AuthResponse {
  success: boolean;
  user?: TmdbAccount;
  error?: string;
}

/**
 * Server action to log in with TMDB username and password.
 */
export async function loginWithTmdb(
  prevState: unknown,
  formData: FormData | { username?: string; password?: string }
): Promise<AuthResponse> {
  const username = (
    formData instanceof FormData ? formData.get("username") : formData?.username
  )?.toString().trim();

  const password = (
    formData instanceof FormData ? formData.get("password") : formData?.password
  )?.toString().trim();

  if (!username) {
    return { success: false, error: "Username is required." };
  }
  if (!password) {
    return { success: false, error: "Password is required." };
  }

  try {
    // 1. Create a request token
    const requestToken = await createRequestToken();

    // 2. Validate token with credentials
    const validatedToken = await validateWithLogin(username, password, requestToken);

    // 3. Create a session ID
    const sessionId = await createSession(validatedToken);

    // 4. Fetch the authenticated account details
    const user = await getAccountDetails(sessionId);

    // 5. Store session ID securely in an HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 2, // 2 days
    });

    return { success: true, user };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to log in with TMDB.";
    return { success: false, error: message };
  }
}

/**
 * Server action to log out and clear the session cookie.
 */
export async function logoutFromTmdb(): Promise<{ success: boolean }> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (sessionId) {
      await deleteSession(sessionId);
    }

    cookieStore.delete(SESSION_COOKIE_NAME);
    return { success: true };
  } catch {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
    return { success: true };
  }
}

/**
 * Server action to get the currently authenticated TMDB user.
 */
export async function getCurrentUser(): Promise<TmdbAccount | null> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionId) {
      return null;
    }

    const user = await getAccountDetails(sessionId);
    return user;
  } catch {
    return null;
  }
}

