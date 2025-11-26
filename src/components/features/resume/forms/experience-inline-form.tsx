import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, PlusIcon, X, XIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAutoSave } from "@/hooks/use-auto-save";
import type { Experience } from "@/lib/api/types";
import {
  type CreateExperienceFormData,
  createExperienceSchema,
} from "@/lib/validations/experience";

interface ExperienceInlineFormProps {
  resumeId: string;
  editingId?: string | null;
  existingExperiences: Experience[];
  defaultValues?: Partial<CreateExperienceFormData>;
  onClose: () => void;
  isNew?: boolean;
}

export function ExperienceInlineForm({
  resumeId,
  editingId,
  existingExperiences,
  defaultValues,
  onClose,
  isNew = false,
}: ExperienceInlineFormProps) {
  const [highlights, setHighlights] = useState<string[]>(
    defaultValues?.highlights?.length ? defaultValues.highlights : [""],
  );
  const newIdRef = useRef<string>(crypto.randomUUID());

  const form = useForm<CreateExperienceFormData>({
    resolver: zodResolver(createExperienceSchema),
    defaultValues: {
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      highlights: [],
      ...defaultValues,
    },
  });

  const { save, isSaving, lastSaved } = useAutoSave({
    resumeId,
    debounceMs: 600,
  });

  const isCurrent = form.watch("current");

  const triggerSave = useCallback(() => {
    const values = form.getValues();
    const filteredHighlights = highlights.filter((h) => h.trim() !== "");
    const currentData = { ...values, highlights: filteredHighlights };

    // Only save if we have required fields
    if (!currentData.company || !currentData.position || !currentData.startDate) {
      return;
    }

    let updatedExperiences: Experience[];
    if (editingId) {
      updatedExperiences = existingExperiences.map((exp) =>
        exp.id === editingId ? { ...exp, ...currentData } : exp,
      );
    } else if (isNew) {
      const existingNew = existingExperiences.find(
        (e) => e.id === newIdRef.current,
      );
      if (existingNew) {
        updatedExperiences = existingExperiences.map((exp) =>
          exp.id === newIdRef.current ? { ...exp, ...currentData } : exp,
        );
      } else {
        updatedExperiences = [
          ...existingExperiences,
          { id: newIdRef.current, ...currentData } as Experience,
        ];
      }
    } else {
      return;
    }

    save({ content: { experience: updatedExperiences } });
  }, [form, highlights, editingId, isNew, existingExperiences, save]);

  // Auto-save on form value changes
  const watchedValues = form.watch();
  useEffect(() => {
    triggerSave();
  }, [watchedValues, highlights, triggerSave]);

  const addHighlight = () => {
    setHighlights([...highlights, ""]);
  };

  const removeHighlight = (index: number) => {
    const newHighlights = highlights.filter((_, i) => i !== index);
    setHighlights(newHighlights);
  };

  const updateHighlight = (index: number, value: string) => {
    const newHighlights = [...highlights];
    newHighlights[index] = value;
    setHighlights(newHighlights);
  };

  return (
    <Card className="gap-2 py-2 border-primary/50 bg-primary/5">
      <CardContent className="px-3 pt-2">
        <Form {...form}>
          <form className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-primary">
                  {isNew ? "New Experience" : "Edit Experience"}
                </span>
                {isSaving && (
                  <span className="flex items-center gap-1 text-[9px] text-muted-foreground">
                    <Loader2 className="h-2.5 w-2.5 animate-spin" />
                    Saving...
                  </span>
                )}
                {!isSaving && lastSaved && (
                  <span className="flex items-center gap-1 text-[9px] text-green-600">
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

            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <FormLabel className="text-[10px]">Company</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Acme Inc."
                        className="h-7 text-[11px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[9px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <FormLabel className="text-[10px]">Position</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Software Engineer"
                        className="h-7 text-[11px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[9px]" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <FormLabel className="text-[10px]">Start Date</FormLabel>
                    <FormControl>
                      <Input
                        type="month"
                        className="h-7 text-[11px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[9px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <FormLabel className="text-[10px]">End Date</FormLabel>
                    <FormControl>
                      <Input
                        type="month"
                        className="h-7 text-[11px]"
                        {...field}
                        disabled={isCurrent}
                      />
                    </FormControl>
                    <FormMessage className="text-[9px]" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="current"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-y-0 space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        if (checked) {
                          form.setValue("endDate", "");
                        }
                      }}
                      className="h-3 w-3"
                    />
                  </FormControl>
                  <FormLabel className="text-[10px] font-normal">
                    I currently work here
                  </FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <FormLabel className="text-[10px]">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief overview of your role..."
                      className="min-h-[50px] text-[11px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[9px]" />
                </FormItem>
              )}
            />

            <div className="space-y-1">
              <FormLabel className="text-[10px]">Key Highlights</FormLabel>
              {highlights.map((highlight, index) => (
                <div key={index} className="flex gap-1">
                  <Input
                    placeholder="Achievement or responsibility..."
                    value={highlight}
                    onChange={(e) => updateHighlight(index, e.target.value)}
                    className="h-7 text-[11px]"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0"
                    onClick={() => removeHighlight(index)}
                    disabled={highlights.length === 1}
                  >
                    <XIcon className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addHighlight}
                className="w-full h-6 text-[10px]"
              >
                <PlusIcon className="mr-1 h-3 w-3" />
                Add Highlight
              </Button>
            </div>

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
