import { Briefcase, GraduationCap, Award } from "lucide-react";
import type { Resume } from "@/lib/api/types";
import type { TemplateConfig } from "@/lib/types/templates";
import {
  formatPhoneDisplay,
  getFullName,
  type PhoneFormat,
} from "@/lib/validations";

interface BorderAccentTemplateProps {
  resume: Resume;
  config?: TemplateConfig;
}

export function BorderAccentTemplate({
  resume,
  config,
}: BorderAccentTemplateProps) {
  const { personalInfo, experience, education, skills, certifications } =
    resume.content;
  const primaryColor = config?.colorScheme?.primary || "#10b981";

  return (
    <div
      className="mx-auto max-w-[21cm] bg-white text-gray-900 shadow-lg p-10 border-8"
      style={{ borderColor: primaryColor }}
    >
      <div
        className="border-4 border-dashed p-6 mb-6"
        style={{ borderColor: `${primaryColor}40` }}
      >
        <h1
          className="text-4xl font-bold text-center mb-2"
          style={{ color: primaryColor }}
        >
          {getFullName(
            personalInfo.firstName,
            personalInfo.lastName,
            personalInfo.nameOrder,
          ) || "Your Name"}
        </h1>
        <p className="text-center text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && (
            <span>
              {" "}
              •{" "}
              {formatPhoneDisplay(
                personalInfo.phone,
                personalInfo.phoneFormat as PhoneFormat,
              )}
            </span>
          )}
          {personalInfo.location && <span> • {personalInfo.location}</span>}
        </p>
      </div>

      {personalInfo.summary && (
        <div
          className="mb-6 p-4 border-4"
          style={{ borderColor: primaryColor }}
        >
          <p className="text-gray-700 text-center">{personalInfo.summary}</p>
        </div>
      )}

      {experience && experience.length > 0 && (
        <div className="mb-6">
          <h2
            className="text-xl font-bold mb-4 p-3 border-l-8 flex items-center gap-2"
            style={{ borderColor: primaryColor, color: primaryColor }}
          >
            <Briefcase className="h-5 w-5" />
            Experience
          </h2>
          {experience.map((exp, idx) => (
            <div
              key={idx}
              className="mb-4 p-3 border-2"
              style={{ borderColor: `${primaryColor}30` }}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold">{exp.position}</h3>
                  <p className="text-sm text-gray-700">{exp.company}</p>
                </div>
                <span className="text-xs text-gray-600">
                  {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              {exp.highlights && exp.highlights.length > 0 && (
                <ul className="space-y-1">
                  {exp.highlights.slice(0, 2).map((highlight, i) => (
                    <li key={i} className="text-sm text-gray-700">
                      • {highlight}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {education && education.length > 0 && (
          <div>
            <h2
              className="text-lg font-bold mb-3 p-2 border-b-4 flex items-center gap-2"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              <GraduationCap className="h-5 w-5" />
              Education
            </h2>
            {education.map((edu, idx) => (
              <div
                key={idx}
                className="mb-3 p-2 border-2"
                style={{ borderColor: `${primaryColor}20` }}
              >
                <h3 className="font-bold text-sm">{edu.degree}</h3>
                <p className="text-xs text-gray-700">{edu.institution}</p>
              </div>
            ))}
          </div>
        )}

        {skills && (
          <div>
            <h2
              className="text-lg font-bold mb-3 p-2 border-b-4"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              Skills
            </h2>
            <div className="space-y-2">
              {typeof skills === "object" &&
                "technical" in skills &&
                Array.isArray(skills.technical) &&
                skills.technical.slice(0, 6).map((skill: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-1 border text-xs text-center"
                    style={{ borderColor: primaryColor }}
                  >
                    {skill.name || skill}
                  </div>
                ))}
            </div>
          </div>
        )}

        {certifications && certifications.length > 0 && (
          <div>
            <h2
              className="text-lg font-bold mb-3 p-2 border-b-4 flex items-center gap-2"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              <Award className="h-5 w-5" />
              Awards
            </h2>
            {certifications.map((cert, idx) => (
              <div
                key={idx}
                className="mb-2 p-2 border-2"
                style={{ borderColor: `${primaryColor}20` }}
              >
                <p className="font-semibold text-xs">{cert.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
