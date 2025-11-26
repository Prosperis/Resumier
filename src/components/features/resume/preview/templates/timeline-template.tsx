/**
 * Timeline Template
 * Visual timeline format with dots and connecting lines
 * Layout: Timeline-style experience with vertical line
 */

import { Briefcase, GraduationCap, Mail, MapPin, Phone } from "lucide-react";
import type { Resume } from "@/lib/api/types";
import type { TemplateConfig } from "@/lib/types/templates";
import { getFullName } from "@/lib/validations";

interface TimelineTemplateProps {
  resume: Resume;
  config?: TemplateConfig;
}

export function TimelineTemplate({ resume, config }: TimelineTemplateProps) {
  const { personalInfo, experience, education, skills } = resume.content;
  const primaryColor = config?.colorScheme?.primary || "#10b981";

  return (
    <div
      className="mx-auto max-w-[21cm] bg-white text-gray-900 shadow-lg p-12"
      style={{ colorScheme: "light" }}
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">
          {getFullName(personalInfo.firstName, personalInfo.lastName, personalInfo.nameOrder) || "Your Name"}
        </h1>
        <div
          className="flex flex-wrap gap-4 text-sm text-gray-600"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            fontSize: "0.875rem",
            alignItems: "center",
          }}
        >
          {personalInfo.email && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
                lineHeight: "1.5rem",
                height: "1.5rem",
              }}
            >
              <Mail
                className="h-4 w-4"
                style={{
                  display: "inline-block",
                  width: "1rem",
                  height: "1rem",
                  flexShrink: 0,
                  verticalAlign: "middle",
                  lineHeight: "1.5rem",
                }}
              />
              <span
                style={{
                  lineHeight: "1.5rem",
                  fontSize: "0.875rem",
                  display: "inline-block",
                  verticalAlign: "middle",
                }}
              >
                {personalInfo.email}
              </span>
            </div>
          )}
          {personalInfo.phone && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
                lineHeight: "1.5rem",
                height: "1.5rem",
              }}
            >
              <Phone
                className="h-4 w-4"
                style={{
                  display: "inline-block",
                  width: "1rem",
                  height: "1rem",
                  flexShrink: 0,
                  verticalAlign: "middle",
                  lineHeight: "1.5rem",
                }}
              />
              <span
                style={{
                  lineHeight: "1.5rem",
                  fontSize: "0.875rem",
                  display: "inline-block",
                  verticalAlign: "middle",
                }}
              >
                {personalInfo.phone}
              </span>
            </div>
          )}
          {personalInfo.location && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
                lineHeight: "1.5rem",
                height: "1.5rem",
              }}
            >
              <MapPin
                className="h-4 w-4"
                style={{
                  display: "inline-block",
                  width: "1rem",
                  height: "1rem",
                  flexShrink: 0,
                  verticalAlign: "middle",
                  lineHeight: "1.5rem",
                }}
              />
              <span
                style={{
                  lineHeight: "1.5rem",
                  fontSize: "0.875rem",
                  display: "inline-block",
                  verticalAlign: "middle",
                }}
              >
                {personalInfo.location}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mb-8">
          <p className="text-gray-700 leading-relaxed">
            {personalInfo.summary}
          </p>
        </div>
      )}

      {/* Experience Timeline */}
      {experience && experience.length > 0 && (
        <div className="mb-8">
          <h2
            className="mb-6 flex items-center gap-2 text-2xl font-bold"
            style={{
              color: primaryColor,
              marginBottom: "1.5rem",
              fontSize: "1.5rem",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Briefcase
              className="h-6 w-6"
              style={{
                width: "1.5rem",
                height: "1.5rem",
                flexShrink: 0,
                verticalAlign: "middle",
                display: "inline-block",
              }}
            />
            <span style={{ lineHeight: "1.5rem" }}>Experience</span>
          </h2>
          <div className="relative">
            {/* Vertical timeline line */}
            <div
              className="absolute left-[7px] top-2 bottom-2 w-0.5"
              style={{
                backgroundColor: primaryColor,
                position: "absolute",
                left: "7px",
                top: "0.5rem",
                bottom: "0.5rem",
                width: "2px",
              }}
            />

            <div
              className="space-y-8"
              style={{ marginTop: "0", marginBottom: "0" }}
            >
              {experience.map((exp, index) => (
                <div
                  key={index}
                  className="relative pl-8"
                  style={{
                    position: "relative",
                    paddingLeft: "2rem",
                    marginBottom: index < experience.length - 1 ? "2rem" : "0",
                  }}
                >
                  {/* Timeline dot */}
                  <div
                    className="absolute left-0 top-1.5 h-4 w-4 rounded-full border-4 border-white shadow"
                    style={{
                      backgroundColor: primaryColor,
                      position: "absolute",
                      left: "0px",
                      top: "0px",
                      height: "1rem",
                      width: "1rem",
                      borderRadius: "50%",
                      border: "4px solid white",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      marginTop: "0.125rem",
                    }}
                  />

                  <div className="mb-2">
                    <h3 className="text-lg font-bold">{exp.position}</h3>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <p className="font-semibold text-gray-700">
                        {exp.company}
                      </p>
                      <p className="text-sm text-gray-600">
                        {exp.startDate} -{" "}
                        {exp.current ? "Present" : exp.endDate}
                      </p>
                    </div>
                  </div>

                  {exp.description && (
                    <p className="mb-3 text-gray-700 text-sm">
                      {exp.description}
                    </p>
                  )}

                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul
                      className="space-y-1.5 text-sm"
                      style={{
                        listStyle: "none",
                        padding: 0,
                        margin: "0.5rem 0 0 0",
                      }}
                    >
                      {exp.highlights.map((highlight, i) => (
                        <li
                          key={i}
                          style={{
                            display: "block",
                            marginBottom:
                              i < exp.highlights.length - 1 ? "0.375rem" : "0",
                            lineHeight: "1.5",
                            color: "#374151",
                          }}
                        >
                          <span
                            style={{
                              color: primaryColor,
                              display: "inline-block",
                              verticalAlign: "top",
                              marginRight: "0.5rem",
                              lineHeight: "1.5",
                              width: "0.5rem",
                            }}
                          >
                            •
                          </span>
                          <span
                            style={{
                              display: "inline-block",
                              verticalAlign: "top",
                              lineHeight: "1.5",
                              width: "calc(100% - 1rem)",
                            }}
                          >
                            {highlight}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Education Timeline */}
      {education && education.length > 0 && (
        <div className="mb-8">
          <h2
            className="mb-6 flex items-center gap-2 text-2xl font-bold"
            style={{
              color: primaryColor,
              marginBottom: "1.5rem",
              fontSize: "1.5rem",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <GraduationCap
              className="h-6 w-6"
              style={{
                width: "1.5rem",
                height: "1.5rem",
                flexShrink: 0,
                verticalAlign: "middle",
                display: "inline-block",
              }}
            />
            <span style={{ lineHeight: "1.5rem" }}>Education</span>
          </h2>
          <div className="relative">
            {/* Vertical timeline line */}
            <div
              className="absolute left-[7px] top-2 bottom-2 w-0.5"
              style={{
                backgroundColor: primaryColor,
                position: "absolute",
                left: "7px",
                top: "0.5rem",
                bottom: "0.5rem",
                width: "2px",
              }}
            />

            <div
              className="space-y-6"
              style={{ marginTop: "0", marginBottom: "0" }}
            >
              {education.map((edu, index) => (
                <div
                  key={index}
                  className="relative pl-8"
                  style={{
                    position: "relative",
                    paddingLeft: "2rem",
                    marginBottom: index < education.length - 1 ? "1.5rem" : "0",
                  }}
                >
                  {/* Timeline dot */}
                  <div
                    className="absolute left-0 top-1.5 h-4 w-4 rounded-full border-4 border-white shadow"
                    style={{
                      backgroundColor: primaryColor,
                      position: "absolute",
                      left: "0px",
                      top: "0px",
                      height: "1rem",
                      width: "1rem",
                      borderRadius: "50%",
                      border: "4px solid white",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      marginTop: "0.125rem",
                    }}
                  />

                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="font-bold">{edu.degree}</h3>
                      <p className="text-gray-700">{edu.institution}</p>
                      {edu.gpa && (
                        <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {edu.startDate} - {edu.endDate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Skills */}
      {skills && (
        <div>
          <h2
            className="mb-4 text-2xl font-bold"
            style={{ color: primaryColor }}
          >
            Skills
          </h2>
          <div
            className="flex flex-wrap gap-2"
            style={{
              display: "block",
              marginTop: "0",
              marginBottom: "0",
            }}
          >
            {typeof skills === "object" &&
              "technical" in skills &&
              Array.isArray(skills.technical) &&
              skills.technical.map((skill: any, index: number) => (
                <span
                  key={index}
                  style={{
                    backgroundColor: primaryColor,
                    padding: "0.25rem 0.75rem",
                    borderRadius: "9999px",
                    fontSize: "0.875rem",
                    color: "white",
                    display: "inline-block",
                    verticalAlign: "middle",
                    lineHeight: "1.5",
                    marginRight: "0.5rem",
                    marginBottom: "0.5rem",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  {skill.name || skill}
                </span>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
