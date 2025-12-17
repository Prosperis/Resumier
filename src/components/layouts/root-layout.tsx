import { Link } from "@tanstack/react-router";
import { ArrowLeft, FileText, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ExportMenu } from "@/components/features/resume/export/export-menu";
import { StyleCustomizer } from "@/components/features/resume/preview/style-customizer";
import { TemplateSelector } from "@/components/features/resume/preview/template-selector";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { selectIsDemo, useAuthStore } from "@/stores/auth-store";
import { useResumeStore } from "@/stores/resume-store";
import { selectCurrentResume, useUIStore } from "@/stores/ui-store";

type RootLayoutProps = {
  children: React.ReactNode;
};

/**
 * Root layout component
 * Provides the main application structure with header and content area
 */
export function RootLayout({ children }: RootLayoutProps) {
  const { t } = useTranslation("common");
  const isDemo = useAuthStore(selectIsDemo);
  const currentResume = useUIStore(selectCurrentResume);
  const template = useResumeStore((state) => state.template);
  const setTemplate = useResumeStore((state) => state.setTemplate);

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-background">
      {/* Skip link for keyboard navigation - visible on focus */}
      <a
        href="#main-content"
        className="focus:bg-primary focus:text-primary-foreground focus:ring-ring sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:px-4 focus:py-2 focus:font-medium focus:ring-2 focus:ring-offset-2 focus:outline-none"
      >
        {t("accessibility.skipToContent", "Skip to main content")}
      </a>

      {/* Header - Compact Professional Design */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur-sm supports-[backdrop-filter]:bg-card/80">
        {/* Demo Mode Banner - inside header so it's part of sticky area */}
        {isDemo && (
          <div className="border-b border-blue-200 bg-blue-50 px-4 py-1">
            <div className="flex items-center justify-center gap-2 text-[10px] font-medium text-blue-700">
              <span>🎭 {t("demo.modeLabel", "Demo Mode")}</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">
                {t("demo.exploringSample", "Exploring with sample data")}
              </span>
            </div>
          </div>
        )}
        <div className="flex h-12 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            {/* Back button when editing a resume */}
            {currentResume && (
              <Button
                variant="ghost"
                size="icon"
                asChild
                aria-label={t("actions.back")}
                className="h-8 w-8"
              >
                <Link to="/dashboard">
                  <ArrowLeft className="size-4" />
                </Link>
              </Button>
            )}

            <Link
              to="/"
              className="flex items-center gap-2 transition-opacity hover:opacity-80"
              aria-label={t("appName")}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
                <FileText className="size-4 text-primary-foreground" aria-hidden="true" />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                {t("appName")}
              </span>
            </Link>

            {/* Dynamic resume context indicator */}
            {currentResume && (
              <span className="text-sm text-muted-foreground">
                / {currentResume.title || t("dashboard:resumeCard.untitled", "Untitled Resume")}
              </span>
            )}
          </div>

          <nav
            className="flex items-center gap-2"
            aria-label={t("navigation.main", "Main navigation")}
          >
            {/* Resume-specific actions - only show when editing a resume */}
            {currentResume && (
              <>
                <TemplateSelector selected={template} onSelect={setTemplate} />
                <StyleCustomizer />
                <ExportMenu resume={currentResume} />
              </>
            )}

            {/* Language switcher - compact version in header */}
            <LanguageSwitcher showLabel={false} size="icon" className="h-8 w-8" />

            <Button
              variant="ghost"
              size="icon"
              asChild
              aria-label={t("navigation.settings")}
              className="h-8 w-8"
            >
              <Link to="/settings">
                <Settings className="size-4" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main
        id="main-content"
        tabIndex={-1}
        className="relative flex-1 overflow-hidden focus:outline-none"
      >
        {children}
      </main>
    </div>
  );
}
