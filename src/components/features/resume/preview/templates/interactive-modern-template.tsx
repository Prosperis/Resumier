/**
 * Interactive Modern Template
 * A version of the modern template with interactive editing capabilities
 */

import {
  Award,
  Briefcase,
  GraduationCap,
  Link as LinkIcon,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import type { Resume, ResumeContent, SkillWithLevel } from "@/lib/api/types";
import type { TemplateConfig } from "@/lib/types/templates";
import { formatPhoneDisplay, getFullName, type PhoneFormat } from "@/lib/validations";
import { getLinkIcon } from "./shared/contact-info";
import {
  EditableSection,
  EditableSectionHeader,
  useOptionalInteractiveResume,
  SectionWrapper,
  HiddenSectionPlaceholder,
  SortableSectionColumn,
  DEFAULT_SECTION_ORDER,
  type SectionType,
} from "../interactive";

// Helper to get skill name from string or SkillWithLevel
function getSkillName(skill: string | SkillWithLevel): string {
  return typeof skill === "string" ? skill : skill.name;
}

// Define which sections belong to which column
const MAIN_COLUMN_SECTIONS: SectionType[] = ["summary", "experience", "education"];
const SIDEBAR_SECTIONS: SectionType[] = ["skills", "certifications", "links"];

interface InteractiveModernTemplateProps {
  resume: Resume;
  config?: TemplateConfig;
}

export function InteractiveModernTemplate({ resume, config }: InteractiveModernTemplateProps) {
  const { personalInfo, experience, education, skills, certifications, links } = resume.content;

  const context = useOptionalInteractiveResume();

  // Get hidden sections and order from context (which syncs with resume content)
  const hiddenSections =
    context?.hiddenSections ||
    (resume.content as ResumeContent & { hiddenSections?: SectionType[] }).hiddenSections ||
    [];

  // Get section order from context
  const sectionOrder =
    context?.sectionOrder ||
    (resume.content as ResumeContent & { sectionOrder?: SectionType[] }).sectionOrder ||
    DEFAULT_SECTION_ORDER;

  // Helper to check visibility using context
  const isSectionVisible = (sectionType: SectionType) => {
    if (context?.isSectionVisible) {
      return context.isSectionVisible(sectionType);
    }
    return !hiddenSections.includes(sectionType);
  };

  // Helper to check if a section has data to render
  const sectionHasData = (sectionType: SectionType): boolean => {
    switch (sectionType) {
      case "summary":
        return !!personalInfo.summary;
      case "experience":
        return (
          experience.filter(
            (exp) =>
              exp.position ||
              exp.company ||
              exp.description ||
              (exp.highlights && exp.highlights.length > 0),
          ).length > 0
        );
      case "education":
        return education.filter((edu) => edu.degree || edu.institution || edu.field).length > 0;
      case "skills":
        return (
          (skills.technical?.length || 0) > 0 ||
          (skills.languages?.length || 0) > 0 ||
          (skills.tools?.length || 0) > 0 ||
          (skills.soft?.length || 0) > 0
        );
      case "certifications":
        return (certifications?.length || 0) > 0;
      case "links":
        return (links?.length || 0) > 0;
      default:
        return true;
    }
  };

  // Helper to check if a section is renderable (visible AND has data)
  const isSectionRenderable = (sectionType: SectionType): boolean => {
    return isSectionVisible(sectionType) && sectionHasData(sectionType);
  };

  // Get sections for main column sorted by sectionOrder
  const mainColumnSections = MAIN_COLUMN_SECTIONS.slice().sort(
    (a, b) => sectionOrder.indexOf(a) - sectionOrder.indexOf(b),
  );

  // Get sections for sidebar sorted by sectionOrder
  const sidebarSections = SIDEBAR_SECTIONS.slice().sort(
    (a, b) => sectionOrder.indexOf(a) - sectionOrder.indexOf(b),
  );

  // Get only the sections that are actually rendered (visible AND have data) for drag and drop
  const renderableMainSections = mainColumnSections.filter(isSectionRenderable);
  const renderableSidebarSections = sidebarSections.filter(isSectionRenderable);

  // Get colors from config or use defaults
  const colors = {
    primary: config?.colorScheme?.primary || "#8b5cf6",
    secondary: config?.colorScheme?.secondary || "#a78bfa",
    text: config?.colorScheme?.text || "#111827",
    textLight: config?.colorScheme?.textLight || "#6b7280",
    background: config?.colorScheme?.background || "#ffffff",
    border: config?.colorScheme?.border || "#e5e7eb",
  };

  // Get typography from config or use defaults
  const typography = {
    headingFont: config?.typography?.headingFont || "Inter, sans-serif",
    bodyFont: config?.typography?.bodyFont || "Inter, sans-serif",
  };

  // Helper to create rgba from hex for backgrounds
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <div
      className="mx-auto max-w-[21cm] bg-white shadow-lg"
      style={{
        colorScheme: "light",
        color: colors.text,
        fontFamily: typography.bodyFont,
      }}
    >
      {/* Header Section - Personal Info (always visible as it's required) */}
      <EditableSection sectionType="personalInfo" editLabel="Edit personal information">
        <div className="p-8" style={{ backgroundColor: colors.primary, color: "white" }}>
          <h1 className="mb-2 text-4xl font-bold" style={{ fontFamily: typography.headingFont }}>
            {getFullName(personalInfo.firstName, personalInfo.lastName, personalInfo.nameOrder) ||
              "Your Name"}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm">
            {personalInfo.email && (
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                <span>
                  {formatPhoneDisplay(personalInfo.phone, personalInfo.phoneFormat as PhoneFormat)}
                </span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{personalInfo.location}</span>
              </div>
            )}
          </div>
        </div>
      </EditableSection>

      <div className="grid grid-cols-3 gap-8 p-8">
        {/* Main Content - 2 columns */}
        <SortableSectionColumn sectionIds={renderableMainSections} className="col-span-2 space-y-6">
          {/* Hidden Section Placeholders for main column sections */}
          {mainColumnSections.map((sectionType) => (
            <HiddenSectionPlaceholder
              key={`hidden-${sectionType}`}
              sectionType={sectionType}
              sectionLabel={
                sectionType === "summary"
                  ? "Professional Summary"
                  : sectionType.charAt(0).toUpperCase() + sectionType.slice(1)
              }
            />
          ))}

          {/* Render main column sections in order */}
          {mainColumnSections.map((sectionType) => {
            switch (sectionType) {
              case "summary":
                return isSectionVisible("summary") && personalInfo.summary ? (
                  <SectionWrapper
                    key="summary"
                    sectionType="summary"
                    sectionLabel="Summary"
                    isDraggable
                  >
                    <EditableSection sectionType="summary" editLabel="Edit summary">
                      <section>
                        <h2
                          className="mb-3 border-b-2 pb-1 text-xl font-bold"
                          style={{
                            color: colors.primary,
                            borderColor: colors.primary,
                            fontFamily: typography.headingFont,
                          }}
                        >
                          Professional Summary
                        </h2>
                        <p className="text-sm leading-relaxed" style={{ color: colors.textLight }}>
                          {personalInfo.summary}
                        </p>
                      </section>
                    </EditableSection>
                  </SectionWrapper>
                ) : null;

              case "experience":
                return isSectionVisible("experience") &&
                  experience.filter(
                    (exp) =>
                      exp.position ||
                      exp.company ||
                      exp.description ||
                      (exp.highlights && exp.highlights.length > 0),
                  ).length > 0 ? (
                  <SectionWrapper
                    key="experience"
                    sectionType="experience"
                    sectionLabel="Experience"
                    isDraggable
                  >
                    <section>
                      <EditableSectionHeader
                        sectionType="experience"
                        onAdd={context?.onAddExperience}
                      >
                        <h2
                          className="mb-3 flex items-center gap-2 border-b-2 pb-1 text-xl font-bold"
                          style={{
                            color: colors.primary,
                            borderColor: colors.primary,
                            fontFamily: typography.headingFont,
                          }}
                        >
                          <Briefcase className="h-5 w-5" />
                          Experience
                        </h2>
                      </EditableSectionHeader>
                      <div className="space-y-4">
                        {experience
                          .filter(
                            (exp) =>
                              exp.position ||
                              exp.company ||
                              exp.description ||
                              (exp.highlights && exp.highlights.length > 0),
                          )
                          .map((exp) => {
                            const dateRange =
                              exp.startDate || exp.endDate || exp.current
                                ? `${exp.startDate || ""}${exp.startDate && (exp.endDate || exp.current) ? " - " : ""}${exp.current ? "Present" : exp.endDate || ""}`
                                : null;
                            return (
                              <EditableSection
                                key={exp.id}
                                sectionType="experience"
                                itemId={exp.id}
                                editLabel={`Edit ${exp.position || "experience"}`}
                                canDelete
                                canReorder={experience.length > 1}
                                onDelete={() => context?.onDeleteExperience(exp.id)}
                              >
                                <div>
                                  <div className="mb-1 flex items-start justify-between">
                                    {exp.position && (
                                      <h3
                                        className="text-base font-bold"
                                        style={{ color: colors.text }}
                                      >
                                        {exp.position}
                                      </h3>
                                    )}
                                    {dateRange && (
                                      <span className="text-sm" style={{ color: colors.textLight }}>
                                        {dateRange}
                                      </span>
                                    )}
                                  </div>
                                  {exp.company && (
                                    <p
                                      className="mb-2 text-sm font-semibold"
                                      style={{ color: colors.textLight }}
                                    >
                                      {exp.company}
                                    </p>
                                  )}
                                  {exp.description && (
                                    <p className="mb-2 text-sm" style={{ color: colors.textLight }}>
                                      {exp.description}
                                    </p>
                                  )}
                                  {exp.highlights && exp.highlights.length > 0 && (
                                    <ul
                                      className="list-inside list-disc space-y-1 text-sm"
                                      style={{ color: colors.textLight }}
                                    >
                                      {exp.highlights.map((highlight, idx) => (
                                        <li key={idx}>{highlight}</li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              </EditableSection>
                            );
                          })}
                      </div>
                    </section>
                  </SectionWrapper>
                ) : null;

              case "education":
                return isSectionVisible("education") &&
                  education.filter((edu) => edu.degree || edu.institution || edu.field).length >
                    0 ? (
                  <SectionWrapper
                    key="education"
                    sectionType="education"
                    sectionLabel="Education"
                    isDraggable
                  >
                    <section>
                      <EditableSectionHeader
                        sectionType="education"
                        onAdd={context?.onAddEducation}
                      >
                        <h2
                          className="mb-3 flex items-center gap-2 border-b-2 pb-1 text-xl font-bold"
                          style={{
                            color: colors.primary,
                            borderColor: colors.primary,
                            fontFamily: typography.headingFont,
                          }}
                        >
                          <GraduationCap className="h-5 w-5" />
                          Education
                        </h2>
                      </EditableSectionHeader>
                      <div className="space-y-4">
                        {education
                          .filter((edu) => edu.degree || edu.institution || edu.field)
                          .map((edu) => {
                            const dateRange =
                              edu.startDate || edu.endDate || edu.current
                                ? `${edu.startDate || ""}${edu.startDate && (edu.endDate || edu.current) ? " - " : ""}${edu.current ? "Present" : edu.endDate || ""}`
                                : null;
                            return (
                              <EditableSection
                                key={edu.id}
                                sectionType="education"
                                itemId={edu.id}
                                editLabel={`Edit ${edu.degree || "education"}`}
                                canDelete
                                canReorder={education.length > 1}
                                onDelete={() => context?.onDeleteEducation(edu.id)}
                              >
                                <div>
                                  <div className="mb-1 flex items-start justify-between">
                                    {edu.degree && (
                                      <h3
                                        className="text-base font-bold"
                                        style={{ color: colors.text }}
                                      >
                                        {edu.degree}
                                      </h3>
                                    )}
                                    {dateRange && (
                                      <span className="text-sm" style={{ color: colors.textLight }}>
                                        {dateRange}
                                      </span>
                                    )}
                                  </div>
                                  {edu.institution && (
                                    <p
                                      className="text-sm font-semibold"
                                      style={{ color: colors.textLight }}
                                    >
                                      {edu.institution}
                                    </p>
                                  )}
                                  {edu.field && (
                                    <p className="text-sm" style={{ color: colors.textLight }}>
                                      {edu.field}
                                    </p>
                                  )}
                                  {edu.gpa && (
                                    <p className="text-sm" style={{ color: colors.textLight }}>
                                      GPA: {edu.gpa}
                                    </p>
                                  )}
                                  {edu.honors && edu.honors.length > 0 && (
                                    <ul
                                      className="mt-1 list-inside list-disc text-sm"
                                      style={{ color: colors.textLight }}
                                    >
                                      {edu.honors.map((honor, idx) => (
                                        <li key={idx}>{honor}</li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              </EditableSection>
                            );
                          })}
                      </div>
                    </section>
                  </SectionWrapper>
                ) : null;

              default:
                return null;
            }
          })}
        </SortableSectionColumn>

        {/* Sidebar - 1 column */}
        <SortableSectionColumn sectionIds={renderableSidebarSections} className="space-y-6">
          {/* Hidden Section Placeholders for sidebar sections */}
          {sidebarSections.map((sectionType) => (
            <HiddenSectionPlaceholder
              key={`hidden-${sectionType}`}
              sectionType={sectionType}
              sectionLabel={sectionType.charAt(0).toUpperCase() + sectionType.slice(1)}
            />
          ))}

          {/* Render sidebar sections in order */}
          {sidebarSections.map((sectionType) => {
            switch (sectionType) {
              case "skills":
                return isSectionVisible("skills") &&
                  (skills.technical?.length > 0 ||
                    skills.languages?.length > 0 ||
                    skills.tools?.length > 0 ||
                    skills.soft?.length > 0) ? (
                  <SectionWrapper
                    key="skills"
                    sectionType="skills"
                    sectionLabel="Skills"
                    isDraggable
                  >
                    <EditableSection sectionType="skills" editLabel="Edit skills">
                      <section>
                        <h2
                          className="mb-3 border-b-2 pb-1 text-lg font-bold"
                          style={{
                            color: colors.primary,
                            borderColor: colors.primary,
                            fontFamily: typography.headingFont,
                          }}
                        >
                          Skills
                        </h2>
                        <div className="space-y-3">
                          {skills.technical && skills.technical.length > 0 && (
                            <div>
                              <h3
                                className="mb-1 text-sm font-semibold"
                                style={{ color: colors.text }}
                              >
                                Technical
                              </h3>
                              <div className="flex flex-wrap gap-1">
                                {skills.technical.map((skill, idx) => (
                                  <span
                                    key={idx}
                                    className="rounded px-2 py-1 text-xs"
                                    style={{
                                      backgroundColor: hexToRgba(colors.primary, 0.1),
                                      color: colors.primary,
                                    }}
                                  >
                                    {getSkillName(skill)}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {skills.languages && skills.languages.length > 0 && (
                            <div>
                              <h3
                                className="mb-1 text-sm font-semibold"
                                style={{ color: colors.text }}
                              >
                                Languages
                              </h3>
                              <div className="flex flex-wrap gap-1">
                                {skills.languages.map((lang, idx) => (
                                  <span
                                    key={idx}
                                    className="rounded px-2 py-1 text-xs"
                                    style={{
                                      backgroundColor: hexToRgba(colors.primary, 0.1),
                                      color: colors.primary,
                                    }}
                                  >
                                    {getSkillName(lang)}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {skills.tools && skills.tools.length > 0 && (
                            <div>
                              <h3
                                className="mb-1 text-sm font-semibold"
                                style={{ color: colors.text }}
                              >
                                Tools
                              </h3>
                              <div className="flex flex-wrap gap-1">
                                {skills.tools.map((tool, idx) => (
                                  <span
                                    key={idx}
                                    className="rounded px-2 py-1 text-xs"
                                    style={{
                                      backgroundColor: hexToRgba(colors.primary, 0.1),
                                      color: colors.primary,
                                    }}
                                  >
                                    {getSkillName(tool)}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {skills.soft && skills.soft.length > 0 && (
                            <div>
                              <h3
                                className="mb-1 text-sm font-semibold"
                                style={{ color: colors.text }}
                              >
                                Soft Skills
                              </h3>
                              <div className="flex flex-wrap gap-1">
                                {skills.soft.map((skill, idx) => (
                                  <span
                                    key={idx}
                                    className="rounded px-2 py-1 text-xs"
                                    style={{
                                      backgroundColor: hexToRgba(colors.primary, 0.1),
                                      color: colors.primary,
                                    }}
                                  >
                                    {getSkillName(skill)}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </section>
                    </EditableSection>
                  </SectionWrapper>
                ) : null;

              case "certifications":
                return isSectionVisible("certifications") &&
                  certifications.filter((cert) => cert.name || cert.issuer || cert.date).length >
                    0 ? (
                  <SectionWrapper
                    key="certifications"
                    sectionType="certifications"
                    sectionLabel="Certifications"
                    isDraggable
                  >
                    <section>
                      <EditableSectionHeader
                        sectionType="certifications"
                        onAdd={context?.onAddCertification}
                      >
                        <h2
                          className="mb-3 flex items-center gap-2 border-b-2 pb-1 text-lg font-bold"
                          style={{
                            color: colors.primary,
                            borderColor: colors.primary,
                            fontFamily: typography.headingFont,
                          }}
                        >
                          <Award className="h-4 w-4" />
                          Certifications
                        </h2>
                      </EditableSectionHeader>
                      <div className="space-y-2">
                        {certifications
                          .filter((cert) => cert.name || cert.issuer || cert.date)
                          .map((cert) => (
                            <EditableSection
                              key={cert.id}
                              sectionType="certifications"
                              itemId={cert.id}
                              editLabel={`Edit ${cert.name || "certification"}`}
                              canDelete
                              onDelete={() => context?.onDeleteCertification(cert.id)}
                            >
                              <div>
                                {cert.name && (
                                  <p
                                    className="text-sm font-semibold"
                                    style={{ color: colors.text }}
                                  >
                                    {cert.name}
                                  </p>
                                )}
                                {cert.issuer && (
                                  <p className="text-xs" style={{ color: colors.textLight }}>
                                    {cert.issuer}
                                  </p>
                                )}
                                {cert.date && (
                                  <p className="text-xs" style={{ color: colors.textLight }}>
                                    {cert.date}
                                  </p>
                                )}
                              </div>
                            </EditableSection>
                          ))}
                      </div>
                    </section>
                  </SectionWrapper>
                ) : null;

              case "links":
                return isSectionVisible("links") &&
                  links.filter((link) => link.label || link.url).length > 0 ? (
                  <SectionWrapper key="links" sectionType="links" sectionLabel="Links" isDraggable>
                    <section>
                      <EditableSectionHeader sectionType="links" onAdd={context?.onAddLink}>
                        <h2
                          className="mb-3 flex items-center gap-2 border-b-2 pb-1 text-lg font-bold"
                          style={{
                            color: colors.primary,
                            borderColor: colors.primary,
                            fontFamily: typography.headingFont,
                          }}
                        >
                          <LinkIcon className="h-4 w-4" />
                          Links
                        </h2>
                      </EditableSectionHeader>
                      <div className="space-y-2">
                        {links
                          .filter((link) => link.label || link.url)
                          .map((link) => (
                            <EditableSection
                              key={link.id}
                              sectionType="links"
                              itemId={link.id}
                              editLabel={`Edit ${link.label || "link"}`}
                              canDelete
                              onDelete={() => context?.onDeleteLink(link.id)}
                            >
                              <div className="flex items-start gap-2">
                                <span
                                  className="mt-0.5 flex-shrink-0"
                                  style={{ color: colors.primary }}
                                >
                                  {getLinkIcon(link.type, true, "h-3 w-3")}
                                </span>
                                <div>
                                  {link.label && (
                                    <p
                                      className="text-xs font-semibold"
                                      style={{ color: colors.text }}
                                    >
                                      {link.label}
                                    </p>
                                  )}
                                  {link.url && (
                                    <a
                                      href={link.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs break-all hover:underline"
                                      style={{ color: colors.primary }}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {link.url}
                                    </a>
                                  )}
                                </div>
                              </div>
                            </EditableSection>
                          ))}
                      </div>
                    </section>
                  </SectionWrapper>
                ) : null;

              default:
                return null;
            }
          })}
        </SortableSectionColumn>
      </div>
    </div>
  );
}
