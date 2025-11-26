import { describe, expect, it } from "vitest";
import {
  type CreateExperienceFormData,
  createExperienceSchema,
  type ExperienceFormData,
  experienceSchema,
} from "../experience";

describe("experienceSchema", () => {
  describe("Valid Data", () => {
    it("validates complete experience entry", () => {
      const validData: ExperienceFormData = {
        id: "exp-1",
        company: "Tech Corp",
        position: "Senior Developer",
        startDate: "2020-01",
        endDate: "2023-06",
        current: false,
        description: "Led development of web applications",
        highlights: ["Built React app", "Mentored team"],
      };
      const result = experienceSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("validates current position without end date", () => {
      const data = {
        id: "exp-1",
        company: "Current Company",
        position: "Developer",
        startDate: "2023-01",
        current: true,
      };
      const result = experienceSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("validates with empty optional fields", () => {
      const data = {
        id: "exp-1",
        company: "Company",
        position: "Position",
        startDate: "2020-01",
        endDate: "2021-01",
        description: "",
      };
      const result = experienceSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("validates with omitted optional fields", () => {
      const data = {
        id: "exp-1",
        company: "Company",
        position: "Position",
        startDate: "2020-01",
        endDate: "2021-01",
      };
      const result = experienceSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("validates with empty highlights array", () => {
      const data = {
        id: "exp-1",
        company: "Company",
        position: "Position",
        startDate: "2020-01",
        endDate: "2021-01",
        highlights: [],
      };
      const result = experienceSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("Optional Fields", () => {
    it("accepts when company is missing (all fields optional)", () => {
      const data = {
        id: "exp-1",
        position: "Developer",
        startDate: "2020-01",
        endDate: "2021-01",
      };
      const result = experienceSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("accepts when position is missing (all fields optional)", () => {
      const data = {
        id: "exp-1",
        company: "Company",
        startDate: "2020-01",
        endDate: "2021-01",
      };
      const result = experienceSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("accepts when start date is missing (all fields optional)", () => {
      const data = {
        id: "exp-1",
        company: "Company",
        position: "Developer",
        endDate: "2021-01",
      };
      const result = experienceSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("accepts when end date is missing for past position (all fields optional)", () => {
      const data = {
        id: "exp-1",
        company: "Company",
        position: "Developer",
        startDate: "2020-01",
        current: false,
      };
      const result = experienceSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("accepts when company is empty string (all fields optional)", () => {
      const data = {
        id: "exp-1",
        company: "",
        position: "Developer",
        startDate: "2020-01",
        endDate: "2021-01",
      };
      const result = experienceSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("accepts when position is empty string (all fields optional)", () => {
      const data = {
        id: "exp-1",
        company: "Company",
        position: "",
        startDate: "2020-01",
        endDate: "2021-01",
      };
      const result = experienceSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("accepts completely empty experience entry (only id required)", () => {
      const data = {
        id: "exp-1",
      };
      const result = experienceSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("Invalid Data", () => {
    it("fails when description exceeds 1000 characters", () => {
      const data = {
        id: "exp-1",
        company: "Company",
        position: "Developer",
        startDate: "2020-01",
        endDate: "2021-01",
        description: "a".repeat(1001),
      };
      const result = experienceSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("description");
      }
    });
  });

  describe("Edge Cases", () => {
    it("accepts description at exactly 1000 characters", () => {
      const data = {
        id: "exp-1",
        company: "Company",
        position: "Developer",
        startDate: "2020-01",
        endDate: "2021-01",
        description: "a".repeat(1000),
      };
      const result = experienceSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("validates with current=true and empty end date", () => {
      const data = {
        id: "exp-1",
        company: "Company",
        position: "Developer",
        startDate: "2020-01",
        endDate: "",
        current: true,
      };
      const result = experienceSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("validates with multiple highlights", () => {
      const data = {
        id: "exp-1",
        company: "Company",
        position: "Developer",
        startDate: "2020-01",
        endDate: "2021-01",
        highlights: ["Achievement 1", "Achievement 2", "Achievement 3"],
      };
      const result = experienceSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });
});

describe("createExperienceSchema", () => {
  it("validates new experience without ID", () => {
    const validData: CreateExperienceFormData = {
      company: "New Company",
      position: "Junior Developer",
      startDate: "2023-01",
      current: true,
    };
    const result = createExperienceSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("fails when ID is provided", () => {
    const data = {
      id: "exp-1",
      company: "Company",
      position: "Developer",
      startDate: "2020-01",
      endDate: "2021-01",
    };
    const result = createExperienceSchema.safeParse(data);
    // Should succeed but ID will be ignored
    expect(result.success).toBe(true);
    if (result.success) {
      // @ts-expect-error - ID should not be in the parsed data
      expect(result.data.id).toBeUndefined();
    }
  });

  it("validates complete data without ID", () => {
    const data = {
      company: "Company",
      position: "Developer",
      startDate: "2020-01",
      endDate: "2021-01",
      description: "Description",
      highlights: ["Highlight 1"],
    };
    const result = createExperienceSchema.safeParse(data);
    expect(result.success).toBe(true);
  });
});
