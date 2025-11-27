import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRightLeft,
  CheckCircle2,
  Loader2,
  MapPin,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { PhoneInput } from "@/components/ui/phone-input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { formatLastSaved, useAutoSave } from "@/hooks/use-auto-save";
import {
  type PersonalInfoFormData,
  type PhoneFormat,
  personalInfoSchema,
  phoneFormatLabels,
  phoneFormatExamples,
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
      phoneFormat: defaultValues?.phoneFormat ?? "national",
      location: defaultValues?.location ?? "",
      summary: defaultValues?.summary ?? "",
    },
    mode: "onChange", // Validate on change for live feedback
  });

  const { save, isSaving, error, lastSaved, isFadingOut } = useAutoSave({
    resumeId,
    enabled,
    debounceMs: 600,
  });

  // Use useWatch to subscribe to form changes and trigger re-renders
  const watchedValues = useWatch({ control: form.control });

  // Handler to flip name order
  const handleFlipNameOrder = () => {
    const currentOrder = form.getValues("nameOrder");
    form.setValue(
      "nameOrder",
      currentOrder === "firstLast" ? "lastFirst" : "firstLast",
    );
  };

  // State for geolocation
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Handler to get current location
  const handleGetLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setIsGettingLocation(true);
    setLocationError(null);

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 300000, // Cache for 5 minutes
          });
        },
      );

      const { latitude, longitude } = position.coords;

      // Use OpenStreetMap's Nominatim API for reverse geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
        {
          headers: {
            "Accept-Language": "en",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to get location name");
      }

      const data = await response.json();
      const address = data.address;

      // Build a readable location string (City, State/Region, Country)
      const parts: string[] = [];
      if (
        address.city ||
        address.town ||
        address.village ||
        address.municipality
      ) {
        parts.push(
          address.city ||
            address.town ||
            address.village ||
            address.municipality,
        );
      }
      if (address.state || address.region || address.county) {
        parts.push(address.state || address.region || address.county);
      }
      if (parts.length === 0 && address.country) {
        parts.push(address.country);
      }

      const locationString = parts.join(", ") || "Unknown location";
      form.setValue("location", locationString, { shouldValidate: true });
    } catch (err) {
      if (err instanceof GeolocationPositionError) {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setLocationError("Location permission denied");
            break;
          case err.POSITION_UNAVAILABLE:
            setLocationError("Location unavailable");
            break;
          case err.TIMEOUT:
            setLocationError("Location request timed out");
            break;
          default:
            setLocationError("Failed to get location");
        }
      } else {
        setLocationError("Failed to get location");
      }
    } finally {
      setIsGettingLocation(false);
    }
  }, [form]);

  // Auto-save on form value changes
  // Saves partial data as user types - validation errors display via FormMessage
  useEffect(() => {
    if (!enabled) return;

    // Only save if we have at least some identifying data (name or email)
    const hasName = watchedValues.firstName || watchedValues.lastName;
    const hasEmail = watchedValues.email;
    if (!hasName && !hasEmail) return;

    save({
      content: {
        personalInfo: {
          firstName: watchedValues.firstName || "",
          lastName: watchedValues.lastName || "",
          nameOrder: watchedValues.nameOrder || "firstLast",
          email: watchedValues.email || "",
          phone: watchedValues.phone || "",
          phoneFormat: watchedValues.phoneFormat || "national",
          location: watchedValues.location || "",
          summary: watchedValues.summary || "",
        },
      },
    });
  }, [watchedValues, enabled, save]);

  return (
    <div className="px-3 py-2 space-y-3">
      <div className="text-muted-foreground flex items-center justify-end gap-1.5 text-[10px]">
        {isSaving && (
          <>
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Saving...</span>
          </>
        )}
        {!isSaving && lastSaved && (
          <span
            className={cn(
              "flex items-center gap-1.5 transition-opacity duration-500",
              isFadingOut ? "opacity-0" : "opacity-100",
            )}
          >
            <CheckCircle2 className="h-3 w-3 text-green-600" />
            <span>{formatLastSaved(lastSaved)}</span>
          </span>
        )}
        {error && (
          <>
            <AlertCircle className="text-destructive h-3 w-3" />
            <span>Failed to save</span>
          </>
        )}
      </div>
      <Form {...form}>
        <form className="space-y-3">
          {/* Name Fields Row */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <FormLabel className="text-[11px]">Name</FormLabel>
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
                      {watchedValues.nameOrder === "lastFirst"
                        ? "Last First"
                        : "First Last"}
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
                        placeholder={
                          watchedValues.nameOrder === "lastFirst"
                            ? "太郎"
                            : "John"
                        }
                        disabled={!enabled}
                        className="h-8 text-xs"
                      />
                    </FormControl>
                    <FormDescription className="text-[10px]">
                      {watchedValues.nameOrder === "lastFirst"
                        ? "Given name"
                        : "First name"}
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
                        placeholder={
                          watchedValues.nameOrder === "lastFirst"
                            ? "田中"
                            : "Doe"
                        }
                        disabled={!enabled}
                        className="h-8 text-xs"
                      />
                    </FormControl>
                    <FormDescription className="text-[10px]">
                      {watchedValues.nameOrder === "lastFirst"
                        ? "Family name"
                        : "Last name"}
                    </FormDescription>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-[11px]">Email</FormLabel>
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

          {/* Phone - full width for country selector + number */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-[11px]">Phone</FormLabel>
                  <FormField
                    control={form.control}
                    name="phoneFormat"
                    render={({ field: formatField }) => (
                      <select
                        value={formatField.value}
                        onChange={(e) =>
                          formatField.onChange(e.target.value as PhoneFormat)
                        }
                        disabled={!enabled}
                        className="border-input bg-muted/50 dark:bg-input/30 h-6 cursor-pointer rounded-md border px-2 text-[10px] outline-none transition-colors focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {(Object.keys(phoneFormatLabels) as PhoneFormat[]).map(
                          (format) => (
                            <option key={format} value={format}>
                              {phoneFormatLabels[format]} -{" "}
                              {phoneFormatExamples[format]}
                            </option>
                          ),
                        )}
                      </select>
                    )}
                  />
                </div>
                <FormControl>
                  <PhoneInput
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    disabled={!enabled}
                    placeholder="(555) 123-4567"
                    defaultCountry="US"
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
                <div className="flex items-center justify-between">
                  <FormLabel className="text-[11px]">Location</FormLabel>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleGetLocation}
                        disabled={!enabled || isGettingLocation}
                        className="h-6 gap-1 px-2 text-[10px]"
                      >
                        {isGettingLocation ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <MapPin className="h-3 w-3" />
                        )}
                        <span className="hidden sm:inline">
                          {isGettingLocation ? "Getting..." : "Use current"}
                        </span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="text-xs">
                        Get your current location
                        {locationError && (
                          <>
                            <br />
                            <span className="text-destructive">
                              {locationError}
                            </span>
                          </>
                        )}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
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

          {/* Summary */}
          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => {
              const charCount = field.value?.length || 0;
              const isNearLimit = charCount >= 400 && charCount <= 500;
              const isOverLimit = charCount > 500;

              return (
                <FormItem className="space-y-1">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-[11px]">
                      Professional Summary
                    </FormLabel>
                    <div className="flex items-center gap-1.5">
                      {(isNearLimit || isOverLimit) && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertTriangle
                              className={`h-3 w-3 ${
                                isOverLimit
                                  ? "text-destructive"
                                  : "text-amber-500"
                              }`}
                            />
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-[220px]">
                            <p className="text-xs">
                              {isOverLimit
                                ? "Summary exceeds 500 characters and will be truncated."
                                : "Keep it concise! Recruiters typically spend only 6-7 seconds scanning a resume. A shorter summary is more impactful."}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      <span
                        className={`text-[10px] tabular-nums ${
                          isOverLimit
                            ? "text-destructive font-medium"
                            : isNearLimit
                              ? "text-amber-500"
                              : "text-muted-foreground"
                        }`}
                      >
                        {charCount}/500
                      </span>
                    </div>
                  </div>
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
                    A brief professional summary
                  </FormDescription>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              );
            }}
          />
        </form>
      </Form>
    </div>
  );
}
