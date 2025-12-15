import { useParams } from "@tanstack/react-router";
import { ChevronDown, Plus, Upload } from "lucide-react";
import { Suspense, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useResume, useUpdateResume } from "@/hooks/api";
import { useEntityListHandlers } from "@/hooks/use-entity-list-handlers";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore, selectIsDemo } from "@/stores/auth-store";
import {
  useUIStore,
  selectResumeBuilderSection,
  selectToggleResumeBuilderSection,
} from "@/stores/ui-store";
import type { ResumeContent } from "@/lib/api/types";
import { cn } from "@/lib/utils";
import { ImportDialog } from "./import/import-dialog";
import {
  FormSkeleton,
  LazyCertificationList,
  LazyEducationList,
  LazyExperienceList,
  LazyLinkList,
  LazyPersonalInfoForm,
  LazySkillsForm,
  ListSkeleton,
} from "./lazy";

// Collapsible Section Component
interface CollapsibleSectionProps {
  id: string;
  title: string;
  description?: string;
  isOpen: boolean;
  onToggle: (id: string) => void;
  action?: React.ReactNode;
  children: React.ReactNode;
}

function CollapsibleSection({
  id,
  title,
  description,
  isOpen,
  onToggle,
  action,
  children,
}: CollapsibleSectionProps) {
  return (
    <Collapsible open={isOpen} onOpenChange={() => onToggle(id)} className="border-b border-border">
      <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-2.5 hover:bg-muted/50 transition-colors">
        <div className="flex items-center gap-2">
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
              !isOpen && "-rotate-90",
            )}
          />
          <div className="text-left">
            <h3 className="text-xs font-semibold">{title}</h3>
            {description && <p className="text-[10px] text-muted-foreground">{description}</p>}
          </div>
        </div>
        {action && <div onClick={(e) => e.stopPropagation()}>{action}</div>}
      </CollapsibleTrigger>
      <CollapsibleContent className="px-3 pb-3 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

// Default empty content structure
const DEFAULT_CONTENT: ResumeContent = {
  personalInfo: {
    firstName: "",
    lastName: "",
    nameOrder: "firstLast",
    email: "",
    phone: "",
    location: "",
    summary: "",
  },
  experience: [],
  education: [],
  skills: { technical: [], languages: [], tools: [], soft: [] },
  certifications: [],
  links: [],
};

