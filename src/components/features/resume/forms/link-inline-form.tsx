import { zodResolver } from "@hookform/resolvers/zod";
import { Check, X } from "lucide-react";
import { useForm } from "react-hook-form";
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
import {
  type CreateLinkFormData,
  createLinkSchema,
} from "@/lib/validations/links";

interface LinkInlineFormProps {
  defaultValues?: Partial<CreateLinkFormData>;
  onSubmit: (values: CreateLinkFormData) => void;
  onCancel: () => void;
  isNew?: boolean;
}

export function LinkInlineForm({
  defaultValues,
  onSubmit,
  onCancel,
  isNew = false,
}: LinkInlineFormProps) {
  const form = useForm<CreateLinkFormData>({
    resolver: zodResolver(createLinkSchema),
    defaultValues: {
      label: "",
      url: "",
      type: "other",
      ...defaultValues,
    },
  });

  const handleSubmit = (values: CreateLinkFormData) => {
    onSubmit(values);
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
                {isNew ? "New Link" : "Edit Link"}
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
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <FormLabel className="text-[10px]">Link Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-7 text-[11px]">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="portfolio" className="text-[11px]">
                        Portfolio
                      </SelectItem>
                      <SelectItem value="linkedin" className="text-[11px]">
                        LinkedIn
                      </SelectItem>
                      <SelectItem value="github" className="text-[11px]">
                        GitHub
                      </SelectItem>
                      <SelectItem value="other" className="text-[11px]">
                        Other
                      </SelectItem>
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
                    <Input
                      placeholder="My Portfolio"
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
