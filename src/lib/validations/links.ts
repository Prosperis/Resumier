import { z } from "zod";

/**
 * Link Type
 */
export const linkTypeSchema = z.enum([
  "portfolio",
  "linkedin",
  "github",
  "other",
]);

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
