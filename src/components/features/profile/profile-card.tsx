/**
 * Profile Card Component
 * Displays a profile summary with actions
 */

import { FileText, MoreHorizontal, Pencil, Trash2, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Profile } from "@/lib/api/profile-types";

interface ProfileCardProps {
  profile: Profile;
  linkedResumesCount?: number;
  onEdit?: (profile: Profile) => void;
  onDelete?: (profile: Profile) => void;
  onCreateResume?: (profile: Profile) => void;
}

export function ProfileCard({
  profile,
  linkedResumesCount = 0,
  onEdit,
  onDelete,
  onCreateResume,
}: ProfileCardProps) {
  const { content } = profile;
  const hasPersonalInfo = content.personalInfo.firstName || content.personalInfo.lastName;
  const experienceCount = content.experience.length;
  const educationCount = content.education.length;
  const skillsCount =
    content.skills.technical.length +
    content.skills.languages.length +
    content.skills.tools.length +
    content.skills.soft.length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="group relative transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{profile.name}</CardTitle>
              {profile.description && (
                <CardDescription className="line-clamp-1">{profile.description}</CardDescription>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(profile)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onCreateResume?.(profile)}>
                <FileText className="mr-2 h-4 w-4" />
                Create Resume from Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete?.(profile)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Personal info preview */}
        {hasPersonalInfo && (
          <p className="text-sm text-muted-foreground">
            {content.personalInfo.firstName} {content.personalInfo.lastName}
            {content.personalInfo.title && ` • ${content.personalInfo.title}`}
          </p>
        )}

        {/* Content stats */}
        <div className="flex flex-wrap gap-2">
          {experienceCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {experienceCount} Experience{experienceCount !== 1 ? "s" : ""}
            </Badge>
          )}
          {educationCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {educationCount} Education{educationCount !== 1 ? "s" : ""}
            </Badge>
          )}
          {skillsCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {skillsCount} Skill{skillsCount !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
          <span>Updated {formatDate(profile.updatedAt)}</span>
          {linkedResumesCount > 0 && (
            <Badge variant="outline" className="text-xs">
              {linkedResumesCount} Resume{linkedResumesCount !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
