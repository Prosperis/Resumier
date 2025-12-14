import type { Resume } from "@/lib/api/types";
import type { TemplateConfig } from "@/lib/types/templates";
import { formatPhoneDisplay, getFullName, type PhoneFormat } from "@/lib/validations";

interface CorporateTemplateProps {
  resume: Resume;
  config?: TemplateConfig;
}

export function CorporateTemplate({ resume, config }: CorporateTemplateProps) {
  const { personalInfo, experience, education, skills, certifications } = resume.content;
  const primaryColor = config?.colorScheme?.primary || "#374151";

  return (
    <div className="mx-auto max-w-[21cm] bg-white p-12 text-gray-900 shadow-lg font-serif">
      <div className="text-center border-b pb-5 mb-6" style={{ borderColor: primaryColor }}>
        <h1
          className="text-3xl font-bold tracking-wide uppercase mb-2"
          style={{ color: primaryColor }}
        >
          {getFullName(personalInfo.firstName, personalInfo.lastName, personalInfo.nameOrder) ||
            "Your Name"}
        </h1>
        <div className="text-sm text-gray-700 space-x-3">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>•</span>}
          {personalInfo.phone && (
            <span>
              {formatPhoneDisplay(personalInfo.phone, personalInfo.phoneFormat as PhoneFormat)}
            </span>
          )}
          {personalInfo.location && <span>•</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
      </div>
      {personalInfo.summary && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wide mb-2 border-b border-gray-300 pb-1">
            Professional Summary
          </h2>
          <p className="text-sm leading-relaxed">{personalInfo.summary}</p>
        </div>
      )}
      {experience && experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wide mb-2 border-b border-gray-300 pb-1">
            Professional Experience
          </h2>
          {experience.map((exp, idx) => (
            <div key={idx} className="mb-5">
              <div className="flex justify-between mb-1">
                <h3 className="font-bold">{exp.position}</h3>
                <span className="text-sm text-gray-600">
                  {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              <p className="text-gray-700 font-semibold">{exp.company}</p>
              {exp.description && <p className="text-sm mt-1 leading-relaxed">{exp.description}</p>}
              {exp.highlights && exp.highlights.length > 0 && (
                <ul className="text-sm mt-2 space-y-1">
                  {exp.highlights.map((highlight, i) => (
                    <li key={i} className="ml-4">
                      • {highlight}
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
          <h2 className="text-sm font-bold uppercase tracking-wide mb-2 border-b border-gray-300 pb-1">
            Education
          </h2>
          {education.map((edu, idx) => (
            <div key={idx} className="mb-3">
              <h3 className="font-bold">{edu.degree}</h3>
              <p>{edu.institution}</p>
              {edu.endDate && <p className="text-gray-600 text-sm">{edu.endDate}</p>}
            </div>
          ))}
        </div>
      )}
      {skills && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wide mb-2 border-b border-gray-300 pb-1">
            Professional Skills
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {typeof skills === "object" &&
              "technical" in skills &&
              Array.isArray(skills.technical) &&
              skills.technical.map((skill: any, idx: number) => (
                <span key={idx} className="text-sm">
                  • {skill.name || skill}
                </span>
              ))}
          </div>
        </div>
      )}
      {certifications && certifications.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide mb-2 border-b border-gray-300 pb-1">
            Professional Certifications
          </h2>
          {certifications.map((cert, idx) => (
            <div key={idx} className="text-sm mb-1">
              <span className="font-semibold">{cert.name}</span>
              {cert.issuer && <span className="text-gray-600"> - {cert.issuer}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
