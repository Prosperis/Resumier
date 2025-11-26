import { z } from "zod";

/**
 * Name order enum - determines how first and last names are combined
 */
export const nameOrderSchema = z.enum(["firstLast", "lastFirst"]);
export type NameOrder = z.infer<typeof nameOrderSchema>;

/**
 * E.164 phone number format regex
 * Format: +[country code][subscriber number]
 * - Starts with +
 * - Followed by 1-3 digit country code
 * - Followed by subscriber number (total 7-15 digits including country code)
 * Examples: +15551234567, +442071234567, +81312345678
 */
const e164PhoneRegex = /^\+[1-9]\d{6,14}$/;

/**
 * Validates phone numbers in E.164 format
 * Also accepts partial numbers during typing (with + prefix)
 */
const phoneValidation = z
  .string()
  .min(1, "Phone number is required")
  .refine(
    (val) => {
      // Allow empty string (handled by min check above)
      if (!val) return true;
      // Must start with + for international format
      if (!val.startsWith("+")) return false;
      // Full E.164 validation for complete numbers
      return e164PhoneRegex.test(val);
    },
    { message: "Please enter a valid phone number" }
  );

/**
 * Name field validation - allows empty string but validates format when provided
 */
const nameFieldValidation = (fieldName: string) =>
  z
    .string()
    .max(50, `${fieldName} must be less than 50 characters`)
    .refine(
      (val) => !val || /^[\p{L}\p{M}\s'-]+$/u.test(val),
      `${fieldName} contains invalid characters`
    )
    .optional()
    .or(z.literal(""));

/**
 * Personal Info Validation Schema
 * Validates basic personal information fields
 * Note: At least one name field (first or last) is required
 */
export const personalInfoSchema = z
  .object({
    firstName: nameFieldValidation("First name"),
    lastName: nameFieldValidation("Last name"),
    nameOrder: nameOrderSchema.default("firstLast"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    phone: phoneValidation,
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
  .refine((data) => data.firstName?.trim() || data.lastName?.trim(), {
    message: "At least one name field is required",
    path: ["firstName"], // Show error on firstName field
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
