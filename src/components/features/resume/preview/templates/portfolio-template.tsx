import { Briefcase, GraduationCap, Award } from "lucide-react";
import type { Resume } from "@/lib/api/types";
import type { TemplateConfig } from "@/lib/types/templates";
import { formatPhoneDisplay, getFullName, type PhoneFormat } from "@/lib/validations";

interface PortfolioTemplateProps {
  resume: Resume;
  config?: TemplateConfig;
}

export function PortfolioTemplate({ resume, config }: PortfolioTemplateProps) {
  const { personalInfo, experience, education, skills, certifications } =
    resume.content;
  const primaryColor = config?.colorScheme?.primary || "#e11d48";

  return (
    <div className="mx-auto max-w-[21cm] bg-white text-gray-900 shadow-lg">
      <div
        className="p-10"
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}cc 100%)`,
          color: "white",
        }}
      >
        <h1 className="text-5xl font-bold mb-2">
          {getFullName(
            personalInfo.firstName,
            personalInfo.lastName,
            personalInfo.nameOrder,
          ) || "Your Name"}
        </h1>
        <p className="text-xl opacity-90 mb-4">Creative Portfolio</p>
        <div className="flex flex-wrap gap-4 text-sm opacity-80">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>•</span>}
          {personalInfo.phone && <span>{formatPhoneDisplay(personalInfo.phone, personalInfo.phoneFormat as PhoneFormat)}</span>}
          {personalInfo.location && <span>•</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
      </div>

      <div className="p-10">
        {personalInfo.summary && (
          <div className="mb-8">
            <h2
              className="text-2xl font-bold mb-3"
              style={{ color: primaryColor }}
            >
              About Me
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {personalInfo.summary}
            </p>
          </div>
        )}

        {experience && experience.length > 0 && (
          <div className="mb-8">
            <h2
              className="text-2xl font-bold mb-4 flex items-center gap-2"
              style={{ color: primaryColor }}
            >
              <Briefcase className="h-6 w-6" />
              Featured Projects
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {experience.map((exp, idx) => (
                <div
                  key={idx}
                  className="p-4 border-2 rounded-lg hover:shadow-md transition-shadow"
                  style={{ borderColor: `${primaryColor}30` }}
                >
                  <div
                    className="h-24 mb-3 rounded flex items-center justify-center text-white font-bold text-xl"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {exp.position.substring(0, 2).toUpperCase()}
                  </div>
                  <h3 className="font-bold mb-1">{exp.position}</h3>
                  <p className="text-sm text-gray-600 mb-2">{exp.company}</p>
                  {exp.description && (
                    <p className="text-xs text-gray-700 line-clamp-2">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-8">
          {skills && (
            <div>
              <h2
                className="text-xl font-bold mb-4"
                style={{ color: primaryColor }}
              >
                Skills
              </h2>
              <div className="space-y-3">
                {typeof skills === "object" &&
                  "technical" in skills &&
                  Array.isArray(skills.technical) &&
                  skills.technical
                    .slice(0, 8)
                    .map((skill: any, idx: number) => (
                      <div key={idx}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">
                            {skill.name || skill}
                          </span>
                          <span className="text-gray-600">
                            {skill.level || 85}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${skill.level || 85}%`,
                              backgroundColor: primaryColor,
                            }}
                          />
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          )}

          <div>
            {education && education.length > 0 && (
              <div className="mb-6">
                <h2
                  className="text-xl font-bold mb-4 flex items-center gap-2"
                  style={{ color: primaryColor }}
                >
                  <GraduationCap className="h-5 w-5" />
                  Education
                </h2>
                {education.map((edu, idx) => (
                  <div
                    key={idx}
                    className="mb-3 p-3 rounded"
                    style={{ backgroundColor: `${primaryColor}08` }}
                  >
                    <h3 className="font-bold">{edu.degree}</h3>
                    <p className="text-sm text-gray-700">{edu.institution}</p>
                    <p className="text-xs text-gray-600">
                      {edu.startDate} - {edu.endDate}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {certifications && certifications.length > 0 && (
              <div>
                <h2
                  className="text-xl font-bold mb-4 flex items-center gap-2"
                  style={{ color: primaryColor }}
                >
                  <Award className="h-5 w-5" />
                  Certifications
                </h2>
                {certifications.map((cert, idx) => (
                  <div key={idx} className="mb-2 text-sm">
                    <p className="font-semibold">{cert.name}</p>
                    {cert.issuer && (
                      <p className="text-xs text-gray-600">{cert.issuer}</p>
                    )}
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
