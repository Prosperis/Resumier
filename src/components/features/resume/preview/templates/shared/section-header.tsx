/**
 * Section Header Component
 * Reusable section headers for templates
 */

import type { LucideIcon } from "lucide-react";
import type { SectionStyle, ColorScheme } from "@/lib/types/templates";

interface SectionHeaderProps {
  title: string;
  icon?: LucideIcon;
  style?: SectionStyle;
  colorScheme?: ColorScheme;
  className?: string;
}

export function SectionHeader({
  title,
  icon: Icon,
  style = "minimal",
  colorScheme,
  className = "",
}: SectionHeaderProps) {
  const primaryColor = colorScheme?.primary || "#8b5cf6";

  // Minimal style - simple border
  if (style === "minimal") {
    return (
      <h2
        className={`mb-3 border-b pb-1 text-xl font-bold ${className}`}
        style={{ borderColor: primaryColor, color: primaryColor }}
      >
        {title}
      </h2>
    );
  }

  // Accented style - with color accent and optional icon
  if (style === "accented") {
    return (
      <h2
        className={`mb-3 border-b-2 pb-1 text-xl font-bold ${className}`}
        style={{ borderColor: primaryColor, color: primaryColor }}
      >
        {Icon && (
          <span className="mr-2 inline-flex">
            <Icon className="h-5 w-5" />
          </span>
        )}
        {title}
      </h2>
    );
  }

  // Icons style - with icon
  if (style === "icons" && Icon) {
    return (
      <h2
        className={`mb-3 flex items-center gap-2 border-b-2 pb-1 text-xl font-bold ${className}`}
        style={{ borderColor: primaryColor, color: primaryColor }}
      >
        <Icon className="h-5 w-5" />
        {title}
      </h2>
    );
  }

  // Bordered style - boxed header
  if (style === "bordered") {
    return (
      <h2
        className={`mb-3 border-l-4 pl-3 text-xl font-bold ${className}`}
        style={{
          borderColor: primaryColor,
          color: colorScheme?.text || "#111827",
        }}
      >
        {title}
      </h2>
    );
  }

  // Cards style - with background
  if (style === "cards") {
    return (
      <h2
        className={`mb-3 rounded-lg px-3 py-2 text-xl font-bold ${className}`}
        style={{
          backgroundColor: `${primaryColor}15`,
          color: primaryColor,
        }}
      >
        {title}
      </h2>
    );
  }

  // Default to minimal
  return (
    <h2 className={`mb-3 text-xl font-bold uppercase ${className}`}>{title}</h2>
  );
}
