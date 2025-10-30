import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { type PersonalInfoFormData, personalInfoSchema } from "@/lib/validations";

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
    mode: "onBlur", // Validate on blur to avoid too many validations
  });

  const { save, isSaving, error, lastSaved } = useAutoSave({
    resumeId,
    enabled,
  });

  // Handle form changes with auto-save
  const handleFieldChange = (field: keyof PersonalInfoFormData, value: string) => {
    form.setValue(field, value);

    // Only save if enabled and the field is valid
    if (!enabled) return;

    const isValid = form.formState.errors[field] === undefined;
    if (isValid) {
      // Get all current form values
      const formValues = form.getValues();

      save({
        content: {
          personalInfo: {
            name: formValues.name,
            email: formValues.email,
            phone: formValues.phone,
            location: formValues.location,
            summary: formValues.summary || "", // Provide default empty string
          },
        },
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Your basic contact information and professional summary
            </CardDescription>
          </div>
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            {isSaving && (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            )}
            {!isSaving && lastSaved && (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>{formatLastSaved(lastSaved)}</span>
              </>
            )}
            {error && (
              <>
                <AlertCircle className="text-destructive h-4 w-4" />
                <span>Failed to save</span>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="John Doe"
                        disabled={!enabled}
                        onBlur={(e) => {
                          field.onBlur();
                          handleFieldChange("name", e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="john@example.com"
                        disabled={!enabled}
                        onBlur={(e) => {
                          field.onBlur();
                          handleFieldChange("email", e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        disabled={!enabled}
                        onBlur={(e) => {
                          field.onBlur();
                          handleFieldChange("phone", e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="San Francisco, CA"
                        disabled={!enabled}
                        onBlur={(e) => {
                          field.onBlur();
                          handleFieldChange("location", e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormDescription>City and state/country</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Summary */}
            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Summary</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Brief overview of your professional background and key skills..."
                      disabled={!enabled}
                      rows={4}
                      onBlur={(e) => {
                        field.onBlur();
                        handleFieldChange("summary", e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    A brief professional summary (optional, max 500 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
