import type { Resume } from "@/lib/api/types";
import { formatPhoneDisplay, getFullName, type PhoneFormat } from "@/lib/validations";

interface MinimalTemplateProps {
  resume: Resume;
}

export function MinimalTemplate({ resume }: MinimalTemplateProps) {
  const { personalInfo, experience, education, skills, certifications, links } =
    resume.content;

  return (
    <div
      className="mx-auto max-w-[21cm] bg-white p-16 font-sans text-gray-900 shadow-lg"
      style={{ colorScheme: "light" }}
    >
      {/* Header Section */}
      <header className="mb-12">
        <h1 className="mb-3 text-5xl font-light tracking-tight">
          {getFullName(
            personalInfo.firstName,
            personalInfo.lastName,
            personalInfo.nameOrder,
          ) || "Your Name"}
        </h1>
        <div className="space-x-4 text-sm text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{formatPhoneDisplay(personalInfo.phone, personalInfo.phoneFormat as PhoneFormat)}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-12">
          <p className="text-sm leading-relaxed text-gray-700">
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-6 text-xs font-semibold tracking-wider text-gray-500 uppercase">
            Experience
          </h2>
          <div className="space-y-8">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="mb-2 flex items-baseline justify-between">
                  <h3 className="text-lg font-medium">{exp.position}</h3>
                  <span className="text-xs text-gray-500">
                    {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <p className="mb-3 text-sm text-gray-600">{exp.company}</p>
                {exp.description && (
                  <p className="mb-2 text-sm leading-relaxed text-gray-700">
                    {exp.description}
                  </p>
                )}
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="space-y-1">
                    {exp.highlights.map((highlight, idx) => (
                      <li
                        key={idx}
                        className="relative pl-4 text-sm text-gray-700 before:absolute before:left-0 before:content-['—']"
                      >
                        {highlight}
                      </li>
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
        <section className="mb-12">
          <h2 className="mb-6 text-xs font-semibold tracking-wider text-gray-500 uppercase">
            Education
          </h2>
          <div className="space-y-6">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="mb-2 flex items-baseline justify-between">
                  <h3 className="text-lg font-medium">{edu.degree}</h3>
                  <span className="text-xs text-gray-500">
                    {edu.startDate} — {edu.current ? "Present" : edu.endDate}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{edu.institution}</p>
                <p className="text-sm text-gray-500">{edu.field}</p>
                {edu.gpa && (
                  <p className="mt-1 text-sm text-gray-500">GPA: {edu.gpa}</p>
                )}
                {edu.honors && edu.honors.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {edu.honors.map((honor, idx) => (
                      <li
                        key={idx}
                        className="relative pl-4 text-sm text-gray-700 before:absolute before:left-0 before:content-['—']"
                      >
                        {honor}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {(skills.technical?.length > 0 ||
        skills.languages?.length > 0 ||
        skills.tools?.length > 0 ||
        skills.soft?.length > 0) && (
        <section className="mb-12">
          <h2 className="mb-6 text-xs font-semibold tracking-wider text-gray-500 uppercase">
            Skills
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {skills.technical && skills.technical.length > 0 && (
              <div>
                <h3 className="mb-2 text-xs font-medium text-gray-700">
                  Technical
                </h3>
                <p className="text-sm text-gray-600">
                  {skills.technical.join(" • ")}
                </p>
              </div>
            )}
            {skills.languages && skills.languages.length > 0 && (
              <div>
                <h3 className="mb-2 text-xs font-medium text-gray-700">
                  Languages
                </h3>
                <p className="text-sm text-gray-600">
                  {skills.languages.join(" • ")}
                </p>
              </div>
            )}
            {skills.tools && skills.tools.length > 0 && (
              <div>
                <h3 className="mb-2 text-xs font-medium text-gray-700">
                  Tools
                </h3>
                <p className="text-sm text-gray-600">
                  {skills.tools.join(" • ")}
                </p>
              </div>
            )}
            {skills.soft && skills.soft.length > 0 && (
              <div>
                <h3 className="mb-2 text-xs font-medium text-gray-700">
                  Soft Skills
                </h3>
                <p className="text-sm text-gray-600">
                  {skills.soft.join(" • ")}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-6 text-xs font-semibold tracking-wider text-gray-500 uppercase">
            Certifications
          </h2>
          <div className="space-y-3">
            {certifications.map((cert) => (
              <div key={cert.id}>
                <p className="text-sm font-medium text-gray-800">{cert.name}</p>
                <p className="text-xs text-gray-600">
                  {cert.issuer} • {cert.date}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Links */}
      {links.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-6 text-xs font-semibold tracking-wider text-gray-500 uppercase">
            Links
          </h2>
          <div className="space-y-2">
            {links.map((link) => (
              <div key={link.id} className="flex items-baseline gap-3">
                <span className="min-w-[100px] text-sm font-medium text-gray-700">
                  {link.label}
                </span>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  {link.url}
                </a>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
