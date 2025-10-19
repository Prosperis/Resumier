import type { Resume } from "@/lib/api/types"

interface ClassicTemplateProps {
  resume: Resume
}

export function ClassicTemplate({ resume }: ClassicTemplateProps) {
  const { personalInfo, experience, education, skills, certifications, links } = resume.content

  return (
    <div className="bg-white text-black shadow-lg max-w-[21cm] mx-auto p-12 font-serif">
      {/* Header Section - Centered */}
      <header className="text-center mb-8 pb-4 border-b-2 border-black">
        <h1 className="text-3xl font-bold mb-2">{personalInfo.name || "Your Name"}</h1>
        <div className="text-sm space-x-3">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && (
            <>
              <span>•</span>
              <span>{personalInfo.phone}</span>
            </>
          )}
          {personalInfo.location && (
            <>
              <span>•</span>
              <span>{personalInfo.location}</span>
            </>
          )}
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-2 uppercase border-b border-black">
            Professional Summary
          </h2>
          <p className="text-sm leading-relaxed">{personalInfo.summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-3 uppercase border-b border-black">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold">{exp.position}</h3>
                  <span className="text-sm">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <p className="text-sm italic mb-2">{exp.company}</p>
                {exp.description && <p className="text-sm mb-2">{exp.description}</p>}
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="list-disc list-inside text-sm space-y-1">
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
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-3 uppercase border-b border-black">Education</h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold">
                    {edu.degree} in {edu.field}
                  </h3>
                  <span className="text-sm">
                    {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                  </span>
                </div>
                <p className="text-sm italic">{edu.institution}</p>
                {edu.gpa && <p className="text-sm">GPA: {edu.gpa}</p>}
                {edu.honors && edu.honors.length > 0 && (
                  <ul className="list-disc list-inside text-sm mt-1">
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

      {/* Skills */}
      {(skills.technical?.length > 0 ||
        skills.languages?.length > 0 ||
        skills.tools?.length > 0 ||
        skills.soft?.length > 0) && (
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-3 uppercase border-b border-black">Skills</h2>
          <div className="space-y-2">
            {skills.technical && skills.technical.length > 0 && (
              <div>
                <span className="font-semibold text-sm">Technical: </span>
                <span className="text-sm">{skills.technical.join(", ")}</span>
              </div>
            )}
            {skills.languages && skills.languages.length > 0 && (
              <div>
                <span className="font-semibold text-sm">Languages: </span>
                <span className="text-sm">{skills.languages.join(", ")}</span>
              </div>
            )}
            {skills.tools && skills.tools.length > 0 && (
              <div>
                <span className="font-semibold text-sm">Tools: </span>
                <span className="text-sm">{skills.tools.join(", ")}</span>
              </div>
            )}
            {skills.soft && skills.soft.length > 0 && (
              <div>
                <span className="font-semibold text-sm">Soft Skills: </span>
                <span className="text-sm">{skills.soft.join(", ")}</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-3 uppercase border-b border-black">Certifications</h2>
          <div className="space-y-2">
            {certifications.map((cert) => (
              <div key={cert.id}>
                <p className="text-sm">
                  <span className="font-semibold">{cert.name}</span>
                  {" - "}
                  <span className="italic">{cert.issuer}</span>
                  {", "}
                  <span>{cert.date}</span>
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Links */}
      {links.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-3 uppercase border-b border-black">
            Professional Links
          </h2>
          <div className="space-y-1">
            {links.map((link) => (
              <div key={link.id} className="text-sm">
                <span className="font-semibold">{link.label}: </span>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="underline">
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
