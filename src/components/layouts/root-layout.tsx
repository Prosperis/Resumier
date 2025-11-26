import { Link } from "@tanstack/react-router";
import { FileText, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportMenu } from "@/components/features/resume/export/export-menu";
import { TemplateSelector } from "@/components/features/resume/preview/template-selector";
import { useAuthStore, selectIsDemo } from "@/stores/auth-store";
import { useResumeStore } from "@/stores/resume-store";
import { useUIStore, selectCurrentResume } from "@/stores/ui-store";

type RootLayoutProps = {
  children: React.ReactNode;
};

/**
 * Root layout component
 * Provides the main application structure with header and content area
 */
export function RootLayout({ children }: RootLayoutProps) {
  const isDemo = useAuthStore(selectIsDemo);
  const currentResume = useUIStore(selectCurrentResume);
  const template = useResumeStore((state) => state.template);
  const setTemplate = useResumeStore((state) => state.setTemplate);

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      {/* Skip link for keyboard navigation - visible on focus */}
      <a
        href="#main-content"
        className="focus:bg-primary focus:text-primary-foreground focus:ring-ring sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:px-4 focus:py-2 focus:font-medium focus:ring-2 focus:ring-offset-2 focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Header - Compact Professional Design */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur-sm supports-[backdrop-filter]:bg-card/80">
        <div className="flex h-12 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 transition-opacity hover:opacity-80"
              aria-label="Resumier home"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
                <FileText className="size-4 text-primary-foreground" aria-hidden="true" />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                Resumier
              </span>
            </Link>

            {/* Dynamic resume context indicator */}
            {currentResume && (
              <span className="text-sm text-muted-foreground">
                / {currentResume.title || "Untitled Resume"}
              </span>
            )}
          </div>

          <nav className="flex items-center gap-2" aria-label="Main navigation">
            {/* Resume-specific actions - only show when editing a resume */}
            {currentResume && (
              <>
                <TemplateSelector selected={template} onSelect={setTemplate} />
                <ExportMenu resume={currentResume} />
              </>
            )}

            <Button
              variant="ghost"
              size="icon"
              asChild
              aria-label="Settings"
              className="h-8 w-8"
            >
              <Link to="/settings">
                <Settings className="size-4" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Demo Mode Banner */}
      {isDemo && (
        <div className="border-b border-blue-200 bg-blue-50 px-4 py-1.5">
          <div className="container mx-auto flex items-center justify-center gap-2 text-xs font-medium text-blue-700">
            <span>🎭 Demo Mode</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Exploring with sample data</span>
          </div>
        </div>
      )}

      {/* Main content */}
      <main
        id="main-content"
        tabIndex={-1}
        className="relative flex-1 focus:outline-none"
      >
        {children}
      </main>
    </div>
  );
}
