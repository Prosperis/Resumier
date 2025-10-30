import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/features/navigation/theme-toggle";
import { Button } from "@/components/ui/button";

export function AppHeader({
  onPersonalInfoClick,
  onJobInfoClick,
  onBackClick,
}: {
  onPersonalInfoClick?: () => void;
  onJobInfoClick?: () => void;
  onBackClick?: () => void;
}) {
  return (
    <header className="bg-background fixed inset-x-0 top-0 z-20 flex h-16 items-center justify-between gap-4 border-b px-4">
      <div className="flex items-center gap-2">
        <picture>
          <source srcSet={`${import.meta.env.BASE_URL}logo_dark.webp`} type="image/webp" />
          <img
            src={`${import.meta.env.BASE_URL}logo_dark_optimized.png`}
            alt="Resumier Logo"
            className="h-8"
            loading="eager"
            width="32"
            height="32"
          />
        </picture>
        {onBackClick && (
          <Button variant="ghost" size="sm" onClick={onBackClick} className="ml-2">
            <ArrowLeft className="mr-1 size-4" /> Dashboard
          </Button>
        )}
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
  );
}
