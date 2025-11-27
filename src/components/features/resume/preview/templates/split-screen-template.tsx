/**
 * Split Screen Template
 * Two-tone layout with dark left side and light right side
 * Layout: 40% dark sidebar + 60% light content
 */

import { Briefcase, GraduationCap, Mail, MapPin, Phone } from "lucide-react";
import type { Resume } from "@/lib/api/types";
import type { TemplateConfig } from "@/lib/types/templates";
import {
  formatPhoneDisplay,
  getFullName,
  type PhoneFormat,
} from "@/lib/validations";
import { ExperienceContentRenderer } from "./shared/experience-content";

interface SplitScreenTemplateProps {
  resume: Resume;
  config?: TemplateConfig;
}

export function SplitScreenTemplate({
  resume,
  config,
}: SplitScreenTemplateProps) {
  const { personalInfo, experience, education, skills, certifications } =
    resume.content;
  const primaryColor = config?.colorScheme?.primary || "#7c3aed";

  return (
    <div
      className="mx-auto flex max-w-[21cm] bg-white shadow-lg"
      style={{ colorScheme: "light", minHeight: "297mm" }}
    >
      {/* Dark Left Side - 40% */}
      <div
        className="w-2/5 p-8 text-white"
        style={{ backgroundColor: primaryColor }}
      >
        {/* Name */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 leading-tight">
            {getFullName(
              personalInfo.firstName,
              personalInfo.lastName,
              personalInfo.nameOrder,
            ) || "Your Name"}
          </h1>
          {personalInfo.summary && (
            <p className="text-sm leading-relaxed text-white/90 mt-4">
              {personalInfo.summary}
            </p>
          )}
        </div>

        {/* Contact */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 pb-2 border-b border-white/30">
            Contact
          </h2>
          <div className="space-y-3 text-sm">
            {personalInfo.email && (
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="break-all">{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>
                  {formatPhoneDisplay(
                    personalInfo.phone,
                    personalInfo.phoneFormat as PhoneFormat,
                  )}
                </span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{personalInfo.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {skills && (
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4 pb-2 border-b border-white/30">
              Skills
            </h2>
            <div className="space-y-2">
              {typeof skills === "object" &&
                "technical" in skills &&
                Array.isArray(skills.technical) &&
                skills.technical
                  .slice(0, 10)
                  .map((skill: any, index: number) => (
                    <div key={index} className="text-sm">
                      • {skill.name || skill}
                    </div>
                  ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <div>
            <h2 className="text-lg font-bold mb-4 pb-2 border-b border-white/30">
              Certifications
            </h2>
            <div className="space-y-2 text-sm">
              {certifications.map((cert, index) => (
                <div key={index}>
                  <div className="font-semibold">{cert.name}</div>
                  {cert.issuer && (
                    <div className="text-xs text-white/80">{cert.issuer}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Light Right Side - 60% */}
      <div className="w-3/5 p-8 text-gray-900">
        {/* Experience */}
        {experience && experience.length > 0 && (
          <div className="mb-8">
            <h2
              className="mb-6 flex items-center gap-3 text-2xl font-bold pb-3 border-b-2"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              <Briefcase className="h-6 w-6" />
              Experience
            </h2>
            <div className="space-y-6">
              {experience.map((exp, index) => (
                <div key={index}>
                  <div className="mb-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {exp.position}
                    </h3>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <p
                        className="font-semibold"
                        style={{ color: primaryColor }}
                      >
                        {exp.company}
                      </p>
                      <p className="text-sm text-gray-600">
                        {exp.startDate} -{" "}
                        {exp.current ? "Present" : exp.endDate}
                      </p>
                    </div>
                  </div>
                  <ExperienceContentRenderer
                    experience={exp}
                    textColor="text-gray-700"
                    bulletColor={primaryColor}
                    bulletStyle="arrow"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <div>
            <h2
              className="mb-6 flex items-center gap-3 text-2xl font-bold pb-3 border-b-2"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              <GraduationCap className="h-6 w-6" />
              Education
            </h2>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index}>
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                      <p className="text-gray-700">{edu.institution}</p>
                      {edu.gpa && (
                        <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {edu.startDate} - {edu.endDate}
                    </p>
                  </div>
                  {edu.honors && edu.honors.length > 0 && (
                    <p className="mt-2 text-sm text-gray-700">
                      {edu.honors.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
