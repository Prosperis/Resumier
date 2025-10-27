import { describe, expect, it } from "vitest"
import { createLinkSchema, linkSchema, linkTypeSchema } from "./links"

describe("linkTypeSchema", () => {
  it("accepts portfolio type", () => {
    const result = linkTypeSchema.safeParse("portfolio")
    expect(result.success).toBe(true)
  })

  it("accepts linkedin type", () => {
    const result = linkTypeSchema.safeParse("linkedin")
    expect(result.success).toBe(true)
  })

  it("accepts github type", () => {
    const result = linkTypeSchema.safeParse("github")
    expect(result.success).toBe(true)
  })

  it("accepts other type", () => {
    const result = linkTypeSchema.safeParse("other")
    expect(result.success).toBe(true)
  })

  it("rejects invalid type", () => {
    const result = linkTypeSchema.safeParse("twitter")
    expect(result.success).toBe(false)
  })
})

describe("linkSchema", () => {
  describe("valid data", () => {
    it("accepts valid link with all fields", () => {
      const validData = {
        id: "link-1",
        label: "Portfolio",
        url: "https://johndoe.com",
        type: "portfolio" as const,
      }

      const result = linkSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })

    it("accepts portfolio link", () => {
      const result = linkSchema.safeParse({
        id: "link-1",
        label: "My Portfolio",
        url: "https://portfolio.example.com",
        type: "portfolio",
      })

      expect(result.success).toBe(true)
    })

    it("accepts linkedin link", () => {
      const result = linkSchema.safeParse({
        id: "link-2",
        label: "LinkedIn Profile",
        url: "https://linkedin.com/in/johndoe",
        type: "linkedin",
      })

      expect(result.success).toBe(true)
    })

    it("accepts github link", () => {
      const result = linkSchema.safeParse({
        id: "link-3",
        label: "GitHub Profile",
        url: "https://github.com/johndoe",
        type: "github",
      })

      expect(result.success).toBe(true)
    })

    it("accepts other link type", () => {
      const result = linkSchema.safeParse({
        id: "link-4",
        label: "Personal Blog",
        url: "https://blog.example.com",
        type: "other",
      })

      expect(result.success).toBe(true)
    })
  })

  describe("required fields", () => {
    it("rejects missing id", () => {
      const result = linkSchema.safeParse({
        label: "Portfolio",
        url: "https://example.com",
        type: "portfolio",
      })

      expect(result.success).toBe(false)
    })

    it("rejects empty label", () => {
      const result = linkSchema.safeParse({
        id: "link-1",
        label: "",
        url: "https://example.com",
        type: "portfolio",
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Label is required")
      }
    })

    it("rejects missing label", () => {
      const result = linkSchema.safeParse({
        id: "link-1",
        url: "https://example.com",
        type: "portfolio",
      })

      expect(result.success).toBe(false)
    })

    it("rejects empty url", () => {
      const result = linkSchema.safeParse({
        id: "link-1",
        label: "Portfolio",
        url: "",
        type: "portfolio",
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        // URL validation runs before min length, so we get "Invalid URL"
        expect(result.error.issues[0].message).toBe("Invalid URL")
      }
    })

    it("rejects missing url", () => {
      const result = linkSchema.safeParse({
        id: "link-1",
        label: "Portfolio",
        type: "portfolio",
      })

      expect(result.success).toBe(false)
    })

    it("rejects missing type", () => {
      const result = linkSchema.safeParse({
        id: "link-1",
        label: "Portfolio",
        url: "https://example.com",
      })

      expect(result.success).toBe(false)
    })
  })

  describe("url validation", () => {
    it("accepts valid http URLs", () => {
      const result = linkSchema.safeParse({
        id: "link-1",
        label: "Portfolio",
        url: "http://example.com",
        type: "portfolio",
      })

      expect(result.success).toBe(true)
    })

    it("accepts valid https URLs", () => {
      const result = linkSchema.safeParse({
        id: "link-1",
        label: "Portfolio",
        url: "https://example.com",
        type: "portfolio",
      })

      expect(result.success).toBe(true)
    })

    it("accepts URLs with paths", () => {
      const result = linkSchema.safeParse({
        id: "link-1",
        label: "Portfolio",
        url: "https://example.com/portfolio/projects",
        type: "portfolio",
      })

      expect(result.success).toBe(true)
    })

    it("accepts URLs with query parameters", () => {
      const result = linkSchema.safeParse({
        id: "link-1",
        label: "Portfolio",
        url: "https://example.com/portfolio?id=123",
        type: "portfolio",
      })

      expect(result.success).toBe(true)
    })

    it("accepts URLs with fragments", () => {
      const result = linkSchema.safeParse({
        id: "link-1",
        label: "Portfolio",
        url: "https://example.com/portfolio#section",
        type: "portfolio",
      })

      expect(result.success).toBe(true)
    })

    it("rejects invalid URL formats", () => {
      const invalidUrls = ["not-a-url", "just text with spaces"]

      for (const url of invalidUrls) {
        const result = linkSchema.safeParse({
          id: "link-1",
          label: "Portfolio",
          url,
          type: "portfolio",
        })
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe("Invalid URL")
        }
      }
    })
  })

  describe("type validation", () => {
    it("rejects invalid type values", () => {
      const result = linkSchema.safeParse({
        id: "link-1",
        label: "Twitter",
        url: "https://twitter.com/johndoe",
        type: "twitter",
      })

      expect(result.success).toBe(false)
    })
  })

  describe("real-world scenarios", () => {
    it("accepts typical portfolio link", () => {
      const result = linkSchema.safeParse({
        id: "link-1",
        label: "Personal Website",
        url: "https://johndoe.dev",
        type: "portfolio",
      })

      expect(result.success).toBe(true)
    })

    it("accepts typical LinkedIn link", () => {
      const result = linkSchema.safeParse({
        id: "link-2",
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/john-doe-12345678",
        type: "linkedin",
      })

      expect(result.success).toBe(true)
    })

    it("accepts typical GitHub link", () => {
      const result = linkSchema.safeParse({
        id: "link-3",
        label: "GitHub",
        url: "https://github.com/johndoe",
        type: "github",
      })

      expect(result.success).toBe(true)
    })

    it("accepts blog link as other type", () => {
      const result = linkSchema.safeParse({
        id: "link-4",
        label: "Technical Blog",
        url: "https://medium.com/@johndoe",
        type: "other",
      })

      expect(result.success).toBe(true)
    })
  })
})

describe("createLinkSchema", () => {
  it("accepts link without id", () => {
    const result = createLinkSchema.safeParse({
      label: "Portfolio",
      url: "https://example.com",
      type: "portfolio",
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).not.toHaveProperty("id")
    }
  })

  it("omits id from the schema", () => {
    const result = createLinkSchema.safeParse({
      id: "link-1", // This should be stripped
      label: "Portfolio",
      url: "https://example.com",
      type: "portfolio",
    })

    expect(result.success).toBe(true)
    if (result.success) {
      // @ts-expect-error - id should not exist on the type
      expect(result.data.id).toBeUndefined()
    }
  })

  it("still validates required fields", () => {
    const result = createLinkSchema.safeParse({
      label: "",
      url: "https://example.com",
      type: "portfolio",
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Label is required")
    }
  })

  it("still validates URL format", () => {
    const result = createLinkSchema.safeParse({
      label: "Portfolio",
      url: "not-a-url",
      type: "portfolio",
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Invalid URL")
    }
  })

  it("still validates type enum", () => {
    const result = createLinkSchema.safeParse({
      label: "Twitter",
      url: "https://twitter.com",
      type: "twitter",
    })

    expect(result.success).toBe(false)
  })
})
