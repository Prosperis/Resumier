/**
 * Timeline Template
 * Visual timeline format with dots and connecting lines
 * Layout: Timeline-style experience with vertical line
 */

import {
  Briefcase,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import type { Resume } from "@/lib/api/types";
import type { TemplateConfig } from "@/lib/types/templates";

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
        <h1 className="mb-2 text-4xl font-bold">{personalInfo.name || "Your Name"}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
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

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mb-8">
          <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
        </div>
      )}

      {/* Experience Timeline */}
      {experience && experience.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold" style={{ color: primaryColor }}>
            <Briefcase className="h-6 w-6" />
            Experience
          </h2>
          <div className="relative">
            {/* Vertical timeline line */}
            <div 
              className="absolute left-[7px] top-2 bottom-2 w-0.5"
              style={{ backgroundColor: primaryColor }}
            />
            
            <div className="space-y-8">
              {experience.map((exp, index) => (
                <div key={index} className="relative pl-8">
                  {/* Timeline dot */}
                  <div 
                    className="absolute left-0 top-1.5 h-4 w-4 rounded-full border-4 border-white shadow"
                    style={{ backgroundColor: primaryColor }}
                  />
                  
                  <div className="mb-2">
                    <h3 className="text-lg font-bold">{exp.position}</h3>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <p className="font-semibold text-gray-700">{exp.company}</p>
                      <p className="text-sm text-gray-600">
                        {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                      </p>
                    </div>
                  </div>
                  
                  {exp.description && (
                    <p className="mb-3 text-gray-700 text-sm">{exp.description}</p>
                  )}
                  
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="space-y-1.5 text-sm">
                      {exp.highlights.map((highlight, i) => (
                        <li key={i} className="flex gap-2 text-gray-700">
                          <span style={{ color: primaryColor }}>•</span>
                          <span>{highlight}</span>
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
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold" style={{ color: primaryColor }}>
            <GraduationCap className="h-6 w-6" />
            Education
          </h2>
          <div className="relative">
            {/* Vertical timeline line */}
            <div 
              className="absolute left-[7px] top-2 bottom-2 w-0.5"
              style={{ backgroundColor: primaryColor }}
            />
            
            <div className="space-y-6">
              {education.map((edu, index) => (
                <div key={index} className="relative pl-8">
                  {/* Timeline dot */}
                  <div 
                    className="absolute left-0 top-1.5 h-4 w-4 rounded-full border-4 border-white shadow"
                    style={{ backgroundColor: primaryColor }}
                  />
                  
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="font-bold">{edu.degree}</h3>
                      <p className="text-gray-700">{edu.institution}</p>
                      {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
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
          <h2 className="mb-4 text-2xl font-bold" style={{ color: primaryColor }}>
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {typeof skills === 'object' && 'technical' in skills && Array.isArray(skills.technical) && 
              skills.technical.map((skill: any, index: number) => (
                <span 
                  key={index}
                  className="px-3 py-1 rounded-full text-sm text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  {skill.name || skill}
                </span>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
}
