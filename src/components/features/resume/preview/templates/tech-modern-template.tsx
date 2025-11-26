import type { Resume } from "@/lib/api/types";
import type { TemplateConfig } from "@/lib/types/templates";
import { getFullName } from "@/lib/validations";

interface TechModernTemplateProps {
  resume: Resume;
  config?: TemplateConfig;
}

export function TechModernTemplate({
  resume,
  config,
}: TechModernTemplateProps) {
  const { personalInfo, experience, education, skills } = resume.content;
  const primaryColor = config?.colorScheme?.primary || "#3b82f6";

  return (
    <div className="mx-auto max-w-[21cm] bg-white text-gray-900 shadow-lg">
      <div
        className="p-8"
        style={{ backgroundColor: primaryColor, color: "white" }}
      >
        <h1 className="text-4xl font-bold mb-2">
          {getFullName(
            personalInfo.firstName,
            personalInfo.lastName,
            personalInfo.nameOrder,
          ) || "Your Name"}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
      </div>

      <div className="flex gap-6 p-8">
        <div className="flex-[2]">
          {personalInfo.summary && (
            <div className="mb-6">
              <h2
                className="text-xl font-bold mb-2 border-b-2 pb-1"
                style={{ color: primaryColor, borderColor: primaryColor }}
              >
                About
              </h2>
              <p className="leading-relaxed">{personalInfo.summary}</p>
            </div>
          )}

          {experience && experience.length > 0 && (
            <div className="mb-6">
              <h2
                className="text-xl font-bold mb-2 border-b-2 pb-1"
                style={{ color: primaryColor, borderColor: primaryColor }}
              >
                Experience
              </h2>
              {experience.map((exp, idx) => (
                <div key={idx} className="mb-4">
                  <h3 className="font-bold text-lg">{exp.position}</h3>
                  <p className="text-gray-700 font-semibold">{exp.company}</p>
                  <p className="text-sm text-gray-600 mb-1">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </p>
                  {exp.description && (
                    <p className="text-sm">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 bg-gray-50 p-6 -mr-8 -mb-8">
          {skills && (
            <div className="mb-6">
              <h2
                className="text-lg font-bold mb-3"
                style={{ color: primaryColor }}
              >
                Skills
              </h2>
              <div className="space-y-2">
                {typeof skills === "object" &&
                  "technical" in skills &&
                  Array.isArray(skills.technical) &&
                  skills.technical
                    .slice(0, 8)
                    .map((skill: any, idx: number) => (
                      <div key={idx}>
                        <span className="text-sm font-semibold">
                          {skill.name || skill}
                        </span>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${skill.level || 70}%`,
                              backgroundColor: primaryColor,
                            }}
                          />
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          )}

          {education && education.length > 0 && (
            <div>
              <h2
                className="text-lg font-bold mb-3"
                style={{ color: primaryColor }}
              >
                Education
              </h2>
              {education.map((edu, idx) => (
                <div key={idx} className="mb-3">
                  <h3 className="font-bold text-sm">{edu.degree}</h3>
                  <p className="text-sm">{edu.institution}</p>
                  {edu.startDate && (
                    <p className="text-xs text-gray-600">
                      {edu.startDate} - {edu.endDate}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
