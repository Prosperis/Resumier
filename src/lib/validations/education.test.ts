import { describe, it, expect } from "vitest"
import { educationSchema, createEducationSchema } from "./education"

describe("educationSchema", () => {
  describe("valid data", () => {
    it("accepts valid education with all fields", () => {
      const validData = {
        id: "edu-1",
        institution: "Stanford University",
        degree: "Bachelor of Science",
        field: "Computer Science",
        startDate: "2016-09",
        endDate: "2020-06",
        current: false,
        gpa: "3.8",
        honors: ["Magna Cum Laude", "Dean's List"],
      }

      const result = educationSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })

    it("accepts current education", () => {
      const validData = {
        id: "edu-2",
        institution: "MIT",
        degree: "Master of Science",
        field: "Artificial Intelligence",
        startDate: "2023-09",
        endDate: "2025-06",
        current: true,
      }

      const result = educationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it("accepts education without optional fields", () => {
      const validData = {
        id: "edu-3",
        institution: "Local College",
        degree: "Associate Degree",
        field: "General Studies",
        startDate: "2018-01",
        endDate: "2020-01",
      }

      const result = educationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it("accepts empty gpa", () => {
      const validData = {
        id: "edu-4",
        institution: "University",
        degree: "Bachelor",
        field: "Engineering",
        startDate: "2019-09",
        endDate: "2023-06",
        gpa: "",
      }

      const result = educationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it("accepts empty honors array", () => {
      const validData = {
        id: "edu-5",
        institution: "University",
        degree: "Bachelor",
        field: "Engineering",
        startDate: "2019-09",
        endDate: "2023-06",
        honors: [],
      }

      const result = educationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })

  describe("required fields", () => {
    it("rejects missing id", () => {
      const invalidData = {
        institution: "University",
        degree: "Bachelor",
        field: "Engineering",
        startDate: "2019-09",
        endDate: "2023-06",
      }

      const result = educationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it("rejects empty institution", () => {
      const invalidData = {
        id: "edu-1",
        institution: "",
        degree: "Bachelor",
        field: "Engineering",
        startDate: "2019-09",
        endDate: "2023-06",
      }

      const result = educationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Institution name is required")
      }
    })

    it("rejects missing institution", () => {
      const invalidData = {
        id: "edu-1",
        degree: "Bachelor",
        field: "Engineering",
        startDate: "2019-09",
        endDate: "2023-06",
      }

      const result = educationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it("rejects empty degree", () => {
      const invalidData = {
        id: "edu-1",
        institution: "University",
        degree: "",
        field: "Engineering",
        startDate: "2019-09",
        endDate: "2023-06",
      }

      const result = educationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Degree is required")
      }
    })

    it("rejects missing degree", () => {
      const invalidData = {
        id: "edu-1",
        institution: "University",
        field: "Engineering",
        startDate: "2019-09",
        endDate: "2023-06",
      }

      const result = educationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it("rejects empty field", () => {
      const invalidData = {
        id: "edu-1",
        institution: "University",
        degree: "Bachelor",
        field: "",
        startDate: "2019-09",
        endDate: "2023-06",
      }

      const result = educationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Field of study is required")
      }
    })

    it("rejects missing field", () => {
      const invalidData = {
        id: "edu-1",
        institution: "University",
        degree: "Bachelor",
        startDate: "2019-09",
        endDate: "2023-06",
      }

      const result = educationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it("rejects empty start date", () => {
      const invalidData = {
        id: "edu-1",
        institution: "University",
        degree: "Bachelor",
        field: "Engineering",
        startDate: "",
        endDate: "2023-06",
      }

      const result = educationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Start date is required")
      }
    })

    it("rejects missing start date", () => {
      const invalidData = {
        id: "edu-1",
        institution: "University",
        degree: "Bachelor",
        field: "Engineering",
        endDate: "2023-06",
      }

      const result = educationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it("rejects empty end date", () => {
      const invalidData = {
        id: "edu-1",
        institution: "University",
        degree: "Bachelor",
        field: "Engineering",
        startDate: "2019-09",
        endDate: "",
      }

      const result = educationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("End date is required")
      }
    })

    it("rejects missing end date", () => {
      const invalidData = {
        id: "edu-1",
        institution: "University",
        degree: "Bachelor",
        field: "Engineering",
        startDate: "2019-09",
      }

      const result = educationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe("gpa validation", () => {
    it("rejects gpa longer than 10 characters", () => {
      const invalidData = {
        id: "edu-1",
        institution: "University",
        degree: "Bachelor",
        field: "Engineering",
        startDate: "2019-09",
        endDate: "2023-06",
        gpa: "12345678901",
      }

      const result = educationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("GPA must be less than 10 characters")
      }
    })

    it("accepts gpa with exactly 10 characters", () => {
      const validData = {
        id: "edu-1",
        institution: "University",
        degree: "Bachelor",
        field: "Engineering",
        startDate: "2019-09",
        endDate: "2023-06",
        gpa: "1234567890",
      }

      const result = educationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it("accepts various gpa formats", () => {
      const gpaFormats = ["3.8", "4.0", "3.85/4.0"]

      for (const gpa of gpaFormats) {
        const result = educationSchema.safeParse({
          id: "edu-1",
          institution: "University",
          degree: "Bachelor",
          field: "Engineering",
          startDate: "2019-09",
          endDate: "2023-06",
          gpa,
        })
        expect(result.success).toBe(true)
      }
    })
  })

  describe("honors validation", () => {
    it("accepts multiple honors", () => {
      const validData = {
        id: "edu-1",
        institution: "University",
        degree: "Bachelor",
        field: "Engineering",
        startDate: "2019-09",
        endDate: "2023-06",
        honors: ["Summa Cum Laude", "Valedictorian", "Dean's List (4 years)"],
      }

      const result = educationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it("accepts single honor", () => {
      const validData = {
        id: "edu-1",
        institution: "University",
        degree: "Bachelor",
        field: "Engineering",
        startDate: "2019-09",
        endDate: "2023-06",
        honors: ["Cum Laude"],
      }

      const result = educationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })
})

describe("createEducationSchema", () => {
  it("accepts education without id", () => {
    const validData = {
      institution: "University",
      degree: "Bachelor",
      field: "Engineering",
      startDate: "2019-09",
      endDate: "2023-06",
    }

    const result = createEducationSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it("omits id from the schema", () => {
    const validData = {
      id: "edu-1", // This should be ignored
      institution: "University",
      degree: "Bachelor",
      field: "Engineering",
      startDate: "2019-09",
      endDate: "2023-06",
    }

    const result = createEducationSchema.safeParse(validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).not.toHaveProperty("id")
    }
  })

  it("still validates required fields", () => {
    const invalidData = {
      institution: "",
      degree: "Bachelor",
      field: "Engineering",
      startDate: "2019-09",
      endDate: "2023-06",
    }

    const result = createEducationSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it("still validates gpa length", () => {
    const invalidData = {
      institution: "University",
      degree: "Bachelor",
      field: "Engineering",
      startDate: "2019-09",
      endDate: "2023-06",
      gpa: "12345678901",
    }

    const result = createEducationSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })
})
