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
    <div className="border-input bg-background ring-offset-background focus-within:ring-ring flex flex-wrap gap-2 rounded-md border px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-offset-2">
      {value.map((tag, index) => (
        <Badge key={index} variant="secondary" className="gap-1">
          {tag}
          <button
            type="button"
            onClick={() => removeTag(index)}
            className="hover:bg-secondary-foreground/20 ml-1 rounded-full"
            aria-label={`Remove ${tag}`}
          >
            <XIcon className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
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
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
        <CardDescription>
          Add your skills by category. Press Enter to add a skill, Backspace to
          remove the last one.
          {isSaving && (
            <span className="text-muted-foreground ml-2 text-xs">
              Saving...
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            <FormField
              control={form.control}
              name="technical"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technical Skills</FormLabel>
                  <FormControl>
                    <TagInput
                      value={field.value || []}
                      onChange={field.onChange}
                      placeholder="e.g., React, TypeScript, Node.js"
                    />
                  </FormControl>
                  <FormDescription>
                    Programming languages, frameworks, and technologies
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="languages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Languages</FormLabel>
                  <FormControl>
                    <TagInput
                      value={field.value || []}
                      onChange={field.onChange}
                      placeholder="e.g., English (Native), Spanish (Fluent)"
                    />
                  </FormControl>
                  <FormDescription>
                    Spoken languages and proficiency levels
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tools"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tools & Software</FormLabel>
                  <FormControl>
                    <TagInput
                      value={field.value || []}
                      onChange={field.onChange}
                      placeholder="e.g., Git, Docker, Figma"
                    />
                  </FormControl>
                  <FormDescription>
                    Development tools, software, and platforms
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="soft"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Soft Skills</FormLabel>
                  <FormControl>
                    <TagInput
                      value={field.value || []}
                      onChange={field.onChange}
                      placeholder="e.g., Leadership, Communication, Problem Solving"
                    />
                  </FormControl>
                  <FormDescription>
                    Interpersonal and professional skills
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
