import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, XIcon, Sliders } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAutoSave } from "@/hooks/use-auto-save";
import type { Skills, SkillWithLevel } from "@/lib/api/types";
import { type SkillsFormData, skillsSchema } from "@/lib/validations/skills";

const DEFAULT_SKILL_MAX_LENGTH = 30;
const DEFAULT_SKILL_LEVEL = 8;

interface SkillsFormProps {
  resumeId: string;
  skills?: Skills;
}

// Helper to get skill name from string or SkillWithLevel
function getSkillName(skill: string | SkillWithLevel): string {
  return typeof skill === "string" ? skill : skill.name;
}

// Helper to get skill level (default if not specified)
function getSkillLevel(skill: string | SkillWithLevel): number {
  if (typeof skill === "string") return DEFAULT_SKILL_LEVEL;
  return skill.level;
}

interface TagInputProps {
  value: (string | SkillWithLevel)[];
  onChange: (value: (string | SkillWithLevel)[]) => void;
  placeholder?: string;
  maxLength?: number;
  enforceLengthLimit?: boolean;
  showLevels?: boolean;
}

function TagInput({
  value = [],
  onChange,
  placeholder,
  maxLength = DEFAULT_SKILL_MAX_LENGTH,
  enforceLengthLimit = true,
  showLevels = false,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      const trimmedValue = inputValue.trim();
      const existingNames = value.map(getSkillName);
      if (!existingNames.includes(trimmedValue)) {
        // Add as SkillWithLevel if showLevels is enabled
        const newSkill: string | SkillWithLevel = showLevels
          ? { name: trimmedValue, level: DEFAULT_SKILL_LEVEL }
          : trimmedValue;
        onChange([...value, newSkill]);
      }
      setInputValue("");
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (enforceLengthLimit) {
      if (newValue.length > maxLength) {
        if (newValue.length >= inputValue.length) {
          return;
        }
      }
    }
    setInputValue(newValue);
  };

  const removeTag = (indexToRemove: number) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  const updateSkillLevel = (index: number, level: number) => {
    const newValue = [...value];
    const skill = newValue[index];
    const skillName = getSkillName(skill);
    newValue[index] = { name: skillName, level };
    onChange(newValue);
  };

  const isNearLimit = enforceLengthLimit && inputValue.length >= maxLength - 5;
  const isAtLimit = enforceLengthLimit && inputValue.length >= maxLength;

  return (
    <div className="space-y-1">
      <div className="border-input bg-background ring-offset-background focus-within:ring-ring flex flex-wrap gap-1.5 rounded-md border px-2 py-1.5 text-xs focus-within:ring-2 focus-within:ring-offset-2">
        {value.map((skill, index) => {
          const skillName = getSkillName(skill);
          const skillLevel = getSkillLevel(skill);

          return (
            <Popover key={index}>
              <PopoverTrigger asChild>
                <Badge
                  variant="secondary"
                  className="gap-0.5 text-[10px] px-1.5 py-0.5 max-w-full cursor-pointer hover:bg-secondary/80"
                >
                  <span className="truncate">{skillName}</span>
                  {showLevels && (
                    <span className="text-[8px] text-muted-foreground ml-0.5">
                      ({skillLevel})
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTag(index);
                    }}
                    className="hover:bg-secondary-foreground/20 ml-0.5 rounded-full shrink-0"
                    aria-label={`Remove ${skillName}`}
                  >
                    <XIcon className="h-2.5 w-2.5" />
                  </button>
                </Badge>
              </PopoverTrigger>
              {showLevels && (
                <PopoverContent className="w-56 p-3" align="start">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">{skillName}</span>
                      <span className="text-xs text-muted-foreground">
                        Level: {skillLevel}/10
                      </span>
                    </div>
                    <Slider
                      value={[skillLevel]}
                      onValueChange={(values: number[]) =>
                        updateSkillLevel(index, values[0])
                      }
                      min={1}
                      max={10}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-[9px] text-muted-foreground">
                      <span>Beginner</span>
                      <span>Expert</span>
                    </div>
                  </div>
                </PopoverContent>
              )}
            </Popover>
          );
        })}
        <input
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] border-0 p-0 h-5 text-xs bg-transparent outline-none placeholder:text-muted-foreground"
        />
      </div>
      {enforceLengthLimit && inputValue.length > 0 && (
        <div
          className={`text-[9px] text-right transition-colors ${
            isAtLimit
              ? "text-destructive"
              : isNearLimit
                ? "text-amber-500"
                : "text-muted-foreground"
          }`}
        >
          {inputValue.length}/{maxLength}
        </div>
      )}
    </div>
  );
}

