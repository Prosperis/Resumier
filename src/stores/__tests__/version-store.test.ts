import { describe, it, expect, beforeEach, vi } from "vitest";
import { useVersionStore } from "../version-store";
import type { ResumeContent } from "@/lib/api/types";

// Mock idb-keyval
vi.mock("idb-keyval", () => ({
  get: vi.fn().mockResolvedValue(null),
  set: vi.fn().mockResolvedValue(undefined),
  del: vi.fn().mockResolvedValue(undefined),
}));

// Sample resume content for testing
const sampleContent: ResumeContent = {
  personalInfo: {
    firstName: "John",
    lastName: "Doe",
    nameOrder: "firstLast",
    email: "john@example.com",
    phone: "555-1234",
    location: "San Francisco, CA",
    summary: "Experienced software engineer",
  },
  experience: [
    {
      id: "exp-1",
      company: "Tech Corp",
      position: "Senior Developer",
      startDate: "2020-01",
      endDate: "Present",
      current: true,
      description: "Leading development team",
      highlights: ["Built scalable systems", "Led team of 5"],
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "University of Tech",
      degree: "BS",
      field: "Computer Science",
      startDate: "2012-09",
      endDate: "2016-05",
      current: false,
    },
  ],
  skills: {
    technical: ["JavaScript", "TypeScript", "React"],
    languages: ["English"],
    tools: ["VS Code", "Git"],
    soft: ["Leadership", "Communication"],
  },
  certifications: [],
  links: [],
};

