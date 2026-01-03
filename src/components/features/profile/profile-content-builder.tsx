import {
  Plus,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  Award,
  Link as LinkIcon,
} from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfileEntityHandlers } from "@/hooks/use-profile-entity-handlers";
import type { ProfileContent } from "@/lib/api/profile-types";
import { ProfilePersonalInfoForm } from "./profile-personal-info-form";

// Default empty content structure
const DEFAULT_CONTENT: ProfileContent = {
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

// Section configuration
const SECTIONS = {
  personal: {
    title: "Personal Information",
    description:
      "Your basic contact details and professional summary. This information appears at the top of your resume.",
    icon: User,
  },
  experience: {
    title: "Work Experience",
    description:
      "Your professional experience and accomplishments. Include relevant positions that showcase your skills.",
    icon: Briefcase,
  },
  education: {
    title: "Education",
    description: "Your educational background, degrees, and academic achievements.",
    icon: GraduationCap,
  },
  skills: {
    title: "Skills",
    description:
      "Technical skills, programming languages, tools, and soft skills that make you stand out.",
    icon: Wrench,
  },
  certifications: {
    title: "Certifications",
    description:
      "Professional certifications, licenses, and credentials that validate your expertise.",
    icon: Award,
  },
  links: {
    title: "Links",
    description: "Portfolio, LinkedIn, GitHub, and other professional links to showcase your work.",
    icon: LinkIcon,
  },
};

interface ProfileContentBuilderProps {
  profileId: string;
  content: ProfileContent;
  openSection: string | null;
  onToggleSection: (sectionId: string) => void;
}

export function ProfileContentBuilder({
  profileId,
  content,
  openSection,
}: ProfileContentBuilderProps) {
  // Get content with fallback - ensure it's a valid ProfileContent
  const profileContent: ProfileContent =
    content &&
    content.personalInfo &&
    Array.isArray(content.experience) &&
    Array.isArray(content.education) &&
    Array.isArray(content.certifications) &&
    Array.isArray(content.links) &&
    content.skills
      ? content
      : DEFAULT_CONTENT;

  // Memoize getCurrentItems callbacks to prevent unnecessary re-renders
  const getExperiences = useMemo(
    () => () => profileContent.experience || [],
    [profileContent.experience],
  );
  const getEducation = useMemo(
    () => () => profileContent.education || [],
    [profileContent.education],
  );
  const getCertifications = useMemo(
    () => () => profileContent.certifications || [],
    [profileContent.certifications],
  );
  const getLinks = useMemo(() => () => profileContent.links || [], [profileContent.links]);

  // Entity handlers using the custom hook
  const experienceHandlers = useProfileEntityHandlers({
    profileId,
    entityKey: "experience",
    getCurrentItems: getExperiences,
    entityLabel: "Experience",
  });

  const educationHandlers = useProfileEntityHandlers({
    profileId,
    entityKey: "education",
    getCurrentItems: getEducation,
    entityLabel: "Education",
  });

  const certificationHandlers = useProfileEntityHandlers({
    profileId,
    entityKey: "certifications",
    getCurrentItems: getCertifications,
    entityLabel: "Certification",
  });

  const linkHandlers = useProfileEntityHandlers({
    profileId,
    entityKey: "links",
    getCurrentItems: getLinks,
    entityLabel: "Link",
  });

  // Get current section config
  const currentSection = openSection && SECTIONS[openSection as keyof typeof SECTIONS];
  const SectionIcon = currentSection?.icon || User;

  // Render section content based on selected section
  const renderSectionContent = () => {
    switch (openSection) {
      case "personal":
        return (
          <ProfilePersonalInfoForm
            profileId={profileId}
            defaultValues={profileContent?.personalInfo || DEFAULT_CONTENT.personalInfo}
          />
        );

      case "experience":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {profileContent.experience.length === 0
                  ? "No work experience added yet."
                  : `${profileContent.experience.length} experience${profileContent.experience.length !== 1 ? "s" : ""} added`}
              </p>
              <Button
                size="sm"
                onClick={experienceHandlers.handleAdd}
                disabled={experienceHandlers.isEditing}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </Button>
            </div>
            <div className="rounded-lg border border-dashed border-muted-foreground/25 p-8 text-center">
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                Experience editing is coming soon.
              </p>
              <p className="text-xs text-muted-foreground">
                Profile-specific forms are being implemented.
              </p>
            </div>
          </div>
        );

      case "education":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {profileContent.education.length === 0
                  ? "No education added yet."
                  : `${profileContent.education.length} education entr${profileContent.education.length !== 1 ? "ies" : "y"} added`}
              </p>
              <Button
                size="sm"
                onClick={educationHandlers.handleAdd}
                disabled={educationHandlers.isEditing}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Education
              </Button>
            </div>
            <div className="rounded-lg border border-dashed border-muted-foreground/25 p-8 text-center">
              <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                Education editing is coming soon.
              </p>
              <p className="text-xs text-muted-foreground">
                Profile-specific forms are being implemented.
              </p>
            </div>
          </div>
        );

      case "skills":
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {Object.values(profileContent.skills).flat().length === 0
                ? "No skills added yet."
                : `${Object.values(profileContent.skills).flat().length} skill${Object.values(profileContent.skills).flat().length !== 1 ? "s" : ""} added`}
            </p>
            <div className="rounded-lg border border-dashed border-muted-foreground/25 p-8 text-center">
              <Wrench className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-sm text-muted-foreground mb-2">Skills editing is coming soon.</p>
              <p className="text-xs text-muted-foreground">
                Profile-specific forms are being implemented.
              </p>
            </div>
          </div>
        );

      case "certifications":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {profileContent.certifications.length === 0
                  ? "No certifications added yet."
                  : `${profileContent.certifications.length} certification${profileContent.certifications.length !== 1 ? "s" : ""} added`}
              </p>
              <Button
                size="sm"
                onClick={certificationHandlers.handleAdd}
                disabled={certificationHandlers.isEditing}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Certification
              </Button>
            </div>
            <div className="rounded-lg border border-dashed border-muted-foreground/25 p-8 text-center">
              <Award className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                Certifications editing is coming soon.
              </p>
              <p className="text-xs text-muted-foreground">
                Profile-specific forms are being implemented.
              </p>
            </div>
          </div>
        );

      case "links":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {profileContent.links.length === 0
                  ? "No links added yet."
                  : `${profileContent.links.length} link${profileContent.links.length !== 1 ? "s" : ""} added`}
              </p>
              <Button size="sm" onClick={linkHandlers.handleAdd} disabled={linkHandlers.isEditing}>
                <Plus className="h-4 w-4 mr-2" />
                Add Link
              </Button>
            </div>
            <div className="rounded-lg border border-dashed border-muted-foreground/25 p-8 text-center">
              <LinkIcon className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-sm text-muted-foreground mb-2">Links editing is coming soon.</p>
              <p className="text-xs text-muted-foreground">
                Profile-specific forms are being implemented.
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <User className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-sm text-muted-foreground">
              Select a section from the left to start editing.
            </p>
          </div>
        );
    }
  };

  if (!openSection || !currentSection) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <User className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium mb-2">Select a Section</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Choose a section from the navigation on the left to start editing your profile
              content.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4 px-6 pt-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <SectionIcon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl">{currentSection.title}</CardTitle>
            <CardDescription className="mt-1">{currentSection.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6">{renderSectionContent()}</CardContent>
    </Card>
  );
}
