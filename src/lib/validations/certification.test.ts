import { describe, expect, it } from "vitest"
import {
  certificationSchema,
  createCertificationSchema,
} from "./certification"

describe("certificationSchema", () => {
  describe("valid data", () => {
    it("accepts valid certification with all fields", () => {
      const validData = {
        id: "cert-1",
        name: "AWS Certified Solutions Architect",
        issuer: "Amazon Web Services",
        date: "2023-06",
        expiryDate: "2026-06",
        credentialId: "ABC123XYZ",
        url: "https://aws.amazon.com/certification/verify",
      }

      const result = certificationSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })

    it("accepts certification without optional fields", () => {
      const validData = {
        id: "cert-1",
        name: "AWS Certified Solutions Architect",
        issuer: "Amazon Web Services",
        date: "2023-06",
      }

      const result = certificationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it("accepts empty strings for optional fields", () => {
      const validData = {
        id: "cert-1",
        name: "AWS Certified Solutions Architect",
        issuer: "Amazon Web Services",
        date: "2023-06",
        expiryDate: "",
        credentialId: "",
        url: "",
      }

      const result = certificationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it("accepts certification without expiry date", () => {
      const validData = {
        id: "cert-1",
        name: "Certified Scrum Master",
        issuer: "Scrum Alliance",
        date: "2023-01",
        credentialId: "CSM123456",
        url: "https://scrumalliance.org/verify",
      }

      const result = certificationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })

  describe("required fields", () => {
    it("rejects missing id", () => {
      const result = certificationSchema.safeParse({
        name: "AWS Certification",
        issuer: "Amazon",
        date: "2023-06",
      })

      expect(result.success).toBe(false)
    })

    it("rejects empty name", () => {
      const result = certificationSchema.safeParse({
        id: "cert-1",
        name: "",
        issuer: "Amazon Web Services",
        date: "2023-06",
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Certification name is required",
        )
      }
    })

    it("rejects missing name", () => {
      const result = certificationSchema.safeParse({
        id: "cert-1",
        issuer: "Amazon Web Services",
        date: "2023-06",
      })

      expect(result.success).toBe(false)
    })

    it("rejects empty issuer", () => {
      const result = certificationSchema.safeParse({
        id: "cert-1",
        name: "AWS Certification",
        issuer: "",
        date: "2023-06",
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Issuer is required")
      }
    })

    it("rejects missing issuer", () => {
      const result = certificationSchema.safeParse({
        id: "cert-1",
        name: "AWS Certification",
        date: "2023-06",
      })

      expect(result.success).toBe(false)
    })

    it("rejects empty date", () => {
      const result = certificationSchema.safeParse({
        id: "cert-1",
        name: "AWS Certification",
        issuer: "Amazon Web Services",
        date: "",
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Date is required")
      }
    })

    it("rejects missing date", () => {
      const result = certificationSchema.safeParse({
        id: "cert-1",
        name: "AWS Certification",
        issuer: "Amazon Web Services",
      })

      expect(result.success).toBe(false)
    })
  })

  describe("url validation", () => {
    it("accepts valid URLs", () => {
      const validUrls = [
        "https://aws.amazon.com/certification",
        "http://scrumalliance.org/verify",
        "https://microsoft.com/learn/certifications",
      ]

      for (const url of validUrls) {
        const result = certificationSchema.safeParse({
          id: "cert-1",
          name: "Certification",
          issuer: "Issuer",
          date: "2023-06",
          url,
        })
        expect(result.success).toBe(true)
      }
    })

    it("rejects invalid URL formats", () => {
      const result = certificationSchema.safeParse({
        id: "cert-1",
        name: "Certification",
        issuer: "Issuer",
        date: "2023-06",
        url: "not-a-valid-url",
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Invalid URL")
      }
    })

    it("accepts empty URL string", () => {
      const result = certificationSchema.safeParse({
        id: "cert-1",
        name: "Certification",
        issuer: "Issuer",
        date: "2023-06",
        url: "",
      })

      expect(result.success).toBe(true)
    })
  })

  describe("optional fields", () => {
    it("accepts various date formats for expiry", () => {
      const dateFormats = ["2026-06", "2026-06-15", "June 2026"]

      for (const expiryDate of dateFormats) {
        const result = certificationSchema.safeParse({
          id: "cert-1",
          name: "Certification",
          issuer: "Issuer",
          date: "2023-06",
          expiryDate,
        })
        expect(result.success).toBe(true)
      }
    })

    it("accepts various credential ID formats", () => {
      const credentialIds = [
        "ABC123",
        "cert-2023-06-15",
        "CSM-123456-789",
        "12345678",
      ]

      for (const credentialId of credentialIds) {
        const result = certificationSchema.safeParse({
          id: "cert-1",
          name: "Certification",
          issuer: "Issuer",
          date: "2023-06",
          credentialId,
        })
        expect(result.success).toBe(true)
      }
    })
  })

  describe("real-world scenarios", () => {
    it("accepts AWS certification", () => {
      const result = certificationSchema.safeParse({
        id: "cert-1",
        name: "AWS Certified Solutions Architect - Professional",
        issuer: "Amazon Web Services",
        date: "2023-06-15",
        expiryDate: "2026-06-15",
        credentialId: "AWS-CSA-PRO-2023-06",
        url: "https://aws.amazon.com/certification/verify",
      })

      expect(result.success).toBe(true)
    })

    it("accepts Google Cloud certification", () => {
      const result = certificationSchema.safeParse({
        id: "cert-2",
        name: "Google Cloud Professional Cloud Architect",
        issuer: "Google Cloud",
        date: "2023-08",
        expiryDate: "2025-08",
        credentialId: "GCP-PCA-123456",
        url: "https://cloud.google.com/certification",
      })

      expect(result.success).toBe(true)
    })

    it("accepts certification without expiry (lifetime cert)", () => {
      const result = certificationSchema.safeParse({
        id: "cert-3",
        name: "Certified Professional Photographer",
        issuer: "Professional Photographers of America",
        date: "2020-03",
        credentialId: "CPP-12345",
      })

      expect(result.success).toBe(true)
    })
  })
})

describe("createCertificationSchema", () => {
  it("accepts certification without id", () => {
    const result = createCertificationSchema.safeParse({
      name: "AWS Certification",
      issuer: "Amazon Web Services",
      date: "2023-06",
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).not.toHaveProperty("id")
    }
  })

  it("omits id from the schema", () => {
    const result = createCertificationSchema.safeParse({
      id: "cert-1", // This should be stripped
      name: "AWS Certification",
      issuer: "Amazon Web Services",
      date: "2023-06",
    })

    expect(result.success).toBe(true)
    if (result.success) {
      // @ts-expect-error - id should not exist on the type
      expect(result.data.id).toBeUndefined()
    }
  })

  it("still validates required fields", () => {
    const result = createCertificationSchema.safeParse({
      name: "",
      issuer: "Amazon",
      date: "2023-06",
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Certification name is required",
      )
    }
  })

  it("still validates URL format", () => {
    const result = createCertificationSchema.safeParse({
      name: "Certification",
      issuer: "Issuer",
      date: "2023-06",
      url: "not-a-url",
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Invalid URL")
    }
  })
})
