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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUpdateProfile } from "@/hooks/api";
import { useToast } from "@/hooks/use-toast";
import type { Profile } from "@/lib/api/profile-types";

interface ProfileEditorProps {
  profile: Profile;
  onBack?: () => void;
}

export function ProfileEditor({ profile, onBack }: ProfileEditorProps) {
  const { toast } = useToast();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const [name, setName] = useState(profile.name);
  const [description, setDescription] = useState(profile.description || "");
  const [activeTab, setActiveTab] = useState("details");

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
      }
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="container flex h-14 items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-2"
          >
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

      {/* Main content */}
      <div className="container py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="details">Profile Details</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
          </TabsList>

          {/* Profile Details Tab */}
          <TabsContent value="details">
            <Card className="max-w-2xl">
              <CardHeader>
                <CardTitle>Profile Details</CardTitle>
                <CardDescription>
                  Basic information about this profile. This helps you organize
                  multiple profiles for different roles.
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
                  <p className="text-xs text-muted-foreground">
                    A name to identify this profile
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-description">Description</Label>
                  <Textarea
                    id="profile-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What is this profile for?"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional description to help you remember what this profile
                    is used for
                  </p>
                </div>

                <Button
                  onClick={handleSaveDetails}
                  disabled={isPending || !name.trim()}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isPending ? "Saving..." : "Save Details"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Profile Content</CardTitle>
                <CardDescription>
                  Add your professional information here. This content will be
                  available when creating resumes from this profile.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Note: Profile content editing uses the same interface as resume
                  editing. Changes are saved to the profile and will be available
                  for all resumes created from this profile.
                </p>
                <div className="border rounded-lg p-4 bg-muted/30">
                  <p className="text-center text-muted-foreground">
                    Profile content editor coming soon...
                  </p>
                  <p className="text-center text-xs text-muted-foreground mt-2">
                    For now, create a resume from this profile to add content,
                    then the content will be saved here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
