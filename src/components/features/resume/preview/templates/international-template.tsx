import { Mail, Phone, MapPin, Briefcase, GraduationCap } from "lucide-react";
import type { Resume } from "@/lib/api/types";
import type { TemplateConfig } from "@/lib/types/templates";
import { formatPhoneDisplay, getFullName, type PhoneFormat } from "@/lib/validations";

interface InternationalTemplateProps {
  resume: Resume;
  config?: TemplateConfig;
}

export function InternationalTemplate({
  resume,
  config,
}: InternationalTemplateProps) {
  const { personalInfo, experience, education, skills, certifications } =
    resume.content;
  const primaryColor = config?.colorScheme?.primary || "#2563eb";

  return (
    <div className="mx-auto max-w-[21cm] bg-white text-gray-900 shadow-lg">
      <div className="grid grid-cols-3">
        <div
          className="col-span-1 p-6"
          style={{ backgroundColor: `${primaryColor}10` }}
        >
          <div
            className="w-32 h-32 mx-auto mb-4 rounded-full flex items-center justify-center text-4xl font-bold text-white"
            style={{ backgroundColor: primaryColor }}
          >
            {(
              (personalInfo.firstName?.[0] || "") +
              (personalInfo.lastName?.[0] || "")
            ).toUpperCase() || "UN"}
          </div>
          <h1
            className="text-center text-xl font-bold mb-4"
            style={{ color: primaryColor }}
          >
            {getFullName(
              personalInfo.firstName,
              personalInfo.lastName,
              personalInfo.nameOrder,
            ) || "Your Name"}
          </h1>

          <div className="space-y-3 text-sm">
            {personalInfo.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" style={{ color: primaryColor }} />
                <span className="text-gray-700 text-xs">
                  {personalInfo.email}
                </span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" style={{ color: primaryColor }} />
                <span className="text-gray-700 text-xs">
                  {formatPhoneDisplay(personalInfo.phone, personalInfo.phoneFormat as PhoneFormat)}
                </span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" style={{ color: primaryColor }} />
                <span className="text-gray-700 text-xs">
                  {personalInfo.location}
                </span>
              </div>
            )}
          </div>

          {skills && (
            <div className="mt-6">
              <h2 className="font-bold mb-3" style={{ color: primaryColor }}>
                Competencies
              </h2>
              <div className="space-y-2">
                {typeof skills === "object" &&
                  "technical" in skills &&
                  Array.isArray(skills.technical) &&
                  skills.technical
                    .slice(0, 10)
                    .map((skill: any, idx: number) => (
                      <div key={idx} className="text-xs">
                        <p className="text-gray-700 mb-1">
                          {skill.name || skill}
                        </p>
                        <div className="w-full h-1 bg-gray-200 rounded">
                          <div
                            className="h-1 rounded"
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

          {certifications && certifications.length > 0 && (
            <div className="mt-6">
              <h2 className="font-bold mb-3" style={{ color: primaryColor }}>
                Certifications
              </h2>
              {certifications.map((cert, idx) => (
                <div key={idx} className="mb-2 text-xs">
                  <p className="font-semibold text-gray-800">{cert.name}</p>
                  {cert.issuer && (
                    <p className="text-gray-600">{cert.issuer}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="col-span-2 p-8">
          {personalInfo.summary && (
            <div className="mb-6">
              <h2
                className="text-lg font-bold mb-2"
                style={{ color: primaryColor }}
              >
                PROFILE
              </h2>
              <div
                className="h-1 w-12 mb-3"
                style={{ backgroundColor: primaryColor }}
              />
              <p className="text-gray-700 leading-relaxed text-sm">
                {personalInfo.summary}
              </p>
            </div>
          )}

          {experience && experience.length > 0 && (
            <div className="mb-6">
              <h2
                className="text-lg font-bold mb-2 flex items-center gap-2"
                style={{ color: primaryColor }}
              >
                <Briefcase className="h-5 w-5" />
                PROFESSIONAL EXPERIENCE
              </h2>
              <div
                className="h-1 w-12 mb-3"
                style={{ backgroundColor: primaryColor }}
              />
              {experience.map((exp, idx) => (
                <div key={idx} className="mb-4">
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
                    <p className="text-sm text-gray-700 mb-2">
                      {exp.description}
                    </p>
                  )}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="space-y-1">
                      {exp.highlights.map((highlight, i) => (
                        <li
                          key={i}
                          className="text-sm text-gray-700 flex gap-2"
                        >
                          <span
                            className="text-xs"
                            style={{ color: primaryColor }}
                          >
                            ►
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

          {education && education.length > 0 && (
            <div>
              <h2
                className="text-lg font-bold mb-2 flex items-center gap-2"
                style={{ color: primaryColor }}
              >
                <GraduationCap className="h-5 w-5" />
                EDUCATION
              </h2>
              <div
                className="h-1 w-12 mb-3"
                style={{ backgroundColor: primaryColor }}
              />
              {education.map((edu, idx) => (
                <div key={idx} className="mb-3">
                  <h3 className="font-bold">{edu.degree}</h3>
                  <p className="text-sm text-gray-700">{edu.institution}</p>
                  <p className="text-xs text-gray-600">
                    {edu.startDate} - {edu.endDate}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
