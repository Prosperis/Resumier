import { describe, expect, it } from "vitest"
import { skillsSchema } from "./skills"

describe("skillsSchema", () => {
  describe("valid data", () => {
    it("accepts valid skills with all categories", () => {
      const validData = {
        technical: ["JavaScript", "TypeScript", "React"],
        languages: ["English", "Spanish"],
        tools: ["Git", "VS Code", "Docker"],
        soft: ["Leadership", "Communication"],
      }

      const result = skillsSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })

    it("accepts skills with only some categories", () => {
      const validData = {
        technical: ["JavaScript", "Python"],
        languages: ["English"],
      }

      const result = skillsSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it("accepts empty object (all fields optional)", () => {
      const result = skillsSchema.safeParse({})
      expect(result.success).toBe(true)
    })

    it("accepts empty arrays for categories", () => {
      const validData = {
        technical: [],
        languages: [],
        tools: [],
        soft: [],
      }

      const result = skillsSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })

  describe("technical skills validation", () => {
    it("accepts multiple technical skills", () => {
      const result = skillsSchema.safeParse({
        technical: [
          "JavaScript",
          "TypeScript",
          "React",
          "Node.js",
          "Python",
          "Rust",
        ],
      })

      expect(result.success).toBe(true)
    })

    it("accepts single technical skill", () => {
      const result = skillsSchema.safeParse({
        technical: ["JavaScript"],
      })

      expect(result.success).toBe(true)
    })

    it("accepts empty technical array", () => {
      const result = skillsSchema.safeParse({
        technical: [],
      })

      expect(result.success).toBe(true)
    })

    it("rejects non-array technical skills", () => {
      const result = skillsSchema.safeParse({
        technical: "JavaScript",
      })

      expect(result.success).toBe(false)
    })

    it("rejects non-string items in technical array", () => {
      const result = skillsSchema.safeParse({
        technical: ["JavaScript", 123, "React"],
      })

      expect(result.success).toBe(false)
    })
  })

  describe("languages validation", () => {
    it("accepts multiple languages", () => {
      const result = skillsSchema.safeParse({
        languages: ["English", "Spanish", "French", "Mandarin"],
      })

      expect(result.success).toBe(true)
    })

    it("accepts single language", () => {
      const result = skillsSchema.safeParse({
        languages: ["English"],
      })

      expect(result.success).toBe(true)
    })

    it("accepts empty languages array", () => {
      const result = skillsSchema.safeParse({
        languages: [],
      })

      expect(result.success).toBe(true)
    })

    it("rejects non-array languages", () => {
      const result = skillsSchema.safeParse({
        languages: "English",
      })

      expect(result.success).toBe(false)
    })
  })

  describe("tools validation", () => {
    it("accepts multiple tools", () => {
      const result = skillsSchema.safeParse({
        tools: ["Git", "Docker", "VS Code", "Figma", "Postman"],
      })

      expect(result.success).toBe(true)
    })

    it("accepts single tool", () => {
      const result = skillsSchema.safeParse({
        tools: ["Git"],
      })

      expect(result.success).toBe(true)
    })

    it("accepts empty tools array", () => {
      const result = skillsSchema.safeParse({
        tools: [],
      })

      expect(result.success).toBe(true)
    })

    it("rejects non-array tools", () => {
      const result = skillsSchema.safeParse({
        tools: "Git",
      })

      expect(result.success).toBe(false)
    })
  })

  describe("soft skills validation", () => {
    it("accepts multiple soft skills", () => {
      const result = skillsSchema.safeParse({
        soft: [
          "Leadership",
          "Communication",
          "Problem Solving",
          "Teamwork",
          "Time Management",
        ],
      })

      expect(result.success).toBe(true)
    })

    it("accepts single soft skill", () => {
      const result = skillsSchema.safeParse({
        soft: ["Leadership"],
      })

      expect(result.success).toBe(true)
    })

    it("accepts empty soft skills array", () => {
      const result = skillsSchema.safeParse({
        soft: [],
      })

      expect(result.success).toBe(true)
    })

    it("rejects non-array soft skills", () => {
      const result = skillsSchema.safeParse({
        soft: "Leadership",
      })

      expect(result.success).toBe(false)
    })
  })

  describe("combined validation", () => {
    it("validates multiple categories simultaneously", () => {
      const validData = {
        technical: ["React", "Node.js"],
        languages: ["English"],
        tools: ["Git"],
        soft: ["Leadership"],
      }

      const result = skillsSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it("rejects invalid data in any category", () => {
      const invalidData = {
        technical: ["React"],
        languages: 123, // Invalid
        tools: ["Git"],
      }

      const result = skillsSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it("accepts omitted categories", () => {
      const result = skillsSchema.safeParse({
        technical: ["JavaScript"],
        // other categories omitted
      })

      expect(result.success).toBe(true)
    })
  })
})
