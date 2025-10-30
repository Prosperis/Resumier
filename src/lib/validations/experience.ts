import { z } from "zod";

/**
 * Experience Validation Schema
 * Validates work experience entries
 */
export const experienceSchema = z
  .object({
    id: z.string(),
    company: z.string().min(1, "Company name is required"),
    position: z.string().min(1, "Position is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional().or(z.literal("")),
    current: z.boolean().optional(),
    description: z
      .string()
      .max(1000, "Description must be less than 1000 characters")
      .optional()
      .or(z.literal("")),
    highlights: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      // If not current position, end date is required
      if (!data.current && !data.endDate) {
        return false;
      }
      return true;
    },
    {
      message: "End date is required for past positions",
      path: ["endDate"],
    },
  );

export type ExperienceFormData = z.infer<typeof experienceSchema>;

/**
 * Schema for creating new experience (without ID)
 */
export const createExperienceSchema = experienceSchema.omit({ id: true });
export type CreateExperienceFormData = z.infer<typeof createExperienceSchema>;
