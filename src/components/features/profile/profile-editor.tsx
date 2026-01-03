/**
 * Profile Editor Component
 * Full-page editor for editing profile content
 */

import { ArrowLeft, Save, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUpdateProfile } from "@/hooks/api";
import { useToast } from "@/hooks/use-toast";
import type { Profile, ProfileContent } from "@/lib/api/profile-types";
import { ProfileContentBuilder } from "./profile-content-builder";

interface ProfileEditorProps {
  profile: Profile;
  onBack?: () => void;
}

export function ProfileEditor({ profile, onBack }: ProfileEditorProps) {
  const { toast } = useToast();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  // Clean up description - remove any "imported from" or similar placeholder text
  const cleanDescription = (desc: string | undefined): string => {
    if (!desc) return "";
    const lowerDesc = desc.toLowerCase();
    // Filter out common placeholder patterns
    if (
      lowerDesc.includes("imported from") ||
      lowerDesc.includes("imported via") ||
      lowerDesc.includes("linkedin import") ||
      lowerDesc.trim() === ""
    ) {
      return "";
    }
    return desc.trim();
  };

  const [name, setName] = useState(profile.name);
  const [description, setDescription] = useState(cleanDescription(profile.description));
  const [activeTab, setActiveTab] = useState("details");
  const [openSection, setOpenSection] = useState<string | null>("personal");

  const handleSaveDetails = () => {
    updateProfile(
      {
        id: profile.id,
        data: {
          name,
          description: description || undefined,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Profile saved",
            description: "Your profile details have been updated.",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message || "Failed to save profile",
            variant: "destructive",
          });
        },
      },
    );
  };

  const handleToggleSection = (sectionId: string) => {
    setOpenSection(openSection === sectionId ? null : sectionId);
  };

  // Ensure profile.content exists with proper structure
  // Initialize with empty structure if content is missing or incomplete
  const defaultContent: ProfileContent = {
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
    skills: { technical: [], languages: [], tools: [], soft: [] },
    certifications: [],
    links: [],
  };

  // Ensure we have a valid content structure
  // Handle cases where content might be undefined or incomplete
  const profileContent: ProfileContent = (profile.content && 
    profile.content.personalInfo &&
    Array.isArray(profile.content.experience) &&
    Array.isArray(profile.content.education) &&
    Array.isArray(profile.content.certifications) &&
    Array.isArray(profile.content.links) &&
    profile.content.skills)
    ? profile.content
    : defaultContent;

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="flex-shrink-0 border-b bg-background/95 backdrop-blur">
        <div className="flex h-14 items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-semibold">{profile.name}</h1>
              <p className="text-xs text-muted-foreground">Profile Editor</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Fixed, never scrolls */}
        <div className="w-64 flex-shrink-0 border-r bg-muted/30 p-4 overflow-y-auto">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="w-full">
              <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
              <TabsTrigger value="content" className="flex-1">Content</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Section Navigation - Only show when content tab is active */}
          {activeTab === "content" && (
            <nav className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                Sections
              </p>
              {[
                { id: "personal", label: "Personal Information", icon: "👤" },
                { id: "experience", label: "Work Experience", icon: "💼" },
                { id: "education", label: "Education", icon: "🎓" },
                { id: "skills", label: "Skills", icon: "🛠️" },
                { id: "certifications", label: "Certifications", icon: "🏆" },
                { id: "links", label: "Links", icon: "🔗" },
              ].map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => handleToggleSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-colors ${
                    openSection === section.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <span className="text-base">{section.icon}</span>
                  <span>{section.label}</span>
                </button>
              ))}
            </nav>
          )}
        </div>

        {/* Right Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] p-6">
          {/* Profile Details Tab */}
          {activeTab === "details" && (
            <div className="max-w-2xl">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Details</CardTitle>
                  <CardDescription>
                    Basic information about this profile. This helps you organize multiple profiles
                    for different roles.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="profile-name">Profile Name</Label>
                    <Input
                      id="profile-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Software Engineer, Product Manager"
                    />
                    <p className="text-xs text-muted-foreground">A name to identify this profile</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profile-description">Description</Label>
                    <Textarea
                      id="profile-description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="e.g., Software Engineer profile for tech roles, Product Manager profile for PM positions"
                      rows={3}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      Optional description to help you remember what this profile is used for. This helps organize multiple profiles for different roles or purposes.
                    </p>
                  </div>

                  <Button onClick={handleSaveDetails} disabled={isPending || !name.trim()}>
                    <Save className="mr-2 h-4 w-4" />
                    {isPending ? "Saving..." : "Save Details"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Content Tab */}
          {activeTab === "content" && (
            <ProfileContentBuilder
              profileId={profile.id}
              content={profileContent}
              openSection={openSection}
              onToggleSection={handleToggleSection}
            />
          )}
        </div>
      </div>
    </div>
  );
}
