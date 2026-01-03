/**
 * Profile Selector Component
 * Allows selecting a profile to link with a resume
 */

import { Link2, Unlink, User } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
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
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {selectedProfile ? (
              <>
                <Link2 className="h-4 w-4 text-primary shrink-0" />
                <span className="truncate">{selectedProfile.name}</span>
                <ProfileStatsCompact profile={selectedProfile} />
              </>
            ) : (
              <>
                <User className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">
                  {isLoading ? "Loading profiles..." : "Select a profile..."}
                </span>
              </>
            )}
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none" textValue="No profile (standalone)">
            <span className="text-muted-foreground">No profile (standalone)</span>
          </SelectItem>
          {profiles?.map((profile) => (
            <SelectItem key={profile.id} value={profile.id} textValue={profile.name}>
              <div className="flex items-center justify-between gap-4 w-full">
                <div className="min-w-0">
                  <div className="font-medium truncate">{profile.name}</div>
                  {profile.description && (
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {profile.description}
                    </div>
                  )}
                </div>
                <ProfileStatsFull profile={profile} />
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
 * Get profile stats as an array
 */
function getProfileStats(profile: Profile) {
  const stats = [];

  if (profile.content.experience.length > 0) {
    stats.push({ label: "exp", count: profile.content.experience.length });
  }
  if (profile.content.education.length > 0) {
    stats.push({ label: "edu", count: profile.content.education.length });
  }

  const skillCount =
    profile.content.skills.technical.length +
    profile.content.skills.tools.length +
    profile.content.skills.soft.length;

  if (skillCount > 0) {
    stats.push({ label: "skills", count: skillCount });
  }

  const langCount = profile.content.skills.languages.length;
  if (langCount > 0) {
    stats.push({ label: "lang", count: langCount });
  }

  const certCount = profile.content.certifications?.length || 0;
  if (certCount > 0) {
    stats.push({ label: "certs", count: certCount });
  }

  const linkCount = profile.content.links?.length || 0;
  if (linkCount > 0) {
    stats.push({ label: "links", count: linkCount });
  }

  return stats;
}

/**
 * Compact stats display for selected profile (shows total items)
 */
function ProfileStatsCompact({ profile }: { profile: Profile }) {
  const stats = getProfileStats(profile);
  const totalItems = stats.reduce((sum, s) => sum + s.count, 0);

  if (totalItems === 0) return null;

  return (
    <Badge variant="secondary" className="text-xs shrink-0">
      {totalItems} items
    </Badge>
  );
}

/**
 * Full stats display for dropdown options
 */
function ProfileStatsFull({ profile }: { profile: Profile }) {
  const stats = getProfileStats(profile);

  if (stats.length === 0) return null;

  // Show first 3 stats inline
  const visibleStats = stats.slice(0, 3);
  const moreCount = stats.length - 3;

  return (
    <div className="flex gap-1 shrink-0">
      {visibleStats.map((stat, i) => (
        <Badge key={i} variant="secondary" className="text-xs">
          {stat.count} {stat.label}
        </Badge>
      ))}
      {moreCount > 0 && (
        <Badge variant="outline" className="text-xs">
          +{moreCount}
        </Badge>
      )}
    </div>
  );
}
