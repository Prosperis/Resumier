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
import type {
  CertificationFormData,
  CreateCertificationFormData,
} from "@/lib/validations/certification";
import type {
  CreateEducationFormData,
  EducationFormData,
} from "@/lib/validations/education";
import type {
  CreateExperienceFormData,
  ExperienceFormData,
} from "@/lib/validations/experience";
import type { CreateLinkFormData, LinkFormData } from "@/lib/validations/links";
import { cn } from "@/lib/utils";
import { ImportDialog } from "./import/import-dialog";
import {
  FormDialogSkeleton,
  FormSkeleton,
  LazyCertificationFormDialog,
  LazyCertificationList,
  LazyEducationFormDialog,
  LazyEducationList,
  LazyExperienceFormDialog,
  LazyExperienceList,
  LazyLinkFormDialog,
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

  // Dialog states
  const [experienceDialogOpen, setExperienceDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] =
    useState<ExperienceFormData | null>(null);

  const [educationDialogOpen, setEducationDialogOpen] = useState(false);
  const [editingEducation, setEditingEducation] =
    useState<EducationFormData | null>(null);

  const [certificationDialogOpen, setCertificationDialogOpen] = useState(false);
  const [editingCertification, setEditingCertification] =
    useState<CertificationFormData | null>(null);

  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkFormData | null>(null);

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
    setEditingExperience(null);
    setExperienceDialogOpen(true);
  };

  const handleEditExperience = (experience: ExperienceFormData) => {
    setEditingExperience(experience);
    setExperienceDialogOpen(true);
  };

  const handleSaveExperience = (
    data: CreateExperienceFormData | ExperienceFormData,
  ) => {
    const experiences = content.experience || [];
    let updatedExperiences: Experience[];

    if (editingExperience) {
      // Update existing
      updatedExperiences = experiences.map((exp) =>
        exp.id === editingExperience.id ? { ...exp, ...data } : exp,
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
        data: {
          content: {
            experience: updatedExperiences,
          },
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: editingExperience
              ? "Experience updated successfully"
              : "Experience added successfully",
          });
          setExperienceDialogOpen(false);
          setEditingExperience(null);
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to save experience: ${error.message}`,
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
        data: {
          content: {
            experience: updatedExperiences,
          },
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Experience deleted successfully",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to delete experience: ${error.message}`,
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
        data: {
          content: {
            experience: reorderedExperiences,
          },
        },
      },
      {
        onSuccess: () => {
          // Silent success - no toast for reordering
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to reorder experiences: ${error.message}`,
            variant: "destructive",
          });
        },
      },
    );
  };

  // Education handlers
  const handleAddEducation = () => {
    setEditingEducation(null);
    setEducationDialogOpen(true);
  };

  const handleEditEducation = (education: EducationFormData) => {
    setEditingEducation(education);
    setEducationDialogOpen(true);
  };

  const handleSaveEducation = (
    data: CreateEducationFormData | EducationFormData,
  ) => {
    const educations = content.education || [];
    let updatedEducations: Education[];

    if (editingEducation) {
      // Update existing
      updatedEducations = educations.map((edu) =>
        edu.id === editingEducation.id ? { ...edu, ...data } : edu,
      );
    } else {
      // Add new
      const newEducation: Education = {
        id: crypto.randomUUID(),
        ...data,
      } as Education;
      updatedEducations = [...educations, newEducation];
    }

    updateResume(
      {
        id: resumeId,
        data: {
          content: {
            education: updatedEducations,
          },
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: editingEducation
              ? "Education updated successfully"
              : "Education added successfully",
          });
          setEducationDialogOpen(false);
          setEditingEducation(null);
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to save education: ${error.message}`,
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
        data: {
          content: {
            education: updatedEducations,
          },
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Education deleted successfully",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to delete education: ${error.message}`,
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
        data: {
          content: {
            education: reorderedEducation,
          },
        },
      },
      {
        onSuccess: () => {
          // Silent success
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to reorder education: ${error.message}`,
            variant: "destructive",
          });
        },
      },
    );
  };

  // Certification handlers
  const handleAddCertification = () => {
    setEditingCertification(null);
    setCertificationDialogOpen(true);
  };

  const handleEditCertification = (certification: CertificationFormData) => {
    setEditingCertification(certification);
    setCertificationDialogOpen(true);
  };

  const handleSaveCertification = (
    data: CreateCertificationFormData | CertificationFormData,
  ) => {
    const certifications = content.certifications || [];
    let updatedCertifications: Certification[];

    if (editingCertification) {
      // Update existing
      updatedCertifications = certifications.map((cert) =>
        cert.id === editingCertification.id ? { ...cert, ...data } : cert,
      );
    } else {
      // Add new
      const newCertification: Certification = {
        id: crypto.randomUUID(),
        ...data,
      } as Certification;
      updatedCertifications = [...certifications, newCertification];
    }

    updateResume(
      {
        id: resumeId,
        data: {
          content: {
            certifications: updatedCertifications,
          },
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: editingCertification
              ? "Certification updated successfully"
              : "Certification added successfully",
          });
          setCertificationDialogOpen(false);
          setEditingCertification(null);
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to save certification: ${error.message}`,
            variant: "destructive",
          });
        },
      },
    );
  };

  const handleDeleteCertification = (id: string) => {
    const certifications = content.certifications || [];
    const updatedCertifications = certifications.filter(
      (cert) => cert.id !== id,
    );

    updateResume(
      {
        id: resumeId,
        data: {
          content: {
            certifications: updatedCertifications,
          },
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Certification deleted successfully",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to delete certification: ${error.message}`,
            variant: "destructive",
          });
        },
      },
    );
  };

  const handleReorderCertifications = (
    reorderedCertifications: Certification[],
  ) => {
    updateResume(
      {
        id: resumeId,
        data: {
          content: {
            certifications: reorderedCertifications,
          },
        },
      },
      {
        onSuccess: () => {
          // Silent success
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to reorder certifications: ${error.message}`,
            variant: "destructive",
          });
        },
      },
    );
  };

  // Link handlers
  const handleAddLink = () => {
    setEditingLink(null);
    setLinkDialogOpen(true);
  };

  const handleEditLink = (link: LinkFormData) => {
    setEditingLink(link);
    setLinkDialogOpen(true);
  };

  const handleSaveLink = (data: CreateLinkFormData | LinkFormData) => {
    const links = content.links || [];
    let updatedLinks: Link[];

    if (editingLink) {
      // Update existing
      updatedLinks = links.map((link) =>
        link.id === editingLink.id ? { ...link, ...data } : link,
      );
    } else {
      // Add new
      const newLink: Link = {
        id: crypto.randomUUID(),
        ...data,
      } as Link;
      updatedLinks = [...links, newLink];
    }

    updateResume(
      {
        id: resumeId,
        data: {
          content: {
            links: updatedLinks,
          },
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: editingLink
              ? "Link updated successfully"
              : "Link added successfully",
          });
          setLinkDialogOpen(false);
          setEditingLink(null);
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to save link: ${error.message}`,
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
        data: {
          content: {
            links: updatedLinks,
          },
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Link deleted successfully",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to delete link: ${error.message}`,
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
        data: {
          content: {
            links: reorderedLinks,
          },
        },
      },
      {
        onSuccess: () => {
          // Silent success
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to reorder links: ${error.message}`,
            variant: "destructive",
          });
        },
      },
    );
  };

  // Import handler
  const handleImportSuccess = (importedData: Partial<ResumeContent>) => {
    // Merge imported data with existing content
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
        data: {
          content: mergedContent,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Import Successful",
            description:
              "Resume data has been imported and merged successfully",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to save imported data: ${error.message}`,
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
                <Button
                  variant="default"
                  size="sm"
                  className="h-6 text-[10px] px-2"
                >
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
          >
            <Plus className="h-3 w-3" />
          </Button>
        }
      >
        <Suspense fallback={<ListSkeleton />}>
          <LazyExperienceList
            experiences={content.experience || []}
            onEdit={handleEditExperience}
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
          >
            <Plus className="h-3 w-3" />
          </Button>
        }
      >
        <Suspense fallback={<ListSkeleton />}>
          <LazyEducationList
            education={content.education || []}
            onEdit={handleEditEducation}
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
          >
            <Plus className="h-3 w-3" />
          </Button>
        }
      >
        <Suspense fallback={<ListSkeleton />}>
          <LazyCertificationList
            certifications={content.certifications || []}
            onEdit={handleEditCertification}
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
          >
            <Plus className="h-3 w-3" />
          </Button>
        }
      >
        <Suspense fallback={<ListSkeleton />}>
          <LazyLinkList
            links={content.links || []}
            onEdit={handleEditLink}
            onDelete={handleDeleteLink}
            onReorder={handleReorderLinks}
          />
        </Suspense>
      </CollapsibleSection>

      {/* Dialogs */}
      <Suspense fallback={<FormDialogSkeleton />}>
        <LazyExperienceFormDialog
          open={experienceDialogOpen}
          onOpenChange={setExperienceDialogOpen}
          onSubmit={handleSaveExperience}
          defaultValues={editingExperience || undefined}
        />
      </Suspense>

      <Suspense fallback={<FormDialogSkeleton />}>
        <LazyEducationFormDialog
          open={educationDialogOpen}
          onOpenChange={setEducationDialogOpen}
          onSubmit={handleSaveEducation}
          defaultValues={editingEducation || undefined}
        />
      </Suspense>

      <Suspense fallback={<FormDialogSkeleton />}>
        <LazyCertificationFormDialog
          open={certificationDialogOpen}
          onOpenChange={setCertificationDialogOpen}
          onSubmit={handleSaveCertification}
          defaultValues={editingCertification || undefined}
        />
      </Suspense>

      <Suspense fallback={<FormDialogSkeleton />}>
        <LazyLinkFormDialog
          open={linkDialogOpen}
          onOpenChange={setLinkDialogOpen}
          onSubmit={handleSaveLink}
          defaultValues={editingLink || undefined}
        />
      </Suspense>
    </div>
  );
}
