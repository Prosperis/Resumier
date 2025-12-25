import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useCloudStorageStore } from "@/stores/cloud-storage-store";
import { Button } from "@/components/ui/button";

/**
 * OAuth Callback Route
 * Handles the redirect from Better Auth OAuth providers
 * Route: /auth/callback
 */
export const Route = createFileRoute("/auth/callback")({
  component: OAuthCallback,
});

function OAuthCallback() {
  const navigate = useNavigate();
  const syncSession = useAuthStore((state) => state.syncSession);
  const syncFromAuthStore = useCloudStorageStore((state) => state.syncFromAuthStore);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Better Auth handles the OAuth callback automatically via cookies
        // We just need to sync the session state
        await syncSession();
        
        // Check if authentication was successful
        const authState = useAuthStore.getState();
        
        if (authState.isAuthenticated && authState.user) {
          // Sync cloud storage store with auth store
          syncFromAuthStore();
          
          setStatus("success");
          
          // Redirect to dashboard after success
          setTimeout(() => {
            // Check if we need to open folder picker
            const cloudState = useCloudStorageStore.getState();
            if (cloudState.isFolderPickerOpen) {
              navigate({ to: "/settings" });
            } else {
              navigate({ to: "/dashboard" });
            }
          }, 1500);
        } else if (authState.error) {
          setStatus("error");
          setErrorMessage(authState.error);
        } else {
          // No error but also no session - might still be processing
          // Try again after a short delay
          setTimeout(async () => {
            await syncSession();
            const newAuthState = useAuthStore.getState();
            
            if (newAuthState.isAuthenticated) {
              syncFromAuthStore();
              setStatus("success");
              setTimeout(() => {
                navigate({ to: "/dashboard" });
              }, 1500);
            } else {
              setStatus("error");
              setErrorMessage("Authentication failed. Please try again.");
            }
          }, 1000);
        }
      } catch (error) {
        setStatus("error");
        setErrorMessage(error instanceof Error ? error.message : "An error occurred");
      }
    };

    processCallback();
  }, [syncSession, syncFromAuthStore, navigate]);

  const handleRetry = () => {
    navigate({ to: "/" });
  };

  const handleGoToDashboard = () => {
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4 p-8">
        {status === "loading" && (
          <>
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <h2 className="text-xl font-semibold">Completing sign in...</h2>
            <p className="text-muted-foreground">Please wait while we connect your account.</p>
          </>
        )}
        
        {status === "success" && (
          <>
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
            <h2 className="text-xl font-semibold">Successfully connected!</h2>
            <p className="text-muted-foreground">Redirecting you to the dashboard...</p>
          </>
        )}
        
        {status === "error" && (
          <>
            <XCircle className="h-12 w-12 text-destructive mx-auto" />
            <h2 className="text-xl font-semibold">Connection failed</h2>
            <p className="text-muted-foreground">{errorMessage}</p>
            <div className="flex gap-2 justify-center pt-4">
              <Button onClick={handleRetry} variant="outline">
                Try Again
              </Button>
              <Button onClick={handleGoToDashboard}>
                Go to Dashboard
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
