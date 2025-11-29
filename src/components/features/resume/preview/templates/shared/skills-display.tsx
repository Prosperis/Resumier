/**
 * Skills Display Component
 * Reusable skills display for templates
 */

import type { Skills, SkillWithLevel } from "@/lib/api/types";
import type { ColorScheme } from "@/lib/types/templates";

interface SkillsDisplayProps {
  skills: Skills;
  colorScheme?: ColorScheme;
  variant?: "inline" | "tags" | "columns" | "bars" | "grid";
  className?: string;
}

// Helper to get skill name from string or SkillWithLevel
function getSkillName(skill: string | SkillWithLevel): string {
  return typeof skill === "string" ? skill : skill.name;
}

// Helper to get skill level (default to 8 if not specified, scale 1-10)
function getSkillLevel(skill: string | SkillWithLevel): number {
  if (typeof skill === "string") return 8; // Default level for string skills
  return skill.level;
}

export function SkillsDisplay({
  skills,
  colorScheme,
  variant = "inline",
  className = "",
}: SkillsDisplayProps) {
  const textColor = colorScheme?.text || "#111827";
  const textLightColor = colorScheme?.textLight || "#6b7280";
  const primaryColor = colorScheme?.primary || "#8b5cf6";

  const hasSkills =
    skills.technical?.length > 0 ||
    skills.languages?.length > 0 ||
    skills.tools?.length > 0 ||
    skills.soft?.length > 0;

  if (!hasSkills) return null;

  // Inline variant - comma-separated
  if (variant === "inline") {
    return (
      <div className={`space-y-2 ${className}`}>
        {skills.technical && skills.technical.length > 0 && (
          <div>
            <span
              className="text-sm font-semibold"
              style={{ color: textColor }}
            >
              Technical:{" "}
            </span>
            <span className="text-sm" style={{ color: textLightColor }}>
              {skills.technical.map(getSkillName).join(", ")}
            </span>
          </div>
        )}
        {skills.languages && skills.languages.length > 0 && (
          <div>
            <span
              className="text-sm font-semibold"
              style={{ color: textColor }}
            >
              Languages:{" "}
            </span>
            <span className="text-sm" style={{ color: textLightColor }}>
              {skills.languages.map(getSkillName).join(", ")}
            </span>
          </div>
        )}
        {skills.tools && skills.tools.length > 0 && (
          <div>
            <span
              className="text-sm font-semibold"
              style={{ color: textColor }}
            >
              Tools:{" "}
            </span>
            <span className="text-sm" style={{ color: textLightColor }}>
              {skills.tools.map(getSkillName).join(", ")}
            </span>
          </div>
        )}
        {skills.soft && skills.soft.length > 0 && (
          <div>
            <span
              className="text-sm font-semibold"
              style={{ color: textColor }}
            >
              Soft Skills:{" "}
            </span>
            <span className="text-sm" style={{ color: textLightColor }}>
              {skills.soft.map(getSkillName).join(", ")}
            </span>
          </div>
        )}
      </div>
    );
  }

  // Tags variant - pill-style tags
  if (variant === "tags") {
    return (
      <div className={`space-y-3 ${className}`}>
        {skills.technical && skills.technical.length > 0 && (
          <div>
            <p
              className="mb-2 text-sm font-semibold"
              style={{ color: textColor }}
            >
              Technical
            </p>
            <div className="flex flex-wrap gap-2">
              {skills.technical.map((skill, idx) => (
                <span
                  key={idx}
                  className="rounded-full px-3 py-1 text-xs font-medium"
                  style={{
                    backgroundColor: `${primaryColor}15`,
                    color: primaryColor,
                  }}
                >
                  {getSkillName(skill)}
                </span>
              ))}
            </div>
          </div>
        )}
        {skills.tools && skills.tools.length > 0 && (
          <div>
            <p
              className="mb-2 text-sm font-semibold"
              style={{ color: textColor }}
            >
              Tools
            </p>
            <div className="flex flex-wrap gap-2">
              {skills.tools.map((skill, idx) => (
                <span
                  key={idx}
                  className="rounded-full px-3 py-1 text-xs font-medium"
                  style={{
                    backgroundColor: `${primaryColor}15`,
                    color: primaryColor,
                  }}
                >
                  {getSkillName(skill)}
                </span>
              ))}
            </div>
          </div>
        )}
        {skills.languages && skills.languages.length > 0 && (
          <div>
            <p
              className="mb-2 text-sm font-semibold"
              style={{ color: textColor }}
            >
              Languages
            </p>
            <div className="flex flex-wrap gap-2">
              {skills.languages.map((skill, idx) => (
                <span
                  key={idx}
                  className="rounded-full px-3 py-1 text-xs font-medium"
                  style={{
                    backgroundColor: `${primaryColor}15`,
                    color: primaryColor,
                  }}
                >
                  {getSkillName(skill)}
                </span>
              ))}
            </div>
          </div>
        )}
        {skills.soft && skills.soft.length > 0 && (
          <div>
            <p
              className="mb-2 text-sm font-semibold"
              style={{ color: textColor }}
            >
              Soft Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {skills.soft.map((skill, idx) => (
                <span
                  key={idx}
                  className="rounded-full px-3 py-1 text-xs font-medium"
                  style={{
                    backgroundColor: `${primaryColor}15`,
                    color: primaryColor,
                  }}
                >
                  {getSkillName(skill)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Columns variant - multi-column layout
  if (variant === "columns") {
    return (
      <div className={`grid grid-cols-2 gap-4 ${className}`}>
        {skills.technical && skills.technical.length > 0 && (
          <div>
            <p
              className="mb-2 text-sm font-semibold"
              style={{ color: textColor }}
            >
              Technical
            </p>
            <ul className="space-y-1 text-sm" style={{ color: textLightColor }}>
              {skills.technical.map((skill, idx) => (
                <li key={idx}>• {getSkillName(skill)}</li>
              ))}
            </ul>
          </div>
        )}
        {skills.tools && skills.tools.length > 0 && (
          <div>
            <p
              className="mb-2 text-sm font-semibold"
              style={{ color: textColor }}
            >
              Tools
            </p>
            <ul className="space-y-1 text-sm" style={{ color: textLightColor }}>
              {skills.tools.map((skill, idx) => (
                <li key={idx}>• {getSkillName(skill)}</li>
              ))}
            </ul>
          </div>
        )}
        {skills.languages && skills.languages.length > 0 && (
          <div>
            <p
              className="mb-2 text-sm font-semibold"
              style={{ color: textColor }}
            >
              Languages
            </p>
            <ul className="space-y-1 text-sm" style={{ color: textLightColor }}>
              {skills.languages.map((skill, idx) => (
                <li key={idx}>• {getSkillName(skill)}</li>
              ))}
            </ul>
          </div>
        )}
        {skills.soft && skills.soft.length > 0 && (
          <div>
            <p
              className="mb-2 text-sm font-semibold"
              style={{ color: textColor }}
            >
              Soft Skills
            </p>
            <ul className="space-y-1 text-sm" style={{ color: textLightColor }}>
              {skills.soft.map((skill, idx) => (
                <li key={idx}>• {getSkillName(skill)}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  // Bars variant - with visual bars showing proficiency level
  if (variant === "bars") {
    const allSkills = [
      ...(skills.technical || []),
      ...(skills.tools || []),
      ...(skills.languages || []),
    ];

    return (
      <div className={`space-y-2 ${className}`}>
        {allSkills.map((skill, idx) => {
          const level = getSkillLevel(skill);
          const percentage = (level / 10) * 100;
          
          return (
            <div key={idx} className="flex items-center gap-3">
              <span
                className="w-32 text-sm font-medium"
                style={{ color: textColor }}
              >
                {getSkillName(skill)}
              </span>
              <div
                className="h-2 flex-1 rounded-full"
                style={{ backgroundColor: `${primaryColor}30` }}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    backgroundColor: primaryColor,
                    width: `${percentage}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Grid variant - compact grid layout
  if (variant === "grid") {
    const allSkills = [
      ...(skills.technical || []),
      ...(skills.tools || []),
      ...(skills.languages || []),
      ...(skills.soft || []),
    ];

    return (
      <div className={`grid grid-cols-3 gap-2 ${className}`}>
        {allSkills.map((skill, idx) => (
          <div
            key={idx}
            className="rounded-md border px-2 py-1 text-center text-xs font-medium"
            style={{
              borderColor: colorScheme?.border || "#e5e7eb",
              color: textColor,
            }}
          >
            {getSkillName(skill)}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
