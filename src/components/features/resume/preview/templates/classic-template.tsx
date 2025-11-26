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
      {experience.filter((exp) => exp.position || exp.company || exp.description || (exp.highlights && exp.highlights.length > 0)).length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 border-b border-black text-lg font-bold uppercase">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {experience.filter((exp) => exp.position || exp.company || exp.description || (exp.highlights && exp.highlights.length > 0)).map((exp) => {
              const dateRange = exp.startDate || exp.endDate || exp.current
                ? `${exp.startDate || ""}${exp.startDate && (exp.endDate || exp.current) ? " - " : ""}${exp.current ? "Present" : exp.endDate || ""}`
                : null;
              return (
                <div key={exp.id}>
                  <div className="mb-1 flex items-baseline justify-between">
                    {exp.position && <h3 className="font-bold">{exp.position}</h3>}
                    {dateRange && <span className="text-sm">{dateRange}</span>}
                  </div>
                  {exp.company && <p className="mb-2 text-sm italic">{exp.company}</p>}
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
              );
            })}
          </div>
        </section>
      )}

      {/* Education */}
      {education.filter((edu) => edu.degree || edu.institution || edu.field).length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 border-b border-black text-lg font-bold uppercase">
            Education
          </h2>
          <div className="space-y-3">
            {education.filter((edu) => edu.degree || edu.institution || edu.field).map((edu) => {
              const degreeField = [edu.degree, edu.field].filter(Boolean).join(" in ");
              const dateRange = edu.startDate || edu.endDate || edu.current
                ? `${edu.startDate || ""}${edu.startDate && (edu.endDate || edu.current) ? " - " : ""}${edu.current ? "Present" : edu.endDate || ""}`
                : null;
              return (
                <div key={edu.id}>
                  <div className="mb-1 flex items-baseline justify-between">
                    {degreeField && <h3 className="font-bold">{degreeField}</h3>}
                    {dateRange && <span className="text-sm">{dateRange}</span>}
                  </div>
                  {edu.institution && <p className="text-sm italic">{edu.institution}</p>}
                  {edu.gpa && <p className="text-sm">GPA: {edu.gpa}</p>}
                  {edu.honors && edu.honors.length > 0 && (
                    <ul className="mt-1 list-inside list-disc text-sm">
                      {edu.honors.map((honor, idx) => (
                        <li key={idx}>{honor}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
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
      {certifications.filter((cert) => cert.name || cert.issuer || cert.date).length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 border-b border-black text-lg font-bold uppercase">
            Certifications
          </h2>
          <div className="space-y-2">
            {certifications.filter((cert) => cert.name || cert.issuer || cert.date).map((cert) => (
              <div key={cert.id}>
                <p className="text-sm">
                  {cert.name && <span className="font-semibold">{cert.name}</span>}
                  {cert.name && cert.issuer && " - "}
                  {cert.issuer && <span className="italic">{cert.issuer}</span>}
                  {(cert.name || cert.issuer) && cert.date && ", "}
                  {cert.date && <span>{cert.date}</span>}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Links */}
      {links.filter((link) => link.label || link.url).length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 border-b border-black text-lg font-bold uppercase">
            Professional Links
          </h2>
          <div className="space-y-1">
            {links.filter((link) => link.label || link.url).map((link) => (
              <div key={link.id} className="text-sm">
                {link.label && <span className="font-semibold">{link.label}{link.url ? ": " : ""}</span>}
                {link.url && (
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {link.url}
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
