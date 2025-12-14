/**
 * LinkedIn OAuth Callback Handler
 * Processes the OAuth callback from LinkedIn
 */

import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { exchangeCodeForToken, importFromLinkedInOAuth } from "@/lib/services/linkedin-service";

export function LinkedInCallback() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Get URL search parameters
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const state = params.get("state");
        const errorParam = params.get("error");
        const errorDescription = params.get("error_description");

        // Check for OAuth errors
        if (errorParam) {
          throw new Error(errorDescription || `LinkedIn OAuth error: ${errorParam}`);
        }

        // Validate authorization code
        if (!code) {
          throw new Error("No authorization code received from LinkedIn");
        }

        // Validate state parameter for CSRF protection
        const savedState = sessionStorage.getItem("linkedin_oauth_state");
        if (state !== savedState) {
          throw new Error("State parameter mismatch - possible CSRF attack");
        }

        // Exchange code for access token
        const tokenResponse = await exchangeCodeForToken(code);

        // Import LinkedIn data
        const resumeData = await importFromLinkedInOAuth(tokenResponse.access_token);

        // Store the imported data temporarily
        sessionStorage.setItem("linkedin_import_data", JSON.stringify(resumeData));
        sessionStorage.removeItem("linkedin_oauth_state");

        toast({
          title: "Import Successful",
          description: "Your LinkedIn profile has been imported successfully",
        });

        // Redirect back to resume builder
        navigate({ to: "/dashboard" });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
        setIsProcessing(false);

        toast({
          title: "Import Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    };

    processCallback();
  }, [navigate, toast]);

  if (isProcessing) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="animate-spin rounded-full border-4 border-gray-200 border-t-violet-600 h-12 w-12 mx-auto" />
          <h1 className="text-2xl font-bold">Importing Your LinkedIn Profile...</h1>
          <p className="text-gray-600">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="space-y-4 text-center max-w-md">
          <div className="text-red-600 text-4xl">⚠️</div>
          <h1 className="text-2xl font-bold">Import Failed</h1>
          <p className="text-gray-600">{error}</p>
          <Button
            onClick={() => {
              navigate({ to: "/dashboard" });
            }}
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
