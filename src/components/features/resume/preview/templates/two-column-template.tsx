/**
 * Two Column Pro Template
 * Modern two-column layout with prominent colored sidebar
 * Layout: 1/3 sidebar + 2/3 main content
 */

import { Award, Briefcase, GraduationCap, Mail, MapPin, Phone } from "lucide-react";
import type { Resume } from "@/lib/api/types";
import type { TemplateConfig } from "@/lib/types/templates";
import { formatPhoneDisplay, getFullName, type PhoneFormat } from "@/lib/validations";
import { ExperienceContentRenderer } from "./shared/experience-content";

interface TwoColumnTemplateProps {
  resume: Resume;
  config?: TemplateConfig;
}

export function TwoColumnTemplate({ resume, config }: TwoColumnTemplateProps) {
  const { personalInfo, experience, education, skills, certifications } = resume.content;

  const primaryColor = config?.colorScheme?.primary || "#6366f1";
  const secondaryColor = config?.colorScheme?.secondary || "#818cf8";

  return (
    <div
      className="mx-auto flex max-w-[21cm] bg-white text-gray-900 shadow-lg"
      style={{ colorScheme: "light" }}
    >
      {/* Left Sidebar - 1/3 width */}
      <div
        className="w-1/3 p-8 text-white"
        style={{
          background: `linear-gradient(180deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
        }}
      >
        {/* Profile */}
        <div className="mb-8">
          <div className="mb-4 h-32 w-32 rounded-full bg-white/20 mx-auto" />
          <h1 className="mb-2 text-2xl font-bold text-center">
            {getFullName(personalInfo.firstName, personalInfo.lastName, personalInfo.nameOrder) ||
              "Your Name"}
          </h1>
        </div>

        {/* Contact */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-bold border-b border-white/30 pb-2">Contact</h2>
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
                  {formatPhoneDisplay(personalInfo.phone, personalInfo.phoneFormat as PhoneFormat)}
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
            <h2 className="mb-4 text-lg font-bold border-b border-white/30 pb-2">Skills</h2>
            <div className="space-y-3">
              {typeof skills === "object" &&
                "technical" in skills &&
                Array.isArray(skills.technical) &&
                skills.technical.slice(0, 8).map((skill: any, index: number) => (
                  <div key={index}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium">{skill.name || skill}</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full"
                        style={{ width: `${85 - index * 5}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <div>
            <h2 className="mb-4 text-lg font-bold border-b border-white/30 pb-2">Certifications</h2>
            <div className="space-y-3 text-sm">
              {certifications.map((cert, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Award className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">{cert.name}</div>
                    {cert.issuer && <div className="text-xs text-white/80">{cert.issuer}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Content - 2/3 width */}
      <div className="w-2/3 p-8">
        {/* Summary */}
        {personalInfo.summary && (
          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-bold" style={{ color: primaryColor }}>
              Profile
            </h2>
            <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <div className="mb-8">
            <h2
              className="mb-6 flex items-center gap-3 text-2xl font-bold"
              style={{ color: primaryColor }}
            >
              <Briefcase className="h-6 w-6" />
              Experience
            </h2>
            <div className="space-y-6">
              {experience.map((exp, index) => (
                <div
                  key={index}
                  className="relative pl-6 border-l-2"
                  style={{ borderColor: primaryColor }}
                >
                  <div
                    className="absolute left-[-5px] top-1.5 h-2 w-2 rounded-full"
                    style={{ backgroundColor: primaryColor }}
                  />
                  <div className="mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <p className="font-semibold" style={{ color: primaryColor }}>
                        {exp.company}
                      </p>
                      <p className="text-sm text-gray-600">
                        {exp.startDate} - {exp.current ? "Present" : exp.endDate}
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
              className="mb-6 flex items-center gap-3 text-2xl font-bold"
              style={{ color: primaryColor }}
            >
              <GraduationCap className="h-6 w-6" />
              Education
            </h2>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div
                  key={index}
                  className="relative pl-6 border-l-2"
                  style={{ borderColor: primaryColor }}
                >
                  <div
                    className="absolute left-[-5px] top-1.5 h-2 w-2 rounded-full"
                    style={{ backgroundColor: primaryColor }}
                  />
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                      <p className="text-gray-700">{edu.institution}</p>
                      {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                    </div>
                    <p className="text-sm text-gray-600">
                      {edu.startDate} - {edu.endDate}
                    </p>
                  </div>
                  {edu.honors && edu.honors.length > 0 && (
                    <p className="mt-2 text-sm text-gray-700">{edu.honors.join(", ")}</p>
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