describe("version-store", () => {
  beforeEach(() => {
    // Reset the store before each test
    useVersionStore.setState({
      versions: {},
      isLoading: false,
      maxVersionsPerResume: 50,
    });
  });

  describe("saveVersion", () => {
    it("should save a new version", () => {
      const { saveVersion, getVersions } = useVersionStore.getState();
      const resumeId = "resume-1";

      const version = saveVersion(resumeId, sampleContent, {
        label: "Initial version",
      });

      expect(version).toBeDefined();
      expect(version.version).toBe(1);
      expect(version.label).toBe("Initial version");
      expect(version.resumeId).toBe(resumeId);
      expect(version.content).toEqual(sampleContent);

      const versions = getVersions(resumeId);
      expect(versions).toHaveLength(1);
    });

    it("should increment version number", () => {
      const { saveVersion, getVersions } = useVersionStore.getState();
      const resumeId = "resume-1";

      saveVersion(resumeId, sampleContent);
      saveVersion(resumeId, sampleContent, { label: "Second version" });
      saveVersion(resumeId, sampleContent, { label: "Third version" });

      const versions = getVersions(resumeId);
      expect(versions).toHaveLength(3);
      expect(versions[0].version).toBe(3); // Most recent first
      expect(versions[1].version).toBe(2);
      expect(versions[2].version).toBe(1);
    });

    it("should save auto-save versions separately", () => {
      const { saveVersion, getVersions } = useVersionStore.getState();
      const resumeId = "resume-1";

      saveVersion(resumeId, sampleContent, { isAutoSave: true });
      saveVersion(resumeId, sampleContent, { label: "Manual save" });
      saveVersion(resumeId, sampleContent, { isAutoSave: true });

      const versions = getVersions(resumeId);
      const autoSaves = versions.filter((v) => v.isAutoSave);
      const manualSaves = versions.filter((v) => !v.isAutoSave);

      expect(autoSaves).toHaveLength(2);
      expect(manualSaves).toHaveLength(1);
    });

    it("should deep clone content to prevent mutations", () => {
      const { saveVersion, getVersion } = useVersionStore.getState();
      const resumeId = "resume-1";
      const mutableContent = { ...sampleContent };

      const version = saveVersion(resumeId, mutableContent);

      // Mutate the original
      mutableContent.personalInfo.firstName = "Jane";

      // Version should still have original value
      const savedVersion = getVersion(resumeId, version.id);
      expect(savedVersion?.content.personalInfo.firstName).toBe("John");
    });
  });

  describe("restoreVersion", () => {
    it("should restore a version by id", () => {
      const { saveVersion, restoreVersion } = useVersionStore.getState();
      const resumeId = "resume-1";

      const version = saveVersion(resumeId, sampleContent, {
        label: "To restore",
      });

      const restored = restoreVersion(resumeId, version.id);

      expect(restored).toBeDefined();
      expect(restored?.content).toEqual(sampleContent);
    });

    it("should return null for non-existent version", () => {
      const { restoreVersion } = useVersionStore.getState();

      const restored = restoreVersion("resume-1", "non-existent");

      expect(restored).toBeNull();
    });
  });

  describe("deleteVersion", () => {
    it("should delete a specific version", () => {
      const { saveVersion, deleteVersion, getVersions } = useVersionStore.getState();
      const resumeId = "resume-1";

      const v1 = saveVersion(resumeId, sampleContent);
      const v2 = saveVersion(resumeId, sampleContent);
      saveVersion(resumeId, sampleContent);

      deleteVersion(resumeId, v2.id);

      const versions = getVersions(resumeId);
      expect(versions).toHaveLength(2);
      expect(versions.find((v) => v.id === v2.id)).toBeUndefined();
      expect(versions.find((v) => v.id === v1.id)).toBeDefined();
    });
  });

  describe("updateVersionLabel", () => {
    it("should update a version label", () => {
      const { saveVersion, updateVersionLabel, getVersion } = useVersionStore.getState();
      const resumeId = "resume-1";

      const version = saveVersion(resumeId, sampleContent);

      updateVersionLabel(resumeId, version.id, "Updated label");

      const updated = getVersion(resumeId, version.id);
      expect(updated?.label).toBe("Updated label");
    });
  });

  describe("clearVersions", () => {
    it("should clear all versions for a resume", () => {
      const { saveVersion, clearVersions, getVersions } = useVersionStore.getState();
      const resumeId = "resume-1";

      saveVersion(resumeId, sampleContent);
      saveVersion(resumeId, sampleContent);
      saveVersion(resumeId, sampleContent);

      clearVersions(resumeId);

      const versions = getVersions(resumeId);
      expect(versions).toHaveLength(0);
    });

    it("should not affect other resumes", () => {
      const { saveVersion, clearVersions, getVersions } = useVersionStore.getState();

      saveVersion("resume-1", sampleContent);
      saveVersion("resume-2", sampleContent);

      clearVersions("resume-1");

      expect(getVersions("resume-1")).toHaveLength(0);
      expect(getVersions("resume-2")).toHaveLength(1);
    });
  });

  describe("cleanupAutoSaves", () => {
    it("should keep only the most recent auto-saves", () => {
      const { saveVersion, cleanupAutoSaves, getVersions } = useVersionStore.getState();
      const resumeId = "resume-1";

      // Create 15 auto-saves
      for (let i = 0; i < 15; i++) {
        saveVersion(resumeId, sampleContent, { isAutoSave: true });
      }

      // Also create some manual saves
      saveVersion(resumeId, sampleContent, { label: "Manual 1" });
      saveVersion(resumeId, sampleContent, { label: "Manual 2" });

      // Cleanup keeping only 5 auto-saves
      cleanupAutoSaves(resumeId, 5);

      const versions = getVersions(resumeId);
      const autoSaves = versions.filter((v) => v.isAutoSave);
      const manualSaves = versions.filter((v) => !v.isAutoSave);

      expect(autoSaves).toHaveLength(5);
      expect(manualSaves).toHaveLength(2); // Manual saves preserved
    });
  });

  describe("max versions limit", () => {
    it("should enforce max versions limit", () => {
      // Set a lower max for testing before getting state
      useVersionStore.setState({
        versions: {},
        maxVersionsPerResume: 5,
      });

      const resumeId = "resume-1";

      // Create more than max versions - need to get saveVersion fresh each time
      // since the store state is used inside saveVersion
      for (let i = 0; i < 10; i++) {
        useVersionStore.getState().saveVersion(resumeId, sampleContent);
      }

      const versions = useVersionStore.getState().getVersions(resumeId);
      expect(versions.length).toBeLessThanOrEqual(5);
    });

    it("should prioritize manual saves when trimming", () => {
      useVersionStore.setState({
        versions: {},
        maxVersionsPerResume: 5,
      });

      const resumeId = "resume-1";
      const store = useVersionStore.getState();

      // Create some manual saves first
      store.saveVersion(resumeId, sampleContent, { label: "Manual 1" });
      store.saveVersion(resumeId, sampleContent, { label: "Manual 2" });
      store.saveVersion(resumeId, sampleContent, { label: "Manual 3" });

      // Then many auto-saves
      for (let i = 0; i < 10; i++) {
        useVersionStore.getState().saveVersion(resumeId, sampleContent, { isAutoSave: true });
      }

      const versions = useVersionStore.getState().getVersions(resumeId);
      const manualSaves = versions.filter((v) => !v.isAutoSave);

      // All manual saves should be kept
      expect(manualSaves).toHaveLength(3);
    });
  });
});
