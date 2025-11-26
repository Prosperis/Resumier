import type { Resume } from "@/lib/api/types";
import type { TemplateConfig } from "@/lib/types/templates";
import { formatPhoneDisplay, getFullName, type PhoneFormat } from "@/lib/validations";

interface AcademicTemplateProps {
  resume: Resume;
  config?: TemplateConfig;
}

export function AcademicTemplate({ resume, config }: AcademicTemplateProps) {
  const { personalInfo, experience, education, certifications } =
    resume.content;
  const primaryColor = config?.colorScheme?.primary || "#1e3a8a";

  return (
    <div className="mx-auto max-w-[21cm] bg-white p-12 text-gray-900 shadow-lg font-serif">
      <div
        className="text-center border-b-2 pb-6 mb-8"
        style={{ borderColor: primaryColor }}
      >
        <h1 className="text-4xl font-bold mb-2">
          {getFullName(
            personalInfo.firstName,
            personalInfo.lastName,
            personalInfo.nameOrder,
          ) || "Your Name"}
        </h1>
        <div className="flex justify-center flex-wrap gap-3 text-sm text-gray-700">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{formatPhoneDisplay(personalInfo.phone, personalInfo.phoneFormat as PhoneFormat)}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
      </div>

      {personalInfo.summary && (
        <div className="mb-6">
          <h2
            className="text-lg font-bold mb-2 border-b pb-1"
            style={{ borderColor: primaryColor, color: primaryColor }}
          >
            Research Interests
          </h2>
          <p className="leading-relaxed">{personalInfo.summary}</p>
        </div>
      )}

      {education && education.length > 0 && (
        <div className="mb-6">
          <h2
            className="text-lg font-bold mb-2 border-b pb-1"
            style={{ borderColor: primaryColor, color: primaryColor }}
          >
            Education
          </h2>
          {education.map((edu, idx) => (
            <div key={idx} className="mb-4">
              <h3 className="font-bold">{edu.degree}</h3>
              <p>{edu.institution}</p>
              {edu.startDate && (
                <p className="text-gray-600">
                  {edu.startDate} - {edu.endDate}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {experience && experience.length > 0 && (
        <div className="mb-6">
          <h2
            className="text-lg font-bold mb-2 border-b pb-1"
            style={{ borderColor: primaryColor, color: primaryColor }}
          >
            Academic Appointments
          </h2>
          {experience.map((exp, idx) => (
            <div key={idx} className="mb-4">
              <h3 className="font-bold">{exp.position}</h3>
              <p>{exp.company}</p>
              <p className="text-gray-600 text-sm">
                {exp.startDate} - {exp.current ? "Present" : exp.endDate}
              </p>
              {exp.description && (
                <p className="mt-1 text-sm">{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {certifications && certifications.length > 0 && (
        <div>
          <h2
            className="text-lg font-bold mb-2 border-b pb-1"
            style={{ borderColor: primaryColor, color: primaryColor }}
          >
            Honors & Awards
          </h2>
          {certifications.map((cert, idx) => (
            <div key={idx} className="mb-2">
              <span className="font-semibold">{cert.name}</span>
              {cert.issuer && (
                <span className="text-gray-600"> - {cert.issuer}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
