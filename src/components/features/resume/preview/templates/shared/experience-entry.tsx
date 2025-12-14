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

/**
 * Renders experience content based on the format
 * - structured: description paragraph + bullet highlights
 * - freeform: just the description (can contain anything)
 * - bullets: just the highlights as bullets
 */
function ExperienceContent({
  experience,
  textLightColor,
  showKeyAchievements = false,
}: {
  experience: Experience;
  textColor: string;
  textLightColor: string;
  showKeyAchievements?: boolean;
}) {
  const format = experience.format || "structured";
  const hasDescription = experience.description && experience.description.trim();
  const hasHighlights =
    experience.highlights &&
    experience.highlights.length > 0 &&
    experience.highlights.some((h) => h.trim());

  // Freeform: only show description (could be anything the user wrote)
  if (format === "freeform") {
    if (!hasDescription) return null;
    return (
      <p className="text-sm whitespace-pre-wrap" style={{ color: textLightColor }}>
        {experience.description}
      </p>
    );
  }

  // Bullets only: only show highlights
  if (format === "bullets") {
    if (!hasHighlights) return null;
    return (
      <ul className="list-inside list-disc space-y-1 text-sm" style={{ color: textLightColor }}>
        {experience
          .highlights!.filter((h) => h.trim())
          .map((highlight, idx) => (
            <li key={idx}>{highlight}</li>
          ))}
      </ul>
    );
  }

  // Structured (default): description + highlights
  return (
    <>
      {hasDescription && (
        <p className="mb-2 text-sm" style={{ color: textLightColor }}>
          {experience.description}
        </p>
      )}
      {hasHighlights && (
        <div>
          {showKeyAchievements && (
            <p className="mb-1 text-xs font-semibold uppercase" style={{ color: textLightColor }}>
              Key Achievements
            </p>
          )}
          <ul className="list-inside list-disc space-y-1 text-sm" style={{ color: textLightColor }}>
            {experience
              .highlights!.filter((h) => h.trim())
              .map((highlight, idx) => (
                <li key={idx}>{highlight}</li>
              ))}
          </ul>
        </div>
      )}
    </>
  );
}

export function ExperienceEntry({
  experience,
  colorScheme,
  variant = "default",
  className = "",
}: ExperienceEntryProps) {
  const textColor = colorScheme?.text || "#111827";
  const textLightColor = colorScheme?.textLight || "#6b7280";

  // Helper to format date range
  const formatDateRange = () => {
    if (!experience.startDate && !experience.endDate && !experience.current) return null;
    const start = experience.startDate || "";
    const end = experience.current ? "Present" : experience.endDate || "";
    if (!start && !end) return null;
    return `${start}${start && end ? " - " : ""}${end}`;
  };

  const dateRange = formatDateRange();

  // Default variant
  if (variant === "default") {
    return (
      <div className={className}>
        <div className="mb-1 flex items-start justify-between">
          {experience.position && (
            <h3 className="text-base font-bold" style={{ color: textColor }}>
              {experience.position}
            </h3>
          )}
          {dateRange && (
            <span className="text-sm" style={{ color: textLightColor }}>
              {dateRange}
            </span>
          )}
        </div>
        {experience.company && (
          <p className="mb-2 text-sm font-semibold" style={{ color: textColor }}>
            {experience.company}
          </p>
        )}
        <ExperienceContent
          experience={experience}
          textColor={textColor}
          textLightColor={textLightColor}
        />
      </div>
    );
  }

  // Compact variant - less spacing
  if (variant === "compact") {
    const format = experience.format || "structured";
    const hasHighlights =
      experience.highlights &&
      experience.highlights.length > 0 &&
      experience.highlights.some((h) => h.trim());

    return (
      <div className={className}>
        <div className="flex items-baseline justify-between">
          {experience.position && (
            <h3 className="font-bold" style={{ color: textColor }}>
              {experience.position}
            </h3>
          )}
          {dateRange && (
            <span className="text-xs" style={{ color: textLightColor }}>
              {dateRange}
            </span>
          )}
        </div>
        {experience.company && (
          <p className="text-sm" style={{ color: textLightColor }}>
            {experience.company}
          </p>
        )}
        {/* For compact, show limited content */}
        {format === "freeform" && experience.description && (
          <p className="mt-1 text-sm line-clamp-2" style={{ color: textLightColor }}>
            {experience.description}
          </p>
        )}
        {(format === "structured" || format === "bullets") && hasHighlights && (
          <ul className="mt-1 list-inside list-disc text-sm" style={{ color: textLightColor }}>
            {experience
              .highlights!.filter((h) => h.trim())
              .slice(0, 3)
              .map((highlight, idx) => (
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
            {experience.position && (
              <h3 className="text-lg font-bold" style={{ color: textColor }}>
                {experience.position}
              </h3>
            )}
            {experience.company && (
              <p
                className="text-base font-semibold"
                style={{ color: colorScheme?.primary || "#8b5cf6" }}
              >
                {experience.company}
              </p>
            )}
          </div>
          {(dateRange || experience.current) && (
            <div className="text-right text-sm" style={{ color: textLightColor }}>
              {dateRange && <div>{dateRange}</div>}
              {experience.current && (
                <div className="mt-1 text-xs font-semibold" style={{ color: colorScheme?.primary }}>
                  Current Position
                </div>
              )}
            </div>
          )}
        </div>
        <ExperienceContent
          experience={experience}
          textColor={textColor}
          textLightColor={textLightColor}
          showKeyAchievements={experience.format !== "freeform"}
        />
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
          {experience.position && (
            <h3 className="text-base font-bold" style={{ color: textColor }}>
              {experience.position}
            </h3>
          )}
          {dateRange && (
            <span className="text-sm font-semibold" style={{ color: colorScheme?.primary }}>
              {dateRange}
            </span>
          )}
        </div>
        {experience.company && (
          <p className="mb-2 text-sm font-semibold" style={{ color: textColor }}>
            {experience.company}
          </p>
        )}
        <ExperienceContent
          experience={experience}
          textColor={textColor}
          textLightColor={textLightColor}
        />
      </div>
    );
  }

  return null;
}