export function SkillsForm({ resumeId, skills }: SkillsFormProps) {
  const [enforceLengthLimit, setEnforceLengthLimit] = useState(true);
  const [showSkillLevels, setShowSkillLevels] = useState(false);

  const form = useForm<SkillsFormData>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      technical: skills?.technical || [],
      languages: skills?.languages || [],
      tools: skills?.tools || [],
      soft: skills?.soft || [],
    },
  });

  const { save, isSaving } = useAutoSave({
    resumeId,
    enabled: form.formState.isDirty,
  });

  // Auto-save on form changes
  const watchedValues = form.watch();
  useEffect(() => {
    if (form.formState.isDirty) {
      save({
        content: {
          skills: {
            technical: watchedValues.technical || [],
            languages: watchedValues.languages || [],
            tools: watchedValues.tools || [],
            soft: watchedValues.soft || [],
          },
        },
      });
    }
  }, [watchedValues, form.formState.isDirty, save]);

  return (
    <div className="px-3 py-2 space-y-3">
      <p className="text-[10px] text-muted-foreground">
        Press Enter to add a skill, Backspace to remove the last one.
        {showSkillLevels && " Click a skill to set its proficiency level."}
        {isSaving && <span className="ml-2">Saving...</span>}
      </p>
      <Form {...form}>
        <form className="space-y-3">
          <FormField
            control={form.control}
            name="technical"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-[11px]">Technical Skills</FormLabel>
                <FormControl>
                  <TagInput
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder="e.g., React, TypeScript, Node.js"
                    enforceLengthLimit={enforceLengthLimit}
                    showLevels={showSkillLevels}
                  />
                </FormControl>
                <FormDescription className="text-[10px]">
                  Programming languages, frameworks, and technologies
                </FormDescription>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="languages"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-[11px]">Languages</FormLabel>
                <FormControl>
                  <TagInput
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder="e.g., English (Native), Spanish (Fluent)"
                    enforceLengthLimit={enforceLengthLimit}
                    showLevels={showSkillLevels}
                  />
                </FormControl>
                <FormDescription className="text-[10px]">
                  Spoken languages and proficiency levels
                </FormDescription>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tools"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-[11px]">Tools & Software</FormLabel>
                <FormControl>
                  <TagInput
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder="e.g., Git, Docker, Figma"
                    enforceLengthLimit={enforceLengthLimit}
                    showLevels={showSkillLevels}
                  />
                </FormControl>
                <FormDescription className="text-[10px]">
                  Development tools, software, and platforms
                </FormDescription>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="soft"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-[11px]">Soft Skills</FormLabel>
                <FormControl>
                  <TagInput
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder="e.g., Leadership, Communication, Problem Solving"
                    enforceLengthLimit={enforceLengthLimit}
                    showLevels={showSkillLevels}
                  />
                </FormControl>
                <FormDescription className="text-[10px]">
                  Interpersonal and professional skills
                </FormDescription>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )}
          />
        </form>
      </Form>

      {/* Settings Toggles */}
      <div className="flex flex-col gap-2 pt-2 border-t">
        {/* Skill Levels Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="h-3.5 w-3.5 text-muted-foreground" />
            <label
              htmlFor="skill-levels-toggle"
              className="text-xs text-muted-foreground cursor-pointer select-none"
            >
              Enable skill proficiency levels
            </label>
          </div>
          <Switch
            id="skill-levels-toggle"
            checked={showSkillLevels}
            onCheckedChange={setShowSkillLevels}
            className="scale-75 origin-right"
          />
        </div>

        {/* Length Limit Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!enforceLengthLimit && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-[200px] text-xs">
                  <p>
                    Long skills may overflow or break the layout in some resume
                    templates.
                  </p>
                </TooltipContent>
              </Tooltip>
            )}
            <label
              htmlFor="length-limit-toggle"
              className="text-xs text-muted-foreground cursor-pointer select-none"
            >
              Limit skill length ({DEFAULT_SKILL_MAX_LENGTH} chars)
            </label>
          </div>
          <Switch
            id="length-limit-toggle"
            checked={enforceLengthLimit}
            onCheckedChange={setEnforceLengthLimit}
            className="scale-75 origin-right"
          />
        </div>
      </div>
    </div>
  );
}
