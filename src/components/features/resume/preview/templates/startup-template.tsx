import { Zap, Briefcase, GraduationCap } from "lucide-react";
import type { Resume } from "@/lib/api/types";
import type { TemplateConfig } from "@/lib/types/templates";
import {
  formatPhoneDisplay,
  getFullName,
  type PhoneFormat,
} from "@/lib/validations";

interface StartupTemplateProps {
  resume: Resume;
  config?: TemplateConfig;
}

export function StartupTemplate({ resume, config }: StartupTemplateProps) {
  const { personalInfo, experience, education, skills } = resume.content;
  const primaryColor = config?.colorScheme?.primary || "#14b8a6";

  return (
    <div className="mx-auto max-w-[21cm] bg-white text-gray-900 shadow-lg p-8">
      <div className="flex items-start gap-6 mb-6">
        <div className="flex-1">
          <h1
            className="text-3xl font-bold mb-1"
            style={{ color: primaryColor }}
          >
            {getFullName(
              personalInfo.firstName,
              personalInfo.lastName,
              personalInfo.nameOrder,
            ) || "Your Name"}
          </h1>
          <div className="flex flex-wrap gap-3 text-sm text-gray-600">
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
            {personalInfo.location && <span>|</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
          </div>
        </div>
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-white"
          style={{ backgroundColor: primaryColor }}
        >
          <Zap className="h-10 w-10" />
        </div>
      </div>

      {personalInfo.summary && (
        <div
          className="mb-6 p-4 border-l-4"
          style={{
            borderColor: primaryColor,
            backgroundColor: `${primaryColor}08`,
          }}
        >
          <p className="text-gray-700">{personalInfo.summary}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6 mb-6">
        {experience && experience.length > 0 && (
          <div className="col-span-2">
            <h2
              className="text-xl font-bold mb-3 flex items-center gap-2"
              style={{ color: primaryColor }}
            >
              <Briefcase className="h-5 w-5" />
              Experience
            </h2>
            {experience.map((exp, idx) => (
              <div
                key={idx}
                className="mb-4 pl-4 border-l-2"
                style={{ borderColor: primaryColor }}
              >
                <h3 className="font-bold">{exp.position}</h3>
                <p className="text-sm text-gray-700">{exp.company}</p>
                <p className="text-xs text-gray-500">
                  {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                </p>
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="mt-1 space-y-1 text-sm">
                    {exp.highlights.slice(0, 2).map((highlight, i) => (
                      <li key={i} className="text-gray-700">
                        • {highlight}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {skills && (
          <div>
            <h2
              className="text-lg font-bold mb-3"
              style={{ color: primaryColor }}
            >
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {typeof skills === "object" &&
                "technical" in skills &&
                Array.isArray(skills.technical) &&
                skills.technical.slice(0, 10).map((skill: any, idx: number) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs rounded text-white"
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
              className="text-lg font-bold mb-3 flex items-center gap-2"
              style={{ color: primaryColor }}
            >
              <GraduationCap className="h-5 w-5" />
              Education
            </h2>
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
  );
}
