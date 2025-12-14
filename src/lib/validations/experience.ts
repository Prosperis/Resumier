import { z } from "zod";

/**
 * Experience Format
 * - "structured": Separate description paragraph + bullet highlights (default)
 * - "freeform": Single text block for free-flowing content
 * - "bullets": Only bullet points, no description paragraph
 */
export const experienceFormatSchema = z.enum(["structured", "freeform", "bullets"]);

/**
 * Experience Validation Schema
 * Validates work experience entries
 * All fields are optional - only non-empty fields are rendered in the resume
 */
export const experienceSchema = z.object({
  id: z.string(),
  company: z.string().optional().or(z.literal("")),
  position: z.string().optional().or(z.literal("")),
  startDate: z.string().optional().or(z.literal("")),
  endDate: z.string().optional().or(z.literal("")),
  current: z.boolean().optional(),
  description: z
    .string()
    .max(2000, "Description must be less than 2000 characters")
    .optional()
    .or(z.literal("")),
  highlights: z.array(z.string()).optional(),
  format: experienceFormatSchema.optional(),
});

export type ExperienceFormData = z.infer<typeof experienceSchema>;

/**
 * Schema for creating new experience (without ID)
 */
export const createExperienceSchema = experienceSchema.omit({ id: true });
export type CreateExperienceFormData = z.infer<typeof createExperienceSchema>;
