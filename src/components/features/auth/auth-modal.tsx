import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/stores/auth-store";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const navigate = useNavigate();
  const loginAsGuest = useAuthStore((state) => state.loginAsGuest);

  const handleOAuthSignIn = (provider: string) => {
    console.log(`Sign in with ${provider}`);
    // TODO: Implement OAuth sign in
  };

  const handleContinueAsGuest = () => {
    // Enable guest mode - this will allow IndexedDB access
    loginAsGuest();
    onOpenChange(false);
    navigate({ to: "/resume/new" });
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
            <span className="text-foreground/70 font-normal">
              continue as a guest
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              type="button"
              onClick={() => handleOAuthSignIn("google")}
              className="w-full h-14 relative group overflow-hidden border-2 hover:border-blue-500 hover:shadow-lg hover:shadow-[#4285F4]/20 hover:scale-[1.02] transition-all duration-300 bg-gradient-to-br from-background to-blue-50/30 dark:to-blue-950/10"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#4285F4]/0 via-[#34A853]/10 via-[#FBBC05]/10 via-[#EA4335]/10 to-[#4285F4]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <svg
                className="mr-2 h-6 w-6 group-hover:scale-110 transition-transform"
                viewBox="0 0 256 262"
                role="img"
                aria-label="Google"
              >
                <path
                  fill="#4285F4"
                  d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                />
                <path
                  fill="#34A853"
                  d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                />
                <path
                  fill="#FBBC05"
                  d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                />
                <path
                  fill="#EB4335"
                  d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                />
              </svg>
              <span className="font-semibold text-base">Google</span>
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => handleOAuthSignIn("dropbox")}
              className="w-full h-14 relative group overflow-hidden border-2 hover:border-blue-600 hover:shadow-lg hover:shadow-blue-600/30 hover:scale-[1.02] transition-all duration-300 bg-gradient-to-br from-background to-blue-50/30 dark:to-blue-950/10"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/10 to-blue-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <svg
                className="mr-2 h-6 w-6 group-hover:scale-110 transition-transform"
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
              <span className="font-semibold text-base">Dropbox</span>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              type="button"
              onClick={() => handleOAuthSignIn("github")}
              className="w-full h-14 relative group overflow-hidden border-2 hover:border-gray-700 dark:hover:border-gray-300 hover:shadow-lg hover:shadow-gray-700/30 dark:hover:shadow-gray-300/20 hover:scale-[1.02] transition-all duration-300 bg-gradient-to-br from-background to-gray-50/50 dark:to-gray-900/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-700/0 via-gray-700/10 to-gray-700/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <svg
                className="mr-2 h-6 w-6 text-gray-800 dark:text-gray-200 group-hover:scale-110 group-hover:rotate-[360deg] transition-all duration-500"
                viewBox="0 0 256 250"
                fill="currentColor"
                role="img"
                aria-label="GitHub"
              >
                <path d="M128.001 0C57.317 0 0 57.307 0 128.001c0 56.554 36.676 104.535 87.535 121.46 6.397 1.185 8.746-2.777 8.746-6.158 0-3.052-.12-13.135-.174-23.83-35.61 7.742-43.124-15.103-43.124-15.103-5.823-14.795-14.213-18.73-14.213-18.73-11.613-7.944.876-7.78.876-7.78 12.853.902 19.621 13.19 19.621 13.19 11.417 19.568 29.945 13.911 37.249 10.64 1.149-8.272 4.466-13.92 8.127-17.116-28.431-3.236-58.318-14.212-58.318-63.258 0-13.975 5-25.394 13.188-34.358-1.329-3.224-5.71-16.242 1.24-33.874 0 0 10.749-3.44 35.21 13.121 10.21-2.836 21.16-4.258 32.038-4.307 10.878.049 21.837 1.47 32.066 4.307 24.431-16.56 35.165-13.12 35.165-13.12 6.967 17.63 2.584 30.65 1.255 33.873 8.207 8.964 13.173 20.383 13.173 34.358 0 49.163-29.944 59.988-58.447 63.157 4.591 3.972 8.682 11.762 8.682 23.704 0 17.126-.148 30.91-.148 35.126 0 3.407 2.304 7.398 8.792 6.14C219.37 232.5 256 184.537 256 128.002 256 57.307 198.691 0 128.001 0zm-80.06 182.34c-.282.636-1.283.827-2.194.39-.929-.417-1.45-1.284-1.15-1.922.276-.655 1.279-.838 2.205-.399.93.418 1.46 1.293 1.139 1.931zm6.296 5.618c-.61.566-1.804.303-2.614-.591-.837-.892-.994-2.086-.375-2.66.63-.566 1.787-.301 2.626.591.838.903 1 2.088.363 2.66zm4.32 7.188c-.785.545-2.067.034-2.86-1.104-.784-1.138-.784-2.503.017-3.05.795-.547 2.058-.055 2.861 1.075.782 1.157.782 2.522-.019 3.08zm7.304 8.325c-.701.774-2.196.566-3.29-.49-1.119-1.032-1.43-2.496-.726-3.27.71-.776 2.213-.558 3.315.49 1.11 1.03 1.45 2.505.701 3.27zm9.442 2.81c-.31 1.003-1.75 1.459-3.199 1.033-1.448-.439-2.395-1.613-2.103-2.626.301-1.01 1.747-1.484 3.207-1.028 1.446.436 2.396 1.602 2.095 2.622zm10.744 1.193c.036 1.055-1.193 1.93-2.715 1.95-1.53.034-2.769-.82-2.786-1.86 0-1.065 1.202-1.932 2.733-1.958 1.522-.03 2.768.818 2.768 1.868zm10.555-.405c.182 1.03-.875 2.088-2.387 2.37-1.485.271-2.861-.365-3.05-1.386-.184-1.056.893-2.114 2.376-2.387 1.514-.263 2.868.356 3.061 1.403z" />
              </svg>
              <span className="font-semibold text-base">GitHub</span>
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => handleOAuthSignIn("gitlab")}
              className="w-full h-14 relative group overflow-hidden border-2 hover:border-orange-600 hover:shadow-lg hover:shadow-orange-600/30 hover:scale-[1.02] transition-all duration-300 bg-gradient-to-br from-background to-orange-50/30 dark:to-orange-950/10"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600/0 via-orange-600/10 to-orange-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <svg
                className="mr-2 h-6 w-6 group-hover:scale-110 transition-transform"
                viewBox="0 0 256 236"
                fill="none"
                role="img"
                aria-label="GitLab"
              >
                <path
                  fill="#E24329"
                  d="M128.075 236.075l47.104-144.97H80.97l47.104 144.97z"
                />
                <path
                  fill="#FC6D26"
                  d="M128.075 236.074L80.97 91.104H14.956l113.119 144.97z"
                />
                <path
                  fill="#FCA326"
                  d="M14.956 91.104L.642 135.16a9.752 9.752 0 0 0 3.542 10.903l123.891 90.012-113.12-144.97z"
                />
                <path
                  fill="#E24329"
                  d="M14.956 91.105H80.97L52.601 3.79c-1.46-4.493-7.816-4.492-9.275 0l-28.37 87.315z"
                />
                <path
                  fill="#FC6D26"
                  d="M128.075 236.074l47.104-144.97h66.015l-113.12 144.97z"
                />
                <path
                  fill="#FCA326"
                  d="M241.194 91.104l14.314 44.056a9.752 9.752 0 0 1-3.543 10.903l-123.89 90.012 113.119-144.97z"
                />
                <path
                  fill="#E24329"
                  d="M241.194 91.105h-66.015l28.37-87.315c1.46-4.493 7.816-4.492 9.275 0l28.37 87.315z"
                />
              </svg>
              <span className="font-semibold text-base">GitLab</span>
            </Button>
          </div>

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
