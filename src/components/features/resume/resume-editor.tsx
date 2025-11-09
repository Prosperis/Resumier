import { Eye, FileEdit } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Resume } from "@/lib/api/types";
import { useResumeStore } from "@/stores/resume-store";
import { ExportMenu } from "./export/export-menu";
import { ResumePreview } from "./preview/resume-preview";
import { TemplateSelector } from "./preview/template-selector";
import { ResumeBuilder } from "./resume-builder";

interface ResumeEditorProps {
  resume: Resume;
}

export function ResumeEditor({ resume }: ResumeEditorProps) {
  const template = useResumeStore((state) => state.template);
  const setTemplate = useResumeStore((state) => state.setTemplate);

  return (
    <Tabs defaultValue="preview" className="w-full">
      <div className="mb-6 flex items-center justify-between gap-4">
        <TabsList>
          <TabsTrigger value="edit" className="gap-2">
            <FileEdit className="h-4 w-4" />
            Edit
          </TabsTrigger>
          <TabsTrigger value="preview" className="gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-2">
          <TemplateSelector selected={template} onSelect={setTemplate} />
          <ExportMenu resume={resume} />
        </div>
      </div>

      <TabsContent value="edit" className="mt-0">
        <ResumeBuilder />
      </TabsContent>

      <TabsContent value="preview" className="mt-0">
        <div className="min-h-[600px] rounded-lg bg-gray-100 p-8">
          <ResumePreview resume={resume} template={template} />
        </div>
      </TabsContent>
    </Tabs>
  );
}
