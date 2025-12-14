import { Circle, Briefcase, GraduationCap, Mail, Phone, MapPin } from "lucide-react";
import type { Resume } from "@/lib/api/types";
import type { TemplateConfig } from "@/lib/types/templates";
import { formatPhoneDisplay, getFullName, type PhoneFormat } from "@/lib/validations";

interface InfographicLiteTemplateProps {
  resume: Resume;
  config?: TemplateConfig;
}

export function InfographicLiteTemplate({ resume, config }: InfographicLiteTemplateProps) {
  const { personalInfo, experience, education, skills } = resume.content;
  const primaryColor = config?.colorScheme?.primary || "#f97316";

  return (
    <div className="mx-auto max-w-[21cm] bg-white text-gray-900 shadow-lg p-8">
      <div className="flex items-center gap-6 mb-8">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold"
          style={{ backgroundColor: primaryColor }}
        >
          <Circle className="h-16 w-16" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">
            {getFullName(personalInfo.firstName, personalInfo.lastName, personalInfo.nameOrder) ||
              "Your Name"}
          </h1>
          <div className="flex flex-wrap gap-3 text-sm">
            {personalInfo.email && (
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {personalInfo.email}
              </span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {formatPhoneDisplay(personalInfo.phone, personalInfo.phoneFormat as PhoneFormat)}
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
      </div>

      {personalInfo.summary && (
        <div className="mb-6 p-4 rounded" style={{ backgroundColor: `${primaryColor}15` }}>
          <p className="text-gray-700">{personalInfo.summary}</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-4 text-center rounded" style={{ backgroundColor: `${primaryColor}10` }}>
          <div className="text-3xl font-bold" style={{ color: primaryColor }}>
            {experience?.length || 0}
          </div>
          <div className="text-sm text-gray-600">Years Experience</div>
        </div>
        <div className="p-4 text-center rounded" style={{ backgroundColor: `${primaryColor}10` }}>
          <div className="text-3xl font-bold" style={{ color: primaryColor }}>
            {education?.length || 0}
          </div>
          <div className="text-sm text-gray-600">Degrees</div>
        </div>
        <div className="p-4 text-center rounded" style={{ backgroundColor: `${primaryColor}10` }}>
          <div className="text-3xl font-bold" style={{ color: primaryColor }}>
            {typeof skills === "object" && "technical" in skills && Array.isArray(skills.technical)
              ? skills.technical.length
              : 0}
          </div>
          <div className="text-sm text-gray-600">Skills</div>
        </div>
      </div>

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
            <div
              key={idx}
              className="mb-4 p-3 rounded border-l-4"
              style={{
                borderColor: primaryColor,
                backgroundColor: `${primaryColor}05`,
              }}
            >
              <div className="flex justify-between">
                <h3 className="font-bold">{exp.position}</h3>
                <span className="text-xs text-gray-600">
                  {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              <p className="text-sm text-gray-700">{exp.company}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        {skills && (
          <div>
            <h2 className="text-lg font-bold mb-3" style={{ color: primaryColor }}>
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {typeof skills === "object" &&
                "technical" in skills &&
                Array.isArray(skills.technical) &&
                skills.technical.map((skill: any, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded text-white text-xs"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {skill.name || skill}
                  </span>
                ))}
            </div>
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
              <div
                key={idx}
                className="mb-2 p-2 rounded"
                style={{ backgroundColor: `${primaryColor}08` }}
              >
                <h3 className="font-semibold text-sm">{edu.degree}</h3>
                <p className="text-xs text-gray-700">{edu.institution}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
