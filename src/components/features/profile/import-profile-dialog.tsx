/**
 * Import Profile Dialog
 * Dialog for importing profile data from LinkedIn
 */

import {
  Download,
  ExternalLink,
  FileArchive,
  FileText,
  Linkedin,
  Loader2,
  Upload,
  X,
  AlertTriangle,
} from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useCreateProfile } from "@/hooks/api";
import { importFromLinkedIn } from "@/lib/services/import-service";
import { LinkedInImportButton } from "@/components/features/resume/import/linkedin-import-button";
import { useAuthStore, selectIsGuest } from "@/stores/auth-store";
import type { ResumeContent } from "@/lib/api/types";
import type { ProfileContent } from "@/lib/api/profile-types";

interface ImportProfileDialogProps {
  trigger?: React.ReactNode;
  onSuccess?: (id: string) => void;
}

type LinkedInImportMethod = "file" | "url" | "oauth";

/**
 * Convert ResumeContent to ProfileContent
 * Both have the same structure, but this ensures type safety
 */
function resumeContentToProfileContent(data: Partial<ResumeContent>): Partial<ProfileContent> {
  return {
    personalInfo: data.personalInfo,
    experience: data.experience,
    education: data.education,
    skills: data.skills,
    certifications: data.certifications,
    links: data.links,
  };
}

