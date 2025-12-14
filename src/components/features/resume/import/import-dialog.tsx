import { Briefcase, FileJson2, FileText, Github, Linkedin, Loader2, Upload, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { ResumeContent } from "@/lib/api/types";
import { IMPORT_SOURCES, importResume, type ImportSource } from "@/lib/services/import-service";
import { LinkedInImportButton } from "./linkedin-import-button";
import { useAuthStore, selectIsGuest } from "@/stores/auth-store";
import { cn } from "@/lib/utils";

interface ImportDialogProps {
  trigger?: React.ReactNode;
  onImportSuccess: (data: Partial<ResumeContent>) => void;
}

const iconMap = {
  linkedin: Linkedin,
  "file-json": FileJson2,
  "file-text": FileText,
  briefcase: Briefcase,
  github: Github,
};

export function ImportDialog({ trigger, onImportSuccess }: ImportDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<ImportSource | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();
  const isGuest = useAuthStore(selectIsGuest);

  const handleSourceSelect = (source: ImportSource) => {
    if (source.comingSoon) {
      toast({
        title: "Coming Soon",
        description: `${source.name} import is coming soon!`,
      });
      return;
    }
    setSelectedSource(source);
    setUrlInput("");
    setFileInput(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileInput(file);
    }
  };

  const handleImport = async () => {
    if (!selectedSource) return;

    const input = selectedSource.requiresFile ? fileInput : urlInput;

    if (!input) {
      toast({
        title: "Error",
        description: selectedSource.requiresFile ? "Please select a file" : "Please enter a URL",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);

    try {
      const result = await importResume(selectedSource.id, input);

      if (result.success && result.data) {
        toast({
          title: "Import Successful",
          description: `Successfully imported data from ${selectedSource.name}`,
        });
        onImportSuccess(result.data);
        setOpen(false);
        // Reset state
        setSelectedSource(null);
        setUrlInput("");
        setFileInput(null);
      } else {
        toast({
          title: "Import Failed",
          description: result.error || "Failed to import resume data",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Import Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleBack = () => {
    setSelectedSource(null);
    setUrlInput("");
    setFileInput(null);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset state when dialog closes
      setSelectedSource(null);
      setUrlInput("");
      setFileInput(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {selectedSource ? `Import from ${selectedSource.name}` : "Import Resume"}
          </DialogTitle>
          <DialogDescription>
            {selectedSource
              ? selectedSource.description
              : "Choose a source to import your resume data"}
          </DialogDescription>
        </DialogHeader>

        {!selectedSource ? (
          // Source selection view
          <div className="grid gap-3 py-4 sm:grid-cols-2">
            {IMPORT_SOURCES.map((source) => {
              const Icon = iconMap[source.icon as keyof typeof iconMap];
              return (
                <button
                  key={source.id}
                  type="button"
                  onClick={() => handleSourceSelect(source)}
                  className={cn(
                    "hover:border-primary focus:ring-ring group relative flex flex-col items-start gap-2 rounded-lg border-2 border-border p-4 text-left transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2",
                    source.comingSoon && "opacity-60 hover:border-border hover:shadow-none",
                  )}
                >
                  {source.comingSoon && (
                    <span className="bg-muted text-muted-foreground absolute right-2 top-2 rounded-full px-2 py-0.5 text-xs font-medium">
                      Soon
                    </span>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary rounded-lg p-2">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{source.name}</h3>
                      <p className="text-muted-foreground text-sm">{source.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          // Import input view
          <div className="space-y-4 py-4">
            {selectedSource.id === "linkedin" ? (
              // LinkedIn import - show OAuth for authenticated users, URL for guests
              isGuest ? (
                // Guest mode: simple URL input
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
                    <h4 className="mb-2 font-medium">Import from LinkedIn Profile URL</h4>
                    <p className="text-muted-foreground mb-4 text-sm">
                      Enter your public LinkedIn profile URL to import your profile data. Your
                      profile must be publicly visible.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedin-url">LinkedIn Profile URL</Label>
                    <Input
                      id="linkedin-url"
                      placeholder="https://www.linkedin.com/in/yourprofile"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      disabled={isImporting}
                    />
                    <p className="text-muted-foreground text-sm">
                      Example: https://www.linkedin.com/in/john-doe-12345
                    </p>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="mb-2 text-sm font-medium">What will be imported?</h4>
                    <ul className="text-muted-foreground space-y-1 text-sm">
                      <li>• Personal information</li>
                      <li>• Work experience</li>
                      <li>• Education history</li>
                      <li>• Skills and certifications</li>
                      <li>• Links and contact information</li>
                    </ul>
                    <p className="text-muted-foreground mt-2 text-xs">
                      Note: Public profile information will be imported. Make sure your LinkedIn
                      profile is set to public.
                    </p>
                  </div>
                </div>
              ) : (
                // Authenticated mode: OAuth flow
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
                    <h4 className="mb-2 font-medium">Connect with LinkedIn</h4>
                    <p className="text-muted-foreground mb-4 text-sm">
                      Click the button below to securely connect your LinkedIn profile. You'll be
                      redirected to LinkedIn to authorize access to your profile information.
                    </p>
                    <LinkedInImportButton
                      onImportStart={() => {
                        // Close dialog when OAuth starts
                        setOpen(false);
                      }}
                    />
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="mb-2 text-sm font-medium">What will be imported?</h4>
                    <ul className="text-muted-foreground space-y-1 text-sm">
                      <li>• Personal information</li>
                      <li>• Work experience</li>
                      <li>• Education history</li>
                      <li>• Skills and certifications</li>
                      <li>• Links and contact information</li>
                    </ul>
                    <p className="text-muted-foreground mt-2 text-xs">
                      Note: Imported data will be merged with your existing resume. You can review
                      and edit everything before saving.
                    </p>
                  </div>
                </div>
              )
            ) : selectedSource.requiresUrl ? (
              // URL-based import
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="url">
                    {selectedSource.name === "LinkedIn" ? "LinkedIn Profile URL" : "Profile URL"}
                  </Label>
                  <Input
                    id="url"
                    placeholder={
                      selectedSource.name === "LinkedIn"
                        ? "https://www.linkedin.com/in/username"
                        : "Enter profile URL"
                    }
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    disabled={isImporting}
                  />
                  <p className="text-muted-foreground text-sm">
                    {selectedSource.name === "LinkedIn"
                      ? "Make sure your LinkedIn profile is public or accessible"
                      : "Enter the full URL to your profile"}
                  </p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="mb-2 text-sm font-medium">What will be imported?</h4>
                  <ul className="text-muted-foreground space-y-1 text-sm">
                    <li>• Personal information</li>
                    <li>• Work experience</li>
                    <li>• Education history</li>
                    <li>• Skills and certifications</li>
                    <li>• Links and contact information</li>
                  </ul>
                  <p className="text-muted-foreground mt-2 text-xs">
                    Note: Imported data will be merged with your existing resume. You can review and
                    edit everything before saving.
                  </p>
                </div>
              </div>
            ) : selectedSource.requiresFile ? (
              // File-based import
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="file">
                    {selectedSource.name === "JSON File" ? "Select JSON File" : "Select File"}
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="file"
                      type="file"
                      accept={
                        selectedSource.id === "json"
                          ? ".json"
                          : selectedSource.id === "pdf"
                            ? ".pdf"
                            : "*"
                      }
                      onChange={handleFileChange}
                      disabled={isImporting}
                      className="cursor-pointer"
                    />
                    {fileInput && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setFileInput(null)}
                        disabled={isImporting}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {fileInput && (
                    <p className="text-muted-foreground text-sm">Selected: {fileInput.name}</p>
                  )}
                  <p className="text-muted-foreground text-sm">
                    {selectedSource.name === "JSON File"
                      ? "Import a resume previously exported from Resumier"
                      : "Upload your resume file"}
                  </p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="mb-2 text-sm font-medium">What will be imported?</h4>
                  <ul className="text-muted-foreground space-y-1 text-sm">
                    <li>• Personal information</li>
                    <li>• Work experience</li>
                    <li>• Education history</li>
                    <li>• Skills and certifications</li>
                    <li>• Links and contact information</li>
                  </ul>
                  <p className="text-muted-foreground mt-2 text-xs">
                    Note: Imported data will be merged with your existing resume. You can review and
                    edit everything before saving.
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          {selectedSource ? (
            <>
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={(selectedSource.id === "linkedin" && !isGuest) || isImporting}
              >
                Back
              </Button>
              {!(selectedSource.id === "linkedin" && !isGuest) && (
                <Button onClick={handleImport} disabled={isImporting}>
                  {isImporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Import
                    </>
                  )}
                </Button>
              )}
            </>
          ) : (
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
