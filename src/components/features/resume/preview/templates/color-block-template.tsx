import { Briefcase, GraduationCap } from "lucide-react";
import type { Resume } from "@/lib/api/types";
import type { TemplateConfig } from "@/lib/types/templates";
import { formatPhoneDisplay, getFullName, type PhoneFormat } from "@/lib/validations";

interface ColorBlockTemplateProps {
  resume: Resume;
  config?: TemplateConfig;
}

export function ColorBlockTemplate({
  resume,
  config,
}: ColorBlockTemplateProps) {
  const { personalInfo, experience, education, skills } = resume.content;
  const primaryColor = config?.colorScheme?.primary || "#f59e0b";

  return (
    <div className="mx-auto max-w-[21cm] bg-white text-gray-900 shadow-lg">
      <div className="grid grid-cols-3">
        <div
          className="col-span-1 p-8 text-white"
          style={{ backgroundColor: primaryColor }}
        >
          <h1 className="text-3xl font-bold mb-4">
            {getFullName(
              personalInfo.firstName,
              personalInfo.lastName,
              personalInfo.nameOrder,
            ) || "Your Name"}
          </h1>
          <div className="space-y-2 text-sm opacity-90">
            {personalInfo.email && <p>{personalInfo.email}</p>}
            {personalInfo.phone && <p>{formatPhoneDisplay(personalInfo.phone, personalInfo.phoneFormat as PhoneFormat)}</p>}
            {personalInfo.location && <p>{personalInfo.location}</p>}
          </div>
        </div>

        <div className="col-span-2 p-8">
          {personalInfo.summary && (
            <div
              className="mb-6 p-4"
              style={{ backgroundColor: `${primaryColor}15` }}
            >
              <p className="text-gray-700">{personalInfo.summary}</p>
            </div>
          )}

          {experience && experience.length > 0 && (
            <div className="mb-6">
              <div
                className="p-2 mb-3 text-white font-bold"
                style={{ backgroundColor: primaryColor }}
              >
                <Briefcase className="inline h-4 w-4 mr-2" />
                EXPERIENCE
              </div>
              {experience.map((exp, idx) => (
                <div key={idx} className="mb-4">
                  <h3 className="font-bold">{exp.position}</h3>
                  <p className="text-sm text-gray-700">
                    {exp.company} | {exp.startDate} -{" "}
                    {exp.current ? "Present" : exp.endDate}
                  </p>
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="mt-1 space-y-1">
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

          <div className="grid grid-cols-2 gap-4">
            {skills && (
              <div>
                <div
                  className="p-2 mb-3 text-white font-bold"
                  style={{ backgroundColor: primaryColor }}
                >
                  SKILLS
                </div>
                <div className="flex flex-wrap gap-2">
                  {typeof skills === "object" &&
                    "technical" in skills &&
                    Array.isArray(skills.technical) &&
                    skills.technical
                      .slice(0, 8)
                      .map((skill: any, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs text-white"
                          style={{ backgroundColor: primaryColor }}
                        >
                          {skill.name || skill}
                        </span>
                      ))}
                </div>
              </div>
            )}

            {education && education.length > 0 && (
              <div>
                <div
                  className="p-2 mb-3 text-white font-bold"
                  style={{ backgroundColor: primaryColor }}
                >
                  <GraduationCap className="inline h-4 w-4 mr-2" />
                  EDUCATION
                </div>
                {education.map((edu, idx) => (
                  <div key={idx} className="mb-2">
                    <h3 className="font-semibold text-sm">{edu.degree}</h3>
                    <p className="text-xs text-gray-700">{edu.institution}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
