import { Briefcase, GraduationCap, Award } from "lucide-react";
import type { Resume } from "@/lib/api/types";
import type { TemplateConfig } from "@/lib/types/templates";
import { getFullName } from "@/lib/validations";

interface ElegantTemplateProps {
  resume: Resume;
  config?: TemplateConfig;
}

export function ElegantTemplate({ resume, config }: ElegantTemplateProps) {
  const { personalInfo, experience, education, skills, certifications } =
    resume.content;
  const primaryColor = config?.colorScheme?.primary || "#78716c";

  return (
    <div className="mx-auto max-w-[21cm] bg-white text-gray-900 shadow-lg p-12 font-serif">
      <div className="text-center mb-10">
        <h1
          className="text-5xl font-light tracking-wider mb-4"
          style={{ color: primaryColor }}
        >
          {getFullName(personalInfo.firstName, personalInfo.lastName, personalInfo.nameOrder) || "Your Name"}
        </h1>
        <div
          className="w-32 h-px mx-auto mb-4"
          style={{ backgroundColor: primaryColor }}
        />
        <p className="text-sm text-gray-600 tracking-wide">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span> • {personalInfo.phone}</span>}
          {personalInfo.location && <span> • {personalInfo.location}</span>}
        </p>
      </div>

      {personalInfo.summary && (
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <p className="text-gray-700 leading-relaxed text-lg italic">
            {personalInfo.summary}
          </p>
        </div>
      )}

      {experience && experience.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-6">
            <div
              className="flex-1 h-px"
              style={{ backgroundColor: primaryColor }}
            />
            <h2
              className="text-2xl font-light tracking-wider flex items-center gap-2"
              style={{ color: primaryColor }}
            >
              <Briefcase className="h-6 w-6" />
              Experience
            </h2>
            <div
              className="flex-1 h-px"
              style={{ backgroundColor: primaryColor }}
            />
          </div>
          {experience.map((exp, idx) => (
            <div key={idx} className="mb-8 max-w-3xl mx-auto">
              <div className="flex justify-between items-baseline mb-2">
                <h3 className="text-xl font-semibold">{exp.position}</h3>
                <span className="text-sm text-gray-500">
                  {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              <p className="text-gray-600 italic mb-3">{exp.company}</p>
              {exp.description && (
                <p className="text-gray-700 leading-relaxed mb-2">
                  {exp.description}
                </p>
              )}
              {exp.highlights && exp.highlights.length > 0 && (
                <ul className="space-y-2 text-gray-700">
                  {exp.highlights.map((highlight, i) => (
                    <li
                      key={i}
                      className="pl-4 relative before:content-['—'] before:absolute before:left-0"
                    >
                      {highlight}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-10">
        {education && education.length > 0 && (
          <div>
            <div className="flex items-center gap-4 mb-4">
              <h2
                className="text-xl font-light tracking-wider flex items-center gap-2"
                style={{ color: primaryColor }}
              >
                <GraduationCap className="h-5 w-5" />
                Education
              </h2>
              <div
                className="flex-1 h-px"
                style={{ backgroundColor: primaryColor }}
              />
            </div>
            {education.map((edu, idx) => (
              <div key={idx} className="mb-4">
                <h3 className="font-semibold">{edu.degree}</h3>
                <p className="text-sm text-gray-600 italic">
                  {edu.institution}
                </p>
                <p className="text-xs text-gray-500">
                  {edu.startDate} — {edu.endDate}
                </p>
              </div>
            ))}
          </div>
        )}

        <div>
          {skills && (
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <h2
                  className="text-xl font-light tracking-wider"
                  style={{ color: primaryColor }}
                >
                  Skills
                </h2>
                <div
                  className="flex-1 h-px"
                  style={{ backgroundColor: primaryColor }}
                />
              </div>
              <div className="space-y-2">
                {typeof skills === "object" &&
                  "technical" in skills &&
                  Array.isArray(skills.technical) &&
                  skills.technical.map((skill: any, idx: number) => (
                    <p key={idx} className="text-sm text-gray-700">
                      {skill.name || skill}
                    </p>
                  ))}
              </div>
            </div>
          )}

          {certifications && certifications.length > 0 && (
            <div>
              <div className="flex items-center gap-4 mb-4">
                <h2
                  className="text-xl font-light tracking-wider flex items-center gap-2"
                  style={{ color: primaryColor }}
                >
                  <Award className="h-5 w-5" />
                  Awards
                </h2>
                <div
                  className="flex-1 h-px"
                  style={{ backgroundColor: primaryColor }}
                />
              </div>
              {certifications.map((cert, idx) => (
                <div key={idx} className="mb-2">
                  <p className="text-sm font-semibold text-gray-800">
                    {cert.name}
                  </p>
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
  );
}
