import { describe, expect, it } from "vitest";
import {
  type CreateEducationFormData,
  createEducationSchema,
  type EducationFormData,
  educationSchema,
} from "../education";

describe("educationSchema", () => {
  describe("Valid Data", () => {
    it("validates complete education entry", () => {
      const validData: EducationFormData = {
        id: "edu-1",
        institution: "MIT",
        degree: "Bachelor of Science",
        field: "Computer Science",
        startDate: "2016-09",
        endDate: "2020-06",
        current: false,
        gpa: "3.8",
        honors: ["Magna Cum Laude", "Dean's List"],
      };
      const result = educationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("validates minimal required fields", () => {
      const data = {
        id: "edu-1",
        institution: "University",
        degree: "BS",
        field: "Engineering",
        startDate: "2018-09",
        endDate: "2022-05",
      };
      const result = educationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("validates current education", () => {
      const data = {
        id: "edu-1",
        institution: "Stanford",
        degree: "PhD",
        field: "AI",
        startDate: "2023-09",
        endDate: "",
        current: true,
      };
      const result = educationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("validates with empty optional fields", () => {
      const data = {
        id: "edu-1",
        institution: "College",
        degree: "BA",
        field: "Arts",
        startDate: "2019-09",
        endDate: "2023-05",
        gpa: "",
      };
      const result = educationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("validates with omitted optional fields", () => {
      const data = {
        id: "edu-1",
        institution: "University",
        degree: "MS",
        field: "Data Science",
        startDate: "2020-09",
        endDate: "2022-05",
      };
      const result = educationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("validates with empty honors array", () => {
      const data = {
        id: "edu-1",
        institution: "College",
        degree: "BS",
        field: "Math",
        startDate: "2018-09",
        endDate: "2022-05",
        honors: [],
      };
      const result = educationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("Optional Fields", () => {
    it("accepts when institution is missing (all fields optional)", () => {
      const data = {
        id: "edu-1",
        degree: "BS",
        field: "CS",
        startDate: "2018-09",
        endDate: "2022-05",
      };
      const result = educationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("accepts when degree is missing (all fields optional)", () => {
      const data = {
        id: "edu-1",
        institution: "MIT",
        field: "CS",
        startDate: "2018-09",
        endDate: "2022-05",
      };
      const result = educationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("accepts when field is missing (all fields optional)", () => {
      const data = {
        id: "edu-1",
        institution: "MIT",
        degree: "BS",
        startDate: "2018-09",
        endDate: "2022-05",
      };
      const result = educationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("accepts when start date is missing (all fields optional)", () => {
      const data = {
        id: "edu-1",
        institution: "MIT",
        degree: "BS",
        field: "CS",
        endDate: "2022-05",
      };
      const result = educationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("accepts when institution is empty string (all fields optional)", () => {
      const data = {
        id: "edu-1",
        institution: "",
        degree: "BS",
        field: "CS",
        startDate: "2018-09",
        endDate: "2022-05",
      };
      const result = educationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("accepts when degree is empty string (all fields optional)", () => {
      const data = {
        id: "edu-1",
        institution: "MIT",
        degree: "",
        field: "CS",
        startDate: "2018-09",
        endDate: "2022-05",
      };
      const result = educationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("accepts when field is empty string (all fields optional)", () => {
      const data = {
        id: "edu-1",
        institution: "MIT",
        degree: "BS",
        field: "",
        startDate: "2018-09",
        endDate: "2022-05",
      };
      const result = educationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("accepts completely empty education entry (only id required)", () => {
      const data = {
        id: "edu-1",
      };
      const result = educationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("Invalid Data", () => {
    it("fails when GPA exceeds 10 characters", () => {
      const data = {
        id: "edu-1",
        institution: "MIT",
        degree: "BS",
        field: "CS",
        startDate: "2018-09",
        endDate: "2022-05",
        gpa: "12345678901",
      };
      const result = educationSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("gpa");
      }
    });
  });

  describe("Edge Cases", () => {
    it("accepts GPA at exactly 10 characters", () => {
      const data = {
        id: "edu-1",
        institution: "MIT",
        degree: "BS",
        field: "CS",
        startDate: "2018-09",
        endDate: "2022-05",
        gpa: "1234567890",
      };
      const result = educationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("validates with multiple honors", () => {
      const data = {
        id: "edu-1",
        institution: "Harvard",
        degree: "BA",
        field: "History",
        startDate: "2017-09",
        endDate: "2021-05",
        honors: ["Summa Cum Laude", "Phi Beta Kappa", "Honors Thesis"],
      };
      const result = educationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("validates with various GPA formats", () => {
      const gpaFormats = ["3.8", "3.80", "3.8/4.0", "95%", "A"];

      for (const gpa of gpaFormats) {
        const data = {
          id: "edu-1",
          institution: "College",
          degree: "BS",
          field: "Math",
          startDate: "2018-09",
          endDate: "2022-05",
          gpa,
        };
        const result = educationSchema.safeParse(data);
        expect(result.success).toBe(true);
      }
    });
  });
});

describe("createEducationSchema", () => {
  it("validates new education without ID", () => {
    const validData: CreateEducationFormData = {
      institution: "New University",
      degree: "MS",
      field: "Data Science",
      startDate: "2023-09",
      endDate: "2025-05",
    };
    const result = createEducationSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("omits ID from parsed data", () => {
    const data = {
      id: "should-be-ignored",
      institution: "University",
      degree: "PhD",
      field: "Physics",
      startDate: "2022-09",
      endDate: "2026-05",
    };
    const result = createEducationSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      // @ts-expect-error - ID should not be in the parsed data
      expect(result.data.id).toBeUndefined();
    }
  });

  it("validates complete data without ID", () => {
    const data = {
      institution: "Stanford",
      degree: "MS",
      field: "AI",
      startDate: "2023-09",
      endDate: "2025-05",
      gpa: "4.0",
      honors: ["Fellowship"],
    };
    const result = createEducationSchema.safeParse(data);
    expect(result.success).toBe(true);
  });
});
