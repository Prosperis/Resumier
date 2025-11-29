import { useEffect, useState } from "react";
import { MousePointerClick, FormInput } from "lucide-react";
import type { Resume } from "@/lib/api/types";
import { useResumeStore } from "@/stores/resume-store";
import { useUIStore, selectSetCurrentResume } from "@/stores/ui-store";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { InteractiveResumePreview } from "./preview/interactive-resume-preview";
import { ResumeBuilder } from "./resume-builder";

interface ResumeEditorProps {
  resume: Resume;
}

export function ResumeEditor({ resume }: ResumeEditorProps) {
  const template = useResumeStore((state) => state.template);
  const setCurrentResume = useUIStore(selectSetCurrentResume);
  const [isInteractive, setIsInteractive] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);

  // Set/clear the current resume for navbar actions
  useEffect(() => {
    setCurrentResume(resume);
    return () => setCurrentResume(null);
  }, [resume, setCurrentResume]);

  return (
    <div className="flex h-full flex-col">
      {/* Mode Toggle Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Edit mode:</span>
          <div className="flex items-center gap-1 bg-muted rounded-md p-0.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-7 px-2 text-xs gap-1.5",
                    isInteractive && "bg-background shadow-sm",
                  )}
                  onClick={() => setIsInteractive(true)}
                >
                  <MousePointerClick className="h-3.5 w-3.5" />
                  Interactive
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Click directly on the resume to edit sections</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-7 px-2 text-xs gap-1.5",
                    !isInteractive && "bg-background shadow-sm",
                  )}
                  onClick={() => setIsInteractive(false)}
                >
                  <FormInput className="h-3.5 w-3.5" />
                  Form
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Use the sidebar form to edit sections</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Toggle sidebar visibility */}
        {!isInteractive && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            {showSidebar ? "Hide Form" : "Show Form"}
          </Button>
        )}
      </div>

      {/* Content Area */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left Panel: Edit Form - visible based on mode */}
        {(!isInteractive || showSidebar) && !isInteractive && (
          <div className="w-1/3 flex flex-col border-r border-border bg-background">
            <div className="flex-1 overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]">
              <ResumeBuilder />
            </div>
          </div>
        )}

        {/* Right Panel: Live Preview */}
        <div
          className={cn(
            "flex items-start justify-center bg-slate-200 dark:bg-slate-800 overflow-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] p-8",
            isInteractive ? "flex-1" : showSidebar ? "w-2/3" : "flex-1",
          )}
        >
          <InteractiveResumePreview
            resume={resume}
            template={template}
            isInteractive={isInteractive}
          />
        </div>
      </div>
    </div>
  );
}
