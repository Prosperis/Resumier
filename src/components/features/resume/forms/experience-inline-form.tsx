import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlignLeft,
  CheckCircle2,
  CheckIcon,
  List,
  Loader2,
  PlusIcon,
  X,
  XIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { MonthPicker } from "@/components/ui/month-picker";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useAutoSave } from "@/hooks/use-auto-save";
import type { Experience, ExperienceFormat } from "@/lib/api/types";
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
  const [previousEndDate, setPreviousEndDate] = useState<string>("");
  const [format, setFormat] = useState<ExperienceFormat>(
    defaultValues?.format || "structured"
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
      format: "structured",
      ...defaultValues,
    },
  });

  const { save, isSaving, lastSaved, isFadingOut } = useAutoSave({
    resumeId,
    debounceMs: 600,
  });

  // Use useWatch to properly subscribe to form changes
  const watchedValues = useWatch({ control: form.control });
  const isCurrent = watchedValues.current;

  const triggerSave = useCallback(() => {
    const filteredHighlights = highlights.filter((h) => h.trim() !== "");
    const currentData = { ...watchedValues, highlights: filteredHighlights, format };

    // Only save if we have required fields
    if (
      !currentData.company ||
      !currentData.position ||
      !currentData.startDate
    ) {
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
  }, [watchedValues, highlights, editingId, isNew, existingExperiences, save]);

  // Auto-save on form value changes
  useEffect(() => {
    triggerSave();
  }, [triggerSave]);

  // Also trigger save when format changes
  useEffect(() => {
    triggerSave();
  }, [format, triggerSave]);

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
                      <MonthPicker
                        className="h-7 text-[11px]"
                        value={field.value}
                        onChange={field.onChange}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage className="text-[9px]" />
                  </FormItem>
                )}
              />

              <div className="space-y-1">
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="space-y-0.5">
                      <FormLabel className="text-[10px]">End Date</FormLabel>
                      <FormControl>
                        <MonthPicker
                          className="h-7 text-[11px]"
                          value={field.value}
                          onChange={field.onChange}
                          disabled={isCurrent}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage className="text-[9px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="current"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-y-0 space-x-2 ml-1">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            if (checked) {
                              setPreviousEndDate(form.getValues("endDate"));
                              form.setValue("endDate", "");
                            } else {
                              form.setValue("endDate", previousEndDate);
                            }
                          }}
                          className="h-3 w-3 rounded-sm"
                          icon={<CheckIcon className="h-2 w-2" />}
                        />
                      </FormControl>
                      <FormLabel className="text-[10px] font-normal">
                        I currently work here
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Format Selector */}
            <div className="space-y-1">
              <FormLabel className="text-[10px]">Content Format</FormLabel>
              <div className="flex gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant={format === "structured" ? "default" : "outline"}
                      size="sm"
                      className="h-7 flex-1 text-[10px] gap-1"
                      onClick={() => setFormat("structured")}
                    >
                      <AlignLeft className="h-3 w-3" />
                      <List className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    <p className="font-medium">Structured</p>
                    <p className="text-muted-foreground">Description paragraph + bullet highlights</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant={format === "bullets" ? "default" : "outline"}
                      size="sm"
                      className="h-7 flex-1 text-[10px] gap-1"
                      onClick={() => setFormat("bullets")}
                    >
                      <List className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    <p className="font-medium">Bullets Only</p>
                    <p className="text-muted-foreground">Just bullet points, no paragraph</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant={format === "freeform" ? "default" : "outline"}
                      size="sm"
                      className="h-7 flex-1 text-[10px] gap-1"
                      onClick={() => setFormat("freeform")}
                    >
                      <AlignLeft className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    <p className="font-medium">Freeform</p>
                    <p className="text-muted-foreground">Single text block, write freely</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Structured Format: Description + Highlights */}
            {format === "structured" && (
              <>
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
              </>
            )}

            {/* Bullets Only Format */}
            {format === "bullets" && (
              <div className="space-y-1">
                <FormLabel className="text-[10px]">Bullet Points</FormLabel>
                {highlights.map((highlight, index) => (
                  <div key={index} className="flex gap-1">
                    <Input
                      placeholder="Achievement, responsibility, or key point..."
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
                  Add Point
                </Button>
              </div>
            )}

            {/* Freeform Format */}
            {format === "freeform" && (
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <FormLabel className="text-[10px]">Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your role, responsibilities, and achievements in your own style..."
                        className="min-h-[120px] text-[11px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-[9px]">
                      Write freely - paragraphs, sentences, or any format you prefer
                    </FormDescription>
                    <FormMessage className="text-[9px]" />
                  </FormItem>
                )}
              />
            )}

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