export function ResumeBuilder() {
  const { id } = useParams({ strict: false });
  const resumeId = id || "";
  const { data: resume } = useResume(resumeId);
  const { mutate: updateResume } = useUpdateResume();
  const { toast } = useToast();
  const isDemo = useAuthStore(selectIsDemo);

  // Accordion state - persisted in store so it survives page refresh
  const openSection = useUIStore(selectResumeBuilderSection);
  const toggleSection = useUIStore(selectToggleResumeBuilderSection);

  const handleToggleSection = (sectionId: string) => {
    toggleSection(sectionId as Parameters<typeof toggleSection>[0]);
  };

  // Get content with fallback
  const content = resume?.content || DEFAULT_CONTENT;

  // Memoize getCurrentItems callbacks to prevent unnecessary re-renders
  const getExperiences = useMemo(() => () => content.experience || [], [content.experience]);
  const getEducation = useMemo(() => () => content.education || [], [content.education]);
  const getCertifications = useMemo(
    () => () => content.certifications || [],
    [content.certifications],
  );
  const getLinks = useMemo(() => () => content.links || [], [content.links]);

  // Entity handlers using the custom hook
  const experienceHandlers = useEntityListHandlers({
    resumeId,
    entityKey: "experience",
    getCurrentItems: getExperiences,
    entityLabel: "Experience",
  });

  const educationHandlers = useEntityListHandlers({
    resumeId,
    entityKey: "education",
    getCurrentItems: getEducation,
    entityLabel: "Education",
  });

  const certificationHandlers = useEntityListHandlers({
    resumeId,
    entityKey: "certifications",
    getCurrentItems: getCertifications,
    entityLabel: "Certification",
  });

  const linkHandlers = useEntityListHandlers({
    resumeId,
    entityKey: "links",
    getCurrentItems: getLinks,
    entityLabel: "Link",
  });

  // Import handler
  const handleImportSuccess = (importedData: Partial<ResumeContent>) => {
    const mergedContent: Partial<ResumeContent> = {
      personalInfo: {
        ...content.personalInfo,
        ...importedData.personalInfo,
      },
      experience: [...(content.experience || []), ...(importedData.experience || [])],
      education: [...(content.education || []), ...(importedData.education || [])],
      skills: {
        technical: [
          ...(content.skills?.technical || []),
          ...(importedData.skills?.technical || []),
        ],
        languages: [
          ...(content.skills?.languages || []),
          ...(importedData.skills?.languages || []),
        ],
        tools: [...(content.skills?.tools || []), ...(importedData.skills?.tools || [])],
        soft: [...(content.skills?.soft || []), ...(importedData.skills?.soft || [])],
      },
      certifications: [...(content.certifications || []), ...(importedData.certifications || [])],
      links: [...(content.links || []), ...(importedData.links || [])],
    };

    updateResume(
      {
        id: resumeId,
        data: { content: mergedContent },
      },
      {
        onSuccess: () => {
          toast({
            title: "Import Successful",
            description: "Resume data has been imported and merged",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to save: ${error.message}`,
            variant: "destructive",
          });
        },
      },
    );
  };

  if (!resume) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Import Resume Section - Hidden in demo mode */}
      {!isDemo && (
        <div className="border-b border-border bg-blue-50/50 dark:bg-blue-950/20 px-3 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Upload className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              <div>
                <h3 className="text-xs font-semibold">Quick Start</h3>
                <p className="text-[10px] text-muted-foreground">
                  Import from LinkedIn, JSON, or other sources
                </p>
              </div>
            </div>
            <ImportDialog
              trigger={
                <Button variant="default" size="sm" className="h-6 text-[10px] px-2">
                  <Upload className="mr-1.5 h-2.5 w-2.5" />
                  Import
                </Button>
              }
              onImportSuccess={handleImportSuccess}
            />
          </div>
        </div>
      )}

      {/* Personal Information Section */}
      <CollapsibleSection
        id="personal"
        title="Personal Information"
        description="Basic contact info and summary"
        isOpen={openSection === "personal"}
        onToggle={handleToggleSection}
      >
        <Suspense fallback={<FormSkeleton />}>
          <LazyPersonalInfoForm resumeId={resumeId} defaultValues={content.personalInfo} />
        </Suspense>
      </CollapsibleSection>

      {/* Experience Section */}
      <CollapsibleSection
        id="experience"
        title="Work Experience"
        description="Professional experience and accomplishments"
        isOpen={openSection === "experience"}
        onToggle={handleToggleSection}
        action={
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={experienceHandlers.handleAdd}
            disabled={experienceHandlers.isEditing}
          >
            <Plus className="h-3 w-3" />
          </Button>
        }
      >
        <Suspense fallback={<ListSkeleton />}>
          <LazyExperienceList
            resumeId={resumeId}
            experiences={content.experience || []}
            editingId={experienceHandlers.editingId}
            isAddingNew={experienceHandlers.isAddingNew}
            onEdit={experienceHandlers.handleEdit}
            onClose={experienceHandlers.handleCancel}
            onDelete={experienceHandlers.handleDelete}
            onReorder={experienceHandlers.handleReorder}
          />
        </Suspense>
      </CollapsibleSection>

      {/* Education Section */}
      <CollapsibleSection
        id="education"
        title="Education"
        description="Educational background and achievements"
        isOpen={openSection === "education"}
        onToggle={handleToggleSection}
        action={
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={educationHandlers.handleAdd}
            disabled={educationHandlers.isEditing}
          >
            <Plus className="h-3 w-3" />
          </Button>
        }
      >
        <Suspense fallback={<ListSkeleton />}>
          <LazyEducationList
            resumeId={resumeId}
            education={content.education || []}
            editingId={educationHandlers.editingId}
            isAddingNew={educationHandlers.isAddingNew}
            onEdit={educationHandlers.handleEdit}
            onClose={educationHandlers.handleCancel}
            onDelete={educationHandlers.handleDelete}
            onReorder={educationHandlers.handleReorder}
          />
        </Suspense>
      </CollapsibleSection>

      {/* Skills Section */}
      <CollapsibleSection
        id="skills"
        title="Skills"
        description="Technical skills, languages, tools, and soft skills"
        isOpen={openSection === "skills"}
        onToggle={handleToggleSection}
      >
        <Suspense fallback={<FormSkeleton />}>
          <LazySkillsForm resumeId={resumeId} skills={content.skills} />
        </Suspense>
      </CollapsibleSection>

      {/* Certifications Section */}
      <CollapsibleSection
        id="certifications"
        title="Certifications"
        description="Professional certifications and credentials"
        isOpen={openSection === "certifications"}
        onToggle={handleToggleSection}
        action={
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-3 p-0"
            onClick={certificationHandlers.handleAdd}
            disabled={certificationHandlers.isEditing}
          >
            <Plus className="h-3 w-3" />
          </Button>
        }
      >
        <Suspense fallback={<ListSkeleton />}>
          <LazyCertificationList
            resumeId={resumeId}
            certifications={content.certifications || []}
            editingId={certificationHandlers.editingId}
            isAddingNew={certificationHandlers.isAddingNew}
            onEdit={certificationHandlers.handleEdit}
            onClose={certificationHandlers.handleCancel}
            onDelete={certificationHandlers.handleDelete}
            onReorder={certificationHandlers.handleReorder}
          />
        </Suspense>
      </CollapsibleSection>

      {/* Links Section */}
      <CollapsibleSection
        id="links"
        title="Links"
        description="Portfolio, LinkedIn, GitHub, and other links"
        isOpen={openSection === "links"}
        onToggle={handleToggleSection}
        action={
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={linkHandlers.handleAdd}
            disabled={linkHandlers.isEditing}
          >
            <Plus className="h-3 w-3" />
          </Button>
        }
      >
        <Suspense fallback={<ListSkeleton />}>
          <LazyLinkList
            resumeId={resumeId}
            links={content.links || []}
            editingId={linkHandlers.editingId}
            isAddingNew={linkHandlers.isAddingNew}
            onEdit={linkHandlers.handleEdit}
            onClose={linkHandlers.handleCancel}
            onDelete={linkHandlers.handleDelete}
            onReorder={linkHandlers.handleReorder}
          />
        </Suspense>
      </CollapsibleSection>
    </div>
  );
}
