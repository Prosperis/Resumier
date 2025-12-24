import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Cloud, Download, FileText, Sparkles } from "lucide-react";
import { useState } from "react";
import { AuthModal } from "@/components/features/auth/auth-modal";
import { Button } from "@/components/ui/button";

/**
 * Index (home) route
 * Main landing page for the application
 */
export const Route = createFileRoute("/")({
  component: IndexComponent,
});

function IndexComponent() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="h-full overflow-y-auto">
      <div className="container mx-auto min-h-[calc(100vh-4rem)] px-8 py-16">
      <div className="mx-auto max-w-5xl space-y-24">
        {/* Hero Section - Clean & Professional */}
        <div className="space-y-10 text-center">
          {/* Main heading */}
          <div className="space-y-6">
            <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-7xl">
              Build Your Perfect <span className="text-primary">Resume</span>
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground leading-relaxed">
              Professional resume builder with AI-powered features. Create, customize, and download
              in minutes.
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              onClick={() => setShowAuthModal(true)}
              className="h-12 px-8 text-base font-medium"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Stats bar */}
          <div className="mx-auto mt-16 flex max-w-3xl items-center justify-center gap-12 divide-x divide-border rounded-xl border border-border bg-card p-8 shadow-sm">
            <div className="flex-1 px-4 text-center first:pl-0 last:pr-0 last:border-r-0">
              <div className="text-3xl font-bold text-foreground">10K+</div>
              <div className="mt-1 text-sm font-medium text-muted-foreground">Resumes Created</div>
            </div>
            <div className="flex-1 px-4 text-center">
              <div className="text-3xl font-bold text-foreground">50+</div>
              <div className="mt-1 text-sm font-medium text-muted-foreground">Templates</div>
            </div>
            <div className="flex-1 px-4 text-center">
              <div className="text-3xl font-bold text-foreground">4.9★</div>
              <div className="mt-1 text-sm font-medium text-muted-foreground">User Rating</div>
            </div>
          </div>
        </div>

        <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />

        {/* Features Grid - Clean Card Design */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Feature Card 1 */}
          <div className="group rounded-xl border border-border bg-card p-8 transition-all hover:border-primary/20 hover:shadow-md">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="h-6 w-6" />
            </div>
            <h2 className="mb-3 text-xl font-bold text-foreground">Professional Templates</h2>
            <p className="text-muted-foreground leading-relaxed">
              Choose from a variety of ATS-friendly templates tailored to different industries and
              experience levels.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="group rounded-xl border border-border bg-card p-8 transition-all hover:border-primary/20 hover:shadow-md">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="mb-3 text-xl font-bold text-foreground">Real-time Preview</h2>
            <p className="text-muted-foreground leading-relaxed">
              Watch your resume transform instantly as you type. What you see is exactly what you'll
              get.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="group rounded-xl border border-border bg-card p-8 transition-all hover:border-primary/20 hover:shadow-md">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Download className="h-6 w-6" />
            </div>
            <h2 className="mb-3 text-xl font-bold text-foreground">Easy Export</h2>
            <p className="text-muted-foreground leading-relaxed">
              Download as high-quality PDF, share online, or print. Your resume is ready for any
              opportunity.
            </p>
          </div>

          {/* Feature Card 4 */}
          <div className="group rounded-xl border border-border bg-card p-8 transition-all hover:border-primary/20 hover:shadow-md">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Cloud className="h-6 w-6" />
            </div>
            <h2 className="mb-3 text-xl font-bold text-foreground">Cloud Sync</h2>
            <p className="text-muted-foreground leading-relaxed">
              Automatic cloud backup keeps your resumes safe and accessible from any device.
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
