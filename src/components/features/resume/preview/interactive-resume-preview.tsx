/**
 * Interactive Resume Preview
 * A resume preview that allows direct interaction and editing on the document
 */

import { useCallback } from "react";
import type { Resume } from "@/lib/api/types";
import type { TemplateType } from "@/lib/types/templates";
import { useUpdateResume } from "@/hooks/api";
import { useToast } from "@/hooks/use-toast";
import {
  InteractiveResumeProvider,
  SectionEditorController,
} from "./interactive";
import { InteractiveModernTemplate } from "./templates/interactive-modern-template";
import { ResumePreview } from "./resume-preview";
import type {
  PersonalInfo,
  Experience,
  Education,
  Skills,
  Certification,
  Link,
} from "@/lib/api/types";

interface InteractiveResumePreviewProps {
  resume: Resume;
  template: TemplateType;
  isInteractive?: boolean;
}

export function InteractiveResumePreview({
  resume,
  template,
  isInteractive = true,
}: InteractiveResumePreviewProps) {
  const { mutate: updateResume } = useUpdateResume();
  const { toast } = useToast();

  // Helper to save resume content
  const saveContent = useCallback(
    (updates: Partial<typeof resume.content>) => {
      updateResume(
        {
          id: resume.id,
          data: {
            content: {
              ...resume.content,
              ...updates,
            },
          },
        },
        {
          onError: (error) => {
            toast({
              title: "Error",
              description: `Failed to save: ${error.message}`,
              variant: "destructive",
            });
          },
        },
      );
    },
    [resume.id, resume.content, updateResume, toast],
  );

  // Update handlers for each section type
  const handleUpdatePersonalInfo = useCallback(
    (data: Partial<PersonalInfo>) => {
      saveContent({
        personalInfo: {
          ...resume.content.personalInfo,
          ...data,
        },
      });
    },
    [resume.content.personalInfo, saveContent],
  );

  const handleUpdateExperience = useCallback(
    (id: string, data: Partial<Experience>) => {
      const updatedExperiences = resume.content.experience.map((exp) =>
        exp.id === id ? { ...exp, ...data } : exp,
      );
      saveContent({ experience: updatedExperiences });
    },
    [resume.content.experience, saveContent],
  );

  const handleAddExperience = useCallback(() => {
    const newExperience: Experience = {
      id: crypto.randomUUID(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      highlights: [],
    };
    saveContent({
      experience: [...resume.content.experience, newExperience],
    });
  }, [resume.content.experience, saveContent]);

  const handleDeleteExperience = useCallback(
    (id: string) => {
      const updatedExperiences = resume.content.experience.filter(
        (exp) => exp.id !== id,
      );
      saveContent({ experience: updatedExperiences });
    },
    [resume.content.experience, saveContent],
  );

  const handleReorderExperience = useCallback(
    (fromIndex: number, toIndex: number) => {
      const experiences = [...resume.content.experience];
      const [removed] = experiences.splice(fromIndex, 1);
      experiences.splice(toIndex, 0, removed);
      saveContent({ experience: experiences });
    },
    [resume.content.experience, saveContent],
  );

  const handleUpdateEducation = useCallback(
    (id: string, data: Partial<Education>) => {
      const updatedEducation = resume.content.education.map((edu) =>
        edu.id === id ? { ...edu, ...data } : edu,
      );
      saveContent({ education: updatedEducation });
    },
    [resume.content.education, saveContent],
  );

  const handleAddEducation = useCallback(() => {
    const newEducation: Education = {
      id: crypto.randomUUID(),
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      current: false,
      gpa: "",
      honors: [],
    };
    saveContent({
      education: [...resume.content.education, newEducation],
    });
  }, [resume.content.education, saveContent]);

  const handleDeleteEducation = useCallback(
    (id: string) => {
      const updatedEducation = resume.content.education.filter(
        (edu) => edu.id !== id,
      );
      saveContent({ education: updatedEducation });
    },
    [resume.content.education, saveContent],
  );

  const handleReorderEducation = useCallback(
    (fromIndex: number, toIndex: number) => {
      const education = [...resume.content.education];
      const [removed] = education.splice(fromIndex, 1);
      education.splice(toIndex, 0, removed);
      saveContent({ education });
    },
    [resume.content.education, saveContent],
  );

  const handleUpdateSkills = useCallback(
    (data: Partial<Skills>) => {
      saveContent({
        skills: {
          ...resume.content.skills,
          ...data,
        },
      });
    },
    [resume.content.skills, saveContent],
  );

  const handleUpdateCertification = useCallback(
    (id: string, data: Partial<Certification>) => {
      const updatedCertifications = resume.content.certifications.map((cert) =>
        cert.id === id ? { ...cert, ...data } : cert,
      );
      saveContent({ certifications: updatedCertifications });
    },
    [resume.content.certifications, saveContent],
  );

  const handleAddCertification = useCallback(() => {
    const newCertification: Certification = {
      id: crypto.randomUUID(),
      name: "",
      issuer: "",
      date: "",
    };
    saveContent({
      certifications: [...resume.content.certifications, newCertification],
    });
  }, [resume.content.certifications, saveContent]);

  const handleDeleteCertification = useCallback(
    (id: string) => {
      const updatedCertifications = resume.content.certifications.filter(
        (cert) => cert.id !== id,
      );
      saveContent({ certifications: updatedCertifications });
    },
    [resume.content.certifications, saveContent],
  );

  const handleReorderCertifications = useCallback(
    (fromIndex: number, toIndex: number) => {
      const certifications = [...resume.content.certifications];
      const [removed] = certifications.splice(fromIndex, 1);
      certifications.splice(toIndex, 0, removed);
      saveContent({ certifications });
    },
    [resume.content.certifications, saveContent],
  );

  const handleUpdateLink = useCallback(
    (id: string, data: Partial<Link>) => {
      const updatedLinks = resume.content.links.map((link) =>
        link.id === id ? { ...link, ...data } : link,
      );
      saveContent({ links: updatedLinks });
    },
    [resume.content.links, saveContent],
  );

  const handleAddLink = useCallback(() => {
    const newLink: Link = {
      id: crypto.randomUUID(),
      label: "",
      url: "",
      type: "website",
    };
    saveContent({
      links: [...resume.content.links, newLink],
    });
  }, [resume.content.links, saveContent]);

  const handleDeleteLink = useCallback(
    (id: string) => {
      const updatedLinks = resume.content.links.filter(
        (link) => link.id !== id,
      );
      saveContent({ links: updatedLinks });
    },
    [resume.content.links, saveContent],
  );

  const handleReorderLinks = useCallback(
    (fromIndex: number, toIndex: number) => {
      const links = [...resume.content.links];
      const [removed] = links.splice(fromIndex, 1);
      links.splice(toIndex, 0, removed);
      saveContent({ links });
    },
    [resume.content.links, saveContent],
  );

  // If not interactive, just render the regular preview
  if (!isInteractive) {
    return <ResumePreview resume={resume} template={template} />;
  }

  // For now, only the modern template has interactive support
  // Other templates will fall back to non-interactive preview
  const hasInteractiveSupport = template === "modern";

  if (!hasInteractiveSupport) {
    return <ResumePreview resume={resume} template={template} />;
  }

  return (
    <InteractiveResumeProvider
      resume={resume}
      isInteractive={isInteractive}
      onUpdatePersonalInfo={handleUpdatePersonalInfo}
      onUpdateExperience={handleUpdateExperience}
      onAddExperience={handleAddExperience}
      onDeleteExperience={handleDeleteExperience}
      onReorderExperience={handleReorderExperience}
      onUpdateEducation={handleUpdateEducation}
      onAddEducation={handleAddEducation}
      onDeleteEducation={handleDeleteEducation}
      onReorderEducation={handleReorderEducation}
      onUpdateSkills={handleUpdateSkills}
      onUpdateCertification={handleUpdateCertification}
      onAddCertification={handleAddCertification}
      onDeleteCertification={handleDeleteCertification}
      onReorderCertifications={handleReorderCertifications}
      onUpdateLink={handleUpdateLink}
      onAddLink={handleAddLink}
      onDeleteLink={handleDeleteLink}
      onReorderLinks={handleReorderLinks}
    >
      <div className="relative">
        <InteractiveModernTemplate resume={resume} />
        <SectionEditorController />
      </div>
    </InteractiveResumeProvider>
  );
}
