/**
 * LinkedIn Import Button
 * Initiates LinkedIn OAuth flow
 */

import { Linkedin, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  getLinkedInAuthUrl,
  LINKEDIN_CONFIG,
} from "@/lib/services/linkedin-service";

interface LinkedInImportButtonProps {
  onImportStart?: () => void;
}

export function LinkedInImportButton({
  onImportStart,
}: LinkedInImportButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLinkedInLogin = () => {
    try {
      // Validate LinkedIn configuration
      if (!LINKEDIN_CONFIG.clientId) {
        toast({
          title: "Configuration Error",
          description: "LinkedIn integration is not properly configured",
          variant: "destructive",
        });
        return;
      }

      setIsLoading(true);
      onImportStart?.();

      // Generate a random state for CSRF protection
      const state = crypto.randomUUID();
      sessionStorage.setItem("linkedin_oauth_state", state);

      // Get authorization URL
      const authUrl = getLinkedInAuthUrl(state, ["openid", "profile", "email"]);

      // Redirect to LinkedIn authorization
      window.location.href = authUrl;
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to initiate LinkedIn login",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      type="button"
      onClick={handleLinkedInLogin}
      disabled={isLoading}
      variant="outline"
      className="w-full"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting to LinkedIn...
        </>
      ) : (
        <>
          <Linkedin className="mr-2 h-4 w-4" />
          Connect with LinkedIn
        </>
      )}
    </Button>
  );
}