export function ImportProfileDialog({ trigger, onSuccess }: ImportProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [linkedInMethod, setLinkedInMethod] = useState<LinkedInImportMethod>("file");
  const [importedData, setImportedData] = useState<Partial<ResumeContent> | null>(null);
  const [importWarnings, setImportWarnings] = useState<string[]>([]);
  const { toast } = useToast();
  const isGuest = useAuthStore(selectIsGuest);

  const { mutate: createProfile, isPending: isCreating } = useCreateProfile();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileInput(file);
    }
  };

  const clearFile = () => {
    setFileInput(null);
    // Reset file input
    const fileInputEl = document.getElementById("linkedin-file") as HTMLInputElement;
    if (fileInputEl) {
      fileInputEl.value = "";
    }
  };

  const handleImport = async () => {
    let input: string | File | null = null;

    if (linkedInMethod === "file") {
      input = fileInput;
    } else if (linkedInMethod === "url") {
      // Remove trailing slash from URL
      input = urlInput.trim().replace(/\/+$/, "");
    }

    if (!input) {
      toast({
        title: "Error",
        description:
          linkedInMethod === "file"
            ? "Please select a LinkedIn data export ZIP file"
            : "Please enter your LinkedIn profile URL",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);

    try {
      const result = await importFromLinkedIn(input);

      if (!result.success || !result.data) {
        toast({
          title: "Import Failed",
          description: result.error || "Failed to import LinkedIn data",
          variant: "destructive",
        });
        return;
      }

      setImportedData(result.data);
      setImportWarnings(result.warnings || []);

      // Only auto-fill profile name for ZIP file imports (real data)
      // URL imports use mock data in development, so leave name empty for user to fill
      if (linkedInMethod === "file") {
        const firstName = result.data.personalInfo?.firstName || "";
        const lastName = result.data.personalInfo?.lastName || "";
        const fullName = `${firstName} ${lastName}`.trim();
        setProfileName(fullName ? `${fullName}'s Profile` : "");
      }

      // Show toast with warnings if present
      const hasWarnings = result.warnings && result.warnings.length > 0;
      toast({
        title: hasWarnings ? "Import Completed with Warnings" : "Import Successful",
        description:
          linkedInMethod === "file"
            ? hasWarnings
              ? "Data imported, but some information is missing. See warnings below."
              : "Your LinkedIn data has been imported. Click 'Create Profile' to save."
            : "Profile data extracted. Note: URL import may have limited data. Use Data Export for complete info.",
        variant: hasWarnings ? "default" : "default",
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Failed to import LinkedIn data",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleCreateProfile = () => {
    if (!importedData) {
      toast({
        title: "Error",
        description: "Please import your LinkedIn data first",
        variant: "destructive",
      });
      return;
    }

    if (!profileName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a profile name",
        variant: "destructive",
      });
      return;
    }

    const profileContent = resumeContentToProfileContent(importedData);

    createProfile(
      {
        name: profileName.trim(),
        description: "Imported from LinkedIn",
        content: profileContent,
      },
      {
        onSuccess: (data) => {
          toast({
            title: "Profile Created",
            description: `Profile "${profileName}" has been created with your LinkedIn data`,
          });
          // Reset state
          setOpen(false);
          setProfileName("");
          setUrlInput("");
          setFileInput(null);
          setImportedData(null);
          setImportWarnings([]);
          setLinkedInMethod("file");

          if (onSuccess) {
            onSuccess(data.id);
          }
        },
        onError: (err) => {
          toast({
            title: "Error",
            description: err.message || "Failed to create profile",
            variant: "destructive",
          });
        },
      },
    );
  };

  const handleReset = () => {
    setImportedData(null);
    setProfileName("");
    setImportWarnings([]);
  };

  const isProcessing = isImporting || isCreating;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" aria-label="Import from LinkedIn">
            <Linkedin className="mr-2 h-4 w-4" aria-hidden="true" />
            Import from LinkedIn
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Linkedin className="h-5 w-5 text-[#0A66C2]" />
            Import Profile from LinkedIn
          </DialogTitle>
          <DialogDescription>
            Import your professional data from LinkedIn to create a master profile. This profile can
            be reused across multiple tailored resumes.
          </DialogDescription>
        </DialogHeader>

        {/* Show imported data summary or import form */}
        {importedData ? (
          <div className="space-y-4 py-4">
            {/* Success message */}
            <div className="rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30 p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-100 dark:bg-green-900/50 p-2">
                  <Linkedin className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-green-800 dark:text-green-200">
                    LinkedIn Data Imported
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    {importedData.experience?.length || 0} experiences,{" "}
                    {importedData.education?.length || 0} education,{" "}
                    {importedData.skills?.technical?.length || 0} skills,{" "}
                    {importedData.skills?.languages?.length || 0} languages,{" "}
                    {importedData.certifications?.length || 0} certifications
                    {importedData.links &&
                      importedData.links.length > 0 &&
                      `, ${importedData.links.length} links`}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="h-8 w-8 p-0"
                  aria-label="Clear imported data"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Warnings section */}
            {importWarnings.length > 0 && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30 p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-amber-100 dark:bg-amber-900/50 p-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h4 className="font-medium text-amber-800 dark:text-amber-200">
                      Important Notice
                    </h4>
                    <div className="space-y-1 text-sm text-amber-700 dark:text-amber-300">
                      {importWarnings.map((warning, idx) => (
                        <p key={idx}>{warning}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Profile name input */}
            <div className="space-y-2">
              <Label htmlFor="profile-name">Profile Name</Label>
              <Input
                id="profile-name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="e.g., Software Engineer Profile"
                disabled={isProcessing}
              />
              <p className="text-xs text-muted-foreground">
                Give your profile a memorable name to identify it later
              </p>
            </div>
          </div>
        ) : (
          <div className="py-4">
            <Tabs
              value={linkedInMethod}
              onValueChange={(v) => setLinkedInMethod(v as LinkedInImportMethod)}
            >
              <TabsList className={`grid w-full ${isGuest ? "grid-cols-2" : "grid-cols-3"}`}>
                <TabsTrigger value="file" className="text-xs sm:text-sm">
                  <FileArchive className="mr-1.5 h-3.5 w-3.5" />
                  Data Export
                </TabsTrigger>
                <TabsTrigger value="url" className="text-xs sm:text-sm">
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                  Profile URL
                </TabsTrigger>
                {!isGuest && (
                  <TabsTrigger value="oauth" className="text-xs sm:text-sm">
                    <Linkedin className="mr-1.5 h-3.5 w-3.5" />
                    Connect
                  </TabsTrigger>
                )}
              </TabsList>

              {/* File Upload (ZIP or PDF) */}
              <TabsContent value="file" className="mt-4 space-y-4">
                <div className="rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-green-100 dark:bg-green-900/50 p-2">
                      <FileArchive className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-green-800 dark:text-green-200">
                        ✓ Recommended: Upload LinkedIn Data Export
                      </h4>
                      <p className="text-green-700 dark:text-green-300 text-sm mt-1">
                        This method imports <strong>all your data</strong> including your complete
                        work history, education, skills, and certifications.
                      </p>
                      <p className="text-green-700 dark:text-green-300 text-sm mt-2 font-medium">
                        ⚠️ Important: Select <strong>"Download larger data archive"</strong> option
                        (not the custom file selection) to get all your data.
                      </p>
                      <p className="text-green-700 dark:text-green-300 text-xs mt-1">
                        Download from: LinkedIn Settings → Data Privacy → Get a copy of your data →
                        Select "Download larger data archive"
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-blue-100 dark:bg-blue-900/50 p-2">
                      <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-800 dark:text-blue-200">
                        Quick Option: Upload LinkedIn PDF Profile
                      </h4>
                      <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                        Alternatively, you can upload a PDF export of your LinkedIn profile. Go to
                        your profile → More → Save to PDF.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin-file">LinkedIn Data Export (ZIP or PDF)</Label>
                  <div className="relative">
                    <input
                      id="linkedin-file"
                      type="file"
                      accept=".zip,.pdf"
                      onChange={handleFileChange}
                      disabled={isProcessing}
                      className="sr-only"
                    />
                    {fileInput ? (
                      <div className="flex items-center gap-2 p-3 rounded-md border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30">
                        <FileText className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-green-800 dark:text-green-200 truncate">
                            {fileInput.name}
                          </p>
                          <p className="text-xs text-green-600 dark:text-green-400">
                            {(fileInput.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => document.getElementById("linkedin-file")?.click()}
                          disabled={isProcessing}
                          className="shrink-0 text-xs"
                        >
                          Change
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={clearFile}
                          disabled={isProcessing}
                          aria-label="Clear selected file"
                          className="shrink-0 h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <label
                        htmlFor="linkedin-file"
                        className="flex items-center justify-center gap-2 p-4 rounded-md border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50 cursor-pointer transition-colors"
                      >
                        <Upload className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Click to select ZIP or PDF file
                        </span>
                      </label>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Supported formats: ZIP (data export) or PDF (profile export)
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Download className="h-4 w-4" />
                  <a
                    href="https://www.linkedin.com/mypreferences/d/download-my-data"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Download your LinkedIn data
                  </a>
                </div>
              </TabsContent>

              {/* URL Input */}
              <TabsContent value="url" className="mt-4 space-y-4">
                <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-blue-100 dark:bg-blue-900/50 p-2">
                      <ExternalLink className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-800 dark:text-blue-200">
                        Import from Profile URL
                      </h4>
                      <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                        Scrapes public LinkedIn data including experiences, education,
                        certifications, projects, courses, volunteer work, honors, and languages.
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                        <strong>Note:</strong> Works best with public profiles. For private profiles
                        or complete data, use the <strong>Data Export</strong> tab.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin-url">LinkedIn Profile URL</Label>
                  <Input
                    id="linkedin-url"
                    placeholder="https://www.linkedin.com/in/yourprofile"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    disabled={isProcessing}
                  />
                  <p className="text-xs text-muted-foreground">
                    Example: https://www.linkedin.com/in/adriandarian
                  </p>
                </div>
              </TabsContent>

              {/* OAuth Connect (authenticated users only) */}
              {!isGuest && (
                <TabsContent value="oauth" className="mt-4 space-y-4">
                  <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-blue-100 dark:bg-blue-900/50 p-2">
                        <Linkedin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-medium">Connect with LinkedIn</h4>
                        <p className="text-muted-foreground text-sm mt-1">
                          Securely connect your LinkedIn account to import your profile data
                          directly. You'll be redirected to LinkedIn to authorize access.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center py-4">
                    <LinkedInImportButton
                      onImportStart={() => {
                        setOpen(false);
                      }}
                    />
                  </div>

                  <div className="rounded-lg bg-muted/50 p-3 text-sm">
                    <p className="text-muted-foreground">
                      <strong>Privacy:</strong> We only request access to your basic profile
                      information. Your credentials are never stored.
                    </p>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          {importedData ? (
            <Button onClick={handleCreateProfile} disabled={isProcessing || !profileName.trim()}>
              {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Profile
            </Button>
          ) : (
            linkedInMethod !== "oauth" && (
              <Button
                onClick={handleImport}
                disabled={
                  isProcessing ||
                  (linkedInMethod === "file" && !fileInput) ||
                  (linkedInMethod === "url" && !urlInput.trim())
                }
              >
                {isImporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Upload className="mr-2 h-4 w-4" />
                Import Data
              </Button>
            )
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
