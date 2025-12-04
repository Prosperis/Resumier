import { parsePhoneNumber } from "libphonenumber-js";
import { z } from "zod";

/**
 * Name order enum - determines how first and last names are combined
 */
export const nameOrderSchema = z.enum(["firstLast", "lastFirst"]);
export type NameOrder = z.infer<typeof nameOrderSchema>;

/**
 * Phone display format options
 */
export const phoneFormatSchema = z.enum([
  "national", // (555) 123-4567
  "international", // +1 555 123 4567
  "e164", // +15551234567
]);
export type PhoneFormat = z.infer<typeof phoneFormatSchema>;

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
 * Phone is optional - only validates format when provided
 */
const phoneValidation = z
  .string()
  .refine(
    (val) => {
      // Allow empty string
      if (!val) return true;
      // Must start with + for international format
      if (!val.startsWith("+")) return false;
      // Full E.164 validation for complete numbers
      return e164PhoneRegex.test(val);
    },
    { message: "Please enter a valid phone number" },
  )
  .optional()
  .or(z.literal(""));

/**
 * Name field validation - allows empty string but validates format when provided
 */
const nameFieldValidation = (fieldName: string) =>
  z
    .string()
    .max(50, `${fieldName} must be less than 50 characters`)
    .refine(
      (val) => !val || /^[\p{L}\p{M}\s'-]+$/u.test(val),
      `${fieldName} contains invalid characters`,
    )
    .optional()
    .or(z.literal(""));

/**
 * Personal Info Validation Schema
 * Validates basic personal information fields
 * All fields are optional - only non-empty fields are rendered in the resume
 */
export const personalInfoSchema = z.object({
  firstName: nameFieldValidation("First name"),
  lastName: nameFieldValidation("Last name"),
  nameOrder: nameOrderSchema.optional().default("firstLast"),
  title: z
    .string()
    .max(100, "Title must be less than 100 characters")
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: "Please enter a valid email address",
    })
    .optional()
    .or(z.literal("")),
  phone: phoneValidation,
  phoneFormat: phoneFormatSchema.optional().default("national"),
  location: z
    .string()
    .max(100, "Location must be less than 100 characters")
    .refine((val) => !val || val.trim().length >= 2, {
      message: "Location must be at least 2 characters",
    })
    .optional()
    .or(z.literal("")),
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

/**
 * Formats a phone number for display
 * @param phone - Phone number in E.164 format (e.g., +15551234567)
 * @param format - Display format: 'national', 'international', or 'e164'
 * @returns Formatted phone number or original if parsing fails
 */
export function formatPhoneDisplay(
  phone: string | undefined,
  format: PhoneFormat = "national",
): string {
  if (!phone) return "";

  try {
    const parsed = parsePhoneNumber(phone);
    if (parsed) {
      switch (format) {
        case "national":
          // (555) 123-4567
          return parsed.formatNational();
        case "international":
          // +1 555 123 4567
          return parsed.formatInternational();
        case "e164":
          // +15551234567
          return parsed.format("E.164");
        default:
          return parsed.formatNational();
      }
    }
  } catch {
    // If parsing fails, return the original
  }

  return phone;
}

/**
 * Phone format display labels for UI
 */
export const phoneFormatLabels: Record<PhoneFormat, string> = {
  national: "National",
  international: "International",
  e164: "Compact",
};

/**
 * Phone format examples for UI
 */
export const phoneFormatExamples: Record<PhoneFormat, string> = {
  national: "(555) 123-4567",
  international: "+1 555 123 4567",
  e164: "+15551234567",
};
