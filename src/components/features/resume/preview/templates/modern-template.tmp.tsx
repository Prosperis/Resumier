import {
  Award,
  Briefcase,
  GraduationCap,
  Link as LinkIcon,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import type { Resume } from "@/lib/api/types";
import type { TemplateConfig } from "@/lib/types/templates";
import { formatPhoneDisplay, getFullName, type PhoneFormat } from "@/lib/validations";

interface ModernTemplateProps {
  resume: Resume;
  config?: TemplateConfig;
}

export function ModernTemplate({ resume, config }: ModernTemplateProps) {
  const { personalInfo, experience, education, skills, certifications, links } =
    resume.content;

  // Get colors from config or use defaults
  const primaryColor = config?.colorScheme?.primary || "{primaryColor}";
  const accentColor = config?.colorScheme?.accent || "{primaryColor}";

  return (
    <div
      className="mx-auto max-w-[21cm] bg-white text-gray-900 shadow-lg"
      style={{ colorScheme: "light" }}
    >
      {/* Header Section */}
      <div
        className="p-8"
        style={{ backgroundColor: primaryColor, color: "white" }}
      >
        <h1 className="mb-2 text-4xl font-bold">
          {getFullName(
            personalInfo.firstName,
            personalInfo.lastName,
            personalInfo.nameOrder,
          ) || "Your Name"}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm">
          {personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              <span>{formatPhoneDisplay(personalInfo.phone, personalInfo.phoneFormat as PhoneFormat)}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{personalInfo.location}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8 p-8">
        {/* Main Content - 2 columns */}
        <div className="col-span-2 space-y-6">
          {/* Summary */}
          {personalInfo.summary && (
            <section>
              <h2
                className="mb-3 border-b-2 pb-1 text-xl font-bold"
                style={{
                  color: "{primaryColor}",
                  borderColor: "{primaryColor}",
                }}
              >
                Professional Summary
              </h2>
              <p className="text-sm leading-relaxed text-gray-700">
                {personalInfo.summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section>
              <h2
                className="mb-3 flex items-center gap-2 border-b-2 pb-1 text-xl font-bold"
                style={{
                  color: "{primaryColor}",
                  borderColor: "{primaryColor}",
                }}
              >
                <Briefcase className="h-5 w-5" />
                Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="mb-1 flex items-start justify-between">
                      <h3 className="text-base font-bold">{exp.position}</h3>
                      <span className="text-sm text-gray-600">
                        {exp.startDate} -{" "}
                        {exp.current ? "Present" : exp.endDate}
                      </span>
                    </div>
                    <p className="mb-2 text-sm font-semibold text-gray-700">
                      {exp.company}
                    </p>
                    {exp.description && (
                      <p className="mb-2 text-sm text-gray-700">
                        {exp.description}
                      </p>
                    )}
                    {exp.highlights && exp.highlights.length > 0 && (
                      <ul className="list-inside list-disc space-y-1 text-sm text-gray-700">
                        {exp.highlights.map((highlight, idx) => (
                          <li key={idx}>{highlight}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section>
              <h2
                className="mb-3 flex items-center gap-2 border-b-2 pb-1 text-xl font-bold"
                style={{
                  color: "{primaryColor}",
                  borderColor: "{primaryColor}",
                }}
              >
                <GraduationCap className="h-5 w-5" />
                Education
              </h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="mb-1 flex items-start justify-between">
                      <h3 className="text-base font-bold">{edu.degree}</h3>
                      <span className="text-sm text-gray-600">
                        {edu.startDate} -{" "}
                        {edu.current ? "Present" : edu.endDate}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-700">
                      {edu.institution}
                    </p>
                    <p className="text-sm text-gray-600">{edu.field}</p>
                    {edu.gpa && (
                      <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>
                    )}
                    {edu.honors && edu.honors.length > 0 && (
                      <ul className="mt-1 list-inside list-disc text-sm text-gray-700">
                        {edu.honors.map((honor, idx) => (
                          <li key={idx}>{honor}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Skills */}
          {(skills.technical?.length > 0 ||
            skills.languages?.length > 0 ||
            skills.tools?.length > 0 ||
            skills.soft?.length > 0) && (
            <section>
              <h2
                className="mb-3 border-b-2 pb-1 text-lg font-bold"
                style={{
                  color: "{primaryColor}",
                  borderColor: "{primaryColor}",
                }}
              >
                Skills
              </h2>
              <div className="space-y-3">
                {skills.technical && skills.technical.length > 0 && (
                  <div>
                    <h3 className="mb-1 text-sm font-semibold text-gray-800">
                      Technical
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {skills.technical.map((skill, idx) => (
                        <span
                          key={idx}
                          className="rounded px-2 py-1 text-xs"
                          style={{
                            backgroundColor: "rgba(139, 92, 246, 0.1)",
                            color: "{primaryColor}",
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {skills.languages && skills.languages.length > 0 && (
                  <div>
                    <h3 className="mb-1 text-sm font-semibold text-gray-800">
                      Languages
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {skills.languages.map((lang, idx) => (
                        <span
                          key={idx}
                          className="rounded px-2 py-1 text-xs"
                          style={{
                            backgroundColor: "rgba(139, 92, 246, 0.1)",
                            color: "{primaryColor}",
                          }}
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {skills.tools && skills.tools.length > 0 && (
                  <div>
                    <h3 className="mb-1 text-sm font-semibold text-gray-800">
                      Tools
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {skills.tools.map((tool, idx) => (
                        <span
                          key={idx}
                          className="rounded px-2 py-1 text-xs"
                          style={{
                            backgroundColor: "rgba(139, 92, 246, 0.1)",
                            color: "{primaryColor}",
                          }}
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {skills.soft && skills.soft.length > 0 && (
                  <div>
                    <h3 className="mb-1 text-sm font-semibold text-gray-800">
                      Soft Skills
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {skills.soft.map((skill, idx) => (
                        <span
                          key={idx}
                          className="rounded px-2 py-1 text-xs"
                          style={{
                            backgroundColor: "rgba(139, 92, 246, 0.1)",
                            color: "{primaryColor}",
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <section>
              <h2
                className="mb-3 flex items-center gap-2 border-b-2 pb-1 text-lg font-bold"
                style={{
                  color: "{primaryColor}",
                  borderColor: "{primaryColor}",
                }}
              >
                <Award className="h-4 w-4" />
                Certifications
              </h2>
              <div className="space-y-2">
                {certifications.map((cert) => (
                  <div key={cert.id}>
                    <p className="text-sm font-semibold text-gray-800">
                      {cert.name}
                    </p>
                    <p className="text-xs text-gray-600">{cert.issuer}</p>
                    <p className="text-xs text-gray-500">{cert.date}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Links */}
          {links.length > 0 && (
            <section>
              <h2
                className="mb-3 flex items-center gap-2 border-b-2 pb-1 text-lg font-bold"
                style={{
                  color: "{primaryColor}",
                  borderColor: "{primaryColor}",
                }}
              >
                <LinkIcon className="h-4 w-4" />
                Links
              </h2>
              <div className="space-y-2">
                {links.map((link) => (
                  <div key={link.id} className="flex items-start gap-2">
                    <LinkIcon
                      className="mt-0.5 h-3 w-3 flex-shrink-0"
                      style={{ color: "{primaryColor}" }}
                    />
                    <div>
                      <p className="text-xs font-semibold text-gray-800">
                        {link.label}
                      </p>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs break-all hover:underline"
                        style={{ color: "{primaryColor}" }}
                      >
                        {link.url}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
