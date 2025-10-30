import { Github, Mail } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleOAuthSignIn = async (provider: string) => {
    setIsLoading(true);
    try {
      // TODO: Implement Better Auth OAuth sign in
      console.log(`Sign in with ${provider}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`${provider} sign in error:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      // TODO: Implement Better Auth email sign in
      console.log("Email sign in:", { email, password });
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Email sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      // TODO: Implement Better Auth email sign up
      console.log("Email sign up:", { name, email, password });
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Email sign up error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Welcome to Resumier
          </DialogTitle>
          <DialogDescription className="text-center">
            Sign in or create an account to get started with your professional
            resume
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4">
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background text-muted-foreground px-2">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                type="button"
                disabled={isLoading}
                onClick={() => handleOAuthSignIn("github")}
                className="w-full"
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
              <Button
                variant="outline"
                type="button"
                disabled={isLoading}
                onClick={() => handleOAuthSignIn("gmail")}
                className="w-full"
              >
                <Mail className="mr-2 h-4 w-4" />
                Gmail
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                type="button"
                disabled={isLoading}
                onClick={() => handleOAuthSignIn("gitlab")}
                className="w-full"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  role="img"
                  aria-label="GitLab"
                >
                  <path d="M23.6004 9.5927L23.5429 9.4345L20.0025 0.5693C19.9402 0.4011 19.8275 0.2561 19.6798 0.1537C19.5321 0.0514 19.3565 -0.0022 19.1767 0.0001C18.997 0.0024 18.8228 0.0604 18.6776 0.166C18.5325 0.2716 18.4233 0.419 18.3649 0.5876L15.9832 7.2822H8.0168L5.635 0.5876C5.5766 0.419 5.4674 0.2716 5.3223 0.166C5.1772 0.0604 5.003 0.0024 4.8232 0.0001C4.6435 -0.0022 4.4679 0.0514 4.3202 0.1537C4.1725 0.2561 4.0598 0.4011 3.9975 0.5693L0.457509 9.4345L0.399509 9.5927C0.0547093 10.5254 -0.0603907 11.5438 0.124509 12.5292C0.309409 13.5147 0.793509 14.4234 1.5107 15.1383L1.5223 15.1495L1.5552 15.1784L7.0896 19.7849L9.8516 21.9668L11.5132 23.3066C11.6568 23.4259 11.8275 23.4946 12.0044 23.5046C12.1813 23.5145 12.3576 23.4654 12.5092 23.363L15.2716 21.9668L18.0336 19.7849L23.5972 15.1555L23.6076 15.1471C24.3217 14.4321 24.8029 13.5244 24.9859 12.5407C25.169 11.557 25.0531 10.5404 24.7072 9.609L23.6004 9.5927Z" />
                </svg>
                GitLab
              </Button>
              <Button
                variant="outline"
                type="button"
                disabled={isLoading}
                onClick={() => handleOAuthSignIn("dropbox")}
                className="w-full"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  role="img"
                  aria-label="Dropbox"
                >
                  <path d="M6 1.807L0 5.629l6 3.822 6.001-3.822L6 1.807zM18 1.807l-6 3.822 6 3.822 6-3.822-6-3.822zM0 13.274l6 3.822 6.001-3.822L6 9.452l-6 3.822zM18 9.452l-6 3.822 6 3.822 6-3.822-6-3.822zM6 18.371l6.001 3.822 6-3.822-6-3.822L6 18.371z" />
                </svg>
                Dropbox
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <Input
                  id="signup-name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  minLength={8}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background text-muted-foreground px-2">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                type="button"
                disabled={isLoading}
                onClick={() => handleOAuthSignIn("github")}
                className="w-full"
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
              <Button
                variant="outline"
                type="button"
                disabled={isLoading}
                onClick={() => handleOAuthSignIn("gmail")}
                className="w-full"
              >
                <Mail className="mr-2 h-4 w-4" />
                Gmail
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                type="button"
                disabled={isLoading}
                onClick={() => handleOAuthSignIn("gitlab")}
                className="w-full"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  role="img"
                  aria-label="GitLab"
                >
                  <path d="M23.6004 9.5927L23.5429 9.4345L20.0025 0.5693C19.9402 0.4011 19.8275 0.2561 19.6798 0.1537C19.5321 0.0514 19.3565 -0.0022 19.1767 0.0001C18.997 0.0024 18.8228 0.0604 18.6776 0.166C18.5325 0.2716 18.4233 0.419 18.3649 0.5876L15.9832 7.2822H8.0168L5.635 0.5876C5.5766 0.419 5.4674 0.2716 5.3223 0.166C5.1772 0.0604 5.003 0.0024 4.8232 0.0001C4.6435 -0.0022 4.4679 0.0514 4.3202 0.1537C4.1725 0.2561 4.0598 0.4011 3.9975 0.5693L0.457509 9.4345L0.399509 9.5927C0.0547093 10.5254 -0.0603907 11.5438 0.124509 12.5292C0.309409 13.5147 0.793509 14.4234 1.5107 15.1383L1.5223 15.1495L1.5552 15.1784L7.0896 19.7849L9.8516 21.9668L11.5132 23.3066C11.6568 23.4259 11.8275 23.4946 12.0044 23.5046C12.1813 23.5145 12.3576 23.4654 12.5092 23.363L15.2716 21.9668L18.0336 19.7849L23.5972 15.1555L23.6076 15.1471C24.3217 14.4321 24.8029 13.5244 24.9859 12.5407C25.169 11.557 25.0531 10.5404 24.7072 9.609L23.6004 9.5927Z" />
                </svg>
                GitLab
              </Button>
              <Button
                variant="outline"
                type="button"
                disabled={isLoading}
                onClick={() => handleOAuthSignIn("dropbox")}
                className="w-full"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  role="img"
                  aria-label="Dropbox"
                >
                  <path d="M6 1.807L0 5.629l6 3.822 6.001-3.822L6 1.807zM18 1.807l-6 3.822 6 3.822 6-3.822-6-3.822zM0 13.274l6 3.822 6.001-3.822L6 9.452l-6 3.822zM18 9.452l-6 3.822 6 3.822 6-3.822-6-3.822zM6 18.371l6.001 3.822 6-3.822-6-3.822L6 18.371z" />
                </svg>
                Dropbox
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
