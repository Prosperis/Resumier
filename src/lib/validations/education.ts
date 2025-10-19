import { z } from "zod"

/**
 * Education Validation Schema
 * Validates education entries
 */
export const educationSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, "Institution name is required"),
  degree: z.string().min(1, "Degree is required"),
  field: z.string().min(1, "Field of study is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  current: z.boolean().default(false),
  gpa: z.string().max(10, "GPA must be less than 10 characters").optional().or(z.literal("")),
  honors: z.array(z.string()).default([]),
})

export type EducationFormData = z.infer<typeof educationSchema>

/**
 * Schema for creating new education (without ID)
 */
export const createEducationSchema = educationSchema.omit({ id: true })
export type CreateEducationFormData = z.infer<typeof createEducationSchema>
