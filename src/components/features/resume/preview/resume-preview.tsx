import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Resume } from "@/lib/api/types";
import type { TemplateType } from "@/lib/types/templates";
import {
  getTemplateComponent,
  getTemplateInfo,
} from "./templates/template-registry";

interface ResumePreviewProps {
  resume: Resume;
  template: TemplateType;
}

// Template loading skeleton
function TemplateLoadingSkeleton() {
  return (
    <div
      className="mx-auto w-full max-w-[21cm] space-y-8 bg-white p-16 shadow-lg"
      style={{ colorScheme: "light" }}
    >
      <div className="space-y-4">
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <Skeleton className="h-24 w-full" />
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}

export function ResumePreview({ resume, template }: ResumePreviewProps) {
  // Get the template component and metadata from the registry
  const TemplateComponent = getTemplateComponent(template);
  const templateInfo = getTemplateInfo(template);

  // Create config from template info
  const config = {
    colorScheme: templateInfo?.colorScheme,
    typography: templateInfo?.typography,
    spacing: templateInfo?.spacing,
  };

  return (
    <div className="mx-auto w-full max-w-[21cm] bg-white shadow-xl">
      {/* Remove dark mode context for resume display */}
      <div className="resume-light-mode light print:bg-white print:p-0">
        <Suspense fallback={<TemplateLoadingSkeleton />}>
          <TemplateComponent resume={resume} config={config} />
        </Suspense>
      </div>
    </div>
  );
}
