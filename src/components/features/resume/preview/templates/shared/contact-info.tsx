/**
 * Contact Info Component
 * Reusable contact information displays for templates
 */

import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Dribbble,
  Codepen,
  Figma,
  Twitch,
  Slack,
  Link as LinkIcon,
} from "lucide-react";
import type { PersonalInfo, Link, LinkType } from "@/lib/api/types";
import type { HeaderStyle, ColorScheme } from "@/lib/types/templates";
import { formatPhoneDisplay, type PhoneFormat } from "@/lib/validations";

interface ContactInfoProps {
  personalInfo: PersonalInfo;
  links?: Link[];
  style?: HeaderStyle;
  colorScheme?: ColorScheme;
  showIcons?: boolean;
  className?: string;
}

export function ContactInfo({
  personalInfo,
  links = [],
  style = "centered",
  colorScheme,
  showIcons = true,
  className = "",
}: ContactInfoProps) {
  const textColor = colorScheme?.text || "#111827";

  // Centered style
  if (style === "centered") {
    return (
      <div className={`text-center ${className}`}>
        <div className="flex flex-wrap justify-center gap-3 text-sm" style={{ color: textColor }}>
          {personalInfo.email && (
            <div className="flex items-center gap-1">
              {showIcons && <Mail className="h-4 w-4" />}
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <>
              <span>•</span>
              <div className="flex items-center gap-1">
                {showIcons && <Phone className="h-4 w-4" />}
                <span>
                  {formatPhoneDisplay(personalInfo.phone, personalInfo.phoneFormat as PhoneFormat)}
                </span>
              </div>
            </>
          )}
          {personalInfo.location && (
            <>
              <span>•</span>
              <div className="flex items-center gap-1">
                {showIcons && <MapPin className="h-4 w-4" />}
                <span>{personalInfo.location}</span>
              </div>
            </>
          )}
        </div>
        {links.length > 0 && (
          <div
            className="mt-2 flex flex-wrap justify-center gap-3 text-sm"
            style={{ color: textColor }}
          >
            {links.map((link) => (
              <a key={link.id} href={link.url} className="flex items-center gap-1 hover:underline">
                {getLinkIcon(link.type, showIcons)}
                <span>{link.label}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Left-aligned style
  if (style === "left") {
    return (
      <div className={`text-left ${className}`}>
        <div className="space-y-1 text-sm" style={{ color: textColor }}>
          {personalInfo.email && (
            <div className="flex items-center gap-2">
              {showIcons && <Mail className="h-4 w-4" />}
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-2">
              {showIcons && <Phone className="h-4 w-4" />}
              <span>
                {formatPhoneDisplay(personalInfo.phone, personalInfo.phoneFormat as PhoneFormat)}
              </span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-2">
              {showIcons && <MapPin className="h-4 w-4" />}
              <span>{personalInfo.location}</span>
            </div>
          )}
          {links.map((link) => (
            <div key={link.id} className="flex items-center gap-2">
              {getLinkIcon(link.type, showIcons)}
              <a href={link.url} className="hover:underline">
                {link.label}
              </a>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Split style - horizontal layout
  if (style === "split") {
    return (
      <div className={`flex flex-wrap items-center justify-between gap-4 ${className}`}>
        <div className="flex flex-wrap gap-3 text-sm" style={{ color: textColor }}>
          {personalInfo.email && (
            <div className="flex items-center gap-1">
              {showIcons && <Mail className="h-4 w-4" />}
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1">
              {showIcons && <Phone className="h-4 w-4" />}
              <span>
                {formatPhoneDisplay(personalInfo.phone, personalInfo.phoneFormat as PhoneFormat)}
              </span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-1">
              {showIcons && <MapPin className="h-4 w-4" />}
              <span>{personalInfo.location}</span>
            </div>
          )}
        </div>
        {links.length > 0 && (
          <div className="flex flex-wrap gap-3 text-sm" style={{ color: textColor }}>
            {links.map((link) => (
              <a key={link.id} href={link.url} className="flex items-center gap-1 hover:underline">
                {getLinkIcon(link.type, showIcons)}
                <span>{link.label}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Minimal style - no icons, inline
  if (style === "minimal") {
    return (
      <div className={`text-sm ${className}`} style={{ color: textColor }}>
        {[
          personalInfo.email,
          formatPhoneDisplay(personalInfo.phone, personalInfo.phoneFormat as PhoneFormat),
          personalInfo.location,
          ...links.map((l) => l.url),
        ]
          .filter(Boolean)
          .join(" • ")}
      </div>
    );
  }

  // Default to centered
  return (
    <div className={`text-center text-sm ${className}`} style={{ color: textColor }}>
      {personalInfo.email && <div>{personalInfo.email}</div>}
      {personalInfo.phone && (
        <div>{formatPhoneDisplay(personalInfo.phone, personalInfo.phoneFormat as PhoneFormat)}</div>
      )}
      {personalInfo.location && <div>{personalInfo.location}</div>}
    </div>
  );
}

/**
 * Get the appropriate icon for a link type
 * Each type has a distinct icon
 */
export function getLinkIcon(type: LinkType, showIcons: boolean, className = "h-4 w-4") {
  if (!showIcons) return null;

  const iconProps = { className };

  switch (type) {
    case "website":
      return <Globe {...iconProps} />;
    case "linkedin":
      return <Linkedin {...iconProps} />;
    case "github":
      return <Github {...iconProps} />;
    case "twitter":
      return <Twitter {...iconProps} />;
    case "facebook":
      return <Facebook {...iconProps} />;
    case "instagram":
      return <Instagram {...iconProps} />;
    case "youtube":
      return <Youtube {...iconProps} />;
    case "dribbble":
      return <Dribbble {...iconProps} />;
    case "codepen":
      return <Codepen {...iconProps} />;
    case "figma":
      return <Figma {...iconProps} />;
    case "twitch":
      return <Twitch {...iconProps} />;
    case "slack":
      return <Slack {...iconProps} />;
    case "email":
      return <Mail {...iconProps} />;
    case "other":
    default:
      return <LinkIcon {...iconProps} />;
  }
}
