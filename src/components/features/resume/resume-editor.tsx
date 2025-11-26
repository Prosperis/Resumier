import { useEffect } from "react";
import type { Resume } from "@/lib/api/types";
import { useResumeStore } from "@/stores/resume-store";
import { useUIStore, selectSetCurrentResume } from "@/stores/ui-store";
import { ResumePreview } from "./preview/resume-preview";
import { ResumeBuilder } from "./resume-builder";

interface ResumeEditorProps {
  resume: Resume;
}

export function ResumeEditor({ resume }: ResumeEditorProps) {
  const template = useResumeStore((state) => state.template);
  const setCurrentResume = useUIStore(selectSetCurrentResume);

  // Set/clear the current resume for navbar actions
  useEffect(() => {
    setCurrentResume(resume);
    return () => setCurrentResume(null);
  }, [resume, setCurrentResume]);

  return (
    <div className="flex h-full flex-col">
      {/* Content Area - strict 1/3 + 2/3 split */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left Panel: Edit Form - exactly 1/3 width */}
        <div className="w-1/3 flex flex-col border-r border-border bg-background">
          {/* Scrollable Edit Content - hidden scrollbar */}
          <div className="flex-1 overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]">
            <ResumeBuilder />
          </div>
        </div>

        {/* Right Panel: Live Preview - exactly 2/3 width */}
        <div className="w-2/3 flex items-start justify-center bg-slate-200 dark:bg-slate-800 overflow-hidden p-8">
          {/* Static document canvas - no scrolling */}
          <ResumePreview resume={resume} template={template} />
        </div>
      </div>
    </div>
  );
}
