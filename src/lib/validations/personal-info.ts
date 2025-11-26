import { z } from "zod";

/**
 * Name order enum - determines how first and last names are combined
 */
export const nameOrderSchema = z.enum(["firstLast", "lastFirst"]);
export type NameOrder = z.infer<typeof nameOrderSchema>;

/**
 * Personal Info Validation Schema
 * Validates basic personal information fields
 */
export const personalInfoSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters"),
  nameOrder: nameOrderSchema.default("firstLast"),
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
});

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

/**
 * Composes a full name from first and last name based on the specified order
 * @param firstName - The first name (given name)
 * @param lastName - The last name (family name)
 * @param nameOrder - Order preference: "firstLast" (e.g., John Doe) or "lastFirst" (e.g., Doe, John)
 * @returns The composed full name
 */
export function getFullName(
  firstName: string,
  lastName: string,
  nameOrder: NameOrder = "firstLast",
): string {
  const first = firstName?.trim() || "";
  const last = lastName?.trim() || "";

  if (!first && !last) return "";
  if (!first) return last;
  if (!last) return first;

  return nameOrder === "lastFirst" ? `${last}, ${first}` : `${first} ${last}`;
}
