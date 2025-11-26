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

  // Helper to format date range
  const formatDateRange = () => {
    if (!education.startDate && !education.endDate && !education.current) return null;
    const start = education.startDate || "";
    const end = education.current ? "Present" : education.endDate || "";
    if (!start && !end) return null;
    return `${start}${start && end ? " - " : ""}${end}`;
  };

  const dateRange = formatDateRange();

  // Default variant
  if (variant === "default") {
    return (
      <div className={className}>
        <div className="mb-1 flex items-start justify-between">
          {education.degree && (
            <h3 className="text-base font-bold" style={{ color: textColor }}>
              {education.degree}
            </h3>
          )}
          {dateRange && (
            <span className="text-sm" style={{ color: textLightColor }}>
              {dateRange}
            </span>
          )}
        </div>
        {education.institution && (
          <p className="text-sm font-semibold" style={{ color: textColor }}>
            {education.institution}
          </p>
        )}
        {education.field && (
          <p className="text-sm" style={{ color: textLightColor }}>
            {education.field}
          </p>
        )}
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
    // Build degree/field string
    const degreeField = [education.degree, education.field].filter(Boolean).join(" in ");
    
    return (
      <div className={className}>
        <div className="flex items-baseline justify-between">
          {degreeField && (
            <h3 className="font-bold" style={{ color: textColor }}>
              {degreeField}
            </h3>
          )}
          {dateRange && (
            <span className="text-xs" style={{ color: textLightColor }}>
              {dateRange}
            </span>
          )}
        </div>
        {education.institution && (
          <p className="text-sm" style={{ color: textLightColor }}>
            {education.institution}
          </p>
        )}
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
            {education.degree && (
              <h3 className="text-lg font-bold" style={{ color: textColor }}>
                {education.degree}
              </h3>
            )}
            {education.institution && (
              <p
                className="text-base font-semibold"
                style={{ color: colorScheme?.primary || "#8b5cf6" }}
              >
                {education.institution}
              </p>
            )}
            {education.field && (
              <p className="text-sm" style={{ color: textLightColor }}>
                {education.field}
              </p>
            )}
          </div>
          {(dateRange || education.gpa) && (
            <div className="text-right text-sm" style={{ color: textLightColor }}>
              {dateRange && <div>{dateRange}</div>}
              {education.gpa && (
                <div
                  className="mt-1 font-semibold"
                  style={{ color: colorScheme?.primary }}
                >
                  GPA: {education.gpa}
                </div>
              )}
            </div>
          )}
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
