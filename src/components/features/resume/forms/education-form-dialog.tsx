import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, XIcon } from "lucide-react";
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
import {
  type CreateEducationFormData,
  createEducationSchema,
} from "@/lib/validations/education";

interface EducationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CreateEducationFormData) => void;
  defaultValues?: Partial<CreateEducationFormData>;
  title?: string;
  description?: string;
}

export function EducationFormDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  title = "Add Education",
  description = "Add your education details.",
}: EducationFormDialogProps) {
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
    // Filter out empty honors
    const filteredHonors = honors.filter((h) => h.trim() !== "");
    onSubmit({ ...values, honors: filteredHonors });
    onOpenChange(false);
    form.reset();
    setHonors([]);
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
              name="institution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institution</FormLabel>
                  <FormControl>
                    <Input placeholder="University of Example" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="degree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Degree</FormLabel>
                    <FormControl>
                      <Input placeholder="Bachelor of Science" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="field"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field of Study</FormLabel>
                    <FormControl>
                      <Input placeholder="Computer Science" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="month" {...field} />
                    </FormControl>
                    <FormDescription>Format: YYYY-MM</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="month" {...field} disabled={isCurrent} />
                    </FormControl>
                    <FormDescription>
                      {isCurrent ? "Currently studying" : "Format: YYYY-MM"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="current"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        if (checked) {
                          form.setValue("endDate", "");
                        }
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>I currently study here</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gpa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GPA (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="3.8" {...field} />
                  </FormControl>
                  <FormDescription>e.g., 3.8 or 3.8/4.0</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {honors.length > 0 && (
              <div className="space-y-2">
                <FormLabel>Honors & Awards (optional)</FormLabel>
                <FormDescription>
                  Add any honors, awards, or achievements
                </FormDescription>
                {honors.map((honor, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Dean's List, Summa Cum Laude..."
                      value={honor}
                      onChange={(e) => updateHonor(index, e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeHonor(index)}
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addHonor}
              className="w-full"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Honor/Award
            </Button>

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
