import type { Resume } from "@/lib/api/types";
import type { TemplateConfig } from "@/lib/types/templates";
import {
  formatPhoneDisplay,
  getFullName,
  type PhoneFormat,
} from "@/lib/validations";

interface CreativeProTemplateProps {
  resume: Resume;
  config?: TemplateConfig;
}

export function CreativeProTemplate({
  resume,
  config,
}: CreativeProTemplateProps) {
  const { personalInfo, experience, education, skills } = resume.content;
  const primaryColor = config?.colorScheme?.primary || "#667eea";
  const secondaryColor = config?.colorScheme?.secondary || "#764ba2";

  return (
    <div className="mx-auto max-w-[21cm] bg-white text-gray-900 shadow-lg">
      <div
        className="p-8"
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
          color: "white",
        }}
      >
        <h1 className="text-4xl font-bold mb-2">
          {getFullName(
            personalInfo.firstName,
            personalInfo.lastName,
            personalInfo.nameOrder,
          ) || "Your Name"}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm opacity-90">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>•</span>}
          {personalInfo.phone && (
            <span>
              {formatPhoneDisplay(
                personalInfo.phone,
                personalInfo.phoneFormat as PhoneFormat,
              )}
            </span>
          )}
          {personalInfo.location && <span>•</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
      </div>

      <div className="p-8">
        {personalInfo.summary && (
          <div
            className="mb-6 p-4 rounded-lg border-l-4"
            style={{
              backgroundColor: `${primaryColor}10`,
              borderColor: primaryColor,
            }}
          >
            <p className="leading-relaxed">{personalInfo.summary}</p>
          </div>
        )}

        {experience && experience.length > 0 && (
          <div className="mb-6">
            <h2
              className="text-2xl font-bold mb-4"
              style={{ color: primaryColor }}
            >
              Experience
            </h2>
            {experience.map((exp, idx) => (
              <div
                key={idx}
                className="mb-5 pl-4 border-l-2"
                style={{ borderColor: `${primaryColor}40` }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{exp.position}</h3>
                    <p
                      className="font-semibold"
                      style={{ color: primaryColor }}
                    >
                      {exp.company}
                    </p>
                  </div>
                  <span
                    className="text-sm text-gray-600 px-2 py-1 rounded"
                    style={{ backgroundColor: `${primaryColor}10` }}
                  >
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-sm mt-2 leading-relaxed">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          {skills && (
            <div>
              <h2
                className="text-2xl font-bold mb-4"
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
                      className="px-3 py-1 rounded-full text-sm font-medium text-white"
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
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: primaryColor }}
              >
                Education
              </h2>
              {education.map((edu, idx) => (
                <div key={idx} className="mb-3">
                  <h3 className="font-bold">{edu.degree}</h3>
                  <p className="text-sm">{edu.institution}</p>
                  {edu.startDate && (
                    <p className="text-sm text-gray-600">
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
