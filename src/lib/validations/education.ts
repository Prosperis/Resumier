import { z } from "zod";

/**
 * Education Validation Schema
 * Validates education entries
 * All fields are optional - only non-empty fields are rendered in the resume
 */
export const educationSchema = z.object({
  id: z.string(),
  institution: z.string().optional().or(z.literal("")),
  degree: z.string().optional().or(z.literal("")),
  field: z.string().optional().or(z.literal("")),
  startDate: z.string().optional().or(z.literal("")),
  endDate: z.string().optional().or(z.literal("")),
  current: z.boolean().optional(),
  gpa: z.string().max(10, "GPA must be less than 10 characters").optional().or(z.literal("")),
  honors: z.array(z.string()).optional(),
});

export type EducationFormData = z.infer<typeof educationSchema>;

/**
 * Schema for creating new education (without ID)
 */
export const createEducationSchema = educationSchema.omit({ id: true });
export type CreateEducationFormData = z.infer<typeof createEducationSchema>;
