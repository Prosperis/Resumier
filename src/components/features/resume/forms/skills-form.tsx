import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
import { useAutoSave } from "@/hooks/use-auto-save";
import type { Skills } from "@/lib/api/types";
import { type SkillsFormData, skillsSchema } from "@/lib/validations/skills";

const DEFAULT_SKILL_MAX_LENGTH = 30;

interface SkillsFormProps {
  resumeId: string;
  skills?: Skills;
}

interface TagInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  maxLength?: number;
  enforceLengthLimit?: boolean;
}

function TagInput({
  value = [],
  onChange,
  placeholder,
  maxLength = DEFAULT_SKILL_MAX_LENGTH,
  enforceLengthLimit = true,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      const trimmedValue = inputValue.trim();
      if (!value.includes(trimmedValue)) {
        onChange([...value, trimmedValue]);
      }
      setInputValue("");
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (enforceLengthLimit) {
      // If we are over the limit
      if (newValue.length > maxLength) {
        // If we are growing (adding chars) or staying same length, reject.
        // Only allow if we are strictly shrinking (deleting).
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

  const isNearLimit = enforceLengthLimit && inputValue.length >= maxLength - 5;
  const isAtLimit = enforceLengthLimit && inputValue.length >= maxLength;

  return (
    <div className="space-y-1">
      <div className="border-input bg-background ring-offset-background focus-within:ring-ring flex flex-wrap gap-1.5 rounded-md border px-2 py-1.5 text-xs focus-within:ring-2 focus-within:ring-offset-2">
        {value.map((tag, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="gap-0.5 text-[10px] px-1.5 py-0.5 max-w-full"
          >
            <span className="truncate">{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="hover:bg-secondary-foreground/20 ml-0.5 rounded-full shrink-0"
              aria-label={`Remove ${tag}`}
            >
              <XIcon className="h-2.5 w-2.5" />
            </button>
          </Badge>
        ))}
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

      {/* Length Limit Toggle */}
      <div className="flex items-center justify-end gap-3 pt-2 border-t">
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
