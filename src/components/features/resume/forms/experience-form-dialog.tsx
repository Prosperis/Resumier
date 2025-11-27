import { zodResolver } from "@hookform/resolvers/zod";
import { AlignLeft, CheckIcon, List, PlusIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import type { ExperienceFormat } from "@/lib/api/types";
import {
  type CreateExperienceFormData,
  createExperienceSchema,
} from "@/lib/validations/experience";

interface ExperienceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CreateExperienceFormData) => void;
  defaultValues?: Partial<CreateExperienceFormData>;
  title?: string;
  description?: string;
}

export function ExperienceFormDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  title = "Add Experience",
  description = "Add your work experience details.",
}: ExperienceFormDialogProps) {
  const [highlights, setHighlights] = useState<string[]>(
    defaultValues?.highlights || [""],
  );
  const [previousEndDate, setPreviousEndDate] = useState<string>("");
  const [format, setFormat] = useState<ExperienceFormat>(
    defaultValues?.format || "structured",
  );

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

  const isCurrent = form.watch("current");

  const handleSubmit = (values: CreateExperienceFormData) => {
    // Filter out empty highlights
    const filteredHighlights = highlights.filter((h) => h.trim() !== "");
    onSubmit({ ...values, highlights: filteredHighlights, format });
    onOpenChange(false);
    form.reset();
    setHighlights([""]);
    setFormat("structured");
  };

  const addHighlight = () => {
    setHighlights([...highlights, ""]);
  };

  const removeHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  const updateHighlight = (index: number, value: string) => {
    const newHighlights = [...highlights];
    newHighlights[index] = value;
    setHighlights(newHighlights);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Inc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input placeholder="Software Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <MonthPicker
                        value={field.value}
                        onChange={field.onChange}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormDescription>Format: YYYY-MM</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <MonthPicker
                          value={field.value}
                          onChange={field.onChange}
                          disabled={isCurrent}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormDescription>
                        {isCurrent ? "Currently working" : "Format: YYYY-MM"}
                      </FormDescription>
                      <FormMessage />
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
                          className="h-3.5 w-3.5 rounded-sm"
                          icon={<CheckIcon className="h-2.5 w-2.5" />}
                        />
                      </FormControl>
                      <FormLabel className="text-xs font-normal">
                        I currently work here
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Format Selector */}
            <div className="space-y-2">
              <FormLabel>Content Format</FormLabel>
              <div className="flex gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant={format === "structured" ? "default" : "outline"}
                      size="sm"
                      className="flex-1 gap-1.5"
                      onClick={() => setFormat("structured")}
                    >
                      <AlignLeft className="h-4 w-4" />
                      <List className="h-4 w-4" />
                      <span className="hidden sm:inline">Structured</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="font-medium">Structured</p>
                    <p className="text-muted-foreground text-xs">
                      Description paragraph + bullet highlights
                    </p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant={format === "bullets" ? "default" : "outline"}
                      size="sm"
                      className="flex-1 gap-1.5"
                      onClick={() => setFormat("bullets")}
                    >
                      <List className="h-4 w-4" />
                      <span className="hidden sm:inline">Bullets</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="font-medium">Bullets Only</p>
                    <p className="text-muted-foreground text-xs">
                      Just bullet points, no paragraph
                    </p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant={format === "freeform" ? "default" : "outline"}
                      size="sm"
                      className="flex-1 gap-1.5"
                      onClick={() => setFormat("freeform")}
                    >
                      <AlignLeft className="h-4 w-4" />
                      <span className="hidden sm:inline">Freeform</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="font-medium">Freeform</p>
                    <p className="text-muted-foreground text-xs">
                      Single text block, write freely
                    </p>
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
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief overview of your role and responsibilities..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel>Key Highlights</FormLabel>
                  <FormDescription>
                    Add bullet points for your achievements and responsibilities
                  </FormDescription>
                  {highlights.map((highlight, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="Led a team of 5 engineers..."
                        value={highlight}
                        onChange={(e) => updateHighlight(index, e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeHighlight(index)}
                        disabled={highlights.length === 1}
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addHighlight}
                    className="w-full"
                  >
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add Highlight
                  </Button>
                </div>
              </>
            )}

            {/* Bullets Only Format */}
            {format === "bullets" && (
              <div className="space-y-2">
                <FormLabel>Bullet Points</FormLabel>
                <FormDescription>
                  Add your achievements, responsibilities, and key contributions
                </FormDescription>
                {highlights.map((highlight, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Achievement, responsibility, or key point..."
                      value={highlight}
                      onChange={(e) => updateHighlight(index, e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeHighlight(index)}
                      disabled={highlights.length === 1}
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addHighlight}
                  className="w-full"
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
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
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your role, responsibilities, and achievements in your own style..."
                        className="min-h-[180px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Write freely - paragraphs, sentences, or any format you
                      prefer
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
