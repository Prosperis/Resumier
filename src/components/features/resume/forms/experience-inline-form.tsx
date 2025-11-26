import { zodResolver } from "@hookform/resolvers/zod";
import { Check, PlusIcon, X, XIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import {
  type CreateExperienceFormData,
  createExperienceSchema,
} from "@/lib/validations/experience";

interface ExperienceInlineFormProps {
  defaultValues?: Partial<CreateExperienceFormData>;
  onSubmit: (values: CreateExperienceFormData) => void;
  onCancel: () => void;
  isNew?: boolean;
}

export function ExperienceInlineForm({
  defaultValues,
  onSubmit,
  onCancel,
  isNew = false,
}: ExperienceInlineFormProps) {
  const [highlights, setHighlights] = useState<string[]>(
    defaultValues?.highlights?.length ? defaultValues.highlights : [""],
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
      ...defaultValues,
    },
  });

  const isCurrent = form.watch("current");

  const handleSubmit = (values: CreateExperienceFormData) => {
    const filteredHighlights = highlights.filter((h) => h.trim() !== "");
    onSubmit({ ...values, highlights: filteredHighlights });
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
    <Card className="gap-2 py-2 border-primary/50 bg-primary/5">
      <CardContent className="px-3 pt-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-2"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium text-primary">
                {isNew ? "New Experience" : "Edit Experience"}
              </span>
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={onCancel}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
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

            <div className="flex justify-end gap-1 pt-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onCancel}
                className="h-6 text-[10px] px-2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="h-6 text-[10px] px-2"
                disabled={form.formState.isSubmitting}
              >
                <Check className="mr-1 h-3 w-3" />
                {form.formState.isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
