import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAutoSave } from "@/hooks/use-auto-save";
import type { Skills } from "@/lib/api/types";
import { type SkillsFormData, skillsSchema } from "@/lib/validations/skills";

interface SkillsFormProps {
  resumeId: string;
  skills?: Skills;
}

interface TagInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

function TagInput({ value = [], onChange, placeholder }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (!value.includes(inputValue.trim())) {
        onChange([...value, inputValue.trim()]);
      }
      setInputValue("");
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (indexToRemove: number) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="border-input bg-background ring-offset-background focus-within:ring-ring flex flex-wrap gap-1.5 rounded-md border px-2 py-1.5 text-xs focus-within:ring-2 focus-within:ring-offset-2">
      {value.map((tag, index) => (
        <Badge key={index} variant="secondary" className="gap-0.5 text-[10px] px-1.5 py-0.5">
          {tag}
          <button
            type="button"
            onClick={() => removeTag(index)}
            className="hover:bg-secondary-foreground/20 ml-0.5 rounded-full"
            aria-label={`Remove ${tag}`}
          >
            <XIcon className="h-2.5 w-2.5" />
          </button>
        </Badge>
      ))}
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 border-0 p-0 h-5 text-xs focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
}

export function SkillsForm({ resumeId, skills }: SkillsFormProps) {
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
    <Card className="gap-3 py-3">
      <CardHeader className="px-3">
        <CardTitle className="text-xs">Skills</CardTitle>
        <CardDescription className="text-[10px]">
          Add your skills by category. Press Enter to add a skill, Backspace to
          remove the last one.
          {isSaving && (
            <span className="text-muted-foreground ml-2 text-[10px]">
              Saving...
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-3">
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
      </CardContent>
    </Card>
  );
}
