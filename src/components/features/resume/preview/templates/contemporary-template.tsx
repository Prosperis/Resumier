import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
} from "lucide-react";
import type { Resume } from "@/lib/api/types";
import type { TemplateConfig } from "@/lib/types/templates";

interface ContemporaryTemplateProps {
  resume: Resume;
  config?: TemplateConfig;
}

export function ContemporaryTemplate({
  resume,
  config,
}: ContemporaryTemplateProps) {
  const { personalInfo, experience, education, skills, certifications } =
    resume.content;
  const primaryColor = config?.colorScheme?.primary || "#64748b";

  return (
    <div className="mx-auto max-w-[21cm] bg-white text-gray-900 shadow-lg p-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">
          {personalInfo.name || "Your Name"}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {personalInfo.location}
            </span>
          )}
        </div>
      </div>

      {personalInfo.summary && (
        <div
          className="mb-8 pb-6 border-l-2 pl-6"
          style={{ borderColor: primaryColor }}
        >
          <p className="text-gray-700 leading-relaxed">
            {personalInfo.summary}
          </p>
        </div>
      )}

      {experience && experience.length > 0 && (
        <div className="mb-8">
          <h2
            className="text-xl font-bold mb-4 flex items-center gap-2"
            style={{ color: primaryColor }}
          >
            <Briefcase className="h-5 w-5" />
            Experience
          </h2>
          {experience.map((exp, idx) => (
            <div
              key={idx}
              className="mb-6 pb-4 border-l-2 pl-6"
              style={{ borderColor: `${primaryColor}40` }}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg">{exp.position}</h3>
                  <p className="text-gray-700">{exp.company}</p>
                </div>
                <span className="text-sm text-gray-600">
                  {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              {exp.description && (
                <p className="text-sm text-gray-700 mb-2">{exp.description}</p>
              )}
              {exp.highlights && exp.highlights.length > 0 && (
                <ul className="space-y-1 text-sm text-gray-700">
                  {exp.highlights.map((highlight, i) => (
                    <li key={i}>• {highlight}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-8">
        {education && education.length > 0 && (
          <div>
            <h2
              className="text-xl font-bold mb-4 flex items-center gap-2"
              style={{ color: primaryColor }}
            >
              <GraduationCap className="h-5 w-5" />
              Education
            </h2>
            {education.map((edu, idx) => (
              <div
                key={idx}
                className="mb-4 pb-4 border-l-2 pl-4"
                style={{ borderColor: `${primaryColor}40` }}
              >
                <h3 className="font-bold">{edu.degree}</h3>
                <p className="text-sm text-gray-700">{edu.institution}</p>
                <p className="text-xs text-gray-600">
                  {edu.startDate} - {edu.endDate}
                </p>
              </div>
            ))}
          </div>
        )}

        <div>
          {skills && (
            <div className="mb-6">
              <h2
                className="text-xl font-bold mb-4"
                style={{ color: primaryColor }}
              >
                Skills
              </h2>
              <div className="space-y-2">
                {typeof skills === "object" &&
                  "technical" in skills &&
                  Array.isArray(skills.technical) &&
                  skills.technical.map((skill: any, idx: number) => (
                    <div
                      key={idx}
                      className="text-sm text-gray-700 border-l-2 pl-3"
                      style={{ borderColor: primaryColor }}
                    >
                      {skill.name || skill}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {certifications && certifications.length > 0 && (
            <div>
              <h2
                className="text-xl font-bold mb-4 flex items-center gap-2"
                style={{ color: primaryColor }}
              >
                <Award className="h-5 w-5" />
                Certifications
              </h2>
              {certifications.map((cert, idx) => (
                <div key={idx} className="mb-2 text-sm text-gray-700">
                  <p className="font-semibold">{cert.name}</p>
                  {cert.issuer && (
                    <p className="text-xs text-gray-600">{cert.issuer}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
