import { describe, expect, it } from "vitest";
import {
  type CreateLinkFormData,
  createLinkSchema,
  type LinkFormData,
  linkSchema,
  linkTypeSchema,
} from "../links";

describe("linkTypeSchema", () => {
  it("validates portfolio type", () => {
    const result = linkTypeSchema.safeParse("portfolio");
    expect(result.success).toBe(true);
  });

  it("validates linkedin type", () => {
    const result = linkTypeSchema.safeParse("linkedin");
    expect(result.success).toBe(true);
  });

  it("validates github type", () => {
    const result = linkTypeSchema.safeParse("github");
    expect(result.success).toBe(true);
  });

  it("validates other type", () => {
    const result = linkTypeSchema.safeParse("other");
    expect(result.success).toBe(true);
  });

  it("fails for invalid type", () => {
    const result = linkTypeSchema.safeParse("invalid");
    expect(result.success).toBe(false);
  });

  it("fails for empty string", () => {
    const result = linkTypeSchema.safeParse("");
    expect(result.success).toBe(false);
  });
});

describe("linkSchema", () => {
  describe("Valid Data", () => {
    it("validates complete link entry", () => {
      const validData: LinkFormData = {
        id: "link-1",
        label: "My Portfolio",
        url: "https://johndoe.com",
        type: "portfolio",
      };
      const result = linkSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("validates linkedin link", () => {
      const data = {
        id: "link-1",
        label: "LinkedIn Profile",
        url: "https://linkedin.com/in/johndoe",
        type: "linkedin",
      };
      const result = linkSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("validates github link", () => {
      const data = {
        id: "link-1",
        label: "GitHub Profile",
        url: "https://github.com/johndoe",
        type: "github",
      };
      const result = linkSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("validates other link type", () => {
      const data = {
        id: "link-1",
        label: "Blog",
        url: "https://myblog.com",
        type: "other",
      };
      const result = linkSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("validates with various URL formats", () => {
      const urls = [
        "https://example.com",
        "http://example.com",
        "https://subdomain.example.com",
        "https://example.com/path/to/page",
        "https://example.com?query=param",
      ];

      for (const url of urls) {
        const data = {
          id: "link-1",
          label: "Test Link",
          url,
          type: "other" as const,
        };
        const result = linkSchema.safeParse(data);
        expect(result.success).toBe(true);
      }
    });
  });

  describe("Invalid Data", () => {
    it("fails when label is missing", () => {
      const data = {
        id: "link-1",
        url: "https://example.com",
        type: "portfolio",
      };
      const result = linkSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("label");
      }
    });

    it("fails when URL is missing", () => {
      const data = {
        id: "link-1",
        label: "My Link",
        type: "portfolio",
      };
      const result = linkSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("url");
      }
    });

    it("fails when type is missing", () => {
      const data = {
        id: "link-1",
        label: "My Link",
        url: "https://example.com",
      };
      const result = linkSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("type");
      }
    });

    it("fails when label is empty string", () => {
      const data = {
        id: "link-1",
        label: "",
        url: "https://example.com",
        type: "portfolio",
      };
      const result = linkSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("fails when URL is empty string", () => {
      const data = {
        id: "link-1",
        label: "My Link",
        url: "",
        type: "portfolio",
      };
      const result = linkSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("fails when URL is invalid format", () => {
      const data = {
        id: "link-1",
        label: "My Link",
        url: "not-a-valid-url",
        type: "portfolio",
      };
      const result = linkSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Invalid URL");
      }
    });

    it("fails when type is invalid", () => {
      const data = {
        id: "link-1",
        label: "My Link",
        url: "https://example.com",
        type: "invalid-type",
      };
      const result = linkSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("type");
      }
    });

    it("fails for URLs without protocol or clearly malformed", () => {
      const invalidUrls = [
        "just-text-without-protocol",
        "example",
        "://no-protocol",
      ];

      for (const url of invalidUrls) {
        const data = {
          id: "link-1",
          label: "Test",
          url,
          type: "other" as const,
        };
        const result = linkSchema.safeParse(data);
        expect(result.success).toBe(false);
      }
    });
  });

  describe("Edge Cases", () => {
    it("validates with long labels", () => {
      const data = {
        id: "link-1",
        label: "My Professional Portfolio Website with Projects and Blog",
        url: "https://example.com",
        type: "portfolio",
      };
      const result = linkSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("validates with complex URLs", () => {
      const data = {
        id: "link-1",
        label: "Portfolio",
        url: "https://subdomain.example.com/path/to/page?query=value&other=param#section",
        type: "portfolio",
      };
      const result = linkSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("validates all link types", () => {
      const types = ["portfolio", "linkedin", "github", "other"] as const;

      for (const type of types) {
        const data = {
          id: `link-${type}`,
          label: `${type} link`,
          url: "https://example.com",
          type,
        };
        const result = linkSchema.safeParse(data);
        expect(result.success).toBe(true);
      }
    });

    it("validates with special characters in label", () => {
      const data = {
        id: "link-1",
        label: "My Portfolio & Projects (2024)",
        url: "https://example.com",
        type: "portfolio",
      };
      const result = linkSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });
});

describe("createLinkSchema", () => {
  it("validates new link without ID", () => {
    const validData: CreateLinkFormData = {
      label: "New Link",
      url: "https://newsite.com",
      type: "portfolio",
    };
    const result = createLinkSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("omits ID from parsed data", () => {
    const data = {
      id: "should-be-ignored",
      label: "Portfolio",
      url: "https://example.com",
      type: "portfolio",
    };
    const result = createLinkSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      // @ts-expect-error - ID should not be in the parsed data
      expect(result.data.id).toBeUndefined();
    }
  });

  it("validates all link types without ID", () => {
    const types = ["portfolio", "linkedin", "github", "other"] as const;

    for (const type of types) {
      const data = {
        label: `${type} link`,
        url: "https://example.com",
        type,
      };
      const result = createLinkSchema.safeParse(data);
      expect(result.success).toBe(true);
    }
  });
});
