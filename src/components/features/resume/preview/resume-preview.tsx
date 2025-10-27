import { lazy, Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import type { Resume } from "@/lib/api/types"
import type { TemplateType } from "@/lib/types/templates"

// Lazy load templates for better code splitting
const ModernTemplate = lazy(() =>
  import("./templates/modern-template").then((m) => ({ default: m.ModernTemplate })),
)
const ClassicTemplate = lazy(() =>
  import("./templates/classic-template").then((m) => ({ default: m.ClassicTemplate })),
)
const MinimalTemplate = lazy(() =>
  import("./templates/minimal-template").then((m) => ({ default: m.MinimalTemplate })),
)

interface ResumePreviewProps {
  resume: Resume
  template: TemplateType
}

// Template loading skeleton
function TemplateLoadingSkeleton() {
  return (
    <div className="w-full max-w-[21cm] mx-auto bg-white p-16 space-y-8 shadow-lg">
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
  )
}

export function ResumePreview({ resume, template }: ResumePreviewProps) {
  const renderTemplate = () => {
    switch (template) {
      case "modern":
        return <ModernTemplate resume={resume} />
      case "classic":
        return <ClassicTemplate resume={resume} />
      case "minimal":
        return <MinimalTemplate resume={resume} />
      default:
        return <ModernTemplate resume={resume} />
    }
  }

  return (
    <div className="w-full h-full overflow-auto bg-gray-100 p-8">
      <div className="print:p-0 print:bg-white">
        <Suspense fallback={<TemplateLoadingSkeleton />}>{renderTemplate()}</Suspense>
      </div>
    </div>
  )
}
