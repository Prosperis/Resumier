import { Briefcase, GraduationCap, Target, TrendingUp } from "lucide-react";
import type { Resume } from "@/lib/api/types";
import type { TemplateConfig } from "@/lib/types/templates";
import { formatPhoneDisplay, getFullName, type PhoneFormat } from "@/lib/validations";

interface ProfessionalServicesTemplateProps {
  resume: Resume;
  config?: TemplateConfig;
}

export function ProfessionalServicesTemplate({
  resume,
  config,
}: ProfessionalServicesTemplateProps) {
  const { personalInfo, experience, education, skills } = resume.content;
  const primaryColor = config?.colorScheme?.primary || "#0ea5e9";

  return (
    <div className="mx-auto max-w-[21cm] bg-white text-gray-900 shadow-lg p-8">
      <div
        className="flex justify-between items-start mb-6 pb-4 border-b-2"
        style={{ borderColor: primaryColor }}
      >
        <div>
          <h1 className="text-3xl font-bold mb-1" style={{ color: primaryColor }}>
            {getFullName(personalInfo.firstName, personalInfo.lastName, personalInfo.nameOrder) ||
              "Your Name"}
          </h1>
          <div className="text-sm text-gray-600">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && (
              <span>
                {" "}
                | {formatPhoneDisplay(personalInfo.phone, personalInfo.phoneFormat as PhoneFormat)}
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          {personalInfo.location && (
            <p className="text-sm text-gray-600">{personalInfo.location}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 text-center rounded" style={{ backgroundColor: `${primaryColor}15` }}>
          <Target className="h-8 w-8 mx-auto mb-2" style={{ color: primaryColor }} />
          <p className="text-sm font-semibold">Results-Driven</p>
        </div>
        <div className="p-4 text-center rounded" style={{ backgroundColor: `${primaryColor}15` }}>
          <TrendingUp className="h-8 w-8 mx-auto mb-2" style={{ color: primaryColor }} />
          <p className="text-sm font-semibold">Growth Focused</p>
        </div>
        <div className="p-4 text-center rounded" style={{ backgroundColor: `${primaryColor}15` }}>
          <Briefcase className="h-8 w-8 mx-auto mb-2" style={{ color: primaryColor }} />
          <p className="text-sm font-semibold">{experience?.length || 0}+ Years</p>
        </div>
      </div>

      {personalInfo.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3" style={{ color: primaryColor }}>
            Professional Profile
          </h2>
          <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
        </div>
      )}

      {experience && experience.length > 0 && (
        <div className="mb-6">
          <h2
            className="text-xl font-bold mb-3 flex items-center gap-2"
            style={{ color: primaryColor }}
          >
            <Briefcase className="h-5 w-5" />
            Experience
          </h2>
          {experience.map((exp, idx) => (
            <div
              key={idx}
              className="mb-4 p-3 rounded"
              style={{
                backgroundColor: `${primaryColor}05`,
                borderLeft: `3px solid ${primaryColor}`,
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg">{exp.position}</h3>
                  <p className="text-gray-700 font-medium">{exp.company}</p>
                </div>
                <span className="text-sm text-gray-600">
                  {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              {exp.highlights && exp.highlights.length > 0 && (
                <ul className="space-y-1">
                  {exp.highlights.map((highlight, i) => (
                    <li key={i} className="text-sm text-gray-700">
                      ✓ {highlight}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        {skills && (
          <div>
            <h2 className="text-xl font-bold mb-3" style={{ color: primaryColor }}>
              Core Competencies
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {typeof skills === "object" &&
                "technical" in skills &&
                Array.isArray(skills.technical) &&
                skills.technical.map((skill: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-2 text-sm text-center rounded"
                    style={{ backgroundColor: `${primaryColor}10` }}
                  >
                    {skill.name || skill}
                  </div>
                ))}
            </div>
          </div>
        )}

        {education && education.length > 0 && (
          <div>
            <h2
              className="text-xl font-bold mb-3 flex items-center gap-2"
              style={{ color: primaryColor }}
            >
              <GraduationCap className="h-5 w-5" />
              Education
            </h2>
            {education.map((edu, idx) => (
              <div
                key={idx}
                className="mb-3 p-3 rounded"
                style={{ backgroundColor: `${primaryColor}08` }}
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
      </div>
    </div>
  );
}
