/**
 * Profile Selector Component
 * Allows selecting a profile to link with a resume
 */

import { Link2, Unlink, User } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useProfiles } from "@/hooks/api";
import type { Profile } from "@/lib/api/profile-types";

interface ProfileSelectorProps {
  selectedProfileId?: string | null;
  onSelect: (profileId: string | null) => void;
  disabled?: boolean;
  className?: string;
}

export function ProfileSelector({
  selectedProfileId,
  onSelect,
  disabled,
  className,
}: ProfileSelectorProps) {
  const { data: profiles, isLoading } = useProfiles();

  const selectedProfile = useMemo(() => {
    if (!selectedProfileId || !profiles) return null;
    return profiles.find((p) => p.id === selectedProfileId);
  }, [selectedProfileId, profiles]);

  const handleSelect = (value: string) => {
    if (value === "none") {
      onSelect(null);
    } else {
      onSelect(value);
    }
  };

  const handleUnlink = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(null);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Select
        value={selectedProfileId || "none"}
        onValueChange={handleSelect}
        disabled={disabled || isLoading}
      >
        <SelectTrigger className="w-full">
          <div className="flex items-center gap-2">
            {selectedProfile ? (
              <>
                <Link2 className="h-4 w-4 text-primary" />
                <SelectValue>{selectedProfile.name}</SelectValue>
              </>
            ) : (
              <>
                <User className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder={isLoading ? "Loading profiles..." : "Select a profile..."} />
              </>
            )}
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">
            <span className="text-muted-foreground">No profile (standalone)</span>
          </SelectItem>
          {profiles?.map((profile) => (
            <SelectItem key={profile.id} value={profile.id}>
              <div className="flex items-center justify-between gap-4 w-full">
                <div>
                  <div className="font-medium">{profile.name}</div>
                  {profile.description && (
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {profile.description}
                    </div>
                  )}
                </div>
                <ProfileStats profile={profile} />
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Show linked profile info */}
      {selectedProfile && (
        <div className="flex items-center justify-between rounded-md border bg-muted/50 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="text-sm">
              <div className="font-medium">Linked to {selectedProfile.name}</div>
              <div className="text-xs text-muted-foreground">
                Content will be pulled from this profile
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleUnlink}
            className="text-muted-foreground hover:text-destructive"
          >
            <Unlink className="mr-1 h-4 w-4" />
            Unlink
          </Button>
        </div>
      )}
    </div>
  );
}

/**
 * Small stats display for profile preview
 */
function ProfileStats({ profile }: { profile: Profile }) {
  const stats = [];

  if (profile.content.experience.length > 0) {
    stats.push(`${profile.content.experience.length} exp`);
  }
  if (profile.content.education.length > 0) {
    stats.push(`${profile.content.education.length} edu`);
  }

  const skillCount =
    profile.content.skills.technical.length +
    profile.content.skills.languages.length +
    profile.content.skills.tools.length +
    profile.content.skills.soft.length;

  if (skillCount > 0) {
    stats.push(`${skillCount} skills`);
  }

  if (stats.length === 0) return null;

  return (
    <div className="flex gap-1">
      {stats.map((stat, i) => (
        <Badge key={i} variant="secondary" className="text-xs">
          {stat}
        </Badge>
      ))}
    </div>
  );
}
