import { z } from "zod";

/**
 * Certification Validation Schema
 * Validates certification entries
 */
export const certificationSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  date: z.string().min(1, "Date is required"),
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
