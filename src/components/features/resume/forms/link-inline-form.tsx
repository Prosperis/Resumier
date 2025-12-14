import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, X } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useAutoSave } from "@/hooks/use-auto-save";
import type { Link, LinkType } from "@/lib/api/types";
import {
  type CreateLinkFormData,
  createLinkSchema,
  linkTypeLabels,
  linkTypeSchema,
} from "@/lib/validations/links";
import { getLinkIcon } from "@/components/features/resume/preview/templates/shared/contact-info";

interface LinkInlineFormProps {
  resumeId: string;
  editingId?: string | null;
  existingLinks: Link[];
  defaultValues?: Partial<CreateLinkFormData>;
  onClose: () => void;
  isNew?: boolean;
}

export function LinkInlineForm({
  resumeId,
  editingId,
  existingLinks,
  defaultValues,
  onClose,
  isNew = false,
}: LinkInlineFormProps) {
  const newIdRef = useRef<string>(crypto.randomUUID());

  const form = useForm<CreateLinkFormData>({
    resolver: zodResolver(createLinkSchema),
    defaultValues: {
      label: "",
      url: "",
      type: "website",
      ...defaultValues,
    },
  });

  const { save, isSaving, lastSaved, isFadingOut } = useAutoSave({
    resumeId,
    debounceMs: 600,
  });

  // Use useWatch to properly subscribe to form changes
  const watchedValues = useWatch({ control: form.control });

  const triggerSave = useCallback(() => {
    const currentData = watchedValues;

    if (!currentData.label || !currentData.url) {
      return;
    }

    let updatedLinks: Link[];
    if (editingId) {
      updatedLinks = existingLinks.map((link) =>
        link.id === editingId ? { ...link, ...currentData } : link,
      );
    } else if (isNew) {
      const existingNew = existingLinks.find((l) => l.id === newIdRef.current);
      if (existingNew) {
        updatedLinks = existingLinks.map((link) =>
          link.id === newIdRef.current ? { ...link, ...currentData } : link,
        );
      } else {
        updatedLinks = [...existingLinks, { id: newIdRef.current, ...currentData } as Link];
      }
    } else {
      return;
    }

    save({ content: { links: updatedLinks } });
  }, [watchedValues, editingId, isNew, existingLinks, save]);

  useEffect(() => {
    triggerSave();
  }, [triggerSave]);

  return (
    <Card className="gap-2 py-2 border-primary/50 bg-primary/5">
      <CardContent className="px-3 pt-2">
        <Form {...form}>
          <form className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-primary">
                  {isNew ? "New Link" : "Edit Link"}
                </span>
                {isSaving && (
                  <span className="flex items-center gap-1 text-[9px] text-muted-foreground">
                    <Loader2 className="h-2.5 w-2.5 animate-spin" />
                    Saving...
                  </span>
                )}
                {!isSaving && lastSaved && (
                  <span
                    className={cn(
                      "flex items-center gap-1 text-[9px] text-green-600 transition-opacity duration-500",
                      isFadingOut ? "opacity-0" : "opacity-100",
                    )}
                  >
                    <CheckCircle2 className="h-2.5 w-2.5" />
                    Saved
                  </span>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                onClick={onClose}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <FormLabel className="text-[10px]">Link Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-7 text-[11px]">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-60">
                      {linkTypeSchema.options.map((type) => (
                        <SelectItem key={type} value={type} className="text-[11px]">
                          <span className="flex items-center gap-2">
                            {getLinkIcon(type as LinkType, true, "h-3.5 w-3.5")}
                            {linkTypeLabels[type]}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[9px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <FormLabel className="text-[10px]">Label</FormLabel>
                  <FormControl>
                    <Input placeholder="My Portfolio" className="h-7 text-[11px]" {...field} />
                  </FormControl>
                  <FormMessage className="text-[9px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <FormLabel className="text-[10px]">URL</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com"
                      className="h-7 text-[11px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[9px]" />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                className="h-6 text-[10px] px-3"
              >
                Done
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
