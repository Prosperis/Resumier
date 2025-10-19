import {
  Award,
  Briefcase,
  GraduationCap,
  Link as LinkIcon,
  Mail,
  MapPin,
  Phone,
} from "lucide-react"
import type { Resume } from "@/lib/api/types"

interface ModernTemplateProps {
  resume: Resume
}

export function ModernTemplate({ resume }: ModernTemplateProps) {
  const { personalInfo, experience, education, skills, certifications, links } = resume.content

  return (
    <div className="bg-white text-gray-900 shadow-lg max-w-[21cm] mx-auto">
      {/* Header Section */}
      <div className="bg-primary text-primary-foreground p-8">
        <h1 className="text-4xl font-bold mb-2">{personalInfo.name || "Your Name"}</h1>
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
              <span>{personalInfo.phone}</span>
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
              <h2 className="text-xl font-bold text-primary mb-3 pb-1 border-b-2 border-primary">
                Professional Summary
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed">{personalInfo.summary}</p>
            </section>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-primary mb-3 pb-1 border-b-2 border-primary flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-base">{exp.position}</h3>
                      <span className="text-sm text-gray-600">
                        {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">{exp.company}</p>
                    {exp.description && (
                      <p className="text-sm text-gray-700 mb-2">{exp.description}</p>
                    )}
                    {exp.highlights && exp.highlights.length > 0 && (
                      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
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
              <h2 className="text-xl font-bold text-primary mb-3 pb-1 border-b-2 border-primary flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Education
              </h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-base">{edu.degree}</h3>
                      <span className="text-sm text-gray-600">
                        {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-700">{edu.institution}</p>
                    <p className="text-sm text-gray-600">{edu.field}</p>
                    {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                    {edu.honors && edu.honors.length > 0 && (
                      <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
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
              <h2 className="text-lg font-bold text-primary mb-3 pb-1 border-b-2 border-primary">
                Skills
              </h2>
              <div className="space-y-3">
                {skills.technical && skills.technical.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-1">Technical</h3>
                    <div className="flex flex-wrap gap-1">
                      {skills.technical.map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {skills.languages && skills.languages.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-1">Languages</h3>
                    <div className="flex flex-wrap gap-1">
                      {skills.languages.map((lang, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {skills.tools && skills.tools.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-1">Tools</h3>
                    <div className="flex flex-wrap gap-1">
                      {skills.tools.map((tool, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {skills.soft && skills.soft.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-1">Soft Skills</h3>
                    <div className="flex flex-wrap gap-1">
                      {skills.soft.map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
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
              <h2 className="text-lg font-bold text-primary mb-3 pb-1 border-b-2 border-primary flex items-center gap-2">
                <Award className="h-4 w-4" />
                Certifications
              </h2>
              <div className="space-y-2">
                {certifications.map((cert) => (
                  <div key={cert.id}>
                    <p className="text-sm font-semibold text-gray-800">{cert.name}</p>
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
              <h2 className="text-lg font-bold text-primary mb-3 pb-1 border-b-2 border-primary flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                Links
              </h2>
              <div className="space-y-2">
                {links.map((link) => (
                  <div key={link.id} className="flex items-start gap-2">
                    <LinkIcon className="h-3 w-3 mt-0.5 flex-shrink-0 text-primary" />
                    <div>
                      <p className="text-xs font-semibold text-gray-800">{link.label}</p>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline break-all"
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
  )
}
