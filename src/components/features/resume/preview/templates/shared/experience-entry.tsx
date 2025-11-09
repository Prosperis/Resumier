/**
 * Experience Entry Component
 * Reusable work experience entries for templates
 */

import type { Experience } from "@/lib/api/types";
import type { ColorScheme } from "@/lib/types/templates";

interface ExperienceEntryProps {
  experience: Experience;
  colorScheme?: ColorScheme;
  variant?: "default" | "compact" | "detailed" | "timeline";
  className?: string;
}

export function ExperienceEntry({
  experience,
  colorScheme,
  variant = "default",
  className = "",
}: ExperienceEntryProps) {
  const textColor = colorScheme?.text || "#111827";
  const textLightColor = colorScheme?.textLight || "#6b7280";

  // Default variant
  if (variant === "default") {
    return (
      <div className={className}>
        <div className="mb-1 flex items-start justify-between">
          <h3 className="text-base font-bold" style={{ color: textColor }}>
            {experience.position}
          </h3>
          <span className="text-sm" style={{ color: textLightColor }}>
            {experience.startDate} -{" "}
            {experience.current ? "Present" : experience.endDate}
          </span>
        </div>
        <p className="mb-2 text-sm font-semibold" style={{ color: textColor }}>
          {experience.company}
        </p>
        {experience.description && (
          <p className="mb-2 text-sm" style={{ color: textLightColor }}>
            {experience.description}
          </p>
        )}
        {experience.highlights && experience.highlights.length > 0 && (
          <ul
            className="list-inside list-disc space-y-1 text-sm"
            style={{ color: textLightColor }}
          >
            {experience.highlights.map((highlight, idx) => (
              <li key={idx}>{highlight}</li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  // Compact variant - less spacing
  if (variant === "compact") {
    return (
      <div className={className}>
        <div className="flex items-baseline justify-between">
          <h3 className="font-bold" style={{ color: textColor }}>
            {experience.position}
          </h3>
          <span className="text-xs" style={{ color: textLightColor }}>
            {experience.startDate} -{" "}
            {experience.current ? "Present" : experience.endDate}
          </span>
        </div>
        <p className="text-sm" style={{ color: textLightColor }}>
          {experience.company}
        </p>
        {experience.highlights && experience.highlights.length > 0 && (
          <ul
            className="mt-1 list-inside list-disc text-sm"
            style={{ color: textLightColor }}
          >
            {experience.highlights.slice(0, 3).map((highlight, idx) => (
              <li key={idx}>{highlight}</li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  // Detailed variant - more information
  if (variant === "detailed") {
    return (
      <div
        className={`${className} border-l-2 pl-4`}
        style={{ borderColor: colorScheme?.primary || "#8b5cf6" }}
      >
        <div className="mb-2 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold" style={{ color: textColor }}>
              {experience.position}
            </h3>
            <p
              className="text-base font-semibold"
              style={{ color: colorScheme?.primary || "#8b5cf6" }}
            >
              {experience.company}
            </p>
          </div>
          <div className="text-right text-sm" style={{ color: textLightColor }}>
            <div>
              {experience.startDate} -{" "}
              {experience.current ? "Present" : experience.endDate}
            </div>
            {experience.current && (
              <div
                className="mt-1 text-xs font-semibold"
                style={{ color: colorScheme?.primary }}
              >
                Current Position
              </div>
            )}
          </div>
        </div>
        {experience.description && (
          <p className="mb-3 text-sm" style={{ color: textColor }}>
            {experience.description}
          </p>
        )}
        {experience.highlights && experience.highlights.length > 0 && (
          <div>
            <p
              className="mb-1 text-xs font-semibold uppercase"
              style={{ color: textLightColor }}
            >
              Key Achievements
            </p>
            <ul
              className="list-inside list-disc space-y-1 text-sm"
              style={{ color: textLightColor }}
            >
              {experience.highlights.map((highlight, idx) => (
                <li key={idx}>{highlight}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  // Timeline variant - with visual timeline
  if (variant === "timeline") {
    return (
      <div className={`${className} relative pl-8`}>
        {/* Timeline dot */}
        <div
          className="absolute left-0 top-1 h-3 w-3 rounded-full"
          style={{ backgroundColor: colorScheme?.primary || "#8b5cf6" }}
        />
        {/* Timeline line */}
        <div
          className="absolute left-[5px] top-4 h-full w-0.5"
          style={{ backgroundColor: colorScheme?.border || "#e5e7eb" }}
        />

        <div className="mb-1 flex items-start justify-between">
          <h3 className="text-base font-bold" style={{ color: textColor }}>
            {experience.position}
          </h3>
          <span
            className="text-sm font-semibold"
            style={{ color: colorScheme?.primary }}
          >
            {experience.startDate} -{" "}
            {experience.current ? "Present" : experience.endDate}
          </span>
        </div>
        <p className="mb-2 text-sm font-semibold" style={{ color: textColor }}>
          {experience.company}
        </p>
        {experience.description && (
          <p className="mb-2 text-sm" style={{ color: textLightColor }}>
            {experience.description}
          </p>
        )}
        {experience.highlights && experience.highlights.length > 0 && (
          <ul
            className="list-inside list-disc space-y-1 text-sm"
            style={{ color: textLightColor }}
          >
            {experience.highlights.map((highlight, idx) => (
              <li key={idx}>{highlight}</li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return null;
}
