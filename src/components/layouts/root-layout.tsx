import { Link } from "@tanstack/react-router";
import { FileText, Moon, Sun, Sparkles, Settings } from "lucide-react";
import { useTheme } from "@/app/theme-provider";
import { AnimatedDotGrid } from "@/components/ui/animated-dot-grid";
import { Button } from "@/components/ui/button";
import { useAnimationStore } from "@/stores/animation-store";
import { useAuthStore, selectIsDemo } from "@/stores/auth-store";

type RootLayoutProps = {
  children: React.ReactNode;
};

/**
 * Root layout component
 * Provides the main application structure with header and content area
 */
export function RootLayout({ children }: RootLayoutProps) {
  const { theme, setTheme } = useTheme();
  const dotGridEnabled = useAnimationStore((state) => state.dotGridEnabled);
  const isDemo = useAuthStore(selectIsDemo);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const isDark = theme === "dark";
  const getThemeIcon = () => {
    return isDark ? <Sun className="size-5" /> : <Moon className="size-5" />;
  };

  const getThemeLabel = () => {
    return `Switch to ${isDark ? "light" : "dark"} theme`;
  };

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Animated honeycomb background */}
      <AnimatedDotGrid
        dotSize={2}
        dotSpacing={120}
        waveRadius={250}
        waveIntensity={40}
        enabled={dotGridEnabled}
      />

      {/* Skip link for keyboard navigation - visible on focus */}
      <a
        href="#main-content"
        className="focus:bg-primary focus:text-primary-foreground focus:ring-ring sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:px-4 focus:py-2 focus:font-medium focus:ring-2 focus:ring-offset-2 focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Header - Modern Gradient Design */}
      <header className="relative sticky top-0 z-50 w-full border-b border-purple-500/20 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        {/* Gradient accent line */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600" />

        <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="group flex items-center gap-3 transition-all duration-300 hover:scale-105"
            aria-label="Resumier home"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg shadow-purple-500/30 transition-all duration-300 group-hover:shadow-purple-500/50">
              <FileText className="size-5 text-white" aria-hidden="true" />
              <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-2xl font-black tracking-tight text-transparent">
              Resumier
            </span>
          </Link>

          <nav className="flex items-center gap-3" aria-label="Main navigation">
            <Button
              variant="ghost"
              size="icon"
              asChild
              aria-label="Settings"
              className="h-10 w-10 rounded-xl transition-all duration-300 hover:scale-105 hover:bg-purple-500/10"
            >
              <Link to="/settings">
                <Settings className="size-5" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={getThemeLabel()}
              className="h-10 w-10 rounded-xl transition-all duration-300 hover:scale-105 hover:bg-purple-500/10"
            >
              {getThemeIcon()}
            </Button>
          </nav>
        </div>
      </header>

      {/* Demo Mode Banner - Thin strip under navbar */}
      {isDemo && (
        <div className="sticky top-20 z-40 border-b border-blue-500/30 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 px-4 py-2 shadow-md">
          <div className="container mx-auto flex items-center justify-center gap-2 text-sm font-medium text-white">
            <Sparkles className="h-4 w-4 animate-pulse" />
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

      {/* Footer - Modern Design */}
      <footer className="relative border-t border-purple-500/20 bg-gradient-to-b from-background to-purple-500/5 py-6 md:py-0">
        {/* Gradient accent line */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

        <div className="text-muted-foreground container flex h-20 items-center justify-center text-sm">
          <span className="flex items-center gap-2">
            Built with
            <span className="font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              React
            </span>
            ,
            <span className="font-semibold bg-gradient-to-r from-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
              TanStack
            </span>
            , and
            <span className="font-semibold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              shadcn/ui
            </span>
          </span>
        </div>
      </footer>
    </div>
  );
}
