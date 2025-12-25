/**
 * Better Auth Server Configuration
 *
 * This configures Better Auth with OAuth providers for cloud storage integration.
 * Supports: Google Drive, OneDrive, Dropbox, and Box
 */

import { betterAuth } from "better-auth";

// Get environment variables
const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    console.warn(`Missing environment variable: ${key}`);
  }
  return value || "";
};

export const auth = betterAuth({
  // Base URL for the auth server
  baseURL:
    process.env.BETTER_AUTH_URL || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:5173",

  // Secret for signing tokens - MUST be set in production
  secret: process.env.BETTER_AUTH_SECRET,

  // Database configuration - using memory adapter for serverless
  // In production, you might want to use a proper database
  database: {
    type: "memory",
  },

  // Configure email/password auth (disabled for now, we use OAuth only)
  emailAndPassword: {
    enabled: false,
  },

  // OAuth Providers
  socialProviders: {
    // Google - for Google Drive integration
    google: {
      clientId: getEnvVar("VITE_GOOGLE_CLIENT_ID"),
      clientSecret: getEnvVar("GOOGLE_CLIENT_SECRET"),
      // Request additional scopes for Drive access
      scope: [
        "openid",
        "email",
        "profile",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/drive.appdata",
      ],
      // Return access token for API calls
      accessType: "offline",
    },

    // Microsoft - for OneDrive integration
    microsoft: {
      clientId: getEnvVar("MICROSOFT_CLIENT_ID"),
      clientSecret: getEnvVar("MICROSOFT_CLIENT_SECRET"),
      // Request scopes for OneDrive access
      scope: [
        "openid",
        "email",
        "profile",
        "Files.ReadWrite",
        "Files.ReadWrite.AppFolder",
        "offline_access",
      ],
      tenant: "common", // Allow both personal and work/school accounts
    },

    // Dropbox
    dropbox: {
      clientId: getEnvVar("DROPBOX_CLIENT_ID"),
      clientSecret: getEnvVar("DROPBOX_CLIENT_SECRET"),
      // Request full Dropbox access or app folder only
      scope: [
        "account_info.read",
        "files.metadata.read",
        "files.metadata.write",
        "files.content.read",
        "files.content.write",
      ],
    },
  },

  // Session configuration
  session: {
    // Use cookie-based sessions for better security
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  },

  // Callbacks for customizing behavior
  callbacks: {
    // Called when a user signs in
    async onSignIn({ user, account }) {
      console.log(`User signed in: ${user.email} via ${account?.provider}`);
      return true;
    },

    // Called when session is created
    async session({ session, user }) {
      // Add provider info to session if available
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
        },
      };
    },
  },

  // Advanced options
  advanced: {
    // Generate secure session tokens
    generateId: () => crypto.randomUUID(),
  },
});

// Export auth types for use in client
export type Session = typeof auth.$Infer.Session;
export type User = (typeof auth.$Infer.Session)["user"];
