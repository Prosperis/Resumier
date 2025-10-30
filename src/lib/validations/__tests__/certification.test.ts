import { describe, expect, it } from "vitest";
import {
  type CertificationFormData,
  type CreateCertificationFormData,
  certificationSchema,
  createCertificationSchema,
} from "../certification";

describe("certificationSchema", () => {
  describe("Valid Data", () => {
    it("validates complete certification entry", () => {
      const validData: CertificationFormData = {
        id: "cert-1",
        name: "AWS Certified Solutions Architect",
        issuer: "Amazon Web Services",
        date: "2023-06",
        expiryDate: "2026-06",
        credentialId: "AWS-123456",
        url: "https://aws.amazon.com/certification",
      };
      const result = certificationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("validates minimal required fields", () => {
      const data = {
        id: "cert-1",
        name: "Certification",
        issuer: "Issuer",
        date: "2023-01",
      };
      const result = certificationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("validates with empty optional fields", () => {
      const data = {
        id: "cert-1",
        name: "PMP",
        issuer: "PMI",
        date: "2022-01",
        expiryDate: "",
        credentialId: "",
        url: "",
      };
      const result = certificationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("validates with omitted optional fields", () => {
      const data = {
        id: "cert-1",
        name: "Scrum Master",
        issuer: "Scrum Alliance",
        date: "2023-03",
      };
      const result = certificationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("validates with valid URL", () => {
      const data = {
        id: "cert-1",
        name: "Google Cloud Certified",
        issuer: "Google",
        date: "2023-01",
        url: "https://cloud.google.com/certification",
      };
      const result = certificationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("Invalid Data", () => {
    it("fails when name is missing", () => {
      const data = {
        id: "cert-1",
        issuer: "Issuer",
        date: "2023-01",
      };
      const result = certificationSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("name");
      }
    });

    it("fails when issuer is missing", () => {
      const data = {
        id: "cert-1",
        name: "Certification",
        date: "2023-01",
      };
      const result = certificationSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("issuer");
      }
    });

    it("fails when date is missing", () => {
      const data = {
        id: "cert-1",
        name: "Certification",
        issuer: "Issuer",
      };
      const result = certificationSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("date");
      }
    });

    it("fails when name is empty string", () => {
      const data = {
        id: "cert-1",
        name: "",
        issuer: "Issuer",
        date: "2023-01",
      };
      const result = certificationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("fails when issuer is empty string", () => {
      const data = {
        id: "cert-1",
        name: "Certification",
        issuer: "",
        date: "2023-01",
      };
      const result = certificationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("fails when date is empty string", () => {
      const data = {
        id: "cert-1",
        name: "Certification",
        issuer: "Issuer",
        date: "",
      };
      const result = certificationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("fails when URL is invalid", () => {
      const data = {
        id: "cert-1",
        name: "Certification",
        issuer: "Issuer",
        date: "2023-01",
        url: "not-a-valid-url",
      };
      const result = certificationSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Invalid URL");
      }
    });

    it("fails when URL is just text without protocol", () => {
      const data = {
        id: "cert-1",
        name: "Certification",
        issuer: "Issuer",
        date: "2023-01",
        url: "just-some-text",
      };
      const result = certificationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("Edge Cases", () => {
    it("validates with various URL protocols", () => {
      const urls = [
        "https://example.com",
        "http://example.com",
        "https://example.com/path/to/cert",
        "https://subdomain.example.com/cert?id=123",
      ];

      for (const url of urls) {
        const data = {
          id: "cert-1",
          name: "Cert",
          issuer: "Issuer",
          date: "2023-01",
          url,
        };
        const result = certificationSchema.safeParse(data);
        expect(result.success).toBe(true);
      }
    });

    it("validates with future expiry date", () => {
      const data = {
        id: "cert-1",
        name: "Certification",
        issuer: "Issuer",
        date: "2023-01",
        expiryDate: "2030-01",
      };
      const result = certificationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("validates with credential ID formats", () => {
      const credentialIds = [
        "ABC123",
        "cert-2023-001",
        "1234567890",
        "GUID-1234-5678-90AB-CDEF",
      ];

      for (const credentialId of credentialIds) {
        const data = {
          id: "cert-1",
          name: "Cert",
          issuer: "Issuer",
          date: "2023-01",
          credentialId,
        };
        const result = certificationSchema.safeParse(data);
        expect(result.success).toBe(true);
      }
    });

    it("validates with all optional fields present", () => {
      const data = {
        id: "cert-1",
        name: "Microsoft Certified",
        issuer: "Microsoft",
        date: "2023-01",
        expiryDate: "2024-01",
        credentialId: "MS-1234",
        url: "https://microsoft.com/learn",
      };
      const result = certificationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });
});

describe("createCertificationSchema", () => {
  it("validates new certification without ID", () => {
    const validData: CreateCertificationFormData = {
      name: "New Certification",
      issuer: "New Issuer",
      date: "2024-01",
    };
    const result = createCertificationSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("omits ID from parsed data", () => {
    const data = {
      id: "should-be-ignored",
      name: "Certification",
      issuer: "Issuer",
      date: "2023-01",
    };
    const result = createCertificationSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      // @ts-expect-error - ID should not be in the parsed data
      expect(result.data.id).toBeUndefined();
    }
  });

  it("validates complete data without ID", () => {
    const data = {
      name: "Azure Certified",
      issuer: "Microsoft",
      date: "2023-06",
      expiryDate: "2026-06",
      credentialId: "AZ-123",
      url: "https://azure.microsoft.com",
    };
    const result = createCertificationSchema.safeParse(data);
    expect(result.success).toBe(true);
  });
});
