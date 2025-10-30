import { betterAuth } from "better-auth";

/**
 * Better Auth Configuration
 * OAuth providers for authentication: GitHub, GitLab, Google (Gmail), Dropbox
 */
export const auth = betterAuth({
  database: {
    // TODO: Configure database connection
    // For now, we'll use in-memory storage for development
    provider: "sqlite",
    url: ":memory:",
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.VITE_GITHUB_CLIENT_ID || "",
      clientSecret: process.env.VITE_GITHUB_CLIENT_SECRET || "",
      enabled: !!process.env.VITE_GITHUB_CLIENT_ID,
    },
    gitlab: {
      clientId: process.env.VITE_GITLAB_CLIENT_ID || "",
      clientSecret: process.env.VITE_GITLAB_CLIENT_SECRET || "",
      enabled: !!process.env.VITE_GITLAB_CLIENT_ID,
    },
    google: {
      clientId: process.env.VITE_GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.VITE_GOOGLE_CLIENT_SECRET || "",
      enabled: !!process.env.VITE_GOOGLE_CLIENT_ID,
    },
    // Note: Dropbox support may need custom implementation
    // as it might not be directly supported by better-auth
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 24 hours
  },
  advanced: {
    generateId: () => {
      // Generate random ID for development
      return Math.random().toString(36).substring(2, 15);
    },
  },
});

/**
 * Auth Client for frontend
 */
export const authClient = {
  signIn: {
    email: async (email: string, password: string) => {
      // TODO: Implement Better Auth email sign in
      console.log("Email sign in:", { email, password });
    },
    social: async (provider: "github" | "gitlab" | "google" | "dropbox") => {
      // TODO: Implement Better Auth OAuth sign in
      console.log("OAuth sign in:", provider);
    },
  },
  signUp: {
    email: async (name: string, email: string, password: string) => {
      // TODO: Implement Better Auth email sign up
      console.log("Email sign up:", { name, email, password });
    },
  },
  signOut: async () => {
    // TODO: Implement Better Auth sign out
    console.log("Sign out");
  },
};
