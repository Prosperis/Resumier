/**
 * Import Dialog Component Tests
 *
 * Note: These tests require a browser environment with proper DOM setup.
 * Run with: bun test --environment jsdom
 */

import { describe, expect, it } from "vitest";
import { IMPORT_SOURCES } from "@/lib/services/import-service";

describe("ImportDialog", () => {
  // Test the import sources configuration
  it("has valid import sources configured", () => {
    expect(IMPORT_SOURCES).toBeDefined();
    expect(IMPORT_SOURCES.length).toBeGreaterThan(0);

    IMPORT_SOURCES.forEach((source) => {
      expect(source.id).toBeDefined();
      expect(source.name).toBeDefined();
      expect(source.description).toBeDefined();
      expect(source.icon).toBeDefined();
    });
  });

  it("has LinkedIn as an import source", () => {
    const linkedIn = IMPORT_SOURCES.find((s) => s.id === "linkedin");
    expect(linkedIn).toBeDefined();
    expect(linkedIn?.requiresUrl).toBe(true);
  });

  it("has JSON file as an import source", () => {
    const json = IMPORT_SOURCES.find((s) => s.id === "json");
    expect(json).toBeDefined();
    expect(json?.requiresFile).toBe(true);
  });

  it("marks some sources as coming soon", () => {
    const comingSoonSources = IMPORT_SOURCES.filter((s) => s.comingSoon);
    expect(comingSoonSources.length).toBeGreaterThan(0);
  });
});
