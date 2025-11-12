import { createFileRoute } from "@tanstack/react-router";
import { LinkedInCallback } from "@/components/features/auth/linkedin-callback";

/**
 * LinkedIn OAuth Callback Route
 * Handles the redirect from LinkedIn after user authorizes access
 * Route: /auth/linkedin/callback
 */
export const Route = createFileRoute("/auth/linkedin/callback")({
  component: LinkedInCallback,
});
