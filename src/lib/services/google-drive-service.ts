/**
 * Google Drive Service
 * Handles file operations with Google Drive
 * Uses Better Auth for authentication tokens
 */

import { useAuthStore } from "@/stores/auth-store";

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  size?: string;
  parents?: string[];
}

export interface GoogleDriveFolder {
  id: string;
  name: string;
  path?: string;
}

const FOLDER_KEY = "resumier-gdrive-folder";

class GoogleDriveService {
  private selectedFolder: GoogleDriveFolder | null = null;

  constructor() {
    this.loadSelectedFolder();
  }

  /**
   * Load selected folder from localStorage
   */
  private loadSelectedFolder(): void {
    try {
      const stored = localStorage.getItem(FOLDER_KEY);
      if (stored) {
        this.selectedFolder = JSON.parse(stored);
      }
    } catch {
      console.error("Failed to load Google Drive folder");
    }
  }

  /**
   * Save selected folder to localStorage
   */
  saveSelectedFolder(folder: GoogleDriveFolder): void {
    this.selectedFolder = folder;
    localStorage.setItem(FOLDER_KEY, JSON.stringify(folder));
  }

  /**
   * Get selected folder
   */
  getSelectedFolder(): GoogleDriveFolder | null {
    return this.selectedFolder;
  }

  /**
   * Clear selected folder
   */
  clearSelectedFolder(): void {
    this.selectedFolder = null;
    localStorage.removeItem(FOLDER_KEY);
  }

  /**
   * Check if user is authenticated (checks auth store)
   */
  isAuthenticated(): boolean {
    const authState = useAuthStore.getState();
    return authState.isAuthenticated && authState.connectedProvider === "google";
  }

  /**
   * Get access token from auth store (Better Auth)
   */
  private getAccessToken(): string {
    const authState = useAuthStore.getState();
    const token = authState.user?.accessToken;
    if (!token) {
      throw new Error("Not authenticated. Please sign in first.");
    }
    return token;
  }

  /**
   * Sign out and clear data
   */
  signOut(): void {
    this.clearSelectedFolder();
  }

  /**
   * List folders in Google Drive
   */
  async listFolders(parentId?: string): Promise<GoogleDriveFolder[]> {
    const token = this.getAccessToken();

    let query = "mimeType='application/vnd.google-apps.folder' and trashed=false";
    if (parentId) {
      query += ` and '${parentId}' in parents`;
    } else {
      query += " and 'root' in parents";
    }

    const params = new URLSearchParams({
      q: query,
      fields: "files(id,name,parents)",
      orderBy: "name",
      pageSize: "100",
    });

    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to list folders");
    }

