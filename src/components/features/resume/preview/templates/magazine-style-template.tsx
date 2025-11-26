import { Briefcase, GraduationCap } from "lucide-react";
import type { Resume } from "@/lib/api/types";
import type { TemplateConfig } from "@/lib/types/templates";
import {
  formatPhoneDisplay,
  getFullName,
  type PhoneFormat,
} from "@/lib/validations";

interface MagazineStyleTemplateProps {
  resume: Resume;
  config?: TemplateConfig;
}

export function MagazineStyleTemplate({
  resume,
  config,
}: MagazineStyleTemplateProps) {
  const { personalInfo, experience, education, skills } = resume.content;
  const primaryColor = config?.colorScheme?.primary || "#6366f1";

  return (
    <div className="mx-auto max-w-[21cm] bg-white text-gray-900 shadow-lg">
      <div className="p-10" style={{ backgroundColor: `${primaryColor}05` }}>
        <div className="flex items-end gap-6 mb-4">
          <h1
            className="text-6xl font-black leading-none"
            style={{ color: primaryColor }}
          >
            {personalInfo.nameOrder === "lastFirst"
              ? personalInfo.lastName || "Last"
              : personalInfo.firstName || "First"}
          </h1>
          <h2 className="text-4xl font-light pb-2">
            {personalInfo.nameOrder === "lastFirst"
              ? personalInfo.firstName || "First"
              : personalInfo.lastName || "Last"}
          </h2>
        </div>
        <div className="flex gap-4 text-sm text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>|</span>}
          {personalInfo.phone && (
            <span>
              {formatPhoneDisplay(
                personalInfo.phone,
                personalInfo.phoneFormat as PhoneFormat,
              )}
            </span>
          )}
        </div>
      </div>

      <div className="p-10">
        {personalInfo.summary && (
          <div className="mb-8">
            <div
              className="w-20 h-1 mb-3"
              style={{ backgroundColor: primaryColor }}
            />
            <p className="text-lg leading-relaxed text-gray-800 italic">
              "{personalInfo.summary}"
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-8">
          <div>
            {experience && experience.length > 0 && (
              <div className="mb-6">
                <h2
                  className="text-2xl font-black mb-4"
                  style={{ color: primaryColor }}
                >
                  <Briefcase className="inline h-6 w-6 mr-2" />
                  Experience
                </h2>
                {experience.map((exp, idx) => (
                  <div key={idx} className="mb-6">
                    <h3 className="font-bold text-xl mb-1">{exp.position}</h3>
                    <p
                      className="text-sm font-semibold mb-1"
                      style={{ color: primaryColor }}
                    >
                      {exp.company}
                    </p>
                    <p className="text-xs text-gray-500 mb-2">
                      {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                    </p>
                    {exp.description && (
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            {education && education.length > 0 && (
              <div className="mb-6">
                <h2
                  className="text-2xl font-black mb-4"
                  style={{ color: primaryColor }}
                >
                  <GraduationCap className="inline h-6 w-6 mr-2" />
                  Education
                </h2>
                {education.map((edu, idx) => (
                  <div key={idx} className="mb-4">
                    <h3 className="font-bold">{edu.degree}</h3>
                    <p className="text-sm text-gray-700">{edu.institution}</p>
                    <p className="text-xs text-gray-500">
                      {edu.startDate} — {edu.endDate}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {skills && (
              <div>
                <h2
                  className="text-2xl font-black mb-4"
                  style={{ color: primaryColor }}
                >
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {typeof skills === "object" &&
                    "technical" in skills &&
                    Array.isArray(skills.technical) &&
                    skills.technical.map((skill: any, idx: number) => (
                      <span
                        key={idx}
                        className="text-xs font-semibold px-3 py-1 border-2"
                        style={{
                          borderColor: primaryColor,
                          color: primaryColor,
                        }}
                      >
                        {skill.name || skill}
                      </span>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
