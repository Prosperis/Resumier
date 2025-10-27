import { Link } from "@tanstack/react-router"
import { FileText, Moon, Sun } from "lucide-react"
import { useTheme } from "@/app/theme-provider"
import { Button } from "@/components/ui/button"

type RootLayoutProps = {
  children: React.ReactNode
}

/**
 * Root layout component
 * Provides the main application structure with header and content area
 */
export function RootLayout({ children }: RootLayoutProps) {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark")
    } else if (theme === "dark") {
      setTheme("system")
    } else {
      setTheme("light")
    }
  }

  const getThemeIcon = () => {
    if (theme === "light") return <Sun className="size-5" />
    if (theme === "dark") return <Moon className="size-5" />
    return <Sun className="size-5" />
  }

  const getThemeLabel = () => {
    if (theme === "light") return "Switch to dark theme"
    if (theme === "dark") return "Switch to system theme"
    return "Switch to light theme"
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip link for keyboard navigation - visible on focus */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:rounded-md focus:font-medium"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold" aria-label="Resumier home">
            <FileText className="size-6" aria-hidden="true" />
            <span className="text-xl">Resumier</span>
          </Link>

          <nav className="flex items-center gap-4" aria-label="Main navigation">
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={getThemeLabel()}>
              {getThemeIcon()}
            </Button>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex h-16 items-center justify-center text-sm text-muted-foreground">
          Built with React, TanStack, and shadcn/ui
        </div>
      </footer>
    </div>
  )
}
