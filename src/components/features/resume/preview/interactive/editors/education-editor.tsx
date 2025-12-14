/**
 * Education Inline Editor
 * Compact editor for education entries that appears in the popover
 */

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MonthPicker } from "@/components/ui/month-picker";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import type { Education } from "@/lib/api/types";
import { type CreateEducationFormData, createEducationSchema } from "@/lib/validations/education";

interface EducationEditorProps {
  data: Education;
  onChange: (data: Partial<Education>) => void;
}

export function EducationEditor({ data, onChange }: EducationEditorProps) {
  const [honors, setHonors] = useState<string[]>(data.honors?.length ? data.honors : []);

  const form = useForm<CreateEducationFormData>({
    resolver: zodResolver(createEducationSchema),
    defaultValues: {
      institution: data.institution || "",
      degree: data.degree || "",
      field: data.field || "",
      startDate: data.startDate || "",
      endDate: data.endDate || "",
      current: data.current || false,
      gpa: data.gpa || "",
      honors: data.honors || [],
    },
    mode: "onChange",
  });

  const watchedValues = useWatch({ control: form.control });
  const isCurrent = watchedValues.current;

  // Sync changes to parent
  useEffect(() => {
    const filteredHonors = honors.filter((h) => h.trim() !== "");
    onChange({
      ...watchedValues,
      honors: filteredHonors,
    } as Partial<Education>);
  }, [watchedValues, honors, onChange]);

  const addHonor = () => {
    setHonors([...honors, ""]);
  };

  const removeHonor = (index: number) => {
    const newHonors = honors.filter((_, i) => i !== index);
    setHonors(newHonors);
  };

  const updateHonor = (index: number, value: string) => {
    const newHonors = [...honors];
    newHonors[index] = value;
    setHonors(newHonors);
  };

  return (
    <Form {...form}>
      <form className="space-y-3">
        {/* Institution */}
        <FormField
          control={form.control}
          name="institution"
          render={({ field }) => (
            <FormItem>
              <Label className="text-xs">Institution</Label>
              <FormControl>
                <Input {...field} placeholder="University of California" className="h-8 text-xs" />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* Degree & Field */}
        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="degree"
            render={({ field }) => (
              <FormItem>
                <Label className="text-xs">Degree</Label>
                <FormControl>
                  <Input {...field} placeholder="Bachelor of Science" className="h-8 text-xs" />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="field"
            render={({ field }) => (
              <FormItem>
                <Label className="text-xs">Field of Study</Label>
                <FormControl>
                  <Input {...field} placeholder="Computer Science" className="h-8 text-xs" />
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
                  <Label className="text-[10px] font-normal">Currently enrolled</Label>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* GPA */}
        <FormField
          control={form.control}
          name="gpa"
          render={({ field }) => (
            <FormItem>
              <Label className="text-xs">GPA (optional)</Label>
              <FormControl>
                <Input {...field} placeholder="3.8/4.0" className="h-8 text-xs w-24" />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* Honors */}
        <div className="space-y-1">
          <Label className="text-xs">Honors & Awards (optional)</Label>
          {honors.map((honor, index) => (
            <div key={index} className="flex gap-1">
              <Input
                placeholder="Dean's List, Magna Cum Laude..."
                value={honor}
                onChange={(e) => updateHonor(index, e.target.value)}
                className="h-7 text-xs"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0"
                onClick={() => removeHonor(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addHonor}
            className="w-full h-6 text-xs"
          >
            <Plus className="mr-1 h-3 w-3" />
            Add Honor
          </Button>
        </div>
      </form>
    </Form>
  );
}
