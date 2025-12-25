/**
 * Google Drive Folder Picker Dialog
 * Allows users to browse and select a folder for storing resumes
 */

import { useState, useEffect, useCallback } from "react";
import { ChevronRight, Folder, FolderPlus, Home, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useCloudStorageStore } from "@/stores/cloud-storage-store";
import {
  googleDriveService,
  type GoogleDriveFolder,
} from "@/lib/services/google-drive-service";
import { useToast } from "@/hooks/use-toast";

interface BreadcrumbItem {
  id: string | null;
  name: string;
}

export function FolderPickerDialog() {
  const { toast } = useToast();
  const isOpen = useCloudStorageStore((state) => state.isFolderPickerOpen);
  const closeFolderPicker = useCloudStorageStore((state) => state.closeFolderPicker);
  const setSelectedFolder = useCloudStorageStore((state) => state.setSelectedFolder);
  const currentSettings = useCloudStorageStore((state) => state.settings);

  const [folders, setFolders] = useState<GoogleDriveFolder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [selectedFolder, setLocalSelectedFolder] = useState<GoogleDriveFolder | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { id: null, name: "My Drive" },
  ]);

  const currentFolderId = breadcrumbs[breadcrumbs.length - 1].id;

  const loadFolders = useCallback(async (parentId?: string) => {
    setIsLoading(true);
    try {
      const folderList = await googleDriveService.listFolders(parentId || undefined);
      setFolders(folderList);
    } catch (error) {
      console.error("Failed to load folders:", error);
      toast({
        title: "Error",
        description: "Failed to load folders from Google Drive",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (isOpen) {
      loadFolders(currentFolderId || undefined);
    }
  }, [isOpen, currentFolderId, loadFolders]);

  const handleFolderClick = (folder: GoogleDriveFolder) => {
    setLocalSelectedFolder(folder);
  };

  const handleFolderDoubleClick = (folder: GoogleDriveFolder) => {
    // Navigate into the folder
    setBreadcrumbs([...breadcrumbs, { id: folder.id, name: folder.name }]);
    setLocalSelectedFolder(null);
  };

  const handleBreadcrumbClick = (index: number) => {
    // Navigate to the breadcrumb level
    setBreadcrumbs(breadcrumbs.slice(0, index + 1));
    setLocalSelectedFolder(null);
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    setIsCreating(true);
    try {
      const newFolder = await googleDriveService.createFolder(
        newFolderName.trim(),
        currentFolderId || undefined
      );
      setFolders([...folders, newFolder]);
      setNewFolderName("");
      setShowNewFolderInput(false);
      setLocalSelectedFolder(newFolder);
      toast({
        title: "Success",
        description: `Folder "${newFolder.name}" created`,
      });
    } catch (error) {
      console.error("Failed to create folder:", error);
      toast({
        title: "Error",
        description: "Failed to create folder",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateResumierFolder = async () => {
    setIsCreating(true);
    try {
      const folder = await googleDriveService.getOrCreateAppFolder();
      setSelectedFolder(folder);
      toast({
        title: "Success",
        description: "Resumier folder selected for storage",
      });
    } catch (error) {
      console.error("Failed to create Resumier folder:", error);
      toast({
        title: "Error",
        description: "Failed to create Resumier folder",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleSelectFolder = () => {
    if (selectedFolder) {
      // Build the full path
      const path = [...breadcrumbs.slice(1).map((b) => b.name), selectedFolder.name].join("/");
      setSelectedFolder({ ...selectedFolder, path });
      toast({
        title: "Folder Selected",
        description: `Your resumes will be saved to "${selectedFolder.name}"`,
      });
    }
  };

  const handleSelectCurrentFolder = () => {
    // Select the current folder we're viewing (from breadcrumbs)
    const currentBreadcrumb = breadcrumbs[breadcrumbs.length - 1];
    if (currentBreadcrumb.id) {
      const path = breadcrumbs.slice(1).map((b) => b.name).join("/");
      setSelectedFolder({ 
        id: currentBreadcrumb.id, 
        name: currentBreadcrumb.name,
        path 
      });
      toast({
        title: "Folder Selected",
        description: `Your resumes will be saved to "${currentBreadcrumb.name}"`,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeFolderPicker}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5 text-blue-500" />
            Select Storage Folder
          </DialogTitle>
          <DialogDescription>
            Choose where to save your resumes in Google Drive
          </DialogDescription>
        </DialogHeader>

        {/* Quick action: Create Resumier folder */}
        {!currentSettings.folderId && (
          <div className="rounded-lg border border-dashed border-blue-300 bg-blue-50/50 dark:bg-blue-950/20 p-3 mb-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Quick Setup</p>
                <p className="text-xs text-muted-foreground">
                  Create a "Resumier" folder in your Drive root
                </p>
              </div>
              <Button
                size="sm"
                onClick={handleCreateResumierFolder}
                disabled={isCreating}
              >
                {isCreating ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                ) : (
                  <FolderPlus className="h-4 w-4 mr-1" />
                )}
                Create
              </Button>
            </div>
          </div>
        )}

        {/* Breadcrumbs */}
        <div className="flex items-center gap-1 text-sm overflow-x-auto pb-2">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.id || "root"} className="flex items-center">
              {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />}
              <button
                type="button"
                onClick={() => handleBreadcrumbClick(index)}
                className={cn(
                  "hover:text-primary transition-colors flex items-center gap-1 px-1 py-0.5 rounded",
                  index === breadcrumbs.length - 1
                    ? "font-medium text-primary"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                {index === 0 && <Home className="h-3 w-3" />}
                {crumb.name}
              </button>
            </div>
          ))}
        </div>

        {/* Folder list */}
        <div className="h-64 overflow-y-auto border rounded-md">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : folders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Folder className="h-12 w-12 mb-2 opacity-50" />
              <p className="text-sm">No folders found</p>
              <p className="text-xs">Create a new folder or select this location</p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  type="button"
                  onClick={() => handleFolderClick(folder)}
                  onDoubleClick={() => handleFolderDoubleClick(folder)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-md text-left transition-colors",
                    selectedFolder?.id === folder.id
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted"
                  )}
                >
                  <Folder
                    className={cn(
                      "h-4 w-4",
                      selectedFolder?.id === folder.id
                        ? "text-primary"
                        : "text-yellow-500"
                    )}
                  />
                  <span className="text-sm truncate">{folder.name}</span>
                  <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground opacity-50" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* New folder input */}
        {showNewFolderInput ? (
          <div className="flex gap-2">
            <Input
              placeholder="New folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
              autoFocus
            />
            <Button
              size="sm"
              onClick={handleCreateFolder}
              disabled={!newFolderName.trim() || isCreating}
            >
              {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setShowNewFolderInput(false);
                setNewFolderName("");
              }}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowNewFolderInput(true)}
            >
              <FolderPlus className="h-4 w-4 mr-1" />
              New Folder
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => loadFolders(currentFolderId || undefined)}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={closeFolderPicker}>
            Cancel
          </Button>
          {currentFolderId && (
            <Button
              variant="secondary"
              onClick={handleSelectCurrentFolder}
            >
              Use This Folder
            </Button>
          )}
          <Button
            onClick={handleSelectFolder}
            disabled={!selectedFolder}
          >
            Select "{selectedFolder?.name || "..."}"
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
