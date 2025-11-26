import { useParams } from "@tanstack/react-router";
import { ChevronDown, Plus, Upload } from "lucide-react";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useResume, useUpdateResume } from "@/hooks/api";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore, selectIsDemo } from "@/stores/auth-store";
import type {
  Certification,
  Education,
  Experience,
  Link,
  ResumeContent,
} from "@/lib/api/types";
import type { CreateCertificationFormData } from "@/lib/validations/certification";
import type { CreateEducationFormData } from "@/lib/validations/education";
import type { CreateExperienceFormData } from "@/lib/validations/experience";
import type { CreateLinkFormData, LinkFormData } from "@/lib/validations/links";
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
    <Collapsible
      open={isOpen}
      onOpenChange={() => onToggle(id)}
      className="border-b border-border"
    >
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
            {description && (
              <p className="text-[10px] text-muted-foreground">{description}</p>
            )}
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

export function ResumeBuilder() {
  const { id } = useParams({ strict: false });
  const resumeId = id || "";
  const { data: resume } = useResume(resumeId);
  const { mutate: updateResume } = useUpdateResume();
  const { toast } = useToast();
  const isDemo = useAuthStore(selectIsDemo);

  // Accordion state - only one section open at a time
  const [openSection, setOpenSection] = useState<string>("personal");

  const handleToggleSection = (sectionId: string) => {
    setOpenSection((current) => (current === sectionId ? "" : sectionId));
  };

  // Inline editing states - track which item is being edited or if adding new
  const [experienceEditingId, setExperienceEditingId] = useState<string | null>(null);
  const [experienceAddingNew, setExperienceAddingNew] = useState(false);

  const [educationEditingId, setEducationEditingId] = useState<string | null>(null);
  const [educationAddingNew, setEducationAddingNew] = useState(false);

  const [certificationEditingId, setCertificationEditingId] = useState<string | null>(null);
  const [certificationAddingNew, setCertificationAddingNew] = useState(false);

  const [linkEditingId, setLinkEditingId] = useState<string | null>(null);
  const [linkAddingNew, setLinkAddingNew] = useState(false);

  if (!resume) {
    return null;
  }

  const content = resume.content || {
    personalInfo: {
      name: "",
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

  // Experience handlers
  const handleAddExperience = () => {
    setExperienceEditingId(null);
    setExperienceAddingNew(true);
  };

  const handleEditExperience = (id: string) => {
    setExperienceAddingNew(false);
    setExperienceEditingId(id);
  };

  const handleCancelExperienceEdit = () => {
    setExperienceEditingId(null);
    setExperienceAddingNew(false);
  };

  const handleSaveExperience = (data: CreateExperienceFormData) => {
    const experiences = content.experience || [];
    let updatedExperiences: Experience[];

    if (experienceEditingId) {
      // Update existing
      updatedExperiences = experiences.map((exp) =>
        exp.id === experienceEditingId ? { ...exp, ...data } : exp,
      );
    } else {
      // Add new
      const newExperience: Experience = {
        id: crypto.randomUUID(),
        ...data,
      } as Experience;
      updatedExperiences = [...experiences, newExperience];
    }

    updateResume(
      {
        id: resumeId,
        data: { content: { experience: updatedExperiences } },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: experienceEditingId
              ? "Experience updated"
              : "Experience added",
          });
          handleCancelExperienceEdit();
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

  const handleDeleteExperience = (id: string) => {
    const experiences = content.experience || [];
    const updatedExperiences = experiences.filter((exp) => exp.id !== id);

    updateResume(
      {
        id: resumeId,
        data: { content: { experience: updatedExperiences } },
      },
      {
        onSuccess: () => {
          toast({ title: "Success", description: "Experience deleted" });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to delete: ${error.message}`,
            variant: "destructive",
          });
        },
      },
    );
  };

  const handleReorderExperiences = (reorderedExperiences: Experience[]) => {
    updateResume(
      {
        id: resumeId,
        data: { content: { experience: reorderedExperiences } },
      },
      {
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to reorder: ${error.message}`,
            variant: "destructive",
          });
        },
      },
    );
  };

  // Education handlers
  const handleAddEducation = () => {
    setEducationEditingId(null);
    setEducationAddingNew(true);
  };

  const handleEditEducation = (id: string) => {
    setEducationAddingNew(false);
    setEducationEditingId(id);
  };

  const handleCancelEducationEdit = () => {
    setEducationEditingId(null);
    setEducationAddingNew(false);
  };

  const handleSaveEducation = (data: CreateEducationFormData) => {
    const educations = content.education || [];
    let updatedEducations: Education[];

    if (educationEditingId) {
      updatedEducations = educations.map((edu) =>
        edu.id === educationEditingId ? { ...edu, ...data } : edu,
      );
    } else {
      const newEducation: Education = {
        id: crypto.randomUUID(),
        ...data,
      } as Education;
      updatedEducations = [...educations, newEducation];
    }

    updateResume(
      {
        id: resumeId,
        data: { content: { education: updatedEducations } },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: educationEditingId ? "Education updated" : "Education added",
          });
          handleCancelEducationEdit();
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

  const handleDeleteEducation = (id: string) => {
    const educations = content.education || [];
    const updatedEducations = educations.filter((edu) => edu.id !== id);

    updateResume(
      {
        id: resumeId,
        data: { content: { education: updatedEducations } },
      },
      {
        onSuccess: () => {
          toast({ title: "Success", description: "Education deleted" });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to delete: ${error.message}`,
            variant: "destructive",
          });
        },
      },
    );
  };

  const handleReorderEducation = (reorderedEducation: Education[]) => {
    updateResume(
      {
        id: resumeId,
        data: { content: { education: reorderedEducation } },
      },
      {
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to reorder: ${error.message}`,
            variant: "destructive",
          });
        },
      },
    );
  };

  // Certification handlers
  const handleAddCertification = () => {
    setCertificationEditingId(null);
    setCertificationAddingNew(true);
  };

  const handleEditCertification = (id: string) => {
    setCertificationAddingNew(false);
    setCertificationEditingId(id);
  };

  const handleCancelCertificationEdit = () => {
    setCertificationEditingId(null);
    setCertificationAddingNew(false);
  };

  const handleSaveCertification = (data: CreateCertificationFormData) => {
    const certifications = content.certifications || [];
    let updatedCertifications: Certification[];

    if (certificationEditingId) {
      updatedCertifications = certifications.map((cert) =>
        cert.id === certificationEditingId ? { ...cert, ...data } : cert,
      );
    } else {
      const newCertification: Certification = {
        id: crypto.randomUUID(),
        ...data,
      } as Certification;
      updatedCertifications = [...certifications, newCertification];
    }

    updateResume(
      {
        id: resumeId,
        data: { content: { certifications: updatedCertifications } },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: certificationEditingId
              ? "Certification updated"
              : "Certification added",
          });
          handleCancelCertificationEdit();
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

  const handleDeleteCertification = (id: string) => {
    const certifications = content.certifications || [];
    const updatedCertifications = certifications.filter((cert) => cert.id !== id);

    updateResume(
      {
        id: resumeId,
        data: { content: { certifications: updatedCertifications } },
      },
      {
        onSuccess: () => {
          toast({ title: "Success", description: "Certification deleted" });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to delete: ${error.message}`,
            variant: "destructive",
          });
        },
      },
    );
  };

  const handleReorderCertifications = (reorderedCertifications: Certification[]) => {
    updateResume(
      {
        id: resumeId,
        data: { content: { certifications: reorderedCertifications } },
      },
      {
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to reorder: ${error.message}`,
            variant: "destructive",
          });
        },
      },
    );
  };

  // Link handlers
  const handleAddLink = () => {
    setLinkEditingId(null);
    setLinkAddingNew(true);
  };

  const handleEditLink = (id: string) => {
    setLinkAddingNew(false);
    setLinkEditingId(id);
  };

  const handleCancelLinkEdit = () => {
    setLinkEditingId(null);
    setLinkAddingNew(false);
  };

  const handleSaveLink = (data: CreateLinkFormData) => {
    const links = content.links || [];
    let updatedLinks: Link[];

    if (linkEditingId) {
      updatedLinks = links.map((link) =>
        link.id === linkEditingId ? { ...link, ...data } : link,
      );
    } else {
      const newLink: Link = {
        id: crypto.randomUUID(),
        ...data,
      } as Link;
      updatedLinks = [...links, newLink];
    }

    updateResume(
      {
        id: resumeId,
        data: { content: { links: updatedLinks } },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: linkEditingId ? "Link updated" : "Link added",
          });
          handleCancelLinkEdit();
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

  const handleDeleteLink = (id: string) => {
    const links = content.links || [];
    const updatedLinks = links.filter((link) => link.id !== id);

    updateResume(
      {
        id: resumeId,
        data: { content: { links: updatedLinks } },
      },
      {
        onSuccess: () => {
          toast({ title: "Success", description: "Link deleted" });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to delete: ${error.message}`,
            variant: "destructive",
          });
        },
      },
    );
  };

  const handleReorderLinks = (reorderedLinks: Link[]) => {
    updateResume(
      {
        id: resumeId,
        data: { content: { links: reorderedLinks } },
      },
      {
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to reorder: ${error.message}`,
            variant: "destructive",
          });
        },
      },
    );
  };

  // Import handler
  const handleImportSuccess = (importedData: Partial<ResumeContent>) => {
    const mergedContent: Partial<ResumeContent> = {
      personalInfo: {
        ...content.personalInfo,
        ...importedData.personalInfo,
      },
      experience: [
        ...(content.experience || []),
        ...(importedData.experience || []),
      ],
      education: [
        ...(content.education || []),
        ...(importedData.education || []),
      ],
      skills: {
        technical: [
          ...(content.skills?.technical || []),
          ...(importedData.skills?.technical || []),
        ],
        languages: [
          ...(content.skills?.languages || []),
          ...(importedData.skills?.languages || []),
        ],
        tools: [
          ...(content.skills?.tools || []),
          ...(importedData.skills?.tools || []),
        ],
        soft: [
          ...(content.skills?.soft || []),
          ...(importedData.skills?.soft || []),
        ],
      },
      certifications: [
        ...(content.certifications || []),
        ...(importedData.certifications || []),
      ],
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
          <LazyPersonalInfoForm
            resumeId={resumeId}
            defaultValues={content.personalInfo}
          />
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
            onClick={handleAddExperience}
            disabled={experienceAddingNew || experienceEditingId !== null}
          >
            <Plus className="h-3 w-3" />
          </Button>
        }
      >
        <Suspense fallback={<ListSkeleton />}>
          <LazyExperienceList
            experiences={content.experience || []}
            editingId={experienceEditingId}
            isAddingNew={experienceAddingNew}
            onEdit={handleEditExperience}
            onCancelEdit={handleCancelExperienceEdit}
            onSave={handleSaveExperience}
            onDelete={handleDeleteExperience}
            onReorder={handleReorderExperiences}
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
            onClick={handleAddEducation}
            disabled={educationAddingNew || educationEditingId !== null}
          >
            <Plus className="h-3 w-3" />
          </Button>
        }
      >
        <Suspense fallback={<ListSkeleton />}>
          <LazyEducationList
            education={content.education || []}
            editingId={educationEditingId}
            isAddingNew={educationAddingNew}
            onEdit={handleEditEducation}
            onCancelEdit={handleCancelEducationEdit}
            onSave={handleSaveEducation}
            onDelete={handleDeleteEducation}
            onReorder={handleReorderEducation}
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
            className="h-6 w-6 p-0"
            onClick={handleAddCertification}
            disabled={certificationAddingNew || certificationEditingId !== null}
          >
            <Plus className="h-3 w-3" />
          </Button>
        }
      >
        <Suspense fallback={<ListSkeleton />}>
          <LazyCertificationList
            certifications={content.certifications || []}
            editingId={certificationEditingId}
            isAddingNew={certificationAddingNew}
            onEdit={handleEditCertification}
            onCancelEdit={handleCancelCertificationEdit}
            onSave={handleSaveCertification}
            onDelete={handleDeleteCertification}
            onReorder={handleReorderCertifications}
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
            onClick={handleAddLink}
            disabled={linkAddingNew || linkEditingId !== null}
          >
            <Plus className="h-3 w-3" />
          </Button>
        }
      >
        <Suspense fallback={<ListSkeleton />}>
          <LazyLinkList
            links={content.links || []}
            editingId={linkEditingId}
            isAddingNew={linkAddingNew}
            onEdit={handleEditLink}
            onCancelEdit={handleCancelLinkEdit}
            onSave={handleSaveLink}
            onDelete={handleDeleteLink}
            onReorder={handleReorderLinks}
          />
        </Suspense>
      </CollapsibleSection>
    </div>
  );
}
