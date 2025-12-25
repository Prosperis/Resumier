import { useNavigate } from "@tanstack/react-router";
import { Loader2, Plus } from "lucide-react";
import { useState, useEffect } from "react";
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
import { useCreateResume, useProfile } from "@/hooks/api";
import { useToast } from "@/hooks/use-toast";
import { ProfileSelector } from "@/components/features/profile/profile-selector";

interface CreateResumeDialogProps {
  trigger?: React.ReactNode;
  onSuccess?: (id: string) => void;
  /** Pre-selected profile ID when creating from a profile */
  defaultProfileId?: string;
  /** Controlled open state */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
}

export function CreateResumeDialog({
  trigger,
  onSuccess,
  defaultProfileId,
  open: controlledOpen,
  onOpenChange,
}: CreateResumeDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  
  // Use controlled or uncontrolled open state
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? (onOpenChange || (() => {})) : setInternalOpen;
  const [title, setTitle] = useState("");
  const [validationError, setValidationError] = useState("");
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
    defaultProfileId || null,
  );
  const [activeTab, setActiveTab] = useState<"standalone" | "from-profile">(
    defaultProfileId ? "from-profile" : "standalone",
  );
  const navigate = useNavigate();
  const { toast } = useToast();

  // Sync state when defaultProfileId changes (for controlled mode)
  useEffect(() => {
    if (defaultProfileId) {
      setSelectedProfileId(defaultProfileId);
      setActiveTab("from-profile");
    }
  }, [defaultProfileId]);

  // Fetch the selected profile to use its content
  const { data: selectedProfile } = useProfile(selectedProfileId || "");

  const { mutate, isPending, error } = useCreateResume();

  // Generate a suggested title based on context
  const suggestedTitle = selectedProfile 
    ? `${selectedProfile.content.personalInfo.firstName || selectedProfile.name}'s Resume`
    : "My Resume";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous validation error
    setValidationError("");

    // Use suggested title if user didn't enter anything
    const finalTitle = title.trim() || suggestedTitle;

    // Default empty content
    const defaultContent = {
      personalInfo: {
        firstName: "",
        lastName: "",
        nameOrder: "firstLast" as const,
        email: "",
        phone: "",
        location: "",
        summary: "",
      },
      experience: [],
      education: [],
      skills: {
        technical: [],
        languages: [],
        tools: [],
        soft: [],
      },
      certifications: [],
      links: [],
    };

    // If creating from profile, use profile content and set up the link
    let content = defaultContent;

    if (activeTab === "from-profile" && selectedProfileId && selectedProfile) {
      // Copy profile content to resume
      content = {
        ...selectedProfile.content,
      } as typeof defaultContent;
      // Note: Profile link configuration could be added here in the future
      // when the API supports linking resumes to profiles
    }

    mutate(
      {
        title: finalTitle,
        content,
        // Note: profileLink is not part of CreateResumeDto yet
        // We'll need to update the resume after creation to add the link
      },
      {
        onSuccess: (data) => {
          toast({
            title: "Success",
            description: selectedProfileId
              ? `Resume created from profile "${selectedProfile?.name}"`
              : "Resume created successfully",
          });
          setOpen(false);
          setTitle("");
          setSelectedProfileId(null);
          setActiveTab("standalone");

          // Add a small delay to ensure dialog portal cleanup completes before navigation
          // This prevents "removeChild" errors during React portal cleanup
          const navigateToResume = () => {
            if (onSuccess) {
              onSuccess(data.id);
            } else {
              // Default: navigate to edit page
              navigate({ to: "/resume/$id", params: { id: data.id } });
            }
          };

          // Delay navigation to allow dialog portal to clean up
          setTimeout(navigateToResume, 150);
        },
        onError: (err) => {
          toast({
            title: "Error",
            description: err.message || "Failed to create resume",
            variant: "destructive",
          });
        },
      },
    );
  };

  // Reset state when dialog opens/closes
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setTitle("");
      setValidationError("");
      if (!defaultProfileId) {
        setSelectedProfileId(null);
        setActiveTab("standalone");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button aria-label="Create new resume">
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            New Resume
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Create New Resume</DialogTitle>
            <DialogDescription>
              Start from scratch or create from an existing profile
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as "standalone" | "from-profile")}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="standalone">Start Fresh</TabsTrigger>
                <TabsTrigger value="from-profile">From Profile</TabsTrigger>
              </TabsList>

              <TabsContent value="standalone" className="space-y-4 pt-4">
                <p className="text-sm text-muted-foreground">
                  Create a new resume and add your information manually.
                </p>
              </TabsContent>

              <TabsContent value="from-profile" className="space-y-4 pt-4">
                <p className="text-sm text-muted-foreground">
                  Start with data from an existing profile. Changes won't affect the original
                  profile.
                </p>
                <ProfileSelector
                  selectedProfileId={selectedProfileId}
                  onSelect={setSelectedProfileId}
                  disabled={isPending}
                />
              </TabsContent>
            </Tabs>

            <div className="space-y-2">
              <Label htmlFor="title">Resume Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  // Clear validation error on change
                  if (validationError) {
                    setValidationError("");
                  }
                }}
                placeholder={suggestedTitle}
                disabled={isPending}
                autoFocus
                aria-invalid={!!validationError || !!error}
                aria-describedby={
                  validationError ? "title-validation-error" : error ? "title-api-error" : undefined
                }
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to use "{suggestedTitle}"
              </p>
              {validationError && (
                <p id="title-validation-error" className="text-destructive text-sm" role="alert">
                  {validationError}
                </p>
              )}
              {error && !validationError && (
                <p id="title-api-error" className="text-destructive text-sm" role="alert">
                  {error.message || "An error occurred"}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || (activeTab === "from-profile" && !selectedProfileId)}
              aria-label={isPending ? "Creating resume..." : "Create resume"}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
              Create Resume
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
