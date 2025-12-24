/**
 * Resume Import Service
 * Handles importing resume data from various sources
 */

import { apiClient } from "@/lib/api/client";
import type { ResumeContent } from "@/lib/api/types";
import { parseLinkedInZip } from "./linkedin-data-parser";

export interface ImportSource {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiresUrl?: boolean;
  requiresFile?: boolean;
  comingSoon?: boolean;
  /**
   * Whether this source supports both URL and file input
   * When true, the dialog shows options for both
   */
  supportsMultipleInputTypes?: boolean;
}

export const IMPORT_SOURCES: ImportSource[] = [
  {
    id: "linkedin",
    name: "LinkedIn",
    description: "Import your profile from LinkedIn data export",
    icon: "linkedin",
    requiresFile: true,
    supportsMultipleInputTypes: true, // Supports both ZIP file and OAuth/URL
  },
  {
    id: "json",
    name: "JSON File",
    description: "Import from a previously exported JSON file",
    icon: "file-json",
    requiresFile: true,
  },
  {
    id: "pdf",
    name: "PDF Resume",
    description: "Parse an existing PDF resume (AI-powered)",
    icon: "file-text",
    requiresFile: true,
    comingSoon: true,
  },
  {
    id: "indeed",
    name: "Indeed",
    description: "Import your Indeed profile",
    icon: "briefcase",
    requiresUrl: true,
    comingSoon: true,
  },
  {
    id: "github",
    name: "GitHub",
    description: "Import projects and bio from GitHub",
    icon: "github",
    requiresUrl: true,
    comingSoon: true,
  },
];

export interface ImportResult {
  success: boolean;
  data?: Partial<ResumeContent>;
  error?: string;
}

/**
 * Import from LinkedIn profile
 * Supports three modes:
 * 1. ZIP file mode: parses LinkedIn data export ZIP file (preferred for guests)
 * 2. OAuth mode: retrieves data stored in sessionStorage by callback handler (authenticated users)
 * 3. URL mode: imports public profile data from URL (guests, fallback)
 */
export async function importFromLinkedIn(input?: string | File): Promise<ImportResult> {
  try {
    if (typeof window === "undefined") {
      // Server-side rendering: no sessionStorage available
      return {
        success: false,
        error: "LinkedIn import is only available in the browser",
      };
    }

    // Mode 1: ZIP file import (if input is a File)
    if (input instanceof File) {
      const result = await parseLinkedInZip(input);

      if (!result.success) {
        return {
          success: false,
          error: result.error || "Failed to parse LinkedIn ZIP file",
        };
      }

      // Log warnings but don't fail
      if (result.warnings && result.warnings.length > 0) {
        console.warn("LinkedIn import warnings:", result.warnings);
      }

      return {
        success: true,
        data: result.data,
      };
    }

    // Mode 2: Check if this is OAuth mode (data in sessionStorage)
    const importedDataStr = sessionStorage.getItem("linkedin_import_data");
    const importedState = sessionStorage.getItem("linkedin_import_state");

    if (importedDataStr && importedState === "completed") {
      // OAuth mode - use stored data
      try {
        const importedData = JSON.parse(importedDataStr) as Partial<ResumeContent>;

        // Validate that we have at least some data
        if (
          !importedData.personalInfo &&
          !importedData.experience?.length &&
          !importedData.education?.length &&
          !importedData.skills?.technical?.length
        ) {
          return {
            success: false,
            error: "LinkedIn data appears to be empty. Please try again.",
          };
        }

        // Clear the sessionStorage after successful retrieval
        sessionStorage.removeItem("linkedin_import_data");
        sessionStorage.removeItem("linkedin_import_state");
        sessionStorage.removeItem("linkedin_oauth_state");

        return {
          success: true,
          data: importedData,
        };
      } catch {
        return {
          success: false,
          error: "Failed to parse LinkedIn import data",
        };
      }
    }

    // Mode 3: Guest mode - import from URL
    const profileUrl = typeof input === "string" ? input : undefined;
    if (profileUrl) {
      // Validate LinkedIn URL
      if (!profileUrl.includes("linkedin.com")) {
        return {
          success: false,
          error: "Please enter a valid LinkedIn profile URL",
        };
      }

      // Call backend to import public profile
      try {
        const data = await apiClient.post<ResumeContent>("/api/linkedin/import", { profileUrl });

        return {
          success: true,
          data,
        };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to import LinkedIn profile";
        return {
          success: false,
          error: errorMessage,
        };
      }
    }

    return {
      success: false,
      error: "No LinkedIn data found. Please upload your LinkedIn data export ZIP file, use the OAuth flow, or provide a profile URL.",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to import from LinkedIn",
    };
  }
}

/**
 * Import from JSON file
 */
export async function importFromJSON(file: File): Promise<ImportResult> {
  try {
    const text = await file.text();
    const data = JSON.parse(text);

    // Validate that it's a valid resume format
    if (!data.personalInfo && !data.content?.personalInfo) {
      return {
        success: false,
        error: "Invalid resume format. Please export a resume from Resumier and try again.",
      };
    }

    // Handle both resume object and content object
    const content = data.content || data;

    return {
      success: true,
      data: content,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to parse JSON file",
    };
  }
}

/**
 * Import from PDF (placeholder - would require OCR/AI service)
 */
export async function importFromPDF(_file: File): Promise<ImportResult> {
  try {
    // This would require integration with a PDF parsing service
    // like AWS Textract, Google Cloud Vision, or a specialized resume parser
    await new Promise((resolve) => setTimeout(resolve, 3000));

    return {
      success: false,
      error: "PDF import is coming soon! This feature is under development.",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to parse PDF",
    };
  }
}

/**
 * Import from GitHub profile
 */
export async function importFromGitHub(githubUrl: string): Promise<ImportResult> {
  try {
    // Extract username from URL
    const username = githubUrl.split("github.com/")[1]?.split("/")[0];
    if (!username) {
      return {
        success: false,
        error: "Invalid GitHub URL",
      };
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return {
      success: false,
      error: "GitHub import is coming soon!",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to import from GitHub",
    };
  }
}

/**
 * Import from Indeed profile
 */
export async function importFromIndeed(_indeedUrl: string): Promise<ImportResult> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return {
      success: false,
      error: "Indeed import is coming soon!",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to import from Indeed",
    };
  }
}

/**
 * Main import handler
 */
export async function importResume(source: string, input: string | File): Promise<ImportResult> {
  switch (source) {
    case "linkedin":
      // LinkedIn accepts both File (ZIP) and string (URL)
      return importFromLinkedIn(input);
    case "json":
      return importFromJSON(input as File);
    case "pdf":
      return importFromPDF(input as File);
    case "github":
      return importFromGitHub(input as string);
    case "indeed":
      return importFromIndeed(input as string);
    default:
      return {
        success: false,
        error: "Unknown import source",
      };
  }
}
