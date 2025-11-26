/**
 * Compact Template
 * Maximum information density with tight spacing
 * Layout: Dense single-column with minimal whitespace
 */

import type { Resume } from "@/lib/api/types";
import type { TemplateConfig } from "@/lib/types/templates";
import { formatPhoneDisplay, getFullName, type PhoneFormat } from "@/lib/validations";

interface CompactTemplateProps {
  resume: Resume;
  config?: TemplateConfig;
}

export function CompactTemplate({ resume, config }: CompactTemplateProps) {
  const { personalInfo, experience, education, skills, certifications } =
    resume.content;
  const primaryColor = config?.colorScheme?.primary || "#525252";

  return (
    <div
      className="mx-auto max-w-[21cm] bg-white text-gray-900 shadow-lg p-8"
      style={{ colorScheme: "light", fontSize: "11px", lineHeight: "1.4" }}
    >
      {/* Compact Header */}
      <div className="mb-4 pb-2 border-b border-gray-300">
        <h1 className="text-2xl font-bold mb-1">
          {getFullName(
            personalInfo.firstName,
            personalInfo.lastName,
            personalInfo.nameOrder,
          ) || "Your Name"}
        </h1>
        <div className="flex flex-wrap gap-3 text-xs text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{formatPhoneDisplay(personalInfo.phone, personalInfo.phoneFormat as PhoneFormat)}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
      </div>

      {/* Summary - Compact */}
      {personalInfo.summary && (
        <div className="mb-3">
          <p className="text-gray-700">{personalInfo.summary}</p>
        </div>
      )}

      {/* Experience - Dense */}
      {experience && experience.length > 0 && (
        <div className="mb-4">
          <h2
            className="text-sm font-bold mb-2 uppercase"
            style={{ color: primaryColor }}
          >
            Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp, index) => (
              <div key={index}>
                <div className="flex items-baseline justify-between mb-0.5">
                  <h3 className="font-bold">{exp.position}</h3>
                  <span className="text-xs text-gray-600">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <p className="font-semibold text-gray-700 mb-1">
                  {exp.company}
                </p>
                {exp.description && (
                  <p className="text-gray-700 mb-1">{exp.description}</p>
                )}
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="space-y-0.5 ml-3">
                    {exp.highlights.map((highlight, i) => (
                      <li key={i} className="text-gray-700 text-xs list-disc">
                        {highlight}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two Column Section - Skills & Education */}
      <div className="grid grid-cols-2 gap-6">
        {/* Education */}
        {education && education.length > 0 && (
          <div className="mb-4">
            <h2
              className="text-sm font-bold mb-2 uppercase"
              style={{ color: primaryColor }}
            >
              Education
            </h2>
            <div className="space-y-2">
              {education.map((edu, index) => (
                <div key={index}>
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-bold text-xs">{edu.degree}</h3>
                    <span className="text-xs text-gray-600">{edu.endDate}</span>
                  </div>
                  <p className="text-gray-700">{edu.institution}</p>
                  {edu.gpa && (
                    <p className="text-xs text-gray-600">GPA: {edu.gpa}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills && (
          <div className="mb-4">
            <h2
              className="text-sm font-bold mb-2 uppercase"
              style={{ color: primaryColor }}
            >
              Skills
            </h2>
            <div className="space-y-1">
              {typeof skills === "object" &&
                "technical" in skills &&
                Array.isArray(skills.technical) &&
                skills.technical.map((skill: any, index: number) => (
                  <div key={index} className="text-gray-800">
                    {skill.name || skill}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Certifications - Compact */}
      {certifications && certifications.length > 0 && (
        <div>
          <h2
            className="text-sm font-bold mb-2 uppercase"
            style={{ color: primaryColor }}
          >
            Certifications
          </h2>
          <div className="flex flex-wrap gap-2">
            {certifications.map((cert, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-gray-100 rounded"
              >
                {cert.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
