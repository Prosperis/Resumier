/**
 * Resume Import Service
 * Handles importing resume data from various sources
 */

import { apiClient } from "@/lib/api/client";
import type { ResumeContent } from "@/lib/api/types";

export interface ImportSource {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiresUrl?: boolean;
  requiresFile?: boolean;
  comingSoon?: boolean;
}

export const IMPORT_SOURCES: ImportSource[] = [
  {
    id: "linkedin",
    name: "LinkedIn",
    description: "Import your profile from LinkedIn",
    icon: "linkedin",
    requiresUrl: true,
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
 * Supports two modes:
 * 1. OAuth mode: retrieves data stored in sessionStorage by callback handler (authenticated users)
 * 2. Guest mode: imports public profile data from URL (guests)
 */
export async function importFromLinkedIn(
  profileUrl?: string,
): Promise<ImportResult> {
  try {
    if (typeof window === "undefined") {
      // Server-side rendering: no sessionStorage available
      return {
        success: false,
        error: "LinkedIn import is only available in the browser",
      };
    }

    // Check if this is OAuth mode (data in sessionStorage)
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
      } catch (parseError) {
        return {
          success: false,
          error: "Failed to parse LinkedIn import data",
        };
      }
    }

    // Guest mode - import from URL
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
        const data = await apiClient.post<ResumeContent>(
          "/api/linkedin/import",
          { profileUrl },
        );

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
      error: "No LinkedIn data found. Please use the OAuth flow or provide a profile URL.",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to import from LinkedIn",
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
        error:
          "Invalid resume format. Please export a resume from Resumier and try again.",
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
      error:
        error instanceof Error ? error.message : "Failed to parse JSON file",
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
export async function importFromGitHub(
  githubUrl: string,
): Promise<ImportResult> {
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
      error:
        error instanceof Error ? error.message : "Failed to import from GitHub",
    };
  }
}

/**
 * Import from Indeed profile
 */
export async function importFromIndeed(
  _indeedUrl: string,
): Promise<ImportResult> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return {
      success: false,
      error: "Indeed import is coming soon!",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to import from Indeed",
    };
  }
}

/**
 * Main import handler
 */
export async function importResume(
  source: string,
  input: string | File,
): Promise<ImportResult> {
  switch (source) {
    case "linkedin":
      return importFromLinkedIn(input as string);
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
