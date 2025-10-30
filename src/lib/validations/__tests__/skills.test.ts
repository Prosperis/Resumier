import { describe, expect, it } from "vitest";
import { type SkillsFormData, skillsSchema } from "../skills";

describe("skillsSchema", () => {
  describe("Valid Data", () => {
    it("validates complete skills data", () => {
      const validData: SkillsFormData = {
        technical: ["JavaScript", "TypeScript", "React"],
        languages: ["English", "Spanish"],
        tools: ["Git", "Docker", "VS Code"],
        soft: ["Communication", "Leadership"],
      };
      const result = skillsSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("validates with all fields omitted", () => {
      const data = {};
      const result = skillsSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("validates with some fields present", () => {
      const data = {
        technical: ["React", "Node.js"],
        languages: ["English"],
      };
      const result = skillsSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("validates with empty arrays", () => {
      const data = {
        technical: [],
        languages: [],
        tools: [],
        soft: [],
      };
      const result = skillsSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("Technical Skills", () => {
    it("accepts array of technical skills", () => {
      const data = {
        technical: ["JavaScript", "Python", "Java", "C++"],
      };
      const result = skillsSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("accepts single technical skill", () => {
      const data = {
        technical: ["JavaScript"],
      };
      const result = skillsSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("accepts technical skills with special characters", () => {
      const data = {
        technical: ["C#", "C++", "ASP.NET", "Node.js", "React.js"],
      };
      const result = skillsSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("accepts technical skills with spaces", () => {
      const data = {
        technical: ["Machine Learning", "Data Science", "Web Development"],
      };
      const result = skillsSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("rejects non-array technical skills", () => {
      const data = {
        technical: "JavaScript",
      };
      const result = skillsSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("rejects array with non-string items", () => {
      const data = {
        technical: ["JavaScript", 123, "Python"],
      };
      const result = skillsSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("Language Skills", () => {
    it("accepts array of languages", () => {
      const data = {
        languages: ["English", "Spanish", "French", "German"],
      };
      const result = skillsSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("accepts languages with proficiency levels", () => {
      const data = {
        languages: ["English (Native)", "Spanish (Fluent)", "French (Basic)"],
      };
      const result = skillsSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("accepts languages in native script", () => {
      const data = {
        languages: ["English", "日本語", "中文", "한국어"],
      };
      const result = skillsSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("rejects non-array languages", () => {
      const data = {
        languages: "English",
      };
      const result = skillsSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("Tool Skills", () => {
    it("accepts array of tools", () => {
      const data = {
        tools: ["Git", "Docker", "Kubernetes", "Jenkins"],
      };
      const result = skillsSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("accepts tools with version numbers", () => {
      const data = {
        tools: ["Docker 20.10", "Node.js 18", "Git 2.39"],
      };
      const result = skillsSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("accepts various tool categories", () => {
      const data = {
        tools: ["VS Code", "IntelliJ IDEA", "Postman", "Figma", "Jira"],
      };
      const result = skillsSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("rejects non-array tools", () => {
      const data = {
        tools: "Git",
      };
      const result = skillsSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("Soft Skills", () => {
    it("accepts array of soft skills", () => {
      const data = {
        soft: ["Communication", "Leadership", "Problem Solving", "Teamwork"],
      };
      const result = skillsSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("accepts complex soft skills descriptions", () => {
      const data = {
        soft: [
          "Cross-functional Team Leadership",
          "Agile Project Management",
          "Client Relationship Management",
        ],
      };
      const result = skillsSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("accepts soft skills with special characters", () => {
      const data = {
        soft: ["Problem-Solving", "Time Management", "Self-Motivated"],
      };
      const result = skillsSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("rejects non-array soft skills", () => {
      const data = {
        soft: "Leadership",
      };
      const result = skillsSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("Multiple Fields", () => {
    it("validates all fields together", () => {
      const data = {
        technical: ["React", "Node.js", "PostgreSQL"],
        languages: ["English", "Spanish"],
        tools: ["Git", "Docker", "VS Code"],
        soft: ["Leadership", "Communication"],
      };
      const result = skillsSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("validates with only one field", () => {
      const data = {
        technical: ["JavaScript"],
      };
      const result = skillsSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("validates with mix of empty and filled arrays", () => {
      const data = {
        technical: ["React"],
        languages: [],
        tools: ["Git"],
        soft: [],
      };
      const result = skillsSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("Edge Cases", () => {
    it("accepts data with extra unexpected fields", () => {
      const data = {
        technical: ["React"],
        unexpectedField: ["value"],
      };
      // Zod by default strips unknown keys
      const result = skillsSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("handles null values correctly", () => {
      const data = {
        technical: null,
        languages: null,
      };
      const result = skillsSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("handles undefined values", () => {
      const data = {
        technical: undefined,
        languages: undefined,
        tools: undefined,
        soft: undefined,
      };
      const result = skillsSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("accepts empty strings in arrays", () => {
      const data = {
        technical: ["React", "", "Node.js"],
      };
      const result = skillsSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("accepts very long skill names", () => {
      const data = {
        technical: ["A".repeat(200)],
      };
      const result = skillsSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("accepts large arrays", () => {
      const data = {
        technical: Array(100).fill("JavaScript"),
      };
      const result = skillsSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("accepts skills with emoji", () => {
      const data = {
        technical: ["React ⚛️", "Node.js 🟢", "TypeScript 💙"],
      };
      const result = skillsSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("accepts skills with numbers", () => {
      const data = {
        technical: ["HTML5", "CSS3", "ES6", "HTTP/2"],
      };
      const result = skillsSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("handles duplicate skills", () => {
      const data = {
        technical: ["React", "React", "React"],
      };
      const result = skillsSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("handles whitespace-only strings", () => {
      const data = {
        technical: ["   ", "React", "  "],
      };
      const result = skillsSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });
});
