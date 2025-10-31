import { createLazyFileRoute, Navigate } from "@tanstack/react-router";

/**
 * Login route component (lazy loaded) - DEPRECATED
 * This route is deprecated - auth is now handled via AuthModal
 * Redirects to home page
 */
export const Route = createLazyFileRoute("/login")({
  component: () => <Navigate to="/" />,
});
