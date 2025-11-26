import { Briefcase, GraduationCap, Award } from "lucide-react";
import type { Resume } from "@/lib/api/types";
import type { TemplateConfig } from "@/lib/types/templates";
import { getFullName } from "@/lib/validations";

interface GovernmentTemplateProps {
  resume: Resume;
  config?: TemplateConfig;
}

export function GovernmentTemplate({
  resume,
  config,
}: GovernmentTemplateProps) {
  const { personalInfo, experience, education, skills, certifications } =
    resume.content;
  const primaryColor = config?.colorScheme?.primary || "#1e3a8a";

  return (
    <div className="mx-auto max-w-[21cm] bg-white text-gray-900 shadow-lg p-10 font-serif">
      <div
        className="border-t-4 border-b-4 py-4 mb-6"
        style={{ borderColor: primaryColor }}
      >
        <h1 className="text-center text-3xl font-bold uppercase tracking-widest mb-2">
          {getFullName(personalInfo.firstName, personalInfo.lastName, personalInfo.nameOrder) || "YOUR NAME"}
        </h1>
        <div className="text-center text-sm text-gray-700">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span> | {personalInfo.phone}</span>}
          {personalInfo.location && <span> | {personalInfo.location}</span>}
        </div>
      </div>

      {personalInfo.summary && (
        <div className="mb-6">
          <h2
            className="text-center text-lg font-bold uppercase tracking-wide mb-3 pb-2 border-b-2"
            style={{ borderColor: primaryColor, color: primaryColor }}
          >
            Professional Summary
          </h2>
          <p className="text-gray-800 leading-relaxed text-justify">
            {personalInfo.summary}
          </p>
        </div>
      )}

      {experience && experience.length > 0 && (
        <div className="mb-6">
          <h2
            className="text-center text-lg font-bold uppercase tracking-wide mb-3 pb-2 border-b-2"
            style={{ borderColor: primaryColor, color: primaryColor }}
          >
            <Briefcase className="inline h-5 w-5 mr-2" />
            Professional Experience
          </h2>
          {experience.map((exp, idx) => (
            <div key={idx} className="mb-4">
              <div
                className="flex justify-between items-start border-b pb-2 mb-2"
                style={{ borderColor: `${primaryColor}30` }}
              >
                <div>
                  <h3 className="font-bold uppercase tracking-wide">
                    {exp.position}
                  </h3>
                  <p className="text-gray-800">{exp.company}</p>
                </div>
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              {exp.description && (
                <p className="text-sm text-gray-700 mb-2">{exp.description}</p>
              )}
              {exp.highlights && exp.highlights.length > 0 && (
                <ul className="space-y-1">
                  {exp.highlights.map((highlight, i) => (
                    <li key={i} className="text-sm text-gray-700 flex gap-2">
                      <span>•</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {education && education.length > 0 && (
        <div className="mb-6">
          <h2
            className="text-center text-lg font-bold uppercase tracking-wide mb-3 pb-2 border-b-2"
            style={{ borderColor: primaryColor, color: primaryColor }}
          >
            <GraduationCap className="inline h-5 w-5 mr-2" />
            Education
          </h2>
          {education.map((edu, idx) => (
            <div key={idx} className="mb-3 flex justify-between">
              <div>
                <h3 className="font-bold uppercase">{edu.degree}</h3>
                <p className="text-gray-800">{edu.institution}</p>
                {edu.field && (
                  <p className="text-sm text-gray-600">Field: {edu.field}</p>
                )}
              </div>
              <span className="text-sm text-gray-600">
                {edu.startDate} - {edu.endDate}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        {skills && (
          <div>
            <h2
              className="text-center text-lg font-bold uppercase tracking-wide mb-3 pb-2 border-b-2"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              Qualifications
            </h2>
            <ul className="space-y-1">
              {typeof skills === "object" &&
                "technical" in skills &&
                Array.isArray(skills.technical) &&
                skills.technical.map((skill: any, idx: number) => (
                  <li key={idx} className="text-sm text-gray-700">
                    • {skill.name || skill}
                  </li>
                ))}
            </ul>
          </div>
        )}

        {certifications && certifications.length > 0 && (
          <div>
            <h2
              className="text-center text-lg font-bold uppercase tracking-wide mb-3 pb-2 border-b-2"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              <Award className="inline h-5 w-5 mr-2" />
              Certifications
            </h2>
            {certifications.map((cert, idx) => (
              <div key={idx} className="mb-2">
                <p className="font-semibold text-sm">{cert.name}</p>
                {cert.issuer && (
                  <p className="text-xs text-gray-600">{cert.issuer}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
