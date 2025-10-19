import { z } from "zod"

/**
 * Personal Info Validation Schema
 * Validates basic personal information fields
 */
export const personalInfoSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().min(1, "Phone number is required"),
  location: z
    .string()
    .min(1, "Location is required")
    .max(100, "Location must be less than 100 characters"),
  summary: z
    .string()
    .max(500, "Summary must be less than 500 characters")
    .optional()
    .or(z.literal("")),
})

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>
