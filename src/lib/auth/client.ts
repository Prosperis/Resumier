/**
 * Better Auth Client Configuration
 *
 * This sets up the Better Auth client for the frontend.
 * Handles authentication state, sign in/out, and OAuth flows.
 */

import { createAuthClient } from "better-auth/react";

// Get the base URL for auth API
const getAuthUrl = (): string => {
  // In production, use the deployed URL
  if (typeof window !== "undefined") {
    // Check for custom auth URL first
    const customUrl = import.meta.env.VITE_AUTH_URL;
    if (customUrl) return customUrl;

    // Use current origin in production
    if (import.meta.env.PROD) {
      return window.location.origin;
    }
  }

  // Default to localhost in development
  return "http://localhost:5173";
};

// Create the auth client
export const authClient = createAuthClient({
  baseURL: getAuthUrl(),
  // Configure fetch options
  fetchOptions: {
    credentials: "include", // Include cookies for session management
  },
});

// Export typed hooks and utilities
export const { signIn, signOut, signUp, useSession, getSession } = authClient;

// Provider-specific sign in functions
export const signInWithGoogle = () => {
  return signIn.social({
    provider: "google",
    callbackURL: `${getAuthUrl()}/auth/callback`,
  });
};

export const signInWithMicrosoft = () => {
  return signIn.social({
    provider: "microsoft",
    callbackURL: `${getAuthUrl()}/auth/callback`,
  });
};

export const signInWithDropbox = () => {
  return signIn.social({
    provider: "dropbox",
    callbackURL: `${getAuthUrl()}/auth/callback`,
  });
};

// Get access token for API calls
export const getAccessToken = async (): Promise<string | null> => {
  const session = await getSession();
  if (session?.data?.session) {
    // The access token is stored in the session
    // Better Auth handles token refresh automatically
    return (session.data as { accessToken?: string }).accessToken || null;
  }
  return null;
};

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  const session = await getSession();
  return !!session?.data?.user;
};

// Get current user info
export const getCurrentUser = async () => {
  const session = await getSession();
  return session?.data?.user || null;
};

// Provider type for type safety
export type AuthProvider = "google" | "microsoft" | "dropbox";

// Map providers to cloud storage
export const providerToCloudStorage: Record<AuthProvider, string> = {
  google: "google-drive",
  microsoft: "onedrive",
  dropbox: "dropbox",
};