    const data = await response.json();
    return data.files.map((file: { id: string; name: string; parents?: string[] }) => ({
      id: file.id,
      name: file.name,
    }));
  }

  /**
   * Create a new folder in Google Drive
   */
  async createFolder(name: string, parentId?: string): Promise<GoogleDriveFolder> {
    const token = this.getAccessToken();

    const metadata: Record<string, unknown> = {
      name,
      mimeType: "application/vnd.google-apps.folder",
    };

    if (parentId) {
      metadata.parents = [parentId];
    }

    const response = await fetch("https://www.googleapis.com/drive/v3/files", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(metadata),
    });

    if (!response.ok) {
      throw new Error("Failed to create folder");
    }

    const data = await response.json();
    return {
      id: data.id,
      name: data.name,
    };
  }

  /**
   * Get or create the Resumier app folder
   */
  async getOrCreateAppFolder(): Promise<GoogleDriveFolder> {
    // First, check if folder already exists
    const folders = await this.listFolders();
    const existingFolder = folders.find((f) => f.name === "Resumier");

    if (existingFolder) {
      return existingFolder;
    }

    // Create the folder if it doesn't exist
    return this.createFolder("Resumier");
  }

  /**
   * List files in a folder
   */
  async listFiles(folderId: string): Promise<GoogleDriveFile[]> {
    const token = this.getAccessToken();

    const query = `'${folderId}' in parents and trashed=false`;
    const params = new URLSearchParams({
      q: query,
      fields: "files(id,name,mimeType,modifiedTime,size,parents)",
      orderBy: "modifiedTime desc",
      pageSize: "100",
    });

    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to list files");
    }

    const data = await response.json();
    return data.files;
  }

  /**
   * Upload a file to Google Drive
   */
  async uploadFile(
    name: string,
    content: string | Blob,
    mimeType: string,
    folderId?: string
  ): Promise<GoogleDriveFile> {
    const token = this.getAccessToken();

    const targetFolderId = folderId || this.selectedFolder?.id;
    if (!targetFolderId) {
      throw new Error("No folder selected for upload");
    }

    const metadata: Record<string, unknown> = {
      name,
      parents: [targetFolderId],
    };

    // Use multipart upload
    const boundary = "resumier_upload_boundary";
    const body =
      `--${boundary}\r\n` +
      `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
      `${JSON.stringify(metadata)}\r\n` +
      `--${boundary}\r\n` +
      `Content-Type: ${mimeType}\r\n\r\n` +
      `${typeof content === "string" ? content : await content.text()}\r\n` +
      `--${boundary}--`;

    const response = await fetch(
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": `multipart/related; boundary=${boundary}`,
        },
        body,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload file");
    }

    return response.json();
  }

  /**
   * Download a file from Google Drive
   */
  async downloadFile(fileId: string): Promise<string> {
    const token = this.getAccessToken();

    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to download file");
    }

    return response.text();
  }

  /**
   * Update an existing file
   */
  async updateFile(fileId: string, content: string | Blob, mimeType: string): Promise<GoogleDriveFile> {
    const token = this.getAccessToken();

    const response = await fetch(
      `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": mimeType,
        },
        body: content,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update file");
    }

    return response.json();
  }

  /**
   * Delete a file from Google Drive
   */
  async deleteFile(fileId: string): Promise<void> {
    const token = this.getAccessToken();

    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete file");
    }
  }

  /**
   * Save resume data to Google Drive
   */
  async saveResume(resumeId: string, data: unknown): Promise<GoogleDriveFile> {
    const fileName = `resume_${resumeId}.json`;
    const content = JSON.stringify(data, null, 2);
    
    // Check if file already exists
    const folderId = this.selectedFolder?.id;
    if (!folderId) {
      throw new Error("No folder selected");
    }

    const files = await this.listFiles(folderId);
    const existingFile = files.find((f) => f.name === fileName);

    if (existingFile) {
      return this.updateFile(existingFile.id, content, "application/json");
    }

    return this.uploadFile(fileName, content, "application/json");
  }

  /**
   * Load resume data from Google Drive
   */
  async loadResume(resumeId: string): Promise<unknown | null> {
    const folderId = this.selectedFolder?.id;
    if (!folderId) {
      throw new Error("No folder selected");
    }

    const files = await this.listFiles(folderId);
    const fileName = `resume_${resumeId}.json`;
    const file = files.find((f) => f.name === fileName);

    if (!file) {
      return null;
    }

    const content = await this.downloadFile(file.id);
    return JSON.parse(content);
  }

  /**
   * List all resumes in the selected folder
   */
  async listResumes(): Promise<{ id: string; name: string; modifiedTime: string }[]> {
    const folderId = this.selectedFolder?.id;
    if (!folderId) {
      return [];
    }

    const files = await this.listFiles(folderId);
    return files
      .filter((f) => f.name.startsWith("resume_") && f.name.endsWith(".json"))
      .map((f) => ({
        id: f.name.replace("resume_", "").replace(".json", ""),
        name: f.name,
        modifiedTime: f.modifiedTime,
      }));
  }
}

// Export singleton instance
export const googleDriveService = new GoogleDriveService();
