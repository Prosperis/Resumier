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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <FileText className="size-6" />
            <span className="text-xl">Resumier</span>
          </Link>

          <nav className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              title={`Current theme: ${theme}`}
            >
              {getThemeIcon()}
            </Button>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex h-16 items-center justify-center text-sm text-muted-foreground">
          Built with React, TanStack, and shadcn/ui
        </div>
      </footer>
    </div>
  )
}
