import { useEffect, useState, useRef } from "react";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { InteractiveResumePreview } from "./preview/interactive-resume-preview";
import { ResumeBuilder } from "./resume-builder";
import { ToolSidebar } from "./tool-sidebar";
import { PreviewNavigation } from "./preview/preview-navigation";
import { PAGE_WIDTH } from "./preview/resume-page-wrapper";

const PREVIEW_HORIZONTAL_PADDING = 64;
const LEFT_SIDEBAR_DEFAULT_WIDTH = 320;
const LEFT_SIDEBAR_MIN_WIDTH = 280;
const LEFT_SIDEBAR_MAX_WIDTH = 440;
const RIGHT_SIDEBAR_DEFAULT_WIDTH = 288;
const RIGHT_SIDEBAR_MIN_WIDTH = 240;
const RIGHT_SIDEBAR_MAX_WIDTH = 420;

type ResizeSide = "left" | "right";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

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
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(LEFT_SIDEBAR_DEFAULT_WIDTH);
  const [rightSidebarWidth, setRightSidebarWidth] = useState(RIGHT_SIDEBAR_DEFAULT_WIDTH);
  const [activeResize, setActiveResize] = useState<{
    side: ResizeSide;
    pointerId: number;
    startX: number;
    startWidth: number;
  } | null>(null);
  const toolSidebarOffsetRem = isToolSidebarExpanded ? rightSidebarWidth / 16 + 1 : 4;

  const leftSidebarRef = useRef<HTMLDivElement>(null);
  const previewScaleRef = useRef<HTMLDivElement>(null);
  const pendingResizeWidthRef = useRef<number | null>(null);
  const resizeFrameRef = useRef<number | null>(null);

  // Ref for the preview container (for navigation)
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const rightSidebarRef = useRef<HTMLDivElement>(null);

  // Set/clear the current resume for navbar actions
  // Note: Keyboard shortcuts for undo/redo are handled globally by GlobalUndoProvider
  useEffect(() => {
    setCurrentResume(resume);
    return () => setCurrentResume(null);
  }, [resume, setCurrentResume]);

  useEffect(() => {
    const container = previewContainerRef.current;
    if (!container) return;

    const updatePreviewScale = () => {
      const availableWidth = Math.max(0, container.clientWidth - PREVIEW_HORIZONTAL_PADDING);
      const nextScale = availableWidth > 0 ? Math.min(1, availableWidth / PAGE_WIDTH) : 1;
      if (previewScaleRef.current) {
        previewScaleRef.current.style.zoom = `${nextScale}`;
      }
    };

    updatePreviewScale();

    const resizeObserver = new ResizeObserver(updatePreviewScale);
    resizeObserver.observe(container);
    window.addEventListener("resize", updatePreviewScale);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updatePreviewScale);
    };
  }, []);

  useEffect(() => {
    if (!activeResize) return;

    const applyResizedWidth = (width: number) => {
      const sidebar =
        activeResize.side === "left" ? leftSidebarRef.current : rightSidebarRef.current;
      if (!sidebar) return;

      sidebar.style.width = `${width}px`;
      sidebar.style.minWidth = `${width}px`;
    };

    const flushPendingResize = () => {
      resizeFrameRef.current = null;
      if (pendingResizeWidthRef.current === null) return;
      applyResizedWidth(pendingResizeWidthRef.current);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const nextWidth =
        activeResize.side === "left"
          ? clamp(
              activeResize.startWidth + (event.clientX - activeResize.startX),
              LEFT_SIDEBAR_MIN_WIDTH,
              LEFT_SIDEBAR_MAX_WIDTH,
            )
          : clamp(
              activeResize.startWidth - (event.clientX - activeResize.startX),
              RIGHT_SIDEBAR_MIN_WIDTH,
              RIGHT_SIDEBAR_MAX_WIDTH,
            );

      pendingResizeWidthRef.current = nextWidth;
      if (resizeFrameRef.current === null) {
        resizeFrameRef.current = window.requestAnimationFrame(flushPendingResize);
      }
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (event.pointerId === activeResize.pointerId) {
        if (resizeFrameRef.current !== null) {
          window.cancelAnimationFrame(resizeFrameRef.current);
          flushPendingResize();
        }

        const finalWidth = pendingResizeWidthRef.current ?? activeResize.startWidth;
        if (activeResize.side === "left") {
          setLeftSidebarWidth(finalWidth);
        } else {
          setRightSidebarWidth(finalWidth);
        }

        pendingResizeWidthRef.current = null;
        setActiveResize(null);
      }
    };

    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    return () => {
      if (resizeFrameRef.current !== null) {
        window.cancelAnimationFrame(resizeFrameRef.current);
        resizeFrameRef.current = null;
      }
      pendingResizeWidthRef.current = null;
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [activeResize]);

  const handleLeftResizeStart = (event: React.PointerEvent<HTMLDivElement>) => {
    setActiveResize({
      side: "left",
      pointerId: event.pointerId,
      startX: event.clientX,
      startWidth: leftSidebarWidth,
    });
  };

  const handleRightResizeStart = (event: React.PointerEvent<HTMLDivElement>) => {
    setActiveResize({
      side: "right",
      pointerId: event.pointerId,
      startX: event.clientX,
      startWidth: rightSidebarWidth,
    });
  };

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
        ref={leftSidebarRef}
        className={cn(
          "group/sidebar relative flex flex-col border-r border-border bg-background duration-300 ease-in-out",
          activeResize?.side === "left" ? "transition-none" : "transition-all",
          isSidebarExpanded ? "" : "w-12",
        )}
        style={
          isSidebarExpanded
            ? { width: `${leftSidebarWidth}px`, minWidth: `${leftSidebarWidth}px` }
            : undefined
        }
      >
        {isSidebarExpanded && (
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize editor sidebar"
            className={cn(
              "absolute inset-y-0 -right-1 z-30 w-2 cursor-col-resize",
              "before:absolute before:inset-y-0 before:left-1/2 before:w-px before:-translate-x-1/2",
              "before:bg-border/70 hover:before:bg-primary",
            )}
            onPointerDown={handleLeftResizeStart}
          />
        )}

        {/* Expand/Collapse Arrow - Minimal Hover Design */}
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 -right-3 z-20",
            "opacity-0 group-hover/sidebar:opacity-100",
            "transition-opacity duration-300 ease-out",
          )}
        >
          <button
            type="button"
            onClick={handleToggleSidebar}
            className={cn(
              "flex items-center justify-center",
              "h-6 w-6",
              "rounded-full",
              "bg-background",
              "border border-border",
              "shadow-sm",
              "text-muted-foreground",
              "cursor-pointer",
              "hover:border-primary hover:text-primary hover:bg-primary/10",
              "transition-colors duration-200",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
            aria-label={isSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isSidebarExpanded ? (
              <ChevronLeft className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        {/* Mini sidebar - visible when collapsed */}
        <div className={cn("flex flex-col h-full", isSidebarExpanded ? "hidden" : "flex")}>
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
        <div className={cn("flex flex-col h-full", isSidebarExpanded ? "flex" : "hidden")}>
          {/* Sidebar header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
            <span className="text-xs font-medium text-muted-foreground">Edit Resume</span>
          </div>

          {/* Resume Builder Form */}
          <div className="flex-1 overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]">
            <ResumeBuilder />
          </div>
        </div>
      </div>

      {/* Main Content: Live Preview - Always interactive */}
      <div
        ref={previewContainerRef}
        className={cn(
          "min-w-0 flex-1 flex items-start justify-center bg-slate-200 dark:bg-slate-800 overflow-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] p-8",
          "[background-image:radial-gradient(circle,_rgba(148,163,184,0.4)_1px,_transparent_1px)] dark:[background-image:radial-gradient(circle,_rgba(71,85,105,0.5)_1px,_transparent_1px)]",
          "[background-size:16px_16px]",
        )}
      >
        <div className="flex w-full justify-center">
          <div ref={previewScaleRef} style={{ zoom: 1 }}>
            <InteractiveResumePreview resume={resume} template={template} isInteractive={true} />
          </div>
        </div>

        {/* Floating navigation buttons */}
        <PreviewNavigation
          containerRef={previewContainerRef}
          rightSidebarOffsetRem={toolSidebarOffsetRem}
        />
      </div>

      {/* Right Sidebar: Tools */}
      <ToolSidebar
        isExpanded={isToolSidebarExpanded}
        width={rightSidebarWidth}
        sidebarRef={rightSidebarRef}
        isResizing={activeResize?.side === "right"}
        onToggle={handleToggleToolSidebar}
        onResizeStart={handleRightResizeStart}
      />
    </div>
  );
}
