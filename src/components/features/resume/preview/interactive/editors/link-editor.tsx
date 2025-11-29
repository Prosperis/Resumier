/**
 * Link Inline Editor
 * Compact editor for links that appears in the popover
 */

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Link, LinkType } from "@/lib/api/types";
import {
  type CreateLinkFormData,
  createLinkSchema,
} from "@/lib/validations/links";

const LINK_TYPES: { value: LinkType; label: string }[] = [
  { value: "website", label: "Website" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "github", label: "GitHub" },
  { value: "twitter", label: "Twitter" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "dribbble", label: "Dribbble" },
  { value: "codepen", label: "CodePen" },
  { value: "figma", label: "Figma" },
  { value: "twitch", label: "Twitch" },
  { value: "slack", label: "Slack" },
  { value: "email", label: "Email" },
  { value: "other", label: "Other" },
];

interface LinkEditorProps {
  data: Link;
  onChange: (data: Partial<Link>) => void;
}

export function LinkEditor({ data, onChange }: LinkEditorProps) {
  const form = useForm<CreateLinkFormData>({
    resolver: zodResolver(createLinkSchema),
    defaultValues: {
      label: data.label || "",
      url: data.url || "",
      type: data.type || "website",
    },
    mode: "onChange",
  });

  const watchedValues = useWatch({ control: form.control });

  // Sync changes to parent
  useEffect(() => {
    onChange(watchedValues as Partial<Link>);
  }, [watchedValues, onChange]);

  return (
    <Form {...form}>
      <form className="space-y-3">
        {/* Link Type */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <Label className="text-xs">Type</Label>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {LINK_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* Label */}
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <Label className="text-xs">Label</Label>
              <FormControl>
                <Input
                  {...field}
                  placeholder="My Portfolio"
                  className="h-8 text-xs"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* URL */}
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <Label className="text-xs">URL</Label>
              <FormControl>
                <Input
                  {...field}
                  type="url"
                  placeholder="https://example.com"
                  className="h-8 text-xs"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
