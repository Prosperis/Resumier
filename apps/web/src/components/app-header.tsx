import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function AppHeader({
  onPersonalInfoClick,
  onJobInfoClick,
}: {
  onPersonalInfoClick?: () => void
  onJobInfoClick?: () => void
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-20 flex h-16 items-center justify-between gap-4 border-b bg-background px-4">
      <div className="flex items-center gap-2">
        <img src={`${import.meta.env.BASE_URL}logo_dark.png`} alt="Logo" className="h-8" />
      </div>
      <h1 className="flex-1 text-center text-lg font-semibold">Resume</h1>
      <nav className="flex gap-2">
        <Button variant="outline" onClick={onPersonalInfoClick}>
          Personal Info
        </Button>
        <Button variant="outline" onClick={onJobInfoClick}>
          Job Info
        </Button>
        <ThemeToggle />
      </nav>
    </header>
  )
}

