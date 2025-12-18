import { useState, useCallback } from "react";
import { formatDistanceToNow, format } from "date-fns";
import {
  GitBranch,
  GitCommit,
  Save,
  RotateCcw,
  Trash2,
  Edit2,
  Check,
  X,
  Clock,
  Layers,
  Tag,
  ChevronDown,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useResumeVersions } from "@/hooks/use-resume-versions";
import type { ResumeContent, ResumeVersion } from "@/lib/api/types";

// Version Item Component
interface VersionItemProps {
  version: ResumeVersion;
  isLatest?: boolean;
  onRestore: (versionId: string) => void;
  onDelete: (versionId: string) => void;
  onUpdateLabel: (versionId: string, label: string) => void;
}

function VersionItem({
  version,
  isLatest,
  onRestore,
  onDelete,
  onUpdateLabel,
}: VersionItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(version.label || "");

  const timeAgo = formatDistanceToNow(new Date(version.createdAt), {
    addSuffix: true,
  });
  const formattedDate = format(new Date(version.createdAt), "MMM d, yyyy 'at' h:mm a");

  const handleSaveLabel = () => {
    onUpdateLabel(version.id, editLabel.trim());
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditLabel(version.label || "");
    setIsEditing(false);
  };

  return (
    <div
      className={cn(
        "group relative p-3 rounded-lg border transition-all duration-200",
        "hover:bg-muted/50 hover:border-border",
        isLatest
          ? "border-primary/30 bg-primary/5"
          : "border-transparent bg-transparent",
      )}
    >
      {/* Version indicator line */}
      <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full bg-gradient-to-b from-primary/60 to-primary/20" />

      <div className="ml-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {/* Version number and badges */}
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm">v{version.version}</span>
              {isLatest && (
                <Badge
                  variant="secondary"
                  className="text-[9px] px-1.5 py-0 h-4 bg-primary/10 text-primary border-primary/20"
                >
                  Latest
                </Badge>
              )}
              {version.isAutoSave ? (
                <Badge
                  variant="outline"
                  className="text-[9px] px-1.5 py-0 h-4 text-muted-foreground"
                >
                  <Clock className="h-2.5 w-2.5 mr-0.5" />
                  Auto
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="text-[9px] px-1.5 py-0 h-4 text-muted-foreground"
                >
                  <Save className="h-2.5 w-2.5 mr-0.5" />
                  Manual
                </Badge>
              )}
            </div>

            {/* Label (editable) */}
            {isEditing ? (
              <div className="flex items-center gap-1.5 mb-2">
                <Input
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  placeholder="Add a label..."
                  className="h-7 text-xs flex-1"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveLabel();
                    if (e.key === "Escape") handleCancelEdit();
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleSaveLabel}
                >
                  <Check className="h-3.5 w-3.5 text-green-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleCancelEdit}
                >
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </div>
            ) : version.label ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 text-xs text-foreground/80 hover:text-foreground mb-2 group/label"
              >
                <Tag className="h-3 w-3 text-muted-foreground" />
                <span>{version.label}</span>
                <Edit2 className="h-2.5 w-2.5 text-muted-foreground opacity-0 group-hover/label:opacity-100 transition-opacity" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-[10px] text-muted-foreground/60 hover:text-muted-foreground mb-2 flex items-center gap-1"
              >
                <Edit2 className="h-2.5 w-2.5" />
                Add label
              </button>
            )}

            {/* Timestamp */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60">
                  <Clock className="h-2.5 w-2.5" />
                  <span>{timeAgo}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="start">
                {formattedDate}
              </TooltipContent>
            </Tooltip>

            {/* Template/Style info */}
            {version.template && (
              <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground/50">
                <span className="capitalize">{version.template}</span>
                {version.styleCustomization?.colorTheme && (
                  <>
                    <span>•</span>
                    <span className="capitalize">{version.styleCustomization.colorTheme}</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onRestore(version.id)}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Restore this version</TooltipContent>
            </Tooltip>

            <AlertDialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent>Delete version</TooltipContent>
              </Tooltip>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Version</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete version {version.version}
                    {version.label ? ` (${version.label})` : ""}? This action cannot
                    be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(version.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}

// Save Version Dialog
interface SaveVersionDialogProps {
  onSave: (label: string) => void;
  trigger?: React.ReactNode;
}

function SaveVersionDialog({ onSave, trigger }: SaveVersionDialogProps) {
  const [label, setLabel] = useState("");
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    onSave(label.trim());
    setLabel("");
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="w-full">
            <Save className="h-3.5 w-3.5 mr-2" />
            Save Version
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <GitCommit className="h-5 w-5 text-primary" />
            Save New Version
          </AlertDialogTitle>
          <AlertDialogDescription>
            Create a snapshot of your current resume. You can restore this version
            anytime.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <Input
            placeholder="Version label (optional) e.g., 'Before redesign'"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
            }}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Version
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Main Version Panel Component
interface VersionPanelProps {
  resumeId: string;
  currentContent: ResumeContent;
  className?: string;
}

export function VersionPanel({ resumeId, currentContent, className }: VersionPanelProps) {
  const [showAutoSaves, setShowAutoSaves] = useState(false);

  const {
    versions,
    versionCount,
    manualVersions,
    autoSaveVersions,
    saveVersion,
    restoreVersion,
    deleteVersion,
    updateLabel,
    clearVersions,
    cleanupAutoSaves,
  } = useResumeVersions(resumeId);

  const handleSaveVersion = useCallback(
    (label: string) => {
      saveVersion(currentContent, label || undefined);
    },
    [currentContent, saveVersion],
  );

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">Versions</span>
          {versionCount > 0 && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
              {versionCount}
            </Badge>
          )}
        </div>
      </div>

      {/* Save button */}
      <div className="p-3 border-b border-border">
        <SaveVersionDialog onSave={handleSaveVersion} />
      </div>

      {/* Version list */}
      <div className="flex-1 overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] p-3">
        {versionCount === 0 ? (
          <div className="text-center py-8">
            <Layers className="h-10 w-10 mx-auto text-muted-foreground/20 mb-3" />
            <p className="text-xs text-muted-foreground">No versions saved</p>
            <p className="text-[10px] text-muted-foreground/60 mt-1">
              Save a version to create a restore point
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Manual versions */}
            {manualVersions.length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 px-1 mb-2">
                  <Sparkles className="h-3 w-3 text-primary" />
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    Saved Versions
                  </span>
                </div>
                {manualVersions.map((version, index) => (
                  <VersionItem
                    key={version.id}
                    version={version}
                    isLatest={index === 0 && autoSaveVersions.length === 0}
                    onRestore={restoreVersion}
                    onDelete={deleteVersion}
                    onUpdateLabel={updateLabel}
                  />
                ))}
              </div>
            )}

            {/* Auto-save versions (collapsible) */}
            {autoSaveVersions.length > 0 && (
              <Collapsible open={showAutoSaves} onOpenChange={setShowAutoSaves}>
                <CollapsibleTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-2 rounded-lg",
                      "text-[10px] font-medium text-muted-foreground uppercase tracking-wider",
                      "hover:bg-muted/50 transition-colors",
                    )}
                  >
                    {showAutoSaves ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                    <Clock className="h-3 w-3" />
                    <span>Auto-saves ({autoSaveVersions.length})</span>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 mt-1">
                  {autoSaveVersions.map((version, index) => (
                    <VersionItem
                      key={version.id}
                      version={version}
                      isLatest={index === 0 && manualVersions.length === 0}
                      onRestore={restoreVersion}
                      onDelete={deleteVersion}
                      onUpdateLabel={updateLabel}
                    />
                  ))}
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        )}
      </div>

      {/* Footer actions */}
      {versionCount > 0 && (
        <div className="border-t border-border p-2 space-y-1">
          {autoSaveVersions.length > 10 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => cleanupAutoSaves(10)}
              className="w-full h-7 text-xs text-muted-foreground hover:text-foreground"
            >
              <Clock className="h-3 w-3 mr-1.5" />
              Cleanup old auto-saves
            </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full h-7 text-xs text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3 w-3 mr-1.5" />
                Clear All Versions
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear All Versions</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all {versionCount} saved version
                  {versionCount > 1 ? "s" : ""} for this resume. This action cannot
                  be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={clearVersions}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
}

// Compact version indicator for toolbar
interface VersionIndicatorProps {
  resumeId: string;
}

export function VersionIndicator({ resumeId }: VersionIndicatorProps) {
  const { versionCount, latestVersion } = useResumeVersions(resumeId);

  if (versionCount === 0) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50 text-xs text-muted-foreground">
          <GitBranch className="h-3 w-3" />
          <span>v{latestVersion?.version}</span>
          <Badge variant="secondary" className="text-[9px] px-1 py-0 h-3.5 ml-1">
            {versionCount}
          </Badge>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          {versionCount} version{versionCount > 1 ? "s" : ""} saved
        </p>
      </TooltipContent>
    </Tooltip>
  );
}

