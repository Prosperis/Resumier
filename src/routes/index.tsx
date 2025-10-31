import { createFileRoute } from "@tanstack/react-router";
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
      <div className="mx-auto max-w-6xl space-y-20">
        {/* Hero Section - Revolutionary Design */}
        <div className="relative space-y-8 text-center">
          {/* Animated accent orbs */}
          <div className="absolute -top-20 left-1/4 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl animate-pulse" />
          <div
            className="absolute -top-10 right-1/4 h-48 w-48 rounded-full bg-blue-500/20 blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />

          {/* Main heading with dramatic gradient */}
          <div className="relative">
            <h1 className="relative inline-block">
              <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-7xl font-black tracking-tighter text-transparent drop-shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-1000">
                Build Your Perfect
              </span>
              <br />
              <span
                className="bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-600 bg-clip-text text-7xl font-black tracking-tighter text-transparent drop-shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-1000"
                style={{ animationDelay: "200ms" }}
              >
                Resume
              </span>
              {/* Decorative elements */}
              <div className="absolute -right-8 top-0 h-3 w-3 rounded-full bg-purple-500 animate-ping" />
              <div
                className="absolute -left-8 bottom-4 h-2 w-2 rounded-full bg-pink-500 animate-ping"
                style={{ animationDelay: "500ms" }}
              />
            </h1>
          </div>

          <p
            className="text-muted-foreground mx-auto max-w-2xl text-2xl font-light leading-relaxed tracking-wide animate-in fade-in slide-in-from-bottom-4 duration-1000"
            style={{ animationDelay: "400ms" }}
          >
            Professional resume builder with{" "}
            <span className="font-semibold text-purple-600">AI-powered</span>{" "}
            features. Create, customize, and download in{" "}
            <span className="font-semibold text-fuchsia-600">minutes</span>.
          </p>

          <div
            className="mt-12 flex justify-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000"
            style={{ animationDelay: "600ms" }}
          >
            <Button
              size="lg"
              onClick={() => setShowAuthModal(true)}
              className="group relative h-14 overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 px-8 text-lg font-semibold shadow-2xl shadow-purple-500/50 transition-all duration-500 hover:scale-110 hover:shadow-purple-500/80"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-600 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <span className="relative flex items-center gap-3">
                <Zap className="h-5 w-5 transition-transform group-hover:rotate-12 group-hover:scale-125" />
                Get Started Free
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
              </span>
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
            </Button>
          </div>

          {/* Stats bar */}
          <div
            className="mx-auto mt-16 flex max-w-3xl items-center justify-around rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-500/5 via-fuchsia-500/5 to-pink-500/5 p-6 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-1000"
            style={{ animationDelay: "800ms" }}
          >
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                10K+
              </div>
              <div className="text-sm text-muted-foreground">
                Resumes Created
              </div>
            </div>
            <div className="h-12 w-px bg-gradient-to-b from-transparent via-purple-500/50 to-transparent" />
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
                50+
              </div>
              <div className="text-sm text-muted-foreground">Templates</div>
            </div>
            <div className="h-12 w-px bg-gradient-to-b from-transparent via-purple-500/50 to-transparent" />
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                4.9★
              </div>
              <div className="text-sm text-muted-foreground">User Rating</div>
            </div>
          </div>
        </div>

        <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />

        {/* Features Grid - Innovative Card Design */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Feature Card 1 - Violet Theme */}
          <div
            className="group relative overflow-hidden rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-transparent p-8 backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:border-violet-500/50 hover:shadow-2xl hover:shadow-violet-500/20 animate-in fade-in slide-in-from-bottom-4 duration-1000"
            style={{ animationDelay: "1000ms" }}
          >
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/0 via-purple-600/10 to-fuchsia-600/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            {/* Floating icon with glow */}
            <div className="relative mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 shadow-lg shadow-violet-500/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-violet-500/80">
              <FileText className="h-8 w-8 text-white" />
              <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>

            <h2 className="relative mb-3 text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              50+ Templates
            </h2>
            <p className="text-muted-foreground relative text-lg leading-relaxed">
              Choose from a stunning variety of{" "}
              <span className="font-semibold text-violet-600">
                professional templates
              </span>{" "}
              tailored to different industries and experience levels.
            </p>

            {/* Corner accent */}
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-violet-500/10 blur-2xl transition-all duration-500 group-hover:bg-violet-500/20" />
          </div>

          {/* Feature Card 2 - Fuchsia Theme */}
          <div
            className="group relative overflow-hidden rounded-3xl border border-fuchsia-500/30 bg-gradient-to-br from-fuchsia-500/10 via-pink-500/5 to-transparent p-8 backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:border-fuchsia-500/50 hover:shadow-2xl hover:shadow-fuchsia-500/20 animate-in fade-in slide-in-from-bottom-4 duration-1000"
            style={{ animationDelay: "1200ms" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600/0 via-pink-600/10 to-rose-600/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-600 to-pink-600 shadow-lg shadow-fuchsia-500/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-fuchsia-500/80">
              <Sparkles className="h-8 w-8 text-white" />
              <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>

            <h2 className="relative mb-3 text-3xl font-bold bg-gradient-to-r from-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
              Real-time Magic
            </h2>
            <p className="text-muted-foreground relative text-lg leading-relaxed">
              Watch your resume{" "}
              <span className="font-semibold text-fuchsia-600">
                transform instantly
              </span>{" "}
              as you type. What you see is exactly what you'll get - no
              surprises.
            </p>

            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-fuchsia-500/10 blur-2xl transition-all duration-500 group-hover:bg-fuchsia-500/20" />
          </div>

          {/* Feature Card 3 - Blue Theme */}
          <div
            className="group relative overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent p-8 backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20 animate-in fade-in slide-in-from-bottom-4 duration-1000"
            style={{ animationDelay: "1400ms" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 via-cyan-600/10 to-sky-600/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-blue-500/80">
              <Download className="h-8 w-8 text-white" />
              <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>

            <h2 className="relative mb-3 text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Export Anywhere
            </h2>
            <p className="text-muted-foreground relative text-lg leading-relaxed">
              Download as{" "}
              <span className="font-semibold text-blue-600">
                high-quality PDF
              </span>
              , share online, or print. Your resume, your way, ready for any
              opportunity.
            </p>

            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl transition-all duration-500 group-hover:bg-blue-500/20" />
          </div>

          {/* Feature Card 4 - Emerald Theme */}
          <div
            className="group relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent p-8 backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/20 animate-in fade-in slide-in-from-bottom-4 duration-1000"
            style={{ animationDelay: "1600ms" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/0 via-teal-600/10 to-green-600/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 shadow-lg shadow-emerald-500/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-emerald-500/80">
              <Cloud className="h-8 w-8 text-white" />
              <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>

            <h2 className="relative mb-3 text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Cloud Sync
            </h2>
            <p className="text-muted-foreground relative text-lg leading-relaxed">
              <span className="font-semibold text-emerald-600">
                Automatic cloud backup
              </span>{" "}
              keeps your resumes safe and accessible from any device, anywhere
              in the world.
            </p>

            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl transition-all duration-500 group-hover:bg-emerald-500/20" />
          </div>
        </div>
      </div>
    </div>
  );
}
