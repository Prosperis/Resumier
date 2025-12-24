/**
 * Tests for LinkedIn Data Export Parser
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import JSZip from "jszip";

// Mock the parser functions
import { parseLinkedInZip, isLinkedInExport } from "@/lib/services/linkedin-data-parser";

/**
 * Helper to create a File from JSZip instance
 */
async function createZipFile(zip: JSZip, filename: string): Promise<File> {
  const arrayBuffer = await zip.generateAsync({ type: "arraybuffer" });
  return new File([arrayBuffer], filename, {
    type: "application/zip",
  });
}

describe("LinkedIn Data Parser", () => {
  describe("isLinkedInExport", () => {
    it("should return true for files with linkedin in the name", () => {
      const file = new File([""], "Basic_LinkedInDataExport.zip", {
        type: "application/zip",
      });
      expect(isLinkedInExport(file)).toBe(true);
    });

    it("should return true for files with Complete_LinkedIn prefix", () => {
      const file = new File([""], "Complete_LinkedInDataExport_01-01-2024.zip", {
        type: "application/zip",
      });
      expect(isLinkedInExport(file)).toBe(true);
    });

    it("should return false for non-zip files", () => {
      const file = new File([""], "linkedin_data.json", {
        type: "application/json",
      });
      expect(isLinkedInExport(file)).toBe(false);
    });

    it("should return false for random zip files", () => {
      const file = new File([""], "my_photos.zip", {
        type: "application/zip",
      });
      expect(isLinkedInExport(file)).toBe(false);
    });
  });

  describe("parseLinkedInZip", () => {
    it("should reject non-zip files", async () => {
      const file = new File(["not a zip"], "data.txt", {
        type: "text/plain",
      });

      const result = await parseLinkedInZip(file);

      expect(result.success).toBe(false);
      expect(result.error).toContain("ZIP file");
    });

    it("should parse a valid LinkedIn export with profile data", async () => {
      const zip = new JSZip();

      // Add Profile CSV
      zip.file(
        "Profile.csv",
        `First Name,Last Name,Headline,Summary,Geo Location
John,Doe,Software Engineer,Experienced developer with 10+ years,San Francisco Bay Area`,
      );

      // Add Positions CSV
      zip.file(
        "Positions.csv",
        `Company Name,Title,Description,Started On,Finished On,Location
Tech Corp,Senior Developer,Led development team,Jan 2020,,San Francisco
Startup Inc,Developer,Built web apps,Jun 2017,Dec 2019,New York`,
      );

      // Add Skills CSV
      zip.file(
        "Skills.csv",
        `Name
JavaScript
TypeScript
React
Node.js`,
      );

      // Add Education CSV - note: degree name with comma separates degree from field
      zip.file(
        "Education.csv",
        `School Name,Start Date,End Date,Degree Name,Notes
MIT,Sep 2013,May 2017,"Bachelor of Science, Computer Science",`,
      );

      // Add Email Addresses CSV
      zip.file(
        "Email Addresses.csv",
        `Email Address,Confirmed,Primary
john.doe@email.com,Yes,Yes`,
      );

      const file = await createZipFile(zip, "LinkedInDataExport.zip");

      const result = await parseLinkedInZip(file);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();

      // Check personal info
      expect(result.data?.personalInfo?.firstName).toBe("John");
      expect(result.data?.personalInfo?.lastName).toBe("Doe");
      expect(result.data?.personalInfo?.title).toBe("Software Engineer");
      expect(result.data?.personalInfo?.email).toBe("john.doe@email.com");

      // Check experience
      expect(result.data?.experience).toHaveLength(2);
      expect(result.data?.experience?.[0].company).toBe("Tech Corp");
      expect(result.data?.experience?.[0].current).toBe(true);
      expect(result.data?.experience?.[1].company).toBe("Startup Inc");
      expect(result.data?.experience?.[1].current).toBe(false);

      // Check skills
      expect(result.data?.skills?.technical).toContain("JavaScript");
      expect(result.data?.skills?.technical).toContain("React");

      // Check education
      expect(result.data?.education).toHaveLength(1);
      expect(result.data?.education?.[0].institution).toBe("MIT");
      expect(result.data?.education?.[0].degree).toBe("Bachelor of Science");
      expect(result.data?.education?.[0].field).toBe("Computer Science");
    });

    it("should handle missing CSV files gracefully", async () => {
      const zip = new JSZip();

      // Only add Profile CSV
      zip.file(
        "Profile.csv",
        `First Name,Last Name,Headline,Summary
Jane,Smith,Product Manager,Building great products`,
      );

      const file = await createZipFile(zip, "LinkedInDataExport.zip");

      const result = await parseLinkedInZip(file);

      expect(result.success).toBe(true);
      expect(result.data?.personalInfo?.firstName).toBe("Jane");
      expect(result.data?.personalInfo?.lastName).toBe("Smith");
      // Should have empty arrays for missing data
      expect(result.data?.experience).toEqual([]);
      expect(result.data?.education).toEqual([]);
    });

    it("should return error for empty zip without recognizable data", async () => {
      const zip = new JSZip();
      zip.file("random.txt", "This is not LinkedIn data");

      const file = await createZipFile(zip, "random.zip");

      const result = await parseLinkedInZip(file);

      expect(result.success).toBe(false);
      expect(result.error).toContain("No recognizable LinkedIn data");
    });

    it("should categorize skills correctly", async () => {
      const zip = new JSZip();

      zip.file(
        "Profile.csv",
        `First Name,Last Name
Test,User`,
      );

      zip.file(
        "Skills.csv",
        `Name
JavaScript
Leadership
Git
Communication
Docker
Problem Solving
Python
Figma`,
      );

      const file = await createZipFile(zip, "LinkedInDataExport.zip");

      const result = await parseLinkedInZip(file);

      expect(result.success).toBe(true);

      // Technical skills
      expect(result.data?.skills?.technical).toContain("JavaScript");
      expect(result.data?.skills?.technical).toContain("Python");
      expect(result.data?.skills?.technical).toContain("Docker");

      // Tools
      expect(result.data?.skills?.tools).toContain("Git");
      expect(result.data?.skills?.tools).toContain("Figma");

      // Soft skills
      expect(result.data?.skills?.soft).toContain("Leadership");
      expect(result.data?.skills?.soft).toContain("Communication");
      expect(result.data?.skills?.soft).toContain("Problem Solving");
    });

    it("should parse different date formats", async () => {
      const zip = new JSZip();

      zip.file(
        "Profile.csv",
        `First Name,Last Name
Test,User`,
      );

      zip.file(
        "Positions.csv",
        `Company Name,Title,Started On,Finished On
Company A,Role A,January 2020,December 2022
Company B,Role B,Jan 2023,
Company C,Role C,2019,2020`,
      );

      const file = await createZipFile(zip, "LinkedInDataExport.zip");

      const result = await parseLinkedInZip(file);

      expect(result.success).toBe(true);
      expect(result.data?.experience).toHaveLength(3);

      // January 2020 -> 2020-01
      expect(result.data?.experience?.[0].startDate).toBe("2020-01");
      expect(result.data?.experience?.[0].endDate).toBe("2022-12");

      // Jan 2023 -> 2023-01
      expect(result.data?.experience?.[1].startDate).toBe("2023-01");
      expect(result.data?.experience?.[1].current).toBe(true);

      // 2019 -> 2019-01
      expect(result.data?.experience?.[2].startDate).toBe("2019-01");
      expect(result.data?.experience?.[2].endDate).toBe("2020-01");
    });

    it("should extract highlights from bullet points in descriptions", async () => {
      const zip = new JSZip();

      zip.file(
        "Profile.csv",
        `First Name,Last Name
Test,User`,
      );

      zip.file(
        "Positions.csv",
        `Company Name,Title,Description,Started On,Finished On
Tech Corp,Developer,"Led a team of engineers.
• Increased performance by 40%
• Implemented CI/CD pipeline
- Mentored 3 junior developers",2020-01,`,
      );

      const file = await createZipFile(zip, "LinkedInDataExport.zip");

      const result = await parseLinkedInZip(file);

      expect(result.success).toBe(true);
      expect(result.data?.experience?.[0].description).toBe("Led a team of engineers.");
      expect(result.data?.experience?.[0].highlights).toContain("Increased performance by 40%");
      expect(result.data?.experience?.[0].highlights).toContain("Implemented CI/CD pipeline");
      expect(result.data?.experience?.[0].highlights).toContain("Mentored 3 junior developers");
    });

    it("should parse certifications", async () => {
      const zip = new JSZip();

      zip.file(
        "Profile.csv",
        `First Name,Last Name
Test,User`,
      );

      zip.file(
        "Certifications.csv",
        `Name,Authority,Started On,Finished On,License Number,Url
AWS Solutions Architect,Amazon Web Services,Jun 2021,,ABC123,https://aws.amazon.com/cert/123
Google Cloud Professional,Google,Jan 2020,Jan 2023,GCP456,`,
      );

      const file = await createZipFile(zip, "LinkedInDataExport.zip");

      const result = await parseLinkedInZip(file);

      expect(result.success).toBe(true);
      expect(result.data?.certifications).toHaveLength(2);

      expect(result.data?.certifications?.[0].name).toBe("AWS Solutions Architect");
      expect(result.data?.certifications?.[0].issuer).toBe("Amazon Web Services");
      expect(result.data?.certifications?.[0].credentialId).toBe("ABC123");
      expect(result.data?.certifications?.[0].url).toBe("https://aws.amazon.com/cert/123");

      expect(result.data?.certifications?.[1].expiryDate).toBe("2023-01");
    });

    it("should parse languages", async () => {
      const zip = new JSZip();

      zip.file(
        "Profile.csv",
        `First Name,Last Name
Test,User`,
      );

      zip.file(
        "Languages.csv",
        `Name,Proficiency
English,Native
Spanish,Professional
French,Elementary`,
      );

      const file = await createZipFile(zip, "LinkedInDataExport.zip");

      const result = await parseLinkedInZip(file);

      expect(result.success).toBe(true);
      expect(result.data?.skills?.languages).toContain("English");
      expect(result.data?.skills?.languages).toContain("Spanish");
      expect(result.data?.skills?.languages).toContain("French");
    });

    it("should include warnings for missing data", async () => {
      const zip = new JSZip();

      // Profile without name
      zip.file(
        "Profile.csv",
        `First Name,Last Name,Headline
,,Software Engineer`,
      );

      const file = await createZipFile(zip, "LinkedInDataExport.zip");

      const result = await parseLinkedInZip(file);

      expect(result.success).toBe(true);
      expect(result.warnings).toBeDefined();
      expect(result.warnings?.some((w) => w.includes("name"))).toBe(true);
    });
  });
});
