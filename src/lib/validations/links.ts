import { z } from "zod";

/**
 * Link Type - only includes types with distinct icons
 */
export const linkTypeSchema = z.enum([
  "website",
  "linkedin",
  "github",
  "twitter",
  "facebook",
  "instagram",
  "youtube",
  "dribbble",
  "codepen",
  "figma",
  "twitch",
  "slack",
  "email",
  "other",
]);

/**
 * Link type labels for display in forms
 */
export const linkTypeLabels: Record<z.infer<typeof linkTypeSchema>, string> = {
  website: "Website",
  linkedin: "LinkedIn",
  github: "GitHub",
  twitter: "Twitter / X",
  facebook: "Facebook",
  instagram: "Instagram",
  youtube: "YouTube",
  dribbble: "Dribbble",
  codepen: "CodePen",
  figma: "Figma",
  twitch: "Twitch",
  slack: "Slack",
  email: "Email",
  other: "Other",
};

/**
 * Link Validation Schema
 * Validates social/portfolio links
 * All fields are optional - only non-empty fields are rendered in the resume
 */
export const linkSchema = z.object({
  id: z.string(),
  label: z.string().optional().or(z.literal("")),
  url: z.string().url("Invalid URL").optional().or(z.literal("")),
  type: linkTypeSchema,
});

export type LinkFormData = z.infer<typeof linkSchema>;

/**
 * Schema for creating new link (without ID)
 */
export const createLinkSchema = linkSchema.omit({ id: true });
export type CreateLinkFormData = z.infer<typeof createLinkSchema>;
