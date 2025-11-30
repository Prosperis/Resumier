import { formatDistanceToNow } from "date-fns";
import {
  History,
  ChevronRight,
  ChevronLeft,
  GitBranch,
  Circle,
  CircleDot,
  Clock,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  useHistoryStore,
  selectHistoryEntries,
  selectCurrentIndex,
  selectIsPreviewingHistory,
  type HistoryEntry,
  type HistoryChange,
} from "@/stores/history-store";
import { useResumeHistory } from "@/hooks/use-resume-history";

// Change indicator component
function ChangeIndicator({ change }: { change: HistoryChange }) {
  const isAddition = change.oldValue === undefined || change.oldValue === "";
  const isDeletion = change.newValue === undefined || change.newValue === "";

  return (
    <div className="flex items-center gap-2 text-xs">
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full flex-shrink-0",
          isAddition && "bg-green-500",
          isDeletion && "bg-red-500",
          !isAddition && !isDeletion && "bg-amber-500",
        )}
      />
      <span className="text-muted-foreground truncate">{change.label}</span>
    </div>
  );
}

// History entry component
function HistoryEntryItem({
  entry,
  isActive,
  isCurrent,
  onSelect,
}: {
  entry: HistoryEntry;
  isActive: boolean;
  isCurrent: boolean;
  onSelect: () => void;
}) {
  const timeAgo = formatDistanceToNow(new Date(entry.timestamp), {
    addSuffix: true,
  });

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full text-left p-2.5 rounded-lg border transition-all duration-200",
        "hover:bg-muted/50",
        isActive && "border-primary bg-primary/5",
        isCurrent && "ring-2 ring-primary ring-offset-1",
        !isActive && !isCurrent && "border-transparent hover:border-border",
      )}
    >
      <div className="flex items-start gap-2">
        {/* Timeline indicator */}
        <div className="flex flex-col items-center pt-0.5 flex-shrink-0">
          {isCurrent ? (
            <CircleDot className="h-3.5 w-3.5 text-primary" />
          ) : isActive ? (
            <Circle className="h-3.5 w-3.5 text-primary fill-primary" />
          ) : (
            <Circle className="h-3.5 w-3.5 text-muted-foreground/40" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Description */}
          <span
            className={cn(
              "font-medium text-xs block truncate",
              isActive ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {entry.description}
          </span>

          {/* Time */}
          <span className="text-[10px] text-muted-foreground/60 flex items-center gap-1 mt-0.5">
            <Clock className="h-2.5 w-2.5" />
            {timeAgo}
          </span>

          {/* Changes preview - only show first one */}
          <div className="mt-1.5">
            {entry.changes.slice(0, 1).map((change, idx) => (
              <ChangeIndicator key={`${change.field}-${idx}`} change={change} />
            ))}
            {entry.changes.length > 1 && (
              <span className="text-[10px] text-muted-foreground/50 ml-3.5">
                +{entry.changes.length - 1} more
              </span>
            )}
          </div>

          {/* Section badges */}
          <div className="flex flex-wrap gap-1 mt-1.5">
            {[...new Set(entry.changes.map((c) => c.section))].map(
              (section) => (
                <Badge
                  key={section}
                  variant="secondary"
                  className="text-[9px] px-1 py-0 h-4"
                >
                  {section}
                </Badge>
              ),
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

interface ToolSidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export function ToolSidebar({ isExpanded, onToggle }: ToolSidebarProps) {
  const entries = useHistoryStore(selectHistoryEntries);
  const currentIndex = useHistoryStore(selectCurrentIndex);
  const isPreviewingHistory = useHistoryStore(selectIsPreviewingHistory);
  const stopPreview = useHistoryStore((state) => state.stopPreview);
  const clearHistory = useHistoryStore((state) => state.clearHistory);
  const canRedo = useHistoryStore((state) => state.canRedo());

  const { undoChange, redoChange } = useResumeHistory();

  const handleSelectEntry = (entry: HistoryEntry, index: number) => {
    const stepsToUndo = currentIndex === -1 ? index + 1 : index - currentIndex;

    if (stepsToUndo > 0) {
      for (let i = 0; i < stepsToUndo; i++) {
        undoChange();
      }
    } else if (stepsToUndo < 0) {
      for (let i = 0; i < Math.abs(stepsToUndo); i++) {
        redoChange();
      }
    }
  };

  const handleBackToCurrent = () => {
    stopPreview();
    while (canRedo) {
      redoChange();
    }
  };

  return (
    <div
      className={cn(
        "group/sidebar relative flex flex-col border-l border-border bg-background transition-all duration-300 ease-in-out",
        isExpanded ? "w-72 min-w-72" : "w-12",
      )}
    >
      {/* Expand/Collapse Arrow - Fluid Design (mirrored for right side) */}
      <div
        className={cn(
          "absolute top-1/2 -translate-y-1/2 right-full z-20",
          "flex items-center justify-center",
          "opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300",
          "h-14 w-6",
        )}
      >
        <button
          type="button"
          onClick={onToggle}
          className="relative w-full h-full flex items-center justify-center focus:outline-none group/toggle"
        >
          {/* Fluid Shape SVG - mirrored */}
          <svg
            viewBox="0 0 24 56"
            className={cn(
              "absolute inset-0 w-full h-full",
              "fill-background stroke-border",
              "transition-colors duration-300",
            )}
            style={{
              filter: "drop-shadow(-1px 0 1px rgba(0,0,0,0.05))",
              transform: "scaleX(-1)",
            }}
          >
            <path
              d="M 0 0 C 0 12, 18 16, 18 28 S 0 44, 0 56"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Icon */}
          <div className="relative z-10 text-muted-foreground group-hover/toggle:text-foreground transition-colors">
            {isExpanded ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </div>
        </button>
      </div>

      {/* Mini sidebar - visible when collapsed */}
      <div
        className={cn("flex flex-col h-full", isExpanded ? "hidden" : "flex")}
      >
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          {/* History icon with count */}
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={onToggle}
                className={cn(
                  "relative flex items-center justify-center w-8 h-8 rounded-md",
                  "text-muted-foreground hover:text-foreground hover:bg-muted",
                  "transition-colors",
                )}
              >
                <History className="h-4 w-4" />
                {entries.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[9px] text-primary-foreground flex items-center justify-center">
                    {entries.length > 9 ? "9+" : entries.length}
                  </span>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" sideOffset={8}>
              <p>History (Ctrl+Z / Ctrl+Shift+Z)</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Expanded sidebar content */}
      <div
        className={cn("flex flex-col h-full", isExpanded ? "flex" : "hidden")}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">
              History
            </span>
            {entries.length > 0 && (
              <Badge
                variant="secondary"
                className="text-[10px] px-1.5 py-0 h-4"
              >
                {entries.length}
              </Badge>
            )}
          </div>

          {/* Keyboard shortcut hint */}
          <span className="text-[10px] text-muted-foreground/50">
            Ctrl+Z / Ctrl+Shift+Z
          </span>
        </div>

        {/* Preview mode indicator */}
        {isPreviewingHistory && (
          <div className="mx-3 mt-3 flex items-center justify-between py-2 px-2.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex items-center gap-1.5">
              <GitBranch className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              <span className="text-xs text-amber-700 dark:text-amber-300">
                Viewing past
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToCurrent}
              className="h-6 px-2 text-[10px] text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100"
            >
              Back
            </Button>
          </div>
        )}

        {/* History entries */}
        <div className="flex-1 overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] p-3 space-y-1.5">
          {entries.length === 0 ? (
            <div className="text-center py-8">
              <History className="h-10 w-10 mx-auto text-muted-foreground/20 mb-3" />
              <p className="text-xs text-muted-foreground">No changes yet</p>
              <p className="text-[10px] text-muted-foreground/60 mt-1">
                Your edits will appear here
              </p>
            </div>
          ) : (
            <>
              {/* Current state indicator */}
              {!isPreviewingHistory && (
                <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground">
                  <CircleDot className="h-3.5 w-3.5 text-green-500" />
                  <span className="font-medium">Current</span>
                </div>
              )}

              {/* Timeline */}
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[13px] top-3 bottom-3 w-px bg-border" />

                {/* Entries */}
                {entries.map((entry, index) => (
                  <HistoryEntryItem
                    key={entry.id}
                    entry={entry}
                    isActive={currentIndex === index}
                    isCurrent={currentIndex === index && isPreviewingHistory}
                    onSelect={() => handleSelectEntry(entry, index)}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer with clear button */}
        {entries.length > 0 && (
          <div className="border-t border-border p-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearHistory}
              className="w-full h-7 text-xs text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3 w-3 mr-1.5" />
              Clear History
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
