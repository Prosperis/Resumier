import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SaveStatusIndicatorProps {
  status: "idle" | "saving" | "saved" | "error";
  lastSaved?: Date | null;
  error?: Error | null;
  className?: string;
}

/**
 * Accessible save status indicator with ARIA live region
 * Announces save status changes to screen readers
 */
export function SaveStatusIndicator({
  status,
  lastSaved,
  error,
  className,
}: SaveStatusIndicatorProps) {
  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);

    if (diffSec < 10) return "just now";
    if (diffSec < 60) return `${diffSec} seconds ago`;
    if (diffMin === 1) return "1 minute ago";
    if (diffMin < 60) return `${diffMin} minutes ago`;

    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getStatusMessage = () => {
    switch (status) {
      case "saving":
        return "Saving changes...";
      case "saved":
        return lastSaved ? `Saved ${formatLastSaved(lastSaved)}` : "All changes saved";
      case "error":
        return error ? `Error: ${error.message}` : "Failed to save changes";
      default:
        return "";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "saving":
        return <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />;
      case "saved":
        return <CheckCircle2 className="h-4 w-4 text-green-600" aria-hidden="true" />;
      case "error":
        return <XCircle className="text-destructive h-4 w-4" aria-hidden="true" />;
      default:
        return null;
    }
  };

  const statusMessage = getStatusMessage();

  if (status === "idle" || !statusMessage) {
    return null;
  }

  return (
    <>
      {/* Visual indicator */}
      <div
        className={cn(
          "flex items-center gap-2 text-sm transition-opacity",
          status === "error" && "text-destructive",
          status === "saved" && "text-muted-foreground",
          status === "saving" && "text-muted-foreground",
          className
        )}
      >
        {getStatusIcon()}
        <span>{statusMessage}</span>
      </div>

      {/* Screen reader announcement - polite for saves, assertive for errors */}
      <div
        role={status === "error" ? "alert" : "status"}
        aria-live={status === "error" ? "assertive" : "polite"}
        aria-atomic="true"
        className="sr-only"
      >
        {statusMessage}
      </div>
    </>
  );
}
