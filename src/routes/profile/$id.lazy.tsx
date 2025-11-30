import {
  createLazyFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { ProfileEditor } from "@/components/features/profile/profile-editor";
import { RouteError } from "@/components/ui/route-error";
import { ResumeEditorLoading } from "@/components/ui/route-loading";
import { useProfile } from "@/hooks/api";

/**
 * Edit profile route component (lazy loaded)
 */
export const Route = createLazyFileRoute("/profile/$id")({
  component: EditProfileComponent,
});

function EditProfileComponent() {
  const { id } = useParams({ from: "/profile/$id" });
  const { data: profile, isLoading, error } = useProfile(id);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate({ to: "/dashboard" });
  };

  if (isLoading) {
    return <ResumeEditorLoading />;
  }

  if (error) {
    return (
      <RouteError
        error={error}
        reset={() => window.location.reload()}
        title="Failed to load profile"
      />
    );
  }

  if (!profile) {
    return (
      <RouteError
        error={new Error("Profile not found")}
        reset={() => window.location.reload()}
        title="Profile not found"
      />
    );
  }

  return <ProfileEditor profile={profile} onBack={handleBack} />;
}
