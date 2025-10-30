import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Cloud,
  Download,
  FileText,
  Sparkles,
  Zap,
} from "lucide-react";
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
    <div className="container mx-auto p-8">
      <div className="mx-auto max-w-4xl space-y-12">
        {/* Hero Section */}
        <div className="space-y-6 text-center">
          <h1 className="from-foreground via-foreground to-primary bg-gradient-to-r bg-clip-text text-6xl font-bold tracking-tight text-transparent">
            Build Your Perfect Resume
          </h1>
          <p className="text-muted-foreground mx-auto max-w-xl text-xl leading-relaxed">
            Professional resume builder. Create, customize, and download in
            minutes.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button
              size="lg"
              onClick={() => setShowAuthModal(true)}
              className="group from-primary via-primary hover:shadow-primary/25 relative overflow-hidden bg-gradient-to-r to-purple-600 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <span className="to-primary absolute inset-0 bg-gradient-to-r from-purple-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="relative flex items-center gap-2">
                <Zap className="h-4 w-4 transition-transform group-hover:rotate-12" />
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>
          </div>
        </div>

        <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />

        {/* Features Grid */}
        <div className="grid gap-6 pt-8 md:grid-cols-2 lg:grid-cols-2">
          <div className="group from-primary/5 via-background/50 to-background/50 border-primary/20 hover:border-primary/40 hover:shadow-primary/10 relative space-y-3 overflow-hidden rounded-lg border bg-gradient-to-br p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="from-primary/10 absolute inset-0 bg-gradient-to-br via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="from-primary/20 to-primary/5 border-primary/10 relative flex h-12 w-12 items-center justify-center rounded-lg border bg-gradient-to-br backdrop-blur-sm">
              <FileText className="text-primary h-6 w-6" />
            </div>
            <h2 className="relative text-2xl font-semibold">
              Multiple Templates
            </h2>
            <p className="text-muted-foreground relative">
              Choose from a variety of professional templates tailored to
              different industries and experience levels.
            </p>
          </div>

          <div className="group via-background/50 to-background/50 relative space-y-3 overflow-hidden rounded-lg border border-purple-500/20 bg-gradient-to-br from-purple-500/5 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative flex h-12 w-12 items-center justify-center rounded-lg border border-purple-500/10 bg-gradient-to-br from-purple-500/20 to-purple-500/5 backdrop-blur-sm">
              <Sparkles className="h-6 w-6 text-purple-500" />
            </div>
            <h2 className="relative text-2xl font-semibold">
              Real-time Preview
            </h2>
            <p className="text-muted-foreground relative">
              See your resume come to life as you type. What you see is exactly
              what you'll get.
            </p>
          </div>

          <div className="group via-background/50 to-background/50 relative space-y-3 overflow-hidden rounded-lg border border-blue-500/20 bg-gradient-to-br from-blue-500/5 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative flex h-12 w-12 items-center justify-center rounded-lg border border-blue-500/10 bg-gradient-to-br from-blue-500/20 to-blue-500/5 backdrop-blur-sm">
              <Download className="h-6 w-6 text-blue-500" />
            </div>
            <h2 className="relative text-2xl font-semibold">Export to PDF</h2>
            <p className="text-muted-foreground relative">
              Download your resume as a high-quality PDF, ready to send to
              employers or print.
            </p>
          </div>

          <div className="group via-background/50 to-background/50 relative space-y-3 overflow-hidden rounded-lg border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative flex h-12 w-12 items-center justify-center rounded-lg border border-emerald-500/10 bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 backdrop-blur-sm">
              <Cloud className="h-6 w-6 text-emerald-500" />
            </div>
            <h2 className="relative text-2xl font-semibold">Cloud Storage</h2>
            <p className="text-muted-foreground relative">
              Save your resumes securely in the cloud. Access them from
              anywhere, anytime.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-muted/50 space-y-4 rounded-lg border p-8 text-center">
          <h3 className="text-2xl font-semibold">
            Ready to create your resume?
          </h3>
          <p className="text-muted-foreground mx-auto max-w-2xl">
            Join thousands of job seekers who have built their perfect resume
            with Resumier. Start for free today!
          </p>
          <Link to="/resume/new">
            <Button size="lg" className="mt-4">
              Create Your Resume
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
