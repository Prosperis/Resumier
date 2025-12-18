import { Redo2, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUndoRedoActions } from "@/hooks/use-keyboard-shortcuts";
import { cn } from "@/lib/utils";

interface UndoRedoButtonsProps {
  /** Size variant for the buttons */
  size?: "default" | "sm" | "lg" | "icon";
  /** Visual variant for the buttons */
  variant?: "default" | "outline" | "ghost" | "secondary";
  /** Whether to show text labels alongside icons */
  showLabels?: boolean;
  /** Custom class name for the container */
  className?: string;
  /** Whether to show tooltips */
  showTooltips?: boolean;
}

/**
 * Reusable undo/redo buttons component.
 * Can be placed in toolbars, navbars, or any other UI location.
 */
export function UndoRedoButtons({
  size = "icon",
  variant = "ghost",
  showLabels = false,
  className,
  showTooltips = true,
}: UndoRedoButtonsProps) {
  const { undo, redo, canUndo, canRedo, undoDescription, redoDescription } =
    useUndoRedoActions();

  const isMac =
    typeof navigator !== "undefined" &&
    navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  const modKey = isMac ? "⌘" : "Ctrl";

  const UndoButton = (
    <Button
      variant={variant}
      size={size}
      onClick={undo}
      disabled={!canUndo}
      aria-label="Undo"
      className={cn(
        "transition-opacity",
        !canUndo && "opacity-50 cursor-not-allowed"
      )}
    >
      <Undo2 className={cn("h-4 w-4", showLabels && "mr-2")} />
      {showLabels && "Undo"}
    </Button>
  );

  const RedoButton = (
    <Button
      variant={variant}
      size={size}
      onClick={redo}
      disabled={!canRedo}
      aria-label="Redo"
      className={cn(
        "transition-opacity",
        !canRedo && "opacity-50 cursor-not-allowed"
      )}
    >
      <Redo2 className={cn("h-4 w-4", showLabels && "mr-2")} />
      {showLabels && "Redo"}
    </Button>
  );

  if (!showTooltips) {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {UndoButton}
        {RedoButton}
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className={cn("flex items-center gap-1", className)}>
        <Tooltip>
          <TooltipTrigger asChild>{UndoButton}</TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="font-medium">Undo</p>
            {undoDescription && (
              <p className="text-xs text-muted-foreground">{undoDescription}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {modKey}+Z
            </p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>{RedoButton}</TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="font-medium">Redo</p>
            {redoDescription && (
              <p className="text-xs text-muted-foreground">{redoDescription}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {modKey}+Shift+Z
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

/**
 * Individual undo button for use in custom layouts.
 */
export function UndoButton({
  size = "icon",
  variant = "ghost",
  className,
}: {
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "outline" | "ghost" | "secondary";
  className?: string;
}) {
  const { undo, canUndo, undoDescription } = useUndoRedoActions();

  const isMac =
    typeof navigator !== "undefined" &&
    navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  const modKey = isMac ? "⌘" : "Ctrl";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            onClick={undo}
            disabled={!canUndo}
            aria-label="Undo"
            className={cn(
              "transition-opacity",
              !canUndo && "opacity-50 cursor-not-allowed",
              className
            )}
          >
            <Undo2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="font-medium">Undo</p>
          {undoDescription && (
            <p className="text-xs text-muted-foreground">{undoDescription}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">{modKey}+Z</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Individual redo button for use in custom layouts.
 */
export function RedoButton({
  size = "icon",
  variant = "ghost",
  className,
}: {
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "outline" | "ghost" | "secondary";
  className?: string;
}) {
  const { redo, canRedo, redoDescription } = useUndoRedoActions();

  const isMac =
    typeof navigator !== "undefined" &&
    navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  const modKey = isMac ? "⌘" : "Ctrl";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            onClick={redo}
            disabled={!canRedo}
            aria-label="Redo"
            className={cn(
              "transition-opacity",
              !canRedo && "opacity-50 cursor-not-allowed",
              className
            )}
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="font-medium">Redo</p>
          {redoDescription && (
            <p className="text-xs text-muted-foreground">{redoDescription}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {modKey}+Shift+Z
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

