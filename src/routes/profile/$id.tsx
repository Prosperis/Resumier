import { createFileRoute, redirect, useParams } from "@tanstack/react-router";
import { queryClient } from "@/app/query-client";
import { RouteError } from "@/components/ui/route-error";
import { ResumeEditorLoading } from "@/components/ui/route-loading";
import { profileQueryKey, useProfile } from "@/hooks/api/use-profile";
import { apiClient } from "@/lib/api/client";
import type { Profile } from "@/lib/api/profile-types";
import { useAuthStore } from "@/stores";

/**
 * Edit profile route
 * Protected route for editing an existing profile by ID
 * Requires authentication
 */
export const Route = createFileRoute("/profile/$id")({
  beforeLoad: () => {
    const { isAuthenticated, isGuest } = useAuthStore.getState();

    // Allow both authenticated users and guests to edit profiles
    if (!isAuthenticated && !isGuest) {
      throw redirect({
        to: "/",
      });
    }
  },
  // Prefetch profile data for faster editing
  loader: async ({ params }) => {
    const { id } = params;

    await queryClient.prefetchQuery({
      queryKey: profileQueryKey(id),
      queryFn: () => apiClient.get<Profile>(`/api/profiles/${id}`),
      staleTime: 1000 * 60 * 5,
    });
  },
  pendingComponent: () => <ResumeEditorLoading />,
  errorComponent: ({ error, reset }) => (
    <RouteError error={error} reset={reset} title="Profile Loading Error" />
  ),
});
