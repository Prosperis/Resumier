import type { Resume } from "@/lib/api/types"

interface MinimalTemplateProps {
  resume: Resume
}

export function MinimalTemplate({ resume }: MinimalTemplateProps) {
  const { personalInfo, experience, education, skills, certifications, links } = resume.content

  return (
    <div className="bg-white text-gray-900 shadow-lg max-w-[21cm] mx-auto p-16 font-sans">
      {/* Header Section */}
      <header className="mb-12">
        <h1 className="text-5xl font-light mb-3 tracking-tight">
          {personalInfo.name || "Your Name"}
        </h1>
        <div className="text-sm text-gray-600 space-x-4">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-12">
          <p className="text-sm leading-relaxed text-gray-700">{personalInfo.summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-6">
            Experience
          </h2>
          <div className="space-y-8">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-lg font-medium">{exp.position}</h3>
                  <span className="text-xs text-gray-500">
                    {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{exp.company}</p>
                {exp.description && (
                  <p className="text-sm text-gray-700 mb-2 leading-relaxed">{exp.description}</p>
                )}
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="space-y-1">
                    {exp.highlights.map((highlight, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-gray-700 pl-4 relative before:content-['—'] before:absolute before:left-0"
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
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-6">
            Education
          </h2>
          <div className="space-y-6">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-lg font-medium">{edu.degree}</h3>
                  <span className="text-xs text-gray-500">
                    {edu.startDate} — {edu.current ? "Present" : edu.endDate}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{edu.institution}</p>
                <p className="text-sm text-gray-500">{edu.field}</p>
                {edu.gpa && <p className="text-sm text-gray-500 mt-1">GPA: {edu.gpa}</p>}
                {edu.honors && edu.honors.length > 0 && (
                  <ul className="space-y-1 mt-2">
                    {edu.honors.map((honor, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-gray-700 pl-4 relative before:content-['—'] before:absolute before:left-0"
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
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-6">
            Skills
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {skills.technical && skills.technical.length > 0 && (
              <div>
                <h3 className="text-xs font-medium text-gray-700 mb-2">Technical</h3>
                <p className="text-sm text-gray-600">{skills.technical.join(" • ")}</p>
              </div>
            )}
            {skills.languages && skills.languages.length > 0 && (
              <div>
                <h3 className="text-xs font-medium text-gray-700 mb-2">Languages</h3>
                <p className="text-sm text-gray-600">{skills.languages.join(" • ")}</p>
              </div>
            )}
            {skills.tools && skills.tools.length > 0 && (
              <div>
                <h3 className="text-xs font-medium text-gray-700 mb-2">Tools</h3>
                <p className="text-sm text-gray-600">{skills.tools.join(" • ")}</p>
              </div>
            )}
            {skills.soft && skills.soft.length > 0 && (
              <div>
                <h3 className="text-xs font-medium text-gray-700 mb-2">Soft Skills</h3>
                <p className="text-sm text-gray-600">{skills.soft.join(" • ")}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-6">
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
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-6">
            Links
          </h2>
          <div className="space-y-2">
            {links.map((link) => (
              <div key={link.id} className="flex items-baseline gap-3">
                <span className="text-sm font-medium text-gray-700 min-w-[100px]">
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
  )
}
