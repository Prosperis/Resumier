/**
 * Experience Inline Editor
 * Compact editor for work experience that appears in the popover
 */

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X, AlignLeft, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MonthPicker } from "@/components/ui/month-picker";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Experience, ExperienceFormat } from "@/lib/api/types";
import {
  type CreateExperienceFormData,
  createExperienceSchema,
} from "@/lib/validations/experience";

interface ExperienceEditorProps {
  data: Experience;
  onChange: (data: Partial<Experience>) => void;
}

export function ExperienceEditor({ data, onChange }: ExperienceEditorProps) {
  const [highlights, setHighlights] = useState<string[]>(
    data.highlights?.length ? data.highlights : [""],
  );
  const [format, setFormat] = useState<ExperienceFormat>(data.format || "structured");

  const form = useForm<CreateExperienceFormData>({
    resolver: zodResolver(createExperienceSchema),
    defaultValues: {
      company: data.company || "",
      position: data.position || "",
      startDate: data.startDate || "",
      endDate: data.endDate || "",
      current: data.current || false,
      description: data.description || "",
      highlights: data.highlights || [],
      format: data.format || "structured",
    },
    mode: "onChange",
  });

  const watchedValues = useWatch({ control: form.control });
  const isCurrent = watchedValues.current;

  // Sync changes to parent
  useEffect(() => {
    const filteredHighlights = highlights.filter((h) => h.trim() !== "");
    onChange({
      ...watchedValues,
      highlights: filteredHighlights,
      format,
    } as Partial<Experience>);
  }, [watchedValues, highlights, format, onChange]);

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
    <Form {...form}>
      <form className="space-y-3">
        {/* Company & Position */}
        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <Label className="text-xs">Company</Label>
                <FormControl>
                  <Input {...field} placeholder="Acme Inc." className="h-8 text-xs" />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <Label className="text-xs">Position</Label>
                <FormControl>
                  <Input {...field} placeholder="Software Engineer" className="h-8 text-xs" />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <Label className="text-xs">Start Date</Label>
                <FormControl>
                  <MonthPicker
                    className="h-8 text-xs"
                    value={field.value}
                    onChange={field.onChange}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <div className="space-y-1">
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-xs">End Date</Label>
                  <FormControl>
                    <MonthPicker
                      className="h-8 text-xs"
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isCurrent}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
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
                      className="h-3 w-3 rounded-sm"
                    />
                  </FormControl>
                  <Label className="text-[10px] font-normal">Currently working here</Label>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Format Selector */}
        <div className="space-y-1">
          <Label className="text-xs">Content Format</Label>
          <div className="flex gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant={format === "structured" ? "default" : "outline"}
                  size="sm"
                  className="h-7 flex-1 text-xs gap-1"
                  onClick={() => setFormat("structured")}
                >
                  <AlignLeft className="h-3 w-3" />
                  <List className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                Paragraph + bullet highlights
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant={format === "bullets" ? "default" : "outline"}
                  size="sm"
                  className="h-7 flex-1 text-xs gap-1"
                  onClick={() => setFormat("bullets")}
                >
                  <List className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                Bullet points only
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant={format === "freeform" ? "default" : "outline"}
                  size="sm"
                  className="h-7 flex-1 text-xs gap-1"
                  onClick={() => setFormat("freeform")}
                >
                  <AlignLeft className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                Freeform text
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Structured Format */}
        {format === "structured" && (
          <>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-xs">Description</Label>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Brief overview of your role..."
                      className="text-xs min-h-[60px]"
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <div className="space-y-1">
              <Label className="text-xs">Key Highlights</Label>
              {highlights.map((highlight, index) => (
                <div key={index} className="flex gap-1">
                  <Input
                    placeholder="Achievement or responsibility..."
                    value={highlight}
                    onChange={(e) => updateHighlight(index, e.target.value)}
                    className="h-7 text-xs"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0"
                    onClick={() => removeHighlight(index)}
                    disabled={highlights.length === 1}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addHighlight}
                className="w-full h-6 text-xs"
              >
                <Plus className="mr-1 h-3 w-3" />
                Add Highlight
              </Button>
            </div>
          </>
        )}

        {/* Bullets Only Format */}
        {format === "bullets" && (
          <div className="space-y-1">
            <Label className="text-xs">Bullet Points</Label>
            {highlights.map((highlight, index) => (
              <div key={index} className="flex gap-1">
                <Input
                  placeholder="Achievement or key point..."
                  value={highlight}
                  onChange={(e) => updateHighlight(index, e.target.value)}
                  className="h-7 text-xs"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0"
                  onClick={() => removeHighlight(index)}
                  disabled={highlights.length === 1}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addHighlight}
              className="w-full h-6 text-xs"
            >
              <Plus className="mr-1 h-3 w-3" />
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
                <Label className="text-xs">Content</Label>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Describe your role, responsibilities, and achievements..."
                    className="text-xs min-h-[100px]"
                    rows={4}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        )}
      </form>
    </Form>
  );
}
