import { formatDistanceToNow } from "date-fns";
import { History, Undo2, Redo2, ChevronRight, GitBranch, Circle, CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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
          "w-1.5 h-1.5 rounded-full",
          isAddition && "bg-green-500",
          isDeletion && "bg-red-500",
          !isAddition && !isDeletion && "bg-amber-500",
        )}
      />
      <span className="text-muted-foreground">{change.label}</span>
      {!isAddition && !isDeletion && (
        <span className="text-muted-foreground/60">
          {typeof change.oldValue === "string" && change.oldValue.length > 20
            ? `${change.oldValue.slice(0, 20)}...`
            : String(change.oldValue || "")}
          <ChevronRight className="inline h-3 w-3 mx-0.5" />
          {typeof change.newValue === "string" && change.newValue.length > 20
            ? `${change.newValue.slice(0, 20)}...`
            : String(change.newValue || "")}
        </span>
      )}
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
        "w-full text-left p-3 rounded-lg border transition-all duration-200",
        "hover:bg-muted/50",
        isActive && "border-primary bg-primary/5",
        isCurrent && "ring-2 ring-primary ring-offset-2",
        !isActive && !isCurrent && "border-transparent",
      )}
    >
      <div className="flex items-start gap-3">
        {/* Timeline indicator */}
        <div className="flex flex-col items-center pt-1">
          {isCurrent ? (
            <CircleDot className="h-4 w-4 text-primary" />
          ) : isActive ? (
            <Circle className="h-4 w-4 text-primary fill-primary" />
          ) : (
            <Circle className="h-4 w-4 text-muted-foreground/40" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Description and time */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <span
              className={cn(
                "font-medium text-sm truncate",
                isActive ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {entry.description}
            </span>
            <span className="text-xs text-muted-foreground/60 whitespace-nowrap">{timeAgo}</span>
          </div>

          {/* Changes preview */}
          <div className="space-y-1">
            {entry.changes.slice(0, 2).map((change, idx) => (
              <ChangeIndicator key={`${change.field}-${idx}`} change={change} />
            ))}
            {entry.changes.length > 2 && (
              <span className="text-xs text-muted-foreground/60">
                +{entry.changes.length - 2} more changes
              </span>
            )}
          </div>

          {/* Section badges */}
          <div className="flex flex-wrap gap-1 mt-2">
            {[...new Set(entry.changes.map((c) => c.section))].map((section) => (
              <Badge key={section} variant="secondary" className="text-[10px] px-1.5 py-0">
                {section}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </button>
  );
}

// Main History Panel
export function HistoryPanel() {
  const entries = useHistoryStore(selectHistoryEntries);
  const currentIndex = useHistoryStore(selectCurrentIndex);
  const isPreviewingHistory = useHistoryStore(selectIsPreviewingHistory);
  const stopPreview = useHistoryStore((state) => state.stopPreview);
  const canUndo = useHistoryStore((state) => state.canUndo());
  const canRedo = useHistoryStore((state) => state.canRedo());

  const { undoChange, redoChange } = useResumeHistory();

  const handleSelectEntry = (_entry: HistoryEntry, index: number) => {
    // Navigate to this point in history
    const stepsToUndo = currentIndex === -1 ? index + 1 : index - currentIndex;

    if (stepsToUndo > 0) {
      // Need to undo
      for (let i = 0; i < stepsToUndo; i++) {
        undoChange();
      }
    } else if (stepsToUndo < 0) {
      // Need to redo
      for (let i = 0; i < Math.abs(stepsToUndo); i++) {
        redoChange();
      }
    }
  };

  const handleBackToCurrent = () => {
    stopPreview();
    // Redo all the way back
    while (canRedo) {
      redoChange();
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <History className="h-4 w-4" />
          {entries.length > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center">
              {entries.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:max-w-[400px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Edit History
          </SheetTitle>
        </SheetHeader>

        {/* Undo/Redo Controls */}
        <div className="flex items-center gap-2 py-4 border-b border-border">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={undoChange}
                disabled={!canUndo}
                className="flex-1"
              >
                <Undo2 className="h-4 w-4 mr-2" />
                Undo
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo last change</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={redoChange}
                disabled={!canRedo}
                className="flex-1"
              >
                <Redo2 className="h-4 w-4 mr-2" />
                Redo
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo change</TooltipContent>
          </Tooltip>
        </div>

        {/* Preview mode indicator */}
        {isPreviewingHistory && (
          <div className="flex items-center justify-between py-3 px-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg my-4">
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span className="text-sm text-amber-700 dark:text-amber-300">Viewing past state</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToCurrent}
              className="text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100"
            >
              Back to current
            </Button>
          </div>
        )}

        {/* History entries */}
        <div className="flex-1 overflow-y-auto py-4 space-y-2">
          {entries.length === 0 ? (
            <div className="text-center py-12">
              <History className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-sm text-muted-foreground">No changes yet</p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Your edit history will appear here
              </p>
            </div>
          ) : (
            <>
              {/* Current state indicator */}
              {!isPreviewingHistory && (
                <div className="flex items-center gap-3 p-3 text-sm text-muted-foreground">
                  <CircleDot className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Current state</span>
                </div>
              )}

              {/* Timeline */}
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[22px] top-4 bottom-4 w-px bg-border" />

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

        {/* Info footer */}
        {entries.length > 0 && (
          <div className="border-t border-border pt-4 mt-auto">
            <p className="text-xs text-muted-foreground text-center">
              Click any entry to preview that state.
              <br />
              Make a change to branch off from that point.
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

// Compact undo/redo buttons for toolbar
export function HistoryControls() {
  const canUndo = useHistoryStore((state) => state.canUndo());
  const canRedo = useHistoryStore((state) => state.canRedo());
  const isPreviewingHistory = useHistoryStore(selectIsPreviewingHistory);

  const { undoChange, redoChange } = useResumeHistory();

  return (
    <div className="flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={undoChange}
            disabled={!canUndo}
            className={cn("h-8 w-8", isPreviewingHistory && "text-amber-600 dark:text-amber-400")}
          >
            <Undo2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Undo (Ctrl+Z)</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={redoChange}
            disabled={!canRedo}
            className={cn("h-8 w-8", isPreviewingHistory && "text-amber-600 dark:text-amber-400")}
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Redo (Ctrl+Y)</p>
        </TooltipContent>
      </Tooltip>

      <HistoryPanel />
    </div>
  );
}
