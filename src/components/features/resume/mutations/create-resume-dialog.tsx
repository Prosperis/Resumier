import { useNavigate } from "@tanstack/react-router";
import { Loader2, Plus } from "lucide-react";
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
import { useCreateResume, useProfile } from "@/hooks/api";
import { useToast } from "@/hooks/use-toast";
import { ProfileSelector } from "@/components/features/profile/profile-selector";
import type { ProfileLink } from "@/lib/api/profile-types";

interface CreateResumeDialogProps {
  trigger?: React.ReactNode;
  onSuccess?: (id: string) => void;
  /** Pre-selected profile ID when creating from a profile */
  defaultProfileId?: string;
}

export function CreateResumeDialog({
  trigger,
  onSuccess,
  defaultProfileId,
}: CreateResumeDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [validationError, setValidationError] = useState("");
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
    defaultProfileId || null
  );
  const [activeTab, setActiveTab] = useState<"standalone" | "from-profile">(
    defaultProfileId ? "from-profile" : "standalone"
  );
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch the selected profile to use its content
  const { data: selectedProfile } = useProfile(selectedProfileId || "");

  const { mutate, isPending, error } = useCreateResume();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous validation error
    setValidationError("");

    if (!title.trim()) {
      setValidationError("Please enter a resume title");
      toast({
        title: "Error",
        description: "Please enter a resume title",
        variant: "destructive",
      });
      // Focus the input field
      document.getElementById("title")?.focus();
      return;
    }

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
    let profileLink: ProfileLink | undefined;

    if (activeTab === "from-profile" && selectedProfileId && selectedProfile) {
      // Copy profile content to resume
      content = {
        ...selectedProfile.content,
      };
      // Set up the profile link
      profileLink = {
        profileId: selectedProfileId,
        selection: {
          includePersonalInfo: true,
          includeSummary: true,
          // Include all items by default (empty arrays = all)
          experienceIds: [],
          educationIds: [],
          certificationIds: [],
          linkIds: [],
          skills: {
            technical: [],
            languages: [],
            tools: [],
            soft: [],
          },
        },
      };
    }

    mutate(
      {
        title: title.trim(),
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

          if (onSuccess) {
            onSuccess(data.id);
          } else {
            // Default: navigate to edit page
            navigate({ to: "/resume/$id", params: { id: data.id } });
          }
        },
        onError: (err) => {
          toast({
            title: "Error",
            description: err.message || "Failed to create resume",
            variant: "destructive",
          });
        },
      }
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
              onValueChange={(v) =>
                setActiveTab(v as "standalone" | "from-profile")
              }
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
                  Start with data from an existing profile. Changes won't affect
                  the original profile.
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
                placeholder={
                  selectedProfile
                    ? `${selectedProfile.name} - Resume`
                    : "e.g., Software Engineer Resume"
                }
                disabled={isPending}
                autoFocus
                required
                aria-invalid={!!validationError || !!error}
                aria-describedby={
                  validationError
                    ? "title-validation-error"
                    : error
                      ? "title-api-error"
                      : undefined
                }
              />
              {validationError && (
                <p
                  id="title-validation-error"
                  className="text-destructive text-sm"
                  role="alert"
                >
                  {validationError}
                </p>
              )}
              {error && !validationError && (
                <p
                  id="title-api-error"
                  className="text-destructive text-sm"
                  role="alert"
                >
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
              disabled={
                isPending ||
                (activeTab === "from-profile" && !selectedProfileId)
              }
              aria-label={isPending ? "Creating resume..." : "Create resume"}
            >
              {isPending && (
                <Loader2
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Create Resume
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
