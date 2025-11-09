/**
 * Certifications List Component
 * Reusable certifications display for templates
 */

import type { Certification } from "@/lib/api/types";
import type { ColorScheme } from "@/lib/types/templates";
import { Award } from "lucide-react";

interface CertificationsListProps {
  certifications: Certification[];
  colorScheme?: ColorScheme;
  variant?: "default" | "compact" | "detailed";
  className?: string;
}

export function CertificationsList({
  certifications,
  colorScheme,
  variant = "default",
  className = "",
}: CertificationsListProps) {
  const textColor = colorScheme?.text || "#111827";
  const textLightColor = colorScheme?.textLight || "#6b7280";

  if (!certifications || certifications.length === 0) return null;

  // Default variant
  if (variant === "default") {
    return (
      <div className={`space-y-3 ${className}`}>
        {certifications.map((cert) => (
          <div key={cert.id}>
            <div className="flex items-start justify-between">
              <h3 className="text-base font-bold" style={{ color: textColor }}>
                {cert.name}
              </h3>
              <span className="text-sm" style={{ color: textLightColor }}>
                {cert.date}
              </span>
            </div>
            <p className="text-sm" style={{ color: textLightColor }}>
              {cert.issuer}
            </p>
            {cert.credentialId && (
              <p className="text-xs" style={{ color: textLightColor }}>
                ID: {cert.credentialId}
              </p>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Compact variant
  if (variant === "compact") {
    return (
      <div className={`space-y-2 ${className}`}>
        {certifications.map((cert) => (
          <div key={cert.id} className="flex items-center gap-2">
            <Award
              className="h-4 w-4"
              style={{ color: colorScheme?.primary }}
            />
            <div className="flex-1">
              <span
                className="text-sm font-semibold"
                style={{ color: textColor }}
              >
                {cert.name}
              </span>
              <span className="text-sm" style={{ color: textLightColor }}>
                {" "}
                - {cert.issuer}
              </span>
            </div>
            <span className="text-xs" style={{ color: textLightColor }}>
              {cert.date}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // Detailed variant
  if (variant === "detailed") {
    return (
      <div className={`space-y-4 ${className}`}>
        {certifications.map((cert) => (
          <div
            key={cert.id}
            className="rounded-lg border p-3"
            style={{ borderColor: colorScheme?.border || "#e5e7eb" }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3
                  className="text-base font-bold"
                  style={{ color: textColor }}
                >
                  {cert.name}
                </h3>
                <p
                  className="text-sm font-semibold"
                  style={{ color: colorScheme?.primary }}
                >
                  {cert.issuer}
                </p>
                <p className="mt-1 text-xs" style={{ color: textLightColor }}>
                  Issued: {cert.date}
                  {cert.expiryDate && ` • Expires: ${cert.expiryDate}`}
                </p>
                {cert.credentialId && (
                  <p className="mt-1 text-xs" style={{ color: textLightColor }}>
                    Credential ID: {cert.credentialId}
                  </p>
                )}
              </div>
              <Award
                className="h-5 w-5"
                style={{ color: colorScheme?.primary }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
