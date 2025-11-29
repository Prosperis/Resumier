/**
 * Section Manager Component
 * Allows users to hide/show, reorder, and manage resume sections
 */

import { useState, useCallback } from "react";
import {
  Layers,
  Eye,
  EyeOff,
  GripVertical,
  ChevronUp,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import type { Resume, ResumeContent } from "@/lib/api/types";
import { useUpdateResume } from "@/hooks/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

/**
 * Section type definition
 */
export type SectionType =
  | "personalInfo"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "certifications"
  | "links";

/**
 * Section configuration with metadata
 */
interface SectionConfig {
  id: SectionType;
  label: string;
  description: string;
  required?: boolean; // Personal info is always required
}

const SECTION_CONFIGS: SectionConfig[] = [
  {
    id: "personalInfo",
    label: "Personal Info",
    description: "Name, contact details, title",
    required: true,
  },
  {
    id: "summary",
    label: "Summary",
    description: "Professional summary/objective",
  },
  {
    id: "experience",
    label: "Experience",
    description: "Work history and achievements",
  },
  {
    id: "education",
    label: "Education",
    description: "Academic background",
  },
  {
    id: "skills",
    label: "Skills",
    description: "Technical and soft skills",
  },
  {
    id: "certifications",
    label: "Certifications",
    description: "Professional certifications",
  },
  {
    id: "links",
    label: "Links",
    description: "Portfolio, social profiles",
  },
];

const DEFAULT_SECTION_ORDER: SectionType[] = [
  "personalInfo",
  "summary",
  "experience",
  "education",
  "skills",
  "certifications",
  "links",
];

/**
 * Extended resume content with section management metadata
 */
interface SectionSettings {
  hiddenSections: SectionType[];
  sectionOrder: SectionType[];
}

interface SectionManagerProps {
  resume: Resume;
}

export function SectionManager({ resume }: SectionManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: updateResume } = useUpdateResume();
  const { toast } = useToast();

  // Get section settings from resume metadata or use defaults
  const sectionSettings: SectionSettings = {
    hiddenSections:
      (resume.content as ResumeContent & { hiddenSections?: SectionType[] })
        .hiddenSections || [],
    sectionOrder:
      (resume.content as ResumeContent & { sectionOrder?: SectionType[] })
        .sectionOrder || DEFAULT_SECTION_ORDER,
  };

  const { hiddenSections, sectionOrder } = sectionSettings;

  // Ensure all sections are in the order array
  const normalizedOrder = [
    ...sectionOrder,
    ...DEFAULT_SECTION_ORDER.filter((s) => !sectionOrder.includes(s)),
  ];

  // Save section settings
  const saveSettings = useCallback(
    (newSettings: Partial<SectionSettings>) => {
      updateResume(
        {
          id: resume.id,
          data: {
            content: {
              ...resume.content,
              ...newSettings,
            },
          },
        },
        {
          onError: (error) => {
            toast({
              title: "Error",
              description: `Failed to save section settings: ${error.message}`,
              variant: "destructive",
            });
          },
        },
      );
    },
    [resume.id, resume.content, updateResume, toast],
  );

  // Toggle section visibility
  const toggleSection = useCallback(
    (sectionId: SectionType) => {
      const isHidden = hiddenSections.includes(sectionId);
      const newHiddenSections = isHidden
        ? hiddenSections.filter((s) => s !== sectionId)
        : [...hiddenSections, sectionId];

      saveSettings({ hiddenSections: newHiddenSections });
    },
    [hiddenSections, saveSettings],
  );

  // Move section up or down
  const moveSection = useCallback(
    (sectionId: SectionType, direction: "up" | "down") => {
      const currentIndex = normalizedOrder.indexOf(sectionId);
      if (currentIndex === -1) return;

      const newIndex =
        direction === "up" ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= normalizedOrder.length) return;

      const newOrder = [...normalizedOrder];
      [newOrder[currentIndex], newOrder[newIndex]] = [
        newOrder[newIndex],
        newOrder[currentIndex],
      ];

      saveSettings({ sectionOrder: newOrder });
    },
    [normalizedOrder, saveSettings],
  );

  // Reset to default order
  const resetOrder = useCallback(() => {
    saveSettings({
      sectionOrder: DEFAULT_SECTION_ORDER,
      hiddenSections: [],
    });
    toast({
      title: "Reset Complete",
      description: "Section order and visibility have been reset to defaults.",
    });
  }, [saveSettings, toast]);

  // Get section config by id
  const getSectionConfig = (id: SectionType) =>
    SECTION_CONFIGS.find((s) => s.id === id)!;

  // Count hidden sections for badge
  const hiddenCount = hiddenSections.length;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs gap-1.5"
            >
              <Layers className="h-3.5 w-3.5" />
              Sections
              {hiddenCount > 0 && (
                <Badge
                  variant="secondary"
                  className="h-4 min-w-4 px-1 text-[10px]"
                >
                  {hiddenCount} hidden
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Manage section visibility and order</p>
        </TooltipContent>
      </Tooltip>

      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-3 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-sm">Manage Sections</h4>
              <p className="text-xs text-muted-foreground">
                Hide, show, or reorder sections
              </p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={resetOrder}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Reset to default order</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="p-2 space-y-1 max-h-80 overflow-y-auto">
          {normalizedOrder.map((sectionId, index) => {
            const config = getSectionConfig(sectionId);
            const isHidden = hiddenSections.includes(sectionId);
            const isFirst = index === 0;
            const isLast = index === normalizedOrder.length - 1;

            return (
              <div
                key={sectionId}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-md transition-colors",
                  isHidden
                    ? "bg-muted/50 text-muted-foreground"
                    : "hover:bg-accent",
                )}
              >
                {/* Drag handle (visual only for now) */}
                <GripVertical className="h-4 w-4 text-muted-foreground/50 cursor-grab" />

                {/* Section info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-sm font-medium truncate",
                        isHidden && "line-through",
                      )}
                    >
                      {config.label}
                    </span>
                    {config.required && (
                      <Badge variant="outline" className="h-4 text-[10px] px-1">
                        Required
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {config.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-0.5">
                  {/* Move up */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        disabled={isFirst}
                        onClick={() => moveSection(sectionId, "up")}
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>Move up</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Move down */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        disabled={isLast}
                        onClick={() => moveSection(sectionId, "down")}
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>Move down</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Toggle visibility */}
                  {!config.required && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => toggleSection(sectionId)}
                        >
                          {isHidden ? (
                            <EyeOff className="h-3.5 w-3.5" />
                          ) : (
                            <Eye className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <p>{isHidden ? "Show section" : "Hide section"}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <Separator />

        <div className="p-2">
          <p className="text-xs text-muted-foreground text-center">
            Hidden sections won't appear in exports
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}

/**
 * Hook to get section settings from resume
 */
export function useSectionSettings(resume: Resume): SectionSettings {
  const content = resume.content as ResumeContent & {
    hiddenSections?: SectionType[];
    sectionOrder?: SectionType[];
  };

  return {
    hiddenSections: content.hiddenSections || [],
    sectionOrder: content.sectionOrder || DEFAULT_SECTION_ORDER,
  };
}

/**
 * Check if a section is visible
 */
export function isSectionVisible(
  sectionId: SectionType,
  hiddenSections: SectionType[],
): boolean {
  return !hiddenSections.includes(sectionId);
}

/**
 * Get ordered and filtered sections
 */
export function getVisibleSections(
  sectionOrder: SectionType[],
  hiddenSections: SectionType[],
): SectionType[] {
  // Ensure all sections are included
  const allSections = [
    ...sectionOrder,
    ...DEFAULT_SECTION_ORDER.filter((s) => !sectionOrder.includes(s)),
  ];

  // Filter out hidden sections
  return allSections.filter((s) => !hiddenSections.includes(s));
}
