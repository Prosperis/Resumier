/**
 * Quick Template Generation
 * Creates multiple template variants efficiently
 */

import type { Resume } from "@/lib/api/types";
import {
  Briefcase,
  GraduationCap,
  Award,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

interface TemplateProps {
  resume: Resume;
}

/**
 * Executive Template - Senior leadership focused
 */
export function ExecutiveTemplate({ resume }: TemplateProps) {
  const { personalInfo, experience, education, skills, certifications } =
    resume.content;

  return (
    <div className="mx-auto max-w-[21cm] bg-white p-12 text-gray-900 shadow-lg font-serif">
      {/* Executive Header */}
      <div className="border-b-4 border-gray-900 pb-6 mb-8">
        <h1 className="text-5xl font-bold mb-2 tracking-tight">
          {personalInfo.name || "Your Name"}
        </h1>
        <p className="text-2xl text-gray-600 font-light mb-4">
          {personalInfo.title || "Executive Title"}
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-700">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="h-4 w-4" /> {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone className="h-4 w-4" /> {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" /> {personalInfo.location}
            </span>
          )}
        </div>
      </div>

      {/* Executive Profile */}
      {personalInfo.summary && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            Executive Profile
          </h2>
          <p className="text-lg leading-relaxed text-gray-700 italic">
            {personalInfo.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center gap-2">
            <Briefcase className="h-6 w-6" /> Professional Experience
          </h2>
          {experience.map((exp, idx) => (
            <div key={idx} className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-xl">{exp.position}</h3>
                  <p className="text-lg text-gray-700">{exp.company}</p>
                </div>
                <span className="text-gray-600 whitespace-nowrap">
                  {exp.startDate} - {exp.endDate || "Present"}
                </span>
              </div>
              {exp.description && (
                <p className="text-gray-700 leading-relaxed">
                  {exp.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center gap-2">
            <GraduationCap className="h-6 w-6" /> Education
          </h2>
          {education.map((edu, idx) => (
            <div key={idx} className="mb-3">
              <h3 className="font-bold text-lg">{edu.degree}</h3>
              <p className="text-gray-700">{edu.institution}</p>
              {edu.graduationDate && (
                <p className="text-gray-600">{edu.graduationDate}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Core Competencies */}
      {skills && skills.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            Core Competencies
          </h2>
          <p className="text-gray-700">
            {skills.map((s) => s.name).join(" • ")}
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Academic Template - CV-style for researchers and professors
 */
export function AcademicTemplate({ resume }: TemplateProps) {
  const { personalInfo, experience, education, skills, certifications } =
    resume.content;

  return (
    <div className="mx-auto max-w-[21cm] bg-white p-12 text-gray-900 shadow-lg font-serif">
      {/* Centered Academic Header */}
      <div className="text-center border-b-2 border-gray-400 pb-6 mb-8">
        <h1 className="text-4xl font-bold mb-2">
          {personalInfo.name || "Your Name"}
        </h1>
        <p className="text-xl text-gray-600 mb-3">
          {personalInfo.title || "Academic Title"}
        </p>
        <div className="flex justify-center flex-wrap gap-3 text-sm text-gray-700">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
      </div>

      {/* Research Interests */}
      {personalInfo.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2 border-b border-gray-800 pb-1">
            Research Interests
          </h2>
          <p className="leading-relaxed">{personalInfo.summary}</p>
        </div>
      )}

      {/* Education First (Academic CV style) */}
      {education && education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2 border-b border-gray-800 pb-1">
            Education
          </h2>
          {education.map((edu, idx) => (
            <div key={idx} className="mb-4">
              <h3 className="font-bold">{edu.degree}</h3>
              <p>{edu.institution}</p>
              {edu.graduationDate && (
                <p className="text-gray-600">{edu.graduationDate}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Academic Appointments */}
      {experience && experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2 border-b border-gray-800 pb-1">
            Academic Appointments
          </h2>
          {experience.map((exp, idx) => (
            <div key={idx} className="mb-4">
              <h3 className="font-bold">{exp.position}</h3>
              <p>{exp.company}</p>
              <p className="text-gray-600 text-sm">
                {exp.startDate} - {exp.endDate || "Present"}
              </p>
              {exp.description && (
                <p className="mt-1 text-sm">{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Publications Placeholder */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2 border-b border-gray-800 pb-1">
          Selected Publications
        </h2>
        <p className="text-sm text-gray-600 italic">Publications list</p>
      </div>

      {/* Certifications/Awards */}
      {certifications && certifications.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-2 border-b border-gray-800 pb-1">
            Honors & Awards
          </h2>
          {certifications.map((cert, idx) => (
            <div key={idx} className="mb-2">
              <span className="font-semibold">{cert.name}</span>
              {cert.issuer && (
                <span className="text-gray-600"> - {cert.issuer}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Corporate Template - Conservative for finance/legal
 */
export function CorporateTemplate({ resume }: TemplateProps) {
  const { personalInfo, experience, education, skills, certifications } =
    resume.content;

  return (
    <div className="mx-auto max-w-[21cm] bg-white p-12 text-gray-900 shadow-lg font-serif">
      {/* Conservative Centered Header */}
      <div className="text-center border-b border-gray-300 pb-5 mb-6">
        <h1 className="text-3xl font-bold tracking-wide uppercase mb-2">
          {personalInfo.name || "Your Name"}
        </h1>
        <div className="text-sm text-gray-700 space-x-3">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>•</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>•</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
      </div>

      {/* Professional Summary */}
      {personalInfo.summary && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wide mb-2 border-b border-gray-300 pb-1">
            Professional Summary
          </h2>
          <p className="text-sm leading-relaxed">{personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wide mb-2 border-b border-gray-300 pb-1">
            Professional Experience
          </h2>
          {experience.map((exp, idx) => (
            <div key={idx} className="mb-5">
              <div className="flex justify-between mb-1">
                <h3 className="font-bold">{exp.position}</h3>
                <span className="text-sm text-gray-600">
                  {exp.startDate} - {exp.endDate || "Present"}
                </span>
              </div>
              <p className="text-gray-700 font-semibold">{exp.company}</p>
              {exp.description && (
                <p className="text-sm mt-1 leading-relaxed">
                  {exp.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wide mb-2 border-b border-gray-300 pb-1">
            Education
          </h2>
          {education.map((edu, idx) => (
            <div key={idx} className="mb-3">
              <h3 className="font-bold">{edu.degree}</h3>
              <p>{edu.institution}</p>
              {edu.graduationDate && (
                <p className="text-gray-600 text-sm">{edu.graduationDate}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wide mb-2 border-b border-gray-300 pb-1">
            Professional Skills
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {skills.map((skill, idx) => (
              <span key={idx} className="text-sm">
                • {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide mb-2 border-b border-gray-300 pb-1">
            Professional Certifications
          </h2>
          {certifications.map((cert, idx) => (
            <div key={idx} className="text-sm mb-1">
              <span className="font-semibold">{cert.name}</span>
              {cert.issuer && (
                <span className="text-gray-600"> - {cert.issuer}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Tech Modern Template - Developer-focused with skills emphasis
 */
export function TechModernTemplate({ resume }: TemplateProps) {
  const { personalInfo, experience, education, skills } = resume.content;

  return (
    <div className="mx-auto max-w-[21cm] bg-white text-gray-900 shadow-lg">
      {/* Tech Header with Blue Accent */}
      <div
        className="p-8"
        style={{ backgroundColor: "#3b82f6", color: "white" }}
      >
        <h1 className="text-4xl font-bold mb-2">
          {personalInfo.name || "Your Name"}
        </h1>
        <p className="text-xl mb-3">{personalInfo.title || "Developer"}</p>
        <div className="flex flex-wrap gap-4 text-sm">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
      </div>

      <div className="flex gap-6 p-8">
        {/* Main Content */}
        <div className="flex-[2]">
          {/* About */}
          {personalInfo.summary && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2 text-blue-600 border-b-2 border-blue-600 pb-1">
                About
              </h2>
              <p className="leading-relaxed">{personalInfo.summary}</p>
            </div>
          )}

          {/* Experience */}
          {experience && experience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2 text-blue-600 border-b-2 border-blue-600 pb-1">
                Experience
              </h2>
              {experience.map((exp, idx) => (
                <div key={idx} className="mb-4">
                  <h3 className="font-bold text-lg">{exp.position}</h3>
                  <p className="text-gray-700 font-semibold">{exp.company}</p>
                  <p className="text-sm text-gray-600 mb-1">
                    {exp.startDate} - {exp.endDate || "Present"}
                  </p>
                  {exp.description && (
                    <p className="text-sm">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="flex-1 bg-gray-50 p-6 -mr-8 -mb-8">
          {/* Skills */}
          {skills && skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3 text-blue-600">Skills</h2>
              <div className="space-y-2">
                {skills.map((skill, idx) => (
                  <div key={idx}>
                    <span className="text-sm font-semibold">{skill.name}</span>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${skill.level || 70}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <div>
              <h2 className="text-lg font-bold mb-3 text-blue-600">
                Education
              </h2>
              {education.map((edu, idx) => (
                <div key={idx} className="mb-3">
                  <h3 className="font-bold text-sm">{edu.degree}</h3>
                  <p className="text-sm">{edu.institution}</p>
                  {edu.graduationDate && (
                    <p className="text-xs text-gray-600">
                      {edu.graduationDate}
                    </p>
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

/**
 * Creative Professional Template - Balanced creativity
 */
export function CreativeProfessionalTemplate({ resume }: TemplateProps) {
  const { personalInfo, experience, education, skills } = resume.content;

  return (
    <div className="mx-auto max-w-[21cm] bg-white text-gray-900 shadow-lg">
      {/* Creative Header with Gradient */}
      <div
        className="p-8"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        }}
      >
        <h1 className="text-4xl font-bold mb-2">
          {personalInfo.name || "Your Name"}
        </h1>
        <p className="text-xl font-light mb-4">
          {personalInfo.title || "Creative Professional"}
        </p>
        <div className="flex flex-wrap gap-4 text-sm opacity-90">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>•</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
        </div>
      </div>

      <div className="p-8">
        {/* Summary */}
        {personalInfo.summary && (
          <div className="mb-6 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-600">
            <p className="leading-relaxed">{personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4 text-purple-700">
              Experience
            </h2>
            {experience.map((exp, idx) => (
              <div key={idx} className="mb-5 pl-4 border-l-2 border-purple-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{exp.position}</h3>
                    <p className="text-purple-700 font-semibold">
                      {exp.company}
                    </p>
                  </div>
                  <span className="text-sm text-gray-600 bg-purple-50 px-2 py-1 rounded">
                    {exp.startDate} - {exp.endDate || "Present"}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-sm mt-2 leading-relaxed">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Skills & Education Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Skills */}
          {skills && skills.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-purple-700">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-purple-700">
                Education
              </h2>
              {education.map((edu, idx) => (
                <div key={idx} className="mb-3">
                  <h3 className="font-bold">{edu.degree}</h3>
                  <p className="text-sm">{edu.institution}</p>
                  {edu.graduationDate && (
                    <p className="text-sm text-gray-600">
                      {edu.graduationDate}
                    </p>
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
