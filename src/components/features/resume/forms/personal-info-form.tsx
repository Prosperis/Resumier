import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { formatLastSaved, useAutoSave } from "@/hooks/use-auto-save";
import {
  type PersonalInfoFormData,
  personalInfoSchema,
} from "@/lib/validations";

interface PersonalInfoFormProps {
  resumeId: string;
  defaultValues?: Partial<PersonalInfoFormData>;
  enabled?: boolean;
}

export function PersonalInfoForm({
  resumeId,
  defaultValues,
  enabled = true,
}: PersonalInfoFormProps) {
  const form = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      email: defaultValues?.email ?? "",
      phone: defaultValues?.phone ?? "",
      location: defaultValues?.location ?? "",
      summary: defaultValues?.summary ?? "",
    },
    mode: "onChange", // Validate on change for live feedback
  });

  const { save, isSaving, error, lastSaved } = useAutoSave({
    resumeId,
    enabled,
    debounceMs: 600,
  });

  // Use useWatch to subscribe to form changes and trigger re-renders
  const watchedValues = useWatch({ control: form.control });

  // Auto-save on form value changes
  useEffect(() => {
    if (!enabled) return;

    // Only save if we have at least some data
    if (!watchedValues.name && !watchedValues.email) return;

    save({
      content: {
        personalInfo: {
          name: watchedValues.name || "",
          email: watchedValues.email || "",
          phone: watchedValues.phone || "",
          location: watchedValues.location || "",
          summary: watchedValues.summary || "",
        },
      },
    });
  }, [watchedValues, enabled, save]);

  return (
    <Card className="gap-3 py-3">
      <CardHeader className="px-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xs">Personal Information</CardTitle>
            <CardDescription className="text-[10px]">
              Your basic contact information and professional summary
            </CardDescription>
          </div>
          <div className="text-muted-foreground flex items-center gap-1.5 text-[10px]">
            {isSaving && (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Saving...</span>
              </>
            )}
            {!isSaving && lastSaved && (
              <>
                <CheckCircle2 className="h-3 w-3 text-green-600" />
                <span>{formatLastSaved(lastSaved)}</span>
              </>
            )}
            {error && (
              <>
                <AlertCircle className="text-destructive h-3 w-3" />
                <span>Failed to save</span>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3">
        <Form {...form}>
          <form className="space-y-3">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-[11px]">Full Name *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="John Doe"
                        disabled={!enabled}
                        className="h-8 text-xs"
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-[11px]">Email *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="john@example.com"
                        disabled={!enabled}
                        className="h-8 text-xs"
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-[11px]">Phone *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        disabled={!enabled}
                        className="h-8 text-xs"
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              {/* Location */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-[11px]">Location *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="San Francisco, CA"
                        disabled={!enabled}
                        className="h-8 text-xs"
                      />
                    </FormControl>
                    <FormDescription className="text-[10px]">
                      City and state/country
                    </FormDescription>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </div>

            {/* Summary */}
            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-[11px]">
                    Professional Summary
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Brief overview of your professional background and key skills..."
                      disabled={!enabled}
                      rows={3}
                      className="text-xs"
                    />
                  </FormControl>
                  <FormDescription className="text-[10px]">
                    A brief professional summary (optional, max 500 characters)
                  </FormDescription>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
