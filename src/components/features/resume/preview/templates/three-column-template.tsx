import { Mail, Phone, MapPin, Briefcase, GraduationCap } from "lucide-react";
import type { Resume } from "@/lib/api/types";
import type { TemplateConfig } from "@/lib/types/templates";
import {
  formatPhoneDisplay,
  getFullName,
  type PhoneFormat,
} from "@/lib/validations";

interface ThreeColumnTemplateProps {
  resume: Resume;
  config?: TemplateConfig;
}

export function ThreeColumnTemplate({
  resume,
  config,
}: ThreeColumnTemplateProps) {
  const { personalInfo, experience, education, skills, certifications } =
    resume.content;
  const primaryColor = config?.colorScheme?.primary || "#8b5cf6";

  return (
    <div className="mx-auto max-w-[21cm] bg-white text-gray-900 shadow-lg">
      <div
        className="p-8 text-center"
        style={{ backgroundColor: primaryColor, color: "white" }}
      >
        <h1 className="text-4xl font-bold mb-2">
          {getFullName(
            personalInfo.firstName,
            personalInfo.lastName,
            personalInfo.nameOrder,
          ) || "Your Name"}
        </h1>
        <div className="flex justify-center gap-4 text-sm opacity-90">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {formatPhoneDisplay(
                personalInfo.phone,
                personalInfo.phoneFormat as PhoneFormat,
              )}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {personalInfo.location}
            </span>
          )}
        </div>
      </div>

      {personalInfo.summary && (
        <div
          className="p-6 text-center"
          style={{ backgroundColor: `${primaryColor}10` }}
        >
          <p className="text-gray-700">{personalInfo.summary}</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 p-6">
        <div
          className="pr-4 border-r"
          style={{ borderColor: `${primaryColor}40` }}
        >
          {skills && (
            <div className="mb-6">
              <h2
                className="text-lg font-bold mb-3"
                style={{ color: primaryColor }}
              >
                Skills
              </h2>
              <div className="space-y-2">
                {typeof skills === "object" &&
                  "technical" in skills &&
                  Array.isArray(skills.technical) &&
                  skills.technical
                    .slice(0, 8)
                    .map((skill: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-2 text-xs rounded"
                        style={{ backgroundColor: `${primaryColor}10` }}
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
                className="text-lg font-bold mb-3"
                style={{ color: primaryColor }}
              >
                Certifications
              </h2>
              {certifications.map((cert, idx) => (
                <div key={idx} className="mb-2 text-xs">
                  <p className="font-semibold">{cert.name}</p>
                  {cert.issuer && (
                    <p className="text-gray-600">{cert.issuer}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="col-span-2 pl-4">
          {experience && experience.length > 0 && (
            <div className="mb-6">
              <h2
                className="text-lg font-bold mb-3 flex items-center gap-2"
                style={{ color: primaryColor }}
              >
                <Briefcase className="h-5 w-5" />
                Experience
              </h2>
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
                    <p className="text-xs text-gray-700 mb-1">
                      {exp.description}
                    </p>
                  )}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="space-y-1">
                      {exp.highlights.slice(0, 2).map((highlight, i) => (
                        <li key={i} className="text-xs text-gray-700">
                          • {highlight}
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
                className="text-lg font-bold mb-3 flex items-center gap-2"
                style={{ color: primaryColor }}
              >
                <GraduationCap className="h-5 w-5" />
                Education
              </h2>
              {education.map((edu, idx) => (
                <div key={idx} className="mb-3">
                  <h3 className="font-bold text-sm">{edu.degree}</h3>
                  <p className="text-xs text-gray-700">{edu.institution}</p>
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
