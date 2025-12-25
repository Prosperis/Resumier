import {
  Briefcase,
  Download,
  ExternalLink,
  FileArchive,
  FileJson2,
  FileText,
  Github,
  Linkedin,
  Loader2,
  Upload,
  X,
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

type LinkedInImportMethod = "file" | "url" | "oauth";

export function ImportDialog({ trigger, onImportSuccess }: ImportDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<ImportSource | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [linkedInMethod, setLinkedInMethod] = useState<LinkedInImportMethod>("file");
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

    // Determine the input based on source and method
    let input: string | File | null = null;

    if (selectedSource.id === "linkedin") {
      // LinkedIn has multiple input methods
      if (linkedInMethod === "file") {
        input = fileInput;
      } else if (linkedInMethod === "url") {
        input = urlInput;
      }
      // OAuth method is handled separately by LinkedInImportButton
    } else if (selectedSource.requiresFile) {
      input = fileInput;
    } else {
      input = urlInput;
    }

    if (!input) {
      toast({
        title: "Error",
        description:
          linkedInMethod === "file" || selectedSource.requiresFile
            ? "Please select a file"
            : "Please enter a URL",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);

    try {
      const result = await importResume(selectedSource.id, input);

      if (result.success && result.data) {
        const hasWarnings = result.warnings && result.warnings.length > 0;
        toast({
          title: hasWarnings ? "Import Completed with Warnings" : "Import Successful",
          description: hasWarnings
            ? `Data imported, but some information is missing. ${result.warnings[0]}`
            : `Successfully imported data from ${selectedSource.name}`,
          variant: hasWarnings ? "default" : "default",
        });
        onImportSuccess(result.data);
        setOpen(false);
        // Reset state
        setSelectedSource(null);
        setUrlInput("");
        setFileInput(null);
        setLinkedInMethod("file");
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
    setLinkedInMethod("file");
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset state when dialog closes
      setSelectedSource(null);
      setUrlInput("");
      setFileInput(null);
      setLinkedInMethod("file");
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
              // LinkedIn import with multiple methods
              <div className="space-y-4">
                <Tabs
                  value={linkedInMethod}
                  onValueChange={(v) => {
                    setLinkedInMethod(v as LinkedInImportMethod);
                    setFileInput(null);
                    setUrlInput("");
                  }}
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="file" className="gap-2">
                      <FileArchive className="h-4 w-4" />
                      <span className="hidden sm:inline">Data Export</span>
                      <span className="sm:hidden">File</span>
                    </TabsTrigger>
                    <TabsTrigger value="url" className="gap-2">
                      <ExternalLink className="h-4 w-4" />
                      <span className="hidden sm:inline">Profile URL</span>
                      <span className="sm:hidden">URL</span>
                    </TabsTrigger>
                    {!isGuest && (
                      <TabsTrigger value="oauth" className="gap-2">
                        <Linkedin className="h-4 w-4" />
                        <span className="hidden sm:inline">Connect</span>
                        <span className="sm:hidden">OAuth</span>
                      </TabsTrigger>
                    )}
                  </TabsList>

                  {/* File Import (ZIP or PDF) */}
                  <TabsContent value="file" className="space-y-4 mt-4">
                    <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 dark:bg-blue-900/50 rounded-full p-2">
                          <FileArchive className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-medium flex items-center gap-2">
                            Import from LinkedIn Data Export
                            <span className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400 text-xs px-2 py-0.5 rounded-full">
                              Recommended
                            </span>
                          </h4>
                          <p className="text-muted-foreground text-sm mt-1">
                            Upload your LinkedIn data export ZIP file or PDF profile for the most complete and
                            accurate import.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* How to export instructions */}
                    <div className="border rounded-lg p-4 space-y-3">
                      <h5 className="font-medium flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        How to export your LinkedIn data:
                      </h5>
                      <div className="space-y-3">
                        <div>
                          <h6 className="text-sm font-medium mb-2">Option 1: Data Export (ZIP) - Most Complete</h6>
                          <ol className="text-sm text-muted-foreground space-y-2 ml-4">
                            <li className="flex gap-2">
                              <span className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs shrink-0">
                                1
                              </span>
                              <span>
                                Go to{" "}
                                <a
                                  href="https://www.linkedin.com/mypreferences/d/download-my-data"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline inline-flex items-center gap-1"
                                >
                                  LinkedIn Settings → Get a copy of your data
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </span>
                            </li>
                            <li className="flex gap-2">
                              <span className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs shrink-0">
                                2
                              </span>
                              <span>
                                Select <strong>"Want something in particular?"</strong> and choose the
                                data you want (Profile, Positions, Education, Skills, etc.)
                              </span>
                            </li>
                            <li className="flex gap-2">
                              <span className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs shrink-0">
                                3
                              </span>
                              <span>
                                Click <strong>"Request archive"</strong> - you'll receive an email when
                                it's ready (usually within minutes)
                              </span>
                            </li>
                            <li className="flex gap-2">
                              <span className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs shrink-0">
                                4
                              </span>
                              <span>Download the ZIP file and upload it below</span>
                            </li>
                          </ol>
                        </div>
                        <div className="border-t pt-3">
                          <h6 className="text-sm font-medium mb-2">Option 2: PDF Profile Export - Quick & Easy</h6>
                          <ol className="text-sm text-muted-foreground space-y-2 ml-4">
                            <li className="flex gap-2">
                              <span className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs shrink-0">
                                1
                              </span>
                              <span>Go to your LinkedIn profile page</span>
                            </li>
                            <li className="flex gap-2">
                              <span className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs shrink-0">
                                2
                              </span>
                              <span>Click the <strong>"More"</strong> button (three dots) on your profile</span>
                            </li>
                            <li className="flex gap-2">
                              <span className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs shrink-0">
                                3
                              </span>
                              <span>Select <strong>"Save to PDF"</strong> from the dropdown menu</span>
                            </li>
                            <li className="flex gap-2">
                              <span className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs shrink-0">
                                4
                              </span>
                              <span>Download the PDF and upload it below</span>
                            </li>
                          </ol>
                        </div>
                      </div>
                    </div>

                    {/* File input */}
                    <div className="space-y-2">
                      <Label htmlFor="linkedin-file">LinkedIn Data Export (ZIP or PDF)</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="linkedin-file"
                          type="file"
                          accept=".zip,.pdf"
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
                        <p className="text-muted-foreground text-sm flex items-center gap-2">
                          {fileInput.name.endsWith(".pdf") ? (
                            <FileText className="h-4 w-4" />
                          ) : (
                            <FileArchive className="h-4 w-4" />
                          )}
                          {fileInput.name} ({(fileInput.size / 1024).toFixed(1)} KB)
                        </p>
                      )}
                      <p className="text-muted-foreground text-xs">
                        Supported formats: ZIP (data export) or PDF (profile export)
                      </p>
                    </div>
                  </TabsContent>

                  {/* URL Import */}
                  <TabsContent value="url" className="space-y-4 mt-4">
                    <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-amber-100 dark:bg-amber-900/50 rounded-full p-2">
                          <ExternalLink className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <h4 className="font-medium">Import from Profile URL</h4>
                          <p className="text-muted-foreground text-sm mt-1">
                            Enter your public LinkedIn profile URL. Note: This method imports
                            limited data as it only accesses publicly visible information.
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
                        disabled={isImporting}
                      />
                      <p className="text-muted-foreground text-xs">
                        Example: https://www.linkedin.com/in/john-doe-12345
                      </p>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-3 text-sm">
                      <p className="text-muted-foreground">
                        <strong>Note:</strong> Your LinkedIn profile must be set to public for this
                        method to work. For the most complete import, use the Data Export method
                        instead.
                      </p>
                    </div>
                  </TabsContent>

                  {/* OAuth Import (authenticated users only) */}
                  {!isGuest && (
                    <TabsContent value="oauth" className="space-y-4 mt-4">
                      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-blue-100 dark:bg-blue-900/50 rounded-full p-2">
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

                      <div className="bg-muted/50 rounded-lg p-3 text-sm">
                        <p className="text-muted-foreground">
                          <strong>Privacy:</strong> We only request access to your basic profile
                          information. Your login credentials are never shared with us.
                        </p>
                      </div>
                    </TabsContent>
                  )}
                </Tabs>

                {/* What will be imported - shown for all methods */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="mb-2 text-sm font-medium">What will be imported?</h4>
                  <ul className="text-muted-foreground space-y-1 text-sm grid grid-cols-2 gap-x-4">
                    <li>• Personal information</li>
                    <li>• Work experience</li>
                    <li>• Education history</li>
                    <li>• Skills</li>
                    <li>• Certifications</li>
                    <li>• Languages</li>
                  </ul>
                  <p className="text-muted-foreground mt-2 text-xs">
                    Imported data will be merged with your existing resume. You can review and edit
                    everything before saving.
                  </p>
                </div>
              </div>
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
              <Button variant="outline" onClick={handleBack} disabled={isImporting}>
                Back
              </Button>
              {/* Show import button for all methods except LinkedIn OAuth */}
              {!(selectedSource.id === "linkedin" && linkedInMethod === "oauth") && (
                <Button
                  onClick={handleImport}
                  disabled={
                    isImporting ||
                    (selectedSource.id === "linkedin" &&
                      ((linkedInMethod === "file" && !fileInput) ||
                        (linkedInMethod === "url" && !urlInput)))
                  }
                >
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
