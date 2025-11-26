/**
 * Executive Template
 * Bold, serif-based design with thick borders and executive profile section
 * Layout: Centered header, single column, prominent sections
 */

import { Award, Mail, MapPin, Phone } from "lucide-react";
import type { Resume } from "@/lib/api/types";
import type { TemplateConfig } from "@/lib/types/templates";
import {
  formatPhoneDisplay,
  getFullName,
  type PhoneFormat,
} from "@/lib/validations";

interface ExecutiveTemplateProps {
  resume: Resume;
  config?: TemplateConfig;
}

export function ExecutiveTemplate({ resume, config }: ExecutiveTemplateProps) {
  const { personalInfo, experience, education, skills, certifications } =
    resume.content;

  const primaryColor = config?.colorScheme?.primary || "#1e40af";

  return (
    <div
      className="mx-auto max-w-[21cm] bg-white text-gray-900 shadow-lg"
      style={{
        colorScheme: "light",
        fontFamily: "Georgia, 'Times New Roman', serif",
      }}
    >
      {/* Thick top border */}
      <div style={{ borderTop: `8px solid ${primaryColor}` }} />

      {/* Header - Centered */}
      <div className="border-b-4 border-gray-900 px-12 py-8 text-center">
        <h1 className="mb-4 text-5xl font-bold tracking-tight">
          {getFullName(
            personalInfo.firstName,
            personalInfo.lastName,
            personalInfo.nameOrder,
          ) || "Your Name"}
        </h1>

        {/* Contact Info - Horizontal */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-700">
          {personalInfo.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-2">
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
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{personalInfo.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Executive Profile Section */}
      {personalInfo.summary && (
        <div className="border-b-2 border-gray-300 px-12 py-8">
          <h2
            className="mb-4 text-2xl font-bold uppercase tracking-wide"
            style={{ color: primaryColor }}
          >
            Executive Profile
          </h2>
          <p className="text-base leading-relaxed text-gray-800">
            {personalInfo.summary}
          </p>
        </div>
      )}

      {/* Professional Experience */}
      {experience && experience.length > 0 && (
        <div className="border-b-2 border-gray-300 px-12 py-8">
          <h2
            className="mb-6 text-2xl font-bold uppercase tracking-wide"
            style={{ color: primaryColor }}
          >
            Professional Experience
          </h2>
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div key={index} className="border-l-4 border-gray-400 pl-6">
                <div className="mb-2">
                  <h3 className="text-xl font-bold">{exp.position}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-gray-700">
                      {exp.company}
                    </p>
                    <p className="text-sm text-gray-600">
                      {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                    </p>
                  </div>
                </div>
                {exp.description && (
                  <p className="mb-3 text-gray-700 leading-relaxed">
                    {exp.description}
                  </p>
                )}
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="space-y-2">
                    {exp.highlights.map((highlight, i) => (
                      <li key={i} className="flex gap-2 text-gray-800">
                        <span
                          className="font-bold"
                          style={{ color: primaryColor }}
                        >
                          •
                        </span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="border-b-2 border-gray-300 px-12 py-8">
          <h2
            className="mb-6 text-2xl font-bold uppercase tracking-wide"
            style={{ color: primaryColor }}
          >
            Education
          </h2>
          <div className="space-y-4">
            {education.map((edu, index) => (
              <div key={index}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold">{edu.degree}</h3>
                    <p className="text-base text-gray-700">{edu.institution}</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    {edu.startDate} - {edu.endDate}
                  </p>
                </div>
                {edu.honors && edu.honors.length > 0 && (
                  <p className="mt-2 text-gray-700">{edu.honors.join(", ")}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills & Certifications - Side by side */}
      <div className="grid grid-cols-2 gap-8 px-12 py-8">
        {/* Skills */}
        {skills && (
          <div>
            <h2
              className="mb-4 text-2xl font-bold uppercase tracking-wide"
              style={{ color: primaryColor }}
            >
              Core Competencies
            </h2>
            <div className="space-y-2">
              {typeof skills === "object" &&
                "technical" in skills &&
                Array.isArray(skills.technical) &&
                skills.technical.map((skill: any, index: number) => (
                  <div key={index} className="text-gray-800">
                    <span className="font-semibold">{skill.name || skill}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <div>
            <h2
              className="mb-4 text-2xl font-bold uppercase tracking-wide"
              style={{ color: primaryColor }}
            >
              Certifications
            </h2>
            <div className="space-y-2">
              {certifications.map((cert, index) => (
                <div key={index}>
                  <div className="flex items-center gap-2">
                    <Award
                      className="h-4 w-4"
                      style={{ color: primaryColor }}
                    />
                    <span className="font-semibold text-gray-800">
                      {cert.name}
                    </span>
                  </div>
                  {cert.issuer && (
                    <p className="ml-6 text-sm text-gray-600">{cert.issuer}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Thick bottom border */}
      <div style={{ borderBottom: `8px solid ${primaryColor}` }} />
    </div>
  );
}
