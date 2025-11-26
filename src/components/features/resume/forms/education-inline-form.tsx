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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  type CreateEducationFormData,
  createEducationSchema,
} from "@/lib/validations/education";

interface EducationInlineFormProps {
  defaultValues?: Partial<CreateEducationFormData>;
  onSubmit: (values: CreateEducationFormData) => void;
  onCancel: () => void;
  isNew?: boolean;
}

export function EducationInlineForm({
  defaultValues,
  onSubmit,
  onCancel,
  isNew = false,
}: EducationInlineFormProps) {
  const [honors, setHonors] = useState<string[]>(defaultValues?.honors || []);

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

  const isCurrent = form.watch("current");

  const handleSubmit = (values: CreateEducationFormData) => {
    const filteredHonors = honors.filter((h) => h.trim() !== "");
    onSubmit({ ...values, honors: filteredHonors });
  };

  const addHonor = () => {
    setHonors([...honors, ""]);
  };

  const removeHonor = (index: number) => {
    setHonors(honors.filter((_, i) => i !== index));
  };

  const updateHonor = (index: number, value: string) => {
    const newHonors = [...honors];
    newHonors[index] = value;
    setHonors(newHonors);
  };

  return (
    <Card className="gap-2 py-2 border-primary/50 bg-primary/5">
      <CardContent className="px-3 pt-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium text-primary">
                {isNew ? "New Education" : "Edit Education"}
              </span>
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
                    <FormLabel className="text-[10px]">Field of Study</FormLabel>
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
                      <Input type="month" className="h-7 text-[11px]" {...field} />
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
                    I currently study here
                  </FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gpa"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <FormLabel className="text-[10px]">GPA (optional)</FormLabel>
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

