import { z } from "zod";

/**
 * Certification Validation Schema
 * Validates certification entries
 * All fields are optional - only non-empty fields are rendered in the resume
 */
export const certificationSchema = z.object({
  id: z.string(),
  name: z.string().optional().or(z.literal("")),
  issuer: z.string().optional().or(z.literal("")),
  date: z.string().optional().or(z.literal("")),
  expiryDate: z.string().optional().or(z.literal("")),
  credentialId: z.string().optional().or(z.literal("")),
  url: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export type CertificationFormData = z.infer<typeof certificationSchema>;

/**
 * Schema for creating new certification (without ID)
 */
export const createCertificationSchema = certificationSchema.omit({ id: true });
export type CreateCertificationFormData = z.infer<
  typeof createCertificationSchema
>;
