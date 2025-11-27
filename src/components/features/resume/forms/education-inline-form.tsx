import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  CheckIcon,
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
import { cn } from "@/lib/utils";
import { useAutoSave } from "@/hooks/use-auto-save";
import type { Education } from "@/lib/api/types";
import {
  type CreateEducationFormData,
  createEducationSchema,
} from "@/lib/validations/education";

interface EducationInlineFormProps {
  resumeId: string;
  editingId?: string | null;
  existingEducation: Education[];
  defaultValues?: Partial<CreateEducationFormData>;
  onClose: () => void;
  isNew?: boolean;
}

export function EducationInlineForm({
  resumeId,
  editingId,
  existingEducation,
  defaultValues,
  onClose,
  isNew = false,
}: EducationInlineFormProps) {
  const [honors, setHonors] = useState<string[]>(defaultValues?.honors || []);
  const [previousEndDate, setPreviousEndDate] = useState<string>("");
  const newIdRef = useRef<string>(crypto.randomUUID());

  const form = useForm<CreateEducationFormData>({
    resolver: zodResolver(createEducationSchema),
    defaultValues: {
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      current: false,
      gpa: "",
      honors: [],
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
    const filteredHonors = honors.filter((h) => h.trim() !== "");
    const currentData = { ...watchedValues, honors: filteredHonors };

    if (
      !currentData.institution ||
      !currentData.degree ||
      !currentData.startDate
    ) {
      return;
    }

    let updatedEducation: Education[];
    if (editingId) {
      updatedEducation = existingEducation.map((edu) =>
        edu.id === editingId ? { ...edu, ...currentData } : edu,
      );
    } else if (isNew) {
      const existingNew = existingEducation.find(
        (e) => e.id === newIdRef.current,
      );
      if (existingNew) {
        updatedEducation = existingEducation.map((edu) =>
          edu.id === newIdRef.current ? { ...edu, ...currentData } : edu,
        );
      } else {
        updatedEducation = [
          ...existingEducation,
          { id: newIdRef.current, ...currentData } as Education,
        ];
      }
    } else {
      return;
    }

    save({ content: { education: updatedEducation } });
  }, [watchedValues, honors, editingId, isNew, existingEducation, save]);

  useEffect(() => {
    triggerSave();
  }, [triggerSave]);

  const addHonor = () => setHonors([...honors, ""]);
  const removeHonor = (index: number) =>
    setHonors(honors.filter((_, i) => i !== index));
  const updateHonor = (index: number, value: string) => {
    const newHonors = [...honors];
    newHonors[index] = value;
    setHonors(newHonors);
  };

  return (
    <Card className="gap-2 py-2 border-primary/50 bg-primary/5">
      <CardContent className="px-3 pt-2">
        <Form {...form}>
          <form className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-primary">
                  {isNew ? "New Education" : "Edit Education"}
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
              name="institution"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <FormLabel className="text-[10px]">Institution</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="University of Example"
                      className="h-7 text-[11px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[9px]" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="degree"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <FormLabel className="text-[10px]">Degree</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Bachelor of Science"
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
                name="field"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <FormLabel className="text-[10px]">
                      Field of Study
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Computer Science"
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
                        I currently study here
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="gpa"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <FormLabel className="text-[10px]">GPA</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="3.8"
                      className="h-7 text-[11px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[9px]" />
                </FormItem>
              )}
            />

            {honors.length > 0 && (
              <div className="space-y-1">
                <FormLabel className="text-[10px]">Honors & Awards</FormLabel>
                {honors.map((honor, index) => (
                  <div key={index} className="flex gap-1">
                    <Input
                      placeholder="Dean's List..."
                      value={honor}
                      onChange={(e) => updateHonor(index, e.target.value)}
                      className="h-7 text-[11px]"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0"
                      onClick={() => removeHonor(index)}
                    >
                      <XIcon className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addHonor}
              className="w-full h-6 text-[10px]"
            >
              <PlusIcon className="mr-1 h-3 w-3" />
              Add Honor/Award
            </Button>

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
