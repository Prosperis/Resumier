import type { Resume } from "@/lib/api/types";
import {
  formatPhoneDisplay,
  getFullName,
  type PhoneFormat,
} from "@/lib/validations";

interface ClassicTemplateProps {
  resume: Resume;
}

export function ClassicTemplate({ resume }: ClassicTemplateProps) {
  const { personalInfo, experience, education, skills, certifications, links } =
    resume.content;

  return (
    <div
      className="mx-auto max-w-[21cm] bg-white p-12 font-serif text-black shadow-lg"
      style={{ colorScheme: "light" }}
    >
      {/* Header Section - Centered */}
      <header className="mb-8 border-b-2 border-black pb-4 text-center">
        <h1 className="mb-2 text-3xl font-bold">
          {getFullName(
            personalInfo.firstName,
            personalInfo.lastName,
            personalInfo.nameOrder,
          ) || "Your Name"}
        </h1>
        <div className="space-x-3 text-sm">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && (
            <>
              <span>•</span>
              <span>
                {formatPhoneDisplay(
                  personalInfo.phone,
                  personalInfo.phoneFormat as PhoneFormat,
                )}
              </span>
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
          <h2 className="mb-2 border-b border-black text-lg font-bold uppercase">
            Professional Summary
          </h2>
          <p className="text-sm leading-relaxed">{personalInfo.summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 border-b border-black text-lg font-bold uppercase">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="mb-1 flex items-baseline justify-between">
                  <h3 className="font-bold">{exp.position}</h3>
                  <span className="text-sm">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <p className="mb-2 text-sm italic">{exp.company}</p>
                {exp.description && (
                  <p className="mb-2 text-sm">{exp.description}</p>
                )}
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="list-inside list-disc space-y-1 text-sm">
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
          <h2 className="mb-3 border-b border-black text-lg font-bold uppercase">
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="mb-1 flex items-baseline justify-between">
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
                  <ul className="mt-1 list-inside list-disc text-sm">
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
          <h2 className="mb-3 border-b border-black text-lg font-bold uppercase">
            Skills
          </h2>
          <div className="space-y-2">
            {skills.technical && skills.technical.length > 0 && (
              <div>
                <span className="text-sm font-semibold">Technical: </span>
                <span className="text-sm">{skills.technical.join(", ")}</span>
              </div>
            )}
            {skills.languages && skills.languages.length > 0 && (
              <div>
                <span className="text-sm font-semibold">Languages: </span>
                <span className="text-sm">{skills.languages.join(", ")}</span>
              </div>
            )}
            {skills.tools && skills.tools.length > 0 && (
              <div>
                <span className="text-sm font-semibold">Tools: </span>
                <span className="text-sm">{skills.tools.join(", ")}</span>
              </div>
            )}
            {skills.soft && skills.soft.length > 0 && (
              <div>
                <span className="text-sm font-semibold">Soft Skills: </span>
                <span className="text-sm">{skills.soft.join(", ")}</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 border-b border-black text-lg font-bold uppercase">
            Certifications
          </h2>
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
          <h2 className="mb-3 border-b border-black text-lg font-bold uppercase">
            Professional Links
          </h2>
          <div className="space-y-1">
            {links.map((link) => (
              <div key={link.id} className="text-sm">
                <span className="font-semibold">{link.label}: </span>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
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
