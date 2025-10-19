import { z } from "zod"

/**
 * Skills Validation Schema
 * Validates skills categories
 */
export const skillsSchema = z.object({
  technical: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
  tools: z.array(z.string()).default([]),
  soft: z.array(z.string()).default([]),
})

export type SkillsFormData = z.infer<typeof skillsSchema>
