import { z } from "zod";

/**
 * Skill with level schema
 */
export const skillWithLevelSchema = z.object({
  name: z.string(),
  level: z.number().min(1).max(10),
});

/**
 * Skill can be a string or an object with name and level
 */
export const skillSchema = z.union([z.string(), skillWithLevelSchema]);

/**
 * Skills Validation Schema
 * Validates skills categories
 */
export const skillsSchema = z.object({
  technical: z.array(skillSchema).optional(),
  languages: z.array(skillSchema).optional(),
  tools: z.array(skillSchema).optional(),
  soft: z.array(skillSchema).optional(),
});

export type SkillWithLevel = z.infer<typeof skillWithLevelSchema>;
export type SkillsFormData = z.infer<typeof skillsSchema>;
