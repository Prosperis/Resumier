import {
  Award,
  Briefcase,
  GraduationCap,
  Link as LinkIcon,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import type { Resume } from "@/lib/api/types";
import type { TemplateConfig } from "@/lib/types/templates";
import {
  formatPhoneDisplay,
  getFullName,
  type PhoneFormat,
} from "@/lib/validations";
import { getLinkIcon } from "./shared/contact-info";

interface ModernTemplateProps {
  resume: Resume;
  config?: TemplateConfig;
}

export function ModernTemplate({ resume, config }: ModernTemplateProps) {
  const { personalInfo, experience, education, skills, certifications, links } =
    resume.content;

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
      {/* Header Section */}
      <div
        className="p-8"
        style={{ backgroundColor: colors.primary, color: "white" }}
      >
        <h1
          className="mb-2 text-4xl font-bold"
          style={{ fontFamily: typography.headingFont }}
        >
          {getFullName(
            personalInfo.firstName,
            personalInfo.lastName,
            personalInfo.nameOrder,
          ) || "Your Name"}
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
                {formatPhoneDisplay(
                  personalInfo.phone,
                  personalInfo.phoneFormat as PhoneFormat,
                )}
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

      <div className="grid grid-cols-3 gap-8 p-8">
        {/* Main Content - 2 columns */}
        <div className="col-span-2 space-y-6">
          {/* Summary */}
          {personalInfo.summary && (
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
              <p
                className="text-sm leading-relaxed"
                style={{ color: colors.textLight }}
              >
                {personalInfo.summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {experience.filter(
            (exp) =>
              exp.position ||
              exp.company ||
              exp.description ||
              (exp.highlights && exp.highlights.length > 0),
          ).length > 0 && (
            <section>
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
                      <div key={exp.id}>
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
                            <span
                              className="text-sm"
                              style={{ color: colors.textLight }}
                            >
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
                          <p
                            className="mb-2 text-sm"
                            style={{ color: colors.textLight }}
                          >
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
                    );
                  })}
              </div>
            </section>
          )}

          {/* Education */}
          {education.filter((edu) => edu.degree || edu.institution || edu.field)
            .length > 0 && (
            <section>
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
              <div className="space-y-4">
                {education
                  .filter((edu) => edu.degree || edu.institution || edu.field)
                  .map((edu) => {
                    const dateRange =
                      edu.startDate || edu.endDate || edu.current
                        ? `${edu.startDate || ""}${edu.startDate && (edu.endDate || edu.current) ? " - " : ""}${edu.current ? "Present" : edu.endDate || ""}`
                        : null;
                    return (
                      <div key={edu.id}>
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
                            <span
                              className="text-sm"
                              style={{ color: colors.textLight }}
                            >
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
                          <p
                            className="text-sm"
                            style={{ color: colors.textLight }}
                          >
                            {edu.field}
                          </p>
                        )}
                        {edu.gpa && (
                          <p
                            className="text-sm"
                            style={{ color: colors.textLight }}
                          >
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
                    );
                  })}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Skills */}
          {(skills.technical?.length > 0 ||
            skills.languages?.length > 0 ||
            skills.tools?.length > 0 ||
            skills.soft?.length > 0) && (
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
                          {skill}
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
                          {lang}
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
                          {tool}
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
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications.filter(
            (cert) => cert.name || cert.issuer || cert.date,
          ).length > 0 && (
            <section>
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
              <div className="space-y-2">
                {certifications
                  .filter((cert) => cert.name || cert.issuer || cert.date)
                  .map((cert) => (
                    <div key={cert.id}>
                      {cert.name && (
                        <p
                          className="text-sm font-semibold"
                          style={{ color: colors.text }}
                        >
                          {cert.name}
                        </p>
                      )}
                      {cert.issuer && (
                        <p
                          className="text-xs"
                          style={{ color: colors.textLight }}
                        >
                          {cert.issuer}
                        </p>
                      )}
                      {cert.date && (
                        <p
                          className="text-xs"
                          style={{ color: colors.textLight }}
                        >
                          {cert.date}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Links */}
          {links.filter((link) => link.label || link.url).length > 0 && (
            <section>
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
              <div className="space-y-2">
                {links
                  .filter((link) => link.label || link.url)
                  .map((link) => (
                    <div key={link.id} className="flex items-start gap-2">
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
                          >
                            {link.url}
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
