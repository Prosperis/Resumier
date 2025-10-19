import type { Resume } from "@/lib/api/types"
import type { TemplateType } from "@/lib/types/templates"
import { ClassicTemplate, MinimalTemplate, ModernTemplate } from "./templates"

interface ResumePreviewProps {
  resume: Resume
  template: TemplateType
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
      <div className="print:p-0 print:bg-white">{renderTemplate()}</div>
    </div>
  )
}
