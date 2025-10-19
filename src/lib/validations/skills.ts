import { z } from "zod"

/**
 * Skills Validation Schema
 * Validates skills categories
 */
export const skillsSchema = z.object({
  technical: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  tools: z.array(z.string()).optional(),
  soft: z.array(z.string()).optional(),
})

export type SkillsFormData = z.infer<typeof skillsSchema>
