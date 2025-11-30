import { useEffect, useState, useCallback } from "react";
import {
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  Award,
  Link as LinkIcon,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import type { Resume } from "@/lib/api/types";
import { useResumeStore } from "@/stores/resume-store";
import {
  useUIStore,
  selectSetCurrentResume,
  selectToggleResumeBuilderSection,
} from "@/stores/ui-store";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { InteractiveResumePreview } from "./preview/interactive-resume-preview";
import { ResumeBuilder } from "./resume-builder";
import { ToolSidebar } from "./tool-sidebar";
import { useResumeHistory } from "@/hooks/use-resume-history";

// Sidebar section icons mapping
const sidebarSections = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "links", label: "Links", icon: LinkIcon },
] as const;

interface ResumeEditorProps {
  resume: Resume;
}

export function ResumeEditor({ resume }: ResumeEditorProps) {
  const template = useResumeStore((state) => state.template);
  const setCurrentResume = useUIStore(selectSetCurrentResume);
  const toggleSection = useUIStore(selectToggleResumeBuilderSection);

  // Sidebar state
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isToolSidebarExpanded, setIsToolSidebarExpanded] = useState(false);

  // History actions for keyboard shortcuts
  const { undoChange, redoChange } = useResumeHistory();

  // Keyboard shortcuts for undo/redo
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Check if user is typing in an input field
      const target = e.target as HTMLElement;
      const isInputField =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      // Only handle shortcuts when not in an input field
      if (isInputField) return;

      // Ctrl+Z or Cmd+Z for undo
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undoChange();
      }

      // Ctrl+Shift+Z or Cmd+Shift+Z for redo
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && e.shiftKey) {
        e.preventDefault();
        redoChange();
      }

      // Ctrl+Y or Cmd+Y for redo (alternative)
      if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        redoChange();
      }
    },
    [undoChange, redoChange],
  );

  // Register keyboard shortcuts
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Set/clear the current resume for navbar actions
  useEffect(() => {
    setCurrentResume(resume);
    return () => setCurrentResume(null);
  }, [resume, setCurrentResume]);

  // Handle clicking a section icon - opens that section and expands sidebar
  const handleSectionClick = (sectionId: string) => {
    toggleSection(sectionId as Parameters<typeof toggleSection>[0]);
    if (!isSidebarExpanded) {
      setIsSidebarExpanded(true);
    }
  };

  // Toggle sidebar expanded state
  const handleToggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  // Toggle tool sidebar
  const handleToggleToolSidebar = () => {
    setIsToolSidebarExpanded(!isToolSidebarExpanded);
  };

  return (
    <div className="flex h-full">
      {/* Collapsible Sidebar */}
      <div
        className={cn(
          "group/sidebar relative flex flex-col border-r border-border bg-background transition-all duration-300 ease-in-out",
          isSidebarExpanded ? "w-80 min-w-80" : "w-12",
        )}
      >
        {/* Expand/Collapse Arrow - Fluid Design */}
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 left-full z-20",
            "flex items-center justify-center",
            "opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300",
            "h-14 w-6",
          )}
        >
          <button
            type="button"
            onClick={handleToggleSidebar}
            className="relative w-full h-full flex items-center justify-center focus:outline-none group/toggle"
          >
            {/* Fluid Shape SVG */}
            <svg
              viewBox="0 0 24 56"
              className={cn(
                "absolute inset-0 w-full h-full",
                "fill-background stroke-border",
                "transition-colors duration-300",
              )}
              style={{ filter: "drop-shadow(1px 0 1px rgba(0,0,0,0.05))" }}
            >
              {/* 
                Path creates a smooth, rounded bulge - less pointy, more organic.
                Uses quadratic curves for a softer, more liquid-like appearance.
              */}
              <path
                d="M 0 0 C 0 12, 18 16, 18 28 S 0 44, 0 56"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Icon */}
            <div className="relative z-10 text-muted-foreground group-hover/toggle:text-foreground transition-colors">
              {isSidebarExpanded ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>
          </button>
        </div>

        {/* Mini sidebar - visible when collapsed */}
        <div
          className={cn(
            "flex flex-col h-full",
            isSidebarExpanded ? "hidden" : "flex",
          )}
        >
          {/* Section Icons - centered vertically */}
          <div className="flex-1 flex flex-col items-center justify-center gap-1">
            {sidebarSections.map((section) => (
              <Tooltip key={section.id} delayDuration={0}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => handleSectionClick(section.id)}
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-md",
                      "text-muted-foreground hover:text-foreground hover:bg-muted",
                      "transition-colors",
                    )}
                  >
                    <section.icon className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>
                  <p>{section.label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        {/* Expanded sidebar content */}
        <div
          className={cn(
            "flex flex-col h-full",
            isSidebarExpanded ? "flex" : "hidden",
          )}
        >
          {/* Sidebar header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
            <span className="text-xs font-medium text-muted-foreground">
              Edit Resume
            </span>
          </div>

          {/* Resume Builder Form */}
          <div className="flex-1 overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]">
            <ResumeBuilder />
          </div>
        </div>
      </div>

      {/* Main Content: Live Preview - Always interactive */}
      <div
        className={cn(
          "flex-1 flex items-start justify-center bg-slate-200 dark:bg-slate-800 overflow-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] p-8",
        )}
      >
        <InteractiveResumePreview
          resume={resume}
          template={template}
          isInteractive={true}
        />
      </div>

      {/* Right Sidebar: Tools */}
      <ToolSidebar
        isExpanded={isToolSidebarExpanded}
        onToggle={handleToggleToolSidebar}
      />
    </div>
  );
}
