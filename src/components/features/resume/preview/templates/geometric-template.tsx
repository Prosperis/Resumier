import { Circle, Square, Triangle } from "lucide-react";
import type { Resume } from "@/lib/api/types";
import type { TemplateConfig } from "@/lib/types/templates";
import { getFullName } from "@/lib/validations";

interface GeometricTemplateProps {
  resume: Resume;
  config?: TemplateConfig;
}

export function GeometricTemplate({ resume, config }: GeometricTemplateProps) {
  const { personalInfo, experience, education, skills } = resume.content;
  const primaryColor = config?.colorScheme?.primary || "#06b6d4";

  return (
    <div className="mx-auto max-w-[21cm] bg-white text-gray-900 shadow-lg p-10 relative overflow-hidden">
      <div
        className="absolute top-0 right-0 w-64 h-64 opacity-5"
        style={{ backgroundColor: primaryColor }}
      >
        <Circle className="absolute top-4 right-4 h-32 w-32" />
        <Square className="absolute bottom-8 left-8 h-24 w-24" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-16 h-16 flex items-center justify-center"
            style={{ backgroundColor: primaryColor }}
          >
            <Triangle className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold" style={{ color: primaryColor }}>
              {getFullName(personalInfo.firstName, personalInfo.lastName, personalInfo.nameOrder) || "Your Name"}
            </h1>
            <div className="text-sm text-gray-600">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span> | {personalInfo.phone}</span>}
            </div>
          </div>
        </div>

        {personalInfo.summary && (
          <div
            className="mb-6 p-4 border-l-4"
            style={{ borderColor: primaryColor }}
          >
            <p className="text-gray-700">{personalInfo.summary}</p>
          </div>
        )}

        {experience && experience.length > 0 && (
          <div className="mb-6">
            <h2
              className="text-xl font-bold mb-4 flex items-center gap-2"
              style={{ color: primaryColor }}
            >
              <Square className="h-5 w-5" />
              Experience
            </h2>
            {experience.map((exp, idx) => (
              <div key={idx} className="mb-4 relative pl-6">
                <div
                  className="absolute left-0 top-2 w-3 h-3"
                  style={{ backgroundColor: primaryColor }}
                />
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold">{exp.position}</h3>
                    <p className="text-sm text-gray-700">{exp.company}</p>
                  </div>
                  <span className="text-xs text-gray-600">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-sm text-gray-700">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          {skills && (
            <div>
              <h2
                className="text-xl font-bold mb-4 flex items-center gap-2"
                style={{ color: primaryColor }}
              >
                <Circle className="h-5 w-5" />
                Skills
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {typeof skills === "object" &&
                  "technical" in skills &&
                  Array.isArray(skills.technical) &&
                  skills.technical.map((skill: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: primaryColor }}
                      />
                      <span className="text-sm text-gray-700">
                        {skill.name || skill}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {education && education.length > 0 && (
            <div>
              <h2
                className="text-xl font-bold mb-4 flex items-center gap-2"
                style={{ color: primaryColor }}
              >
                <Triangle className="h-5 w-5" />
                Education
              </h2>
              {education.map((edu, idx) => (
                <div key={idx} className="mb-3 relative pl-6">
                  <div
                    className="absolute left-0 top-1 w-3 h-3 rotate-45"
                    style={{ backgroundColor: primaryColor }}
                  />
                  <h3 className="font-bold text-sm">{edu.degree}</h3>
                  <p className="text-xs text-gray-700">{edu.institution}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
