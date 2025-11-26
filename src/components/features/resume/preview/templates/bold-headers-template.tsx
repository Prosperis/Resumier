import { Briefcase, GraduationCap, Award } from "lucide-react";
import type { Resume } from "@/lib/api/types";
import type { TemplateConfig } from "@/lib/types/templates";
import { getFullName } from "@/lib/validations";

interface BoldHeadersTemplateProps {
  resume: Resume;
  config?: TemplateConfig;
}

export function BoldHeadersTemplate({
  resume,
  config,
}: BoldHeadersTemplateProps) {
  const { personalInfo, experience, education, skills, certifications } =
    resume.content;
  const primaryColor = config?.colorScheme?.primary || "#dc2626";

  return (
    <div className="mx-auto max-w-[21cm] bg-white text-gray-900 shadow-lg p-10">
      <div className="mb-8">
        <h1
          className="text-5xl font-black mb-3"
          style={{ color: primaryColor }}
        >
          {getFullName(
            personalInfo.firstName,
            personalInfo.lastName,
            personalInfo.nameOrder,
          ) || "YOUR NAME"}
        </h1>
        <div className="text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span> • {personalInfo.phone}</span>}
          {personalInfo.location && <span> • {personalInfo.location}</span>}
        </div>
      </div>

      {personalInfo.summary && (
        <div className="mb-8">
          <div
            className="p-6 text-2xl font-black text-white mb-4"
            style={{ backgroundColor: primaryColor }}
          >
            ABOUT
          </div>
          <p className="text-gray-700 text-lg leading-relaxed pl-2">
            {personalInfo.summary}
          </p>
        </div>
      )}

      {experience && experience.length > 0 && (
        <div className="mb-8">
          <div
            className="p-6 text-2xl font-black text-white mb-4 flex items-center gap-3"
            style={{ backgroundColor: primaryColor }}
          >
            <Briefcase className="h-7 w-7" />
            EXPERIENCE
          </div>
          {experience.map((exp, idx) => (
            <div key={idx} className="mb-5 pl-2">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-bold">{exp.position}</h3>
                  <p className="text-lg text-gray-700">{exp.company}</p>
                </div>
                <span className="text-sm text-gray-600 font-semibold">
                  {exp.startDate} - {exp.current ? "PRESENT" : exp.endDate}
                </span>
              </div>
              {exp.description && (
                <p className="text-gray-700 mb-2">{exp.description}</p>
              )}
              {exp.highlights && exp.highlights.length > 0 && (
                <ul className="space-y-1">
                  {exp.highlights.map((highlight, i) => (
                    <li key={i} className="flex gap-2 text-gray-700">
                      <span
                        className="font-bold"
                        style={{ color: primaryColor }}
                      >
                        ▸
                      </span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-8">
        {education && education.length > 0 && (
          <div>
            <div
              className="p-4 text-xl font-black text-white mb-4 flex items-center gap-2"
              style={{ backgroundColor: primaryColor }}
            >
              <GraduationCap className="h-6 w-6" />
              EDUCATION
            </div>
            {education.map((edu, idx) => (
              <div key={idx} className="mb-4 pl-2">
                <h3 className="font-bold text-lg">{edu.degree}</h3>
                <p className="text-gray-700">{edu.institution}</p>
                <p className="text-sm text-gray-600">
                  {edu.startDate} - {edu.endDate}
                </p>
              </div>
            ))}
          </div>
        )}

        <div>
          {skills && (
            <div className="mb-6">
              <div
                className="p-4 text-xl font-black text-white mb-4"
                style={{ backgroundColor: primaryColor }}
              >
                SKILLS
              </div>
              <div className="space-y-2 pl-2">
                {typeof skills === "object" &&
                  "technical" in skills &&
                  Array.isArray(skills.technical) &&
                  skills.technical.map((skill: any, idx: number) => (
                    <div key={idx} className="font-semibold text-gray-700">
                      • {skill.name || skill}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {certifications && certifications.length > 0 && (
            <div>
              <div
                className="p-4 text-xl font-black text-white mb-4 flex items-center gap-2"
                style={{ backgroundColor: primaryColor }}
              >
                <Award className="h-6 w-6" />
                AWARDS
              </div>
              {certifications.map((cert, idx) => (
                <div key={idx} className="mb-2 pl-2">
                  <p className="font-bold text-gray-800">{cert.name}</p>
                  {cert.issuer && (
                    <p className="text-sm text-gray-600">{cert.issuer}</p>
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
