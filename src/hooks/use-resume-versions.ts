import { useCallback, useMemo } from "react";
import { useVersionStore, selectVersionActions } from "@/stores/version-store";
import { useResumeStore } from "@/stores/resume-store";
import { useToast } from "@/hooks/use-toast";
import type { ResumeContent, ResumeVersion } from "@/lib/api/types";

/**
 * Hook for managing resume versions with convenient methods
 * and integration with the resume store.
 */
export function useResumeVersions(resumeId: string) {
  const { toast } = useToast();

  // Version store state and actions
  const versions = useVersionStore((state) => state.versions[resumeId] || []);
  const {
    saveVersion,
    restoreVersion,
    deleteVersion,
    updateVersionLabel,
    clearVersions,
    cleanupAutoSaves,
  } = useVersionStore(selectVersionActions);

  // Resume store state and actions
  const template = useResumeStore((state) => state.template);
  const styleCustomization = useResumeStore((state) => state.styleCustomization);
  const setContent = useResumeStore((state) => state.setContent);
  const setTemplate = useResumeStore((state) => state.setTemplate);
  const setColorTheme = useResumeStore((state) => state.setColorTheme);
  const setFontTheme = useResumeStore((state) => state.setFontTheme);

  // Computed values
  const versionCount = versions.length;
  const latestVersion = versions[0] || null;
  const manualVersions = useMemo(
    () => versions.filter((v) => !v.isAutoSave),
    [versions],
  );
  const autoSaveVersions = useMemo(
    () => versions.filter((v) => v.isAutoSave),
    [versions],
  );

  /**
   * Save a new version of the resume
   */
  const handleSaveVersion = useCallback(
    (content: ResumeContent, label?: string): ResumeVersion => {
      const version = saveVersion(resumeId, content, {
        label,
        template,
        styleCustomization: {
          colorTheme: styleCustomization.colorTheme,
          fontTheme: styleCustomization.fontTheme,
        },
        isAutoSave: false,
      });

      toast({
        title: "Version saved",
        description: label || `Version ${version.version} created`,
      });

      return version;
    },
    [resumeId, template, styleCustomization, saveVersion, toast],
  );

  /**
   * Auto-save a version (silently, without toast)
   */
  const handleAutoSave = useCallback(
    (content: ResumeContent): ResumeVersion => {
      return saveVersion(resumeId, content, {
        template,
        styleCustomization: {
          colorTheme: styleCustomization.colorTheme,
          fontTheme: styleCustomization.fontTheme,
        },
        isAutoSave: true,
      });
    },
    [resumeId, template, styleCustomization, saveVersion],
  );

  /**
   * Restore a specific version
   */
  const handleRestoreVersion = useCallback(
    (versionId: string): boolean => {
      const version = restoreVersion(resumeId, versionId);
      if (!version) {
        toast({
          title: "Error",
          description: "Could not find the version to restore",
          variant: "destructive",
        });
        return false;
      }

      // Apply the version content to the resume store
      setContent(version.content);

      // Also restore template and style if available
      if (version.template) {
        setTemplate(version.template as "modern" | "minimal" | "professional" | "creative");
      }

      if (version.styleCustomization) {
        if (version.styleCustomization.colorTheme) {
          setColorTheme(version.styleCustomization.colorTheme);
        }
        if (version.styleCustomization.fontTheme) {
          setFontTheme(version.styleCustomization.fontTheme);
        }
      }

      toast({
        title: "Version restored",
        description: version.label || `Restored to version ${version.version}`,
      });

      return true;
    },
    [resumeId, restoreVersion, setContent, setTemplate, setColorTheme, setFontTheme, toast],
  );

  /**
   * Delete a version
   */
  const handleDeleteVersion = useCallback(
    (versionId: string) => {
      deleteVersion(resumeId, versionId);
      toast({
        title: "Version deleted",
        description: "The version has been removed",
      });
    },
    [resumeId, deleteVersion, toast],
  );

  /**
   * Update a version's label
   */
  const handleUpdateLabel = useCallback(
    (versionId: string, label: string) => {
      updateVersionLabel(resumeId, versionId, label);
    },
    [resumeId, updateVersionLabel],
  );

  /**
   * Clear all versions for this resume
   */
  const handleClearVersions = useCallback(() => {
    clearVersions(resumeId);
    toast({
      title: "All versions cleared",
      description: "Version history has been reset",
    });
  }, [resumeId, clearVersions, toast]);

  /**
   * Cleanup old auto-saves, keeping only the most recent N
   */
  const handleCleanupAutoSaves = useCallback(
    (keepCount: number = 10) => {
      cleanupAutoSaves(resumeId, keepCount);
    },
    [resumeId, cleanupAutoSaves],
  );

  /**
   * Compare two versions and return what changed
   */
  const compareVersions = useCallback(
    (versionId1: string, versionId2: string) => {
      const v1 = versions.find((v) => v.id === versionId1);
      const v2 = versions.find((v) => v.id === versionId2);

      if (!v1 || !v2) return null;

      const changes: string[] = [];

      // Compare personal info
      if (
        JSON.stringify(v1.content.personalInfo) !==
        JSON.stringify(v2.content.personalInfo)
      ) {
        changes.push("Personal info changed");
      }

      // Compare experience
      if (
        JSON.stringify(v1.content.experience) !== JSON.stringify(v2.content.experience)
      ) {
        const diff = v2.content.experience.length - v1.content.experience.length;
        if (diff > 0) {
          changes.push(`Added ${diff} experience${diff > 1 ? "s" : ""}`);
        } else if (diff < 0) {
          changes.push(`Removed ${Math.abs(diff)} experience${Math.abs(diff) > 1 ? "s" : ""}`);
        } else {
          changes.push("Experience updated");
        }
      }

      // Compare education
      if (
        JSON.stringify(v1.content.education) !== JSON.stringify(v2.content.education)
      ) {
        changes.push("Education changed");
      }

      // Compare skills
      if (JSON.stringify(v1.content.skills) !== JSON.stringify(v2.content.skills)) {
        changes.push("Skills changed");
      }

      // Compare certifications
      if (
        JSON.stringify(v1.content.certifications) !==
        JSON.stringify(v2.content.certifications)
      ) {
        changes.push("Certifications changed");
      }

      // Compare links
      if (JSON.stringify(v1.content.links) !== JSON.stringify(v2.content.links)) {
        changes.push("Links changed");
      }

      // Compare template
      if (v1.template !== v2.template) {
        changes.push(`Template: ${v1.template} → ${v2.template}`);
      }

      return {
        from: v1,
        to: v2,
        changes,
        hasChanges: changes.length > 0,
      };
    },
    [versions],
  );

  return {
    // State
    versions,
    versionCount,
    latestVersion,
    manualVersions,
    autoSaveVersions,

    // Actions
    saveVersion: handleSaveVersion,
    autoSave: handleAutoSave,
    restoreVersion: handleRestoreVersion,
    deleteVersion: handleDeleteVersion,
    updateLabel: handleUpdateLabel,
    clearVersions: handleClearVersions,
    cleanupAutoSaves: handleCleanupAutoSaves,

    // Utilities
    compareVersions,
  };
}

