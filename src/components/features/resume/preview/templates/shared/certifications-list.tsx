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

  // Filter out certifications with no meaningful content
  const validCertifications = certifications.filter(
    (cert) => cert.name || cert.issuer || cert.date,
  );

  if (validCertifications.length === 0) return null;

  // Default variant
  if (variant === "default") {
    return (
      <div className={`space-y-3 ${className}`}>
        {validCertifications.map((cert) => (
          <div key={cert.id}>
            <div className="flex items-start justify-between">
              {cert.name && (
                <h3
                  className="text-base font-bold"
                  style={{ color: textColor }}
                >
                  {cert.name}
                </h3>
              )}
              {cert.date && (
                <span className="text-sm" style={{ color: textLightColor }}>
                  {cert.date}
                </span>
              )}
            </div>
            {cert.issuer && (
              <p className="text-sm" style={{ color: textLightColor }}>
                {cert.issuer}
              </p>
            )}
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
        {validCertifications.map((cert) => (
          <div key={cert.id} className="flex items-center gap-2">
            <Award
              className="h-4 w-4"
              style={{ color: colorScheme?.primary }}
            />
            <div className="flex-1">
              {cert.name && (
                <span
                  className="text-sm font-semibold"
                  style={{ color: textColor }}
                >
                  {cert.name}
                </span>
              )}
              {cert.issuer && (
                <span className="text-sm" style={{ color: textLightColor }}>
                  {cert.name ? " - " : ""}
                  {cert.issuer}
                </span>
              )}
            </div>
            {cert.date && (
              <span className="text-xs" style={{ color: textLightColor }}>
                {cert.date}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Detailed variant
  if (variant === "detailed") {
    return (
      <div className={`space-y-4 ${className}`}>
        {validCertifications.map((cert) => (
          <div
            key={cert.id}
            className="rounded-lg border p-3"
            style={{ borderColor: colorScheme?.border || "#e5e7eb" }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {cert.name && (
                  <h3
                    className="text-base font-bold"
                    style={{ color: textColor }}
                  >
                    {cert.name}
                  </h3>
                )}
                {cert.issuer && (
                  <p
                    className="text-sm font-semibold"
                    style={{ color: colorScheme?.primary }}
                  >
                    {cert.issuer}
                  </p>
                )}
                {(cert.date || cert.expiryDate) && (
                  <p className="mt-1 text-xs" style={{ color: textLightColor }}>
                    {cert.date && `Issued: ${cert.date}`}
                    {cert.expiryDate &&
                      `${cert.date ? " • " : ""}Expires: ${cert.expiryDate}`}
                  </p>
                )}
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
