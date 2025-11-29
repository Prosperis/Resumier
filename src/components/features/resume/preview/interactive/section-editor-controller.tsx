/**
 * Section Editor Controller
 * Determines which editor to show based on the selected section
 */

import { useCallback, useMemo } from "react";
import { useInteractiveResume } from "./interactive-context";
import { SectionEditorPopover } from "./section-editor-popover";
import {
  PersonalInfoEditor,
  ExperienceEditor,
  EducationEditor,
  SkillsEditor,
  CertificationEditor,
  LinkEditor,
} from "./editors";
import type {
  PersonalInfo,
  Experience,
  Education,
  Skills,
  Certification,
  Link,
} from "@/lib/api/types";

/**
 * SectionEditorController
 * Renders the appropriate editor popover based on the currently selected section
 */
export function SectionEditorController() {
  const {
    selectedSection,
    resume,
    clearSelection,
    selectSection,
    onUpdatePersonalInfo,
    onUpdateExperience,
    onUpdateEducation,
    onUpdateSkills,
    onUpdateCertification,
    onUpdateLink,
  } = useInteractiveResume();

  // Get the data for the selected section
  const sectionData = useMemo(() => {
    if (!selectedSection) return null;

    const { type, itemId } = selectedSection;
    const content = resume.content;

    switch (type) {
      case "personalInfo":
      case "summary":
        return { type, data: content.personalInfo };

      case "experience":
        if (itemId) {
          const exp = content.experience.find((e) => e.id === itemId);
          const index = content.experience.findIndex((e) => e.id === itemId);
          return exp
            ? { type, data: exp, index, total: content.experience.length }
            : null;
        }
        return null;

      case "education":
        if (itemId) {
          const edu = content.education.find((e) => e.id === itemId);
          const index = content.education.findIndex((e) => e.id === itemId);
          return edu
            ? { type, data: edu, index, total: content.education.length }
            : null;
        }
        return null;

      case "skills":
        return { type, data: content.skills };

      case "certifications":
        if (itemId) {
          const cert = content.certifications.find((c) => c.id === itemId);
          const index = content.certifications.findIndex(
            (c) => c.id === itemId,
          );
          return cert
            ? { type, data: cert, index, total: content.certifications.length }
            : null;
        }
        return null;

      case "links":
        if (itemId) {
          const link = content.links.find((l) => l.id === itemId);
          const index = content.links.findIndex((l) => l.id === itemId);
          return link
            ? { type, data: link, index, total: content.links.length }
            : null;
        }
        return null;

      default:
        return null;
    }
  }, [selectedSection, resume]);

  // Navigation for list items
  const navigateToItem = useCallback(
    (direction: "prev" | "next") => {
      if (!selectedSection || !sectionData || sectionData.index === undefined)
        return;

      const { type } = selectedSection;
      const content = resume.content;
      let items: { id: string }[] = [];

      switch (type) {
        case "experience":
          items = content.experience;
          break;
        case "education":
          items = content.education;
          break;
        case "certifications":
          items = content.certifications;
          break;
        case "links":
          items = content.links;
          break;
      }

      const newIndex =
        direction === "prev" ? sectionData.index - 1 : sectionData.index + 1;
      if (newIndex >= 0 && newIndex < items.length) {
        // Navigate to the next/previous item
        selectSection({
          type,
          itemId: items[newIndex].id,
          rect: selectedSection.rect,
        });
      }
    },
    [selectedSection, sectionData, resume],
  );

  // Get title and subtitle for the popover
  const getPopoverInfo = useCallback(() => {
    if (!selectedSection || !sectionData) return { title: "", subtitle: "" };

    const { type } = selectedSection;

    switch (type) {
      case "personalInfo":
        return { title: "Personal Information", subtitle: "" };
      case "summary":
        return { title: "Professional Summary", subtitle: "" };
      case "experience":
        if (sectionData.index !== undefined) {
          const exp = sectionData.data as Experience;
          return {
            title: exp.position || "Experience",
            subtitle: `${sectionData.index + 1} of ${sectionData.total}`,
          };
        }
        return { title: "Experience", subtitle: "" };
      case "education":
        if (sectionData.index !== undefined) {
          const edu = sectionData.data as Education;
          return {
            title: edu.degree || "Education",
            subtitle: `${sectionData.index + 1} of ${sectionData.total}`,
          };
        }
        return { title: "Education", subtitle: "" };
      case "skills":
        return { title: "Skills", subtitle: "" };
      case "certifications":
        if (sectionData.index !== undefined) {
          const cert = sectionData.data as Certification;
          return {
            title: cert.name || "Certification",
            subtitle: `${sectionData.index + 1} of ${sectionData.total}`,
          };
        }
        return { title: "Certification", subtitle: "" };
      case "links":
        if (sectionData.index !== undefined) {
          const link = sectionData.data as Link;
          return {
            title: link.label || "Link",
            subtitle: `${sectionData.index + 1} of ${sectionData.total}`,
          };
        }
        return { title: "Link", subtitle: "" };
      default:
        return { title: "Edit", subtitle: "" };
    }
  }, [selectedSection, sectionData]);

  if (!selectedSection || !sectionData) return null;

  const { title, subtitle } = getPopoverInfo();
  const isListItem = sectionData.index !== undefined;
  const hasPrevious = isListItem && sectionData.index > 0;
  const hasNext =
    isListItem && sectionData.index < (sectionData.total || 0) - 1;

  // Render the appropriate editor
  const renderEditor = () => {
    const { type } = selectedSection;

    switch (type) {
      case "personalInfo":
      case "summary":
        return (
          <PersonalInfoEditor
            data={sectionData.data as PersonalInfo}
            onChange={onUpdatePersonalInfo}
          />
        );

      case "experience":
        return (
          <ExperienceEditor
            data={sectionData.data as Experience}
            onChange={(data) =>
              onUpdateExperience(selectedSection.itemId!, data)
            }
          />
        );

      case "education":
        return (
          <EducationEditor
            data={sectionData.data as Education}
            onChange={(data) =>
              onUpdateEducation(selectedSection.itemId!, data)
            }
          />
        );

      case "skills":
        return (
          <SkillsEditor
            data={sectionData.data as Skills}
            onChange={onUpdateSkills}
          />
        );

      case "certifications":
        return (
          <CertificationEditor
            data={sectionData.data as Certification}
            onChange={(data) =>
              onUpdateCertification(selectedSection.itemId!, data)
            }
          />
        );

      case "links":
        return (
          <LinkEditor
            data={sectionData.data as Link}
            onChange={(data) => onUpdateLink(selectedSection.itemId!, data)}
          />
        );

      default:
        return <div>Unknown section type</div>;
    }
  };

  return (
    <SectionEditorPopover
      title={title}
      subtitle={subtitle}
      showNavigation={isListItem}
      hasPrevious={hasPrevious}
      hasNext={hasNext}
      onPrevious={() => navigateToItem("prev")}
      onNext={() => navigateToItem("next")}
      onClose={clearSelection}
    >
      {renderEditor()}
    </SectionEditorPopover>
  );
}
