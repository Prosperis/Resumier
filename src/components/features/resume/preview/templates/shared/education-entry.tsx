/**
 * Education Entry Component
 * Reusable education entries for templates
 */

import type { Education } from "@/lib/api/types";
import type { ColorScheme } from "@/lib/types/templates";

interface EducationEntryProps {
  education: Education;
  colorScheme?: ColorScheme;
  variant?: "default" | "compact" | "detailed";
  className?: string;
}

export function EducationEntry({
  education,
  colorScheme,
  variant = "default",
  className = "",
}: EducationEntryProps) {
  const textColor = colorScheme?.text || "#111827";
  const textLightColor = colorScheme?.textLight || "#6b7280";

  // Default variant
  if (variant === "default") {
    return (
      <div className={className}>
        <div className="mb-1 flex items-start justify-between">
          <h3 className="text-base font-bold" style={{ color: textColor }}>
            {education.degree}
          </h3>
          <span className="text-sm" style={{ color: textLightColor }}>
            {education.startDate} -{" "}
            {education.current ? "Present" : education.endDate}
          </span>
        </div>
        <p className="text-sm font-semibold" style={{ color: textColor }}>
          {education.institution}
        </p>
        <p className="text-sm" style={{ color: textLightColor }}>
          {education.field}
        </p>
        {education.gpa && (
          <p className="text-sm" style={{ color: textLightColor }}>
            GPA: {education.gpa}
          </p>
        )}
        {education.honors && education.honors.length > 0 && (
          <ul
            className="mt-1 list-inside list-disc text-sm"
            style={{ color: textLightColor }}
          >
            {education.honors.map((honor, idx) => (
              <li key={idx}>{honor}</li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  // Compact variant
  if (variant === "compact") {
    return (
      <div className={className}>
        <div className="flex items-baseline justify-between">
          <h3 className="font-bold" style={{ color: textColor }}>
            {education.degree} in {education.field}
          </h3>
          <span className="text-xs" style={{ color: textLightColor }}>
            {education.startDate} -{" "}
            {education.current ? "Present" : education.endDate}
          </span>
        </div>
        <p className="text-sm" style={{ color: textLightColor }}>
          {education.institution}
        </p>
        {education.gpa && (
          <p className="text-sm" style={{ color: textLightColor }}>
            GPA: {education.gpa}
          </p>
        )}
      </div>
    );
  }

  // Detailed variant
  if (variant === "detailed") {
    return (
      <div className={className}>
        <div className="mb-2 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold" style={{ color: textColor }}>
              {education.degree}
            </h3>
            <p
              className="text-base font-semibold"
              style={{ color: colorScheme?.primary || "#8b5cf6" }}
            >
              {education.institution}
            </p>
            <p className="text-sm" style={{ color: textLightColor }}>
              {education.field}
            </p>
          </div>
          <div className="text-right text-sm" style={{ color: textLightColor }}>
            <div>
              {education.startDate} -{" "}
              {education.current ? "Present" : education.endDate}
            </div>
            {education.gpa && (
              <div
                className="mt-1 font-semibold"
                style={{ color: colorScheme?.primary }}
              >
                GPA: {education.gpa}
              </div>
            )}
          </div>
        </div>
        {education.honors && education.honors.length > 0 && (
          <div>
            <p
              className="mb-1 text-xs font-semibold uppercase"
              style={{ color: textLightColor }}
            >
              Honors & Awards
            </p>
            <ul
              className="list-inside list-disc space-y-1 text-sm"
              style={{ color: textLightColor }}
            >
              {education.honors.map((honor, idx) => (
                <li key={idx}>{honor}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return null;
}
