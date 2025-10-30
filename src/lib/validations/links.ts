import { z } from "zod";

/**
 * Link Type
 */
export const linkTypeSchema = z.enum(["portfolio", "linkedin", "github", "other"]);

/**
 * Link Validation Schema
 * Validates social/portfolio links
 */
export const linkSchema = z.object({
  id: z.string(),
  label: z.string().min(1, "Label is required"),
  url: z.string().url("Invalid URL").min(1, "URL is required"),
  type: linkTypeSchema,
});

export type LinkFormData = z.infer<typeof linkSchema>;

/**
 * Schema for creating new link (without ID)
 */
export const createLinkSchema = linkSchema.omit({ id: true });
export type CreateLinkFormData = z.infer<typeof createLinkSchema>;
