import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/stores/auth-store";
import { hasGuestData } from "@/lib/utils/guest-storage";
import { initializeDemoMode } from "@/lib/utils/demo-mode";
import { queryClient } from "@/app/query-client";
import { resumesQueryKey } from "@/hooks/api";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const navigate = useNavigate();
  const loginAsGuest = useAuthStore((state) => state.loginAsGuest);
  const loginAsDemo = useAuthStore((state) => state.loginAsDemo);
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);

  const handleOAuthSignIn = (provider: string) => {
    console.log(`Sign in with ${provider}`);
    // TODO: Implement OAuth sign in
  };

  const handleContinueAsGuest = async () => {
    // Check if guest has existing data BEFORE enabling guest mode
    const hasData = await hasGuestData();

    // Enable guest mode - this will allow IndexedDB access
    loginAsGuest();
    onOpenChange(false);

    // Navigate to dashboard if they have resumes, otherwise to create new resume
    if (hasData) {
      navigate({ to: "/dashboard" });
    } else {
      navigate({ to: "/resume/new" });
    }
  };

  const handleTryDemo = async () => {
    setIsLoadingDemo(true);
    try {
      // Initialize demo mode with pre-populated data
      console.log("Initializing demo mode...");
      await initializeDemoMode({ multipleResumes: true, clearExisting: true });
      console.log("Demo mode initialized successfully");

      // Set auth state to demo
      loginAsDemo();
      console.log("Auth state set to demo");

      // Invalidate resumes cache to force refetch with demo data
      await queryClient.invalidateQueries({ queryKey: resumesQueryKey });
      console.log("Resumes cache invalidated");

      // Close modal
      onOpenChange(false);

      // Navigate to dashboard to view demo resumes
      console.log("Navigating to dashboard...");
      navigate({ to: "/dashboard" });
    } catch (error) {
      console.error("Failed to start demo:", error);
      alert("Failed to start demo mode. Please try again.");
    } finally {
      setIsLoadingDemo(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md overflow-hidden">
        <DialogHeader className="relative pb-2">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-orange-500/10 blur-3xl -z-10" />
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600 bg-clip-text text-transparent animate-gradient">
            Welcome to Resumier
          </DialogTitle>
          <DialogDescription className="text-sm mt-2">
            Choose a provider to sync your resumes or{" "}
            <span className="text-foreground/70 font-normal">continue as a guest</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Row 1: Major providers */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => handleOAuthSignIn("google")}
              className="w-full h-12 relative group overflow-hidden border hover:border-blue-500 hover:shadow-md hover:shadow-[#4285F4]/20 hover:scale-[1.02] transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#4285F4]/0 via-[#4285F4]/10 to-[#4285F4]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <svg
                className="h-5 w-5 group-hover:scale-110 transition-transform"
                viewBox="0 0 87.3 78"
                role="img"
                aria-label="Google Drive"
              >
                <path
                  fill="#0066DA"
                  d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3L29 52.2H0c0 1.55.4 3.1 1.2 4.5l5.4 10.15z"
                />
                <path
                  fill="#00AC47"
                  d="M43.65 25.25L29 1.2C27.65 2 26.5 3.1 25.7 4.5L1.2 46.5c-.8 1.4-1.2 2.95-1.2 4.5h29l14.65-25.75z"
                />
                <path
                  fill="#EA4335"
                  d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75L86.1 58.7c.8-1.4 1.2-2.95 1.2-4.5H58.3L43.65 78h16.2c2.65 0 5.2-.7 7.5-2.1l6.2-1.1z"
                />
                <path
                  fill="#00832D"
                  d="M43.65 25.25L58.3 0H29c-2.65 0-5.2.7-7.5 2.1l22.15 23.15z"
                />
                <path
                  fill="#2684FC"
                  d="M58.3 52.2H29l-15.25 26.6c2.3 1.4 4.85 2.1 7.5 2.1h44.3c2.65 0 5.2-.7 7.5-2.1L58.3 52.2z"
                />
                <path
                  fill="#FFBA00"
                  d="M73.35 26.5L58.3 0h-14.65l14.65 25.25L87.3 52.2c0-1.55-.4-3.1-1.2-4.5L73.35 26.5z"
                />
              </svg>
              <span className="font-medium text-xs ml-1.5">gDrive</span>
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => handleOAuthSignIn("dropbox")}
              className="w-full h-12 relative group overflow-hidden border hover:border-blue-600 hover:shadow-md hover:shadow-blue-600/20 hover:scale-[1.02] transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/10 to-blue-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <svg
                className="h-5 w-5 group-hover:scale-110 transition-transform"
                viewBox="0 0 256 218"
                fill="none"
                role="img"
                aria-label="Dropbox"
              >
                <path
                  fill="#0061FF"
                  d="M63.995 0L0 37.368l63.995 37.369 64.005-37.369L63.995 0zm128.01 0l-64.005 37.368 64.005 37.369L256 37.368 192.005 0zM0 112.106l63.995 37.368 64.005-37.368-64.005-37.369L0 112.106zm192.005-37.369l-64.005 37.369 64.005 37.368L256 112.106l-63.995-37.369zm-64.005 100.476l-64.005 37.369-21.328-12.456v13.937l85.333 49.935 85.343-49.935v-13.937l-21.338 12.456-64.005-37.369z"
                />
              </svg>
              <span className="font-medium text-xs ml-1.5">Dropbox</span>
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => handleOAuthSignIn("onedrive")}
              className="w-full h-12 relative group overflow-hidden border hover:border-sky-500 hover:shadow-md hover:shadow-sky-500/20 hover:scale-[1.02] transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-sky-500/0 via-sky-500/10 to-sky-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <svg
                className="h-5 w-5 group-hover:scale-110 transition-transform"
                viewBox="0 0 256 154"
                fill="none"
                role="img"
                aria-label="OneDrive"
              >
                <path
                  fill="#0364B8"
                  d="M154.66 110.682L103.573 71.09a54.83 54.83 0 0 1 25.644-6.395c.945 0 1.882.027 2.812.077A54.836 54.836 0 0 1 181.4 109.43l.067.393-26.806.86z"
                />
                <path
                  fill="#0078D4"
                  d="M104.598 47.468A45.08 45.08 0 0 1 130.71 39.5c16.573 0 31.315 8.974 39.198 22.383a55.243 55.243 0 0 1 11.722-1.255c.944 0 1.881.027 2.811.077l-79.843 49.977V47.468z"
                />
                <path
                  fill="#1490DF"
                  d="M104.598 110.682v-63.214A45.025 45.025 0 0 0 85.64 114.16l.001.003a44.947 44.947 0 0 0 3.8 4.04l48.03-7.521h-32.873z"
                />
                <path
                  fill="#28A8EA"
                  d="M181.467 109.823a54.79 54.79 0 0 0-49.438-45.05 45.1 45.1 0 0 0-27.431-17.305v63.214h70.135l6.734-1.259z"
                />
                <path
                  fill="#0078D4"
                  d="M215.908 82.345c-1.013-.072-2.033-.109-3.06-.109a40.092 40.092 0 0 0-31.381 15.082l-.067-.393a54.87 54.87 0 0 0-49.371-32.152c-.93-.05-1.867-.077-2.812-.077a54.83 54.83 0 0 0-25.644 6.395l51.087 39.591h-50.062l-15.157 2.377a44.91 44.91 0 0 0 .001.003 44.947 44.947 0 0 0 3.8 4.04c.003.003.006.004.009.007a45.019 45.019 0 0 0 30.249 11.611h87.958C231.037 128.72 256 103.757 256 83.235a40.09 40.09 0 0 0-40.092-.89z"
                />
                <path
                  fill="#14447D"
                  d="M85.64 114.16l.001.003a44.947 44.947 0 0 0 3.8 4.04c.003.003.006.004.009.007a45.019 45.019 0 0 0 30.249 11.611H45.015C20.154 129.82 0 109.665 0 84.804c0-20.65 13.92-38.534 33.85-43.87a64.727 64.727 0 0 0-1.048 11.544A64.962 64.962 0 0 0 85.64 114.16z"
                />
              </svg>
              <span className="font-medium text-xs ml-1.5">OneDrive</span>
            </Button>
          </div>

          {/* Row 2: Additional providers */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => handleOAuthSignIn("box")}
              className="w-full h-12 relative group overflow-hidden border hover:border-blue-500 hover:shadow-md hover:shadow-blue-500/20 hover:scale-[1.02] transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <svg
                className="h-5 w-5 group-hover:scale-110 transition-transform"
                viewBox="0 0 256 256"
                fill="none"
                role="img"
                aria-label="Box"
              >
                <path
                  fill="#0061D5"
                  d="M53.5 187.3L0 153.6V68.3l53.5 33.7v85.3zm149-119L128 28.6 53.5 68.3v33.7L128 62.3l74.5 39.7V68.3zm0 85.3V102L128 141.7 53.5 102v51.6L128 193.3l74.5-39.7zM256 153.6l-53.5 33.7V102L256 68.3v85.3z"
                />
              </svg>
              <span className="font-medium text-xs ml-1.5">Box</span>
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => handleOAuthSignIn("pcloud")}
              className="w-full h-12 relative group overflow-hidden border hover:border-cyan-500 hover:shadow-md hover:shadow-cyan-500/20 hover:scale-[1.02] transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <svg
                className="h-5 w-5 group-hover:scale-110 transition-transform"
                viewBox="0 0 256 256"
                fill="none"
                role="img"
                aria-label="pCloud"
              >
                <path
                  fill="#20BEC6"
                  d="M128 24C70.6 24 24 70.6 24 128c0 57.4 46.6 104 104 104s104-46.6 104-104C232 70.6 185.4 24 128 24zm40 144h-80c-22.1 0-40-17.9-40-40s17.9-40 40-40c4.4 0 8.6.7 12.6 2C107.3 73 120.6 64 136 64c22.1 0 40 17.9 40 40 0 1.4-.1 2.7-.2 4 14.1 5.7 24.2 19.4 24.2 35.5 0 21.3-17.2 38.5-38.5 38.5H168z"
                />
              </svg>
              <span className="font-medium text-xs ml-1.5">pCloud</span>
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => handleOAuthSignIn("mega")}
              className="w-full h-12 relative group overflow-hidden border hover:border-red-500 hover:shadow-md hover:shadow-red-500/20 hover:scale-[1.02] transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <svg
                className="h-5 w-5 group-hover:scale-110 transition-transform"
                viewBox="0 0 256 256"
                fill="none"
                role="img"
                aria-label="MEGA"
              >
                <path
                  fill="#D9272E"
                  d="M128 28L28 128l100 100 100-100L128 28zm0 40l60 60-60 60-60-60 60-60z"
                />
              </svg>
              <span className="font-medium text-xs ml-1.5">MEGA</span>
            </Button>
          </div>

          <div className="relative mt-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-dashed opacity-30" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background text-muted-foreground/50 px-3 text-[10px] uppercase tracking-wider">
                Or
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            type="button"
            onClick={handleTryDemo}
            disabled={isLoadingDemo}
            className="w-full h-12 relative group overflow-hidden border-2 border-dashed hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02] transition-all duration-300 bg-gradient-to-br from-background to-blue-50/30 dark:to-blue-950/10"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <span className="text-2xl mr-2">🎭</span>
            <span className="font-semibold text-base">
              {isLoadingDemo ? "Loading Demo..." : "Try Demo Mode"}
            </span>
          </Button>

          <div className="relative mt-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-dashed opacity-30" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background text-muted-foreground/50 px-3 text-[10px] uppercase tracking-wider">
                No Cloud Storage?
              </span>
            </div>
          </div>

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={handleContinueAsGuest}
              className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors cursor-pointer inline-flex items-center gap-1"
            >
              <span className="opacity-50">→</span>
              <span>Continue with local storage only</span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
