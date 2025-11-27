/**
 * Experience Content Renderer
 * Utility component to render experience content based on format
 * Can be used inline in templates that don't use ExperienceEntry
 */

import type { Experience } from "@/lib/api/types";

interface ExperienceContentProps {
  experience: Experience;
  textColor?: string;
  bulletColor?: string;
  bulletStyle?: "disc" | "arrow" | "dash" | "dot";
  className?: string;
}

/**
 * Renders the content portion of an experience entry based on format
 * - structured: description paragraph + bullet highlights
 * - freeform: just the description (can contain anything)
 * - bullets: just the highlights as bullets
 */
export function ExperienceContentRenderer({
  experience,
  textColor = "text-gray-700",
  bulletColor,
  bulletStyle = "disc",
  className = "",
}: ExperienceContentProps) {
  const format = experience.format || "structured";
  const hasDescription =
    experience.description && experience.description.trim();
  const hasHighlights =
    experience.highlights &&
    experience.highlights.length > 0 &&
    experience.highlights.some((h) => h.trim());

  const renderBullet = (style: string, color?: string) => {
    const colorStyle = color ? { color } : {};
    switch (style) {
      case "arrow":
        return (
          <span style={colorStyle} className="shrink-0">
            ▸
          </span>
        );
      case "dash":
        return (
          <span style={colorStyle} className="shrink-0">
            —
          </span>
        );
      case "dot":
        return (
          <span style={colorStyle} className="shrink-0">
            •
          </span>
        );
      default:
        return null;
    }
  };

  const renderHighlights = (highlights: string[]) => {
    const filteredHighlights = highlights.filter((h) => h.trim());
    if (filteredHighlights.length === 0) return null;

    if (bulletStyle === "disc") {
      return (
        <ul
          className={`list-inside list-disc space-y-1 text-sm ${textColor}`}
          style={bulletColor ? { color: bulletColor } : {}}
        >
          {filteredHighlights.map((highlight, idx) => (
            <li key={idx}>{highlight}</li>
          ))}
        </ul>
      );
    }

    return (
      <ul className={`space-y-1.5 text-sm ${className}`}>
        {filteredHighlights.map((highlight, idx) => (
          <li key={idx} className={`flex gap-2 ${textColor}`}>
            {renderBullet(bulletStyle, bulletColor)}
            <span>{highlight}</span>
          </li>
        ))}
      </ul>
    );
  };

  // Freeform: only show description
  if (format === "freeform") {
    if (!hasDescription) return null;
    return (
      <p
        className={`text-sm whitespace-pre-wrap leading-relaxed ${textColor} ${className}`}
      >
        {experience.description}
      </p>
    );
  }

  // Bullets only: only show highlights
  if (format === "bullets") {
    if (!hasHighlights) return null;
    return renderHighlights(experience.highlights!);
  }

  // Structured (default): description + highlights
  return (
    <>
      {hasDescription && (
        <p className={`mb-3 text-sm leading-relaxed ${textColor} ${className}`}>
          {experience.description}
        </p>
      )}
      {hasHighlights && renderHighlights(experience.highlights!)}
    </>
  );
}

/**
 * Helper to check if experience has any content to display
 */
export function hasExperienceContent(experience: Experience): boolean {
  const format = experience.format || "structured";
  const hasDescription =
    experience.description && experience.description.trim();
  const hasHighlights =
    experience.highlights &&
    experience.highlights.length > 0 &&
    experience.highlights.some((h) => h.trim());

  if (format === "freeform") return !!hasDescription;
  if (format === "bullets") return !!hasHighlights;
  return !!hasDescription || !!hasHighlights;
}
