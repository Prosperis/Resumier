import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowRightLeft, CheckCircle2, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
      firstName: defaultValues?.firstName ?? "",
      lastName: defaultValues?.lastName ?? "",
      nameOrder: defaultValues?.nameOrder ?? "firstLast",
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

  // Handler to flip name order
  const handleFlipNameOrder = () => {
    const currentOrder = form.getValues("nameOrder");
    form.setValue("nameOrder", currentOrder === "firstLast" ? "lastFirst" : "firstLast");
  };

  // Auto-save on form value changes
  useEffect(() => {
    if (!enabled) return;

    // Only save if we have at least some data
    if (!watchedValues.firstName && !watchedValues.lastName && !watchedValues.email) return;

    save({
      content: {
        personalInfo: {
          firstName: watchedValues.firstName || "",
          lastName: watchedValues.lastName || "",
          nameOrder: watchedValues.nameOrder || "firstLast",
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
            {/* Name Fields Row */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <FormLabel className="text-[11px]">Name *</FormLabel>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleFlipNameOrder}
                      disabled={!enabled}
                      className="h-6 gap-1 px-2 text-[10px]"
                    >
                      <ArrowRightLeft className="h-3 w-3" />
                      <span className="hidden sm:inline">
                        {watchedValues.nameOrder === "lastFirst" ? "Last First" : "First Last"}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-xs">
                      Switch name order for different languages
                      <br />
                      <span className="text-muted-foreground">
                        e.g., "John Doe" ↔ "Doe, John"
                      </span>
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {/* First Name */}
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={watchedValues.nameOrder === "lastFirst" ? "太郎" : "John"}
                          disabled={!enabled}
                          className="h-8 text-xs"
                        />
                      </FormControl>
                      <FormDescription className="text-[10px]">
                        {watchedValues.nameOrder === "lastFirst" ? "Given name" : "First name"}
                      </FormDescription>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                {/* Last Name */}
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={watchedValues.nameOrder === "lastFirst" ? "田中" : "Doe"}
                          disabled={!enabled}
                          className="h-8 text-xs"
                        />
                      </FormControl>
                      <FormDescription className="text-[10px]">
                        {watchedValues.nameOrder === "lastFirst" ? "Family name" : "Last name"}
                      </FormDescription>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
