import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Login route - DEPRECATED
 * This route is deprecated - auth is now handled via AuthModal on the home page
 * Redirects all traffic to home page
 */
export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    // Always redirect to home page where AuthModal is available
    throw redirect({
      to: "/",
    });
  },
});
