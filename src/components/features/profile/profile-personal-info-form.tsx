import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRightLeft,
  CheckCircle2,
  Loader2,
  MapPin,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useUpdateProfile } from "@/hooks/api";
import {
  type PersonalInfoFormData,
  type PhoneFormat,
  personalInfoSchema,
  phoneFormatLabels,
  phoneFormatExamples,
} from "@/lib/validations";
import type { PersonalInfo } from "@/lib/api/types";

interface ProfilePersonalInfoFormProps {
  profileId: string;
  defaultValues?: Partial<PersonalInfo>;
  enabled?: boolean;
}

export function ProfilePersonalInfoForm({
  profileId,
  defaultValues,
  enabled = true,
}: ProfilePersonalInfoFormProps) {
  const form = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema) as never,
    defaultValues: {
      firstName: defaultValues?.firstName ?? "",
      lastName: defaultValues?.lastName ?? "",
      nameOrder: defaultValues?.nameOrder ?? "firstLast",
      email: defaultValues?.email ?? "",
      phone: defaultValues?.phone ?? "",
      phoneFormat: (defaultValues as { phoneFormat?: PhoneFormat })?.phoneFormat ?? "national",
      location: defaultValues?.location ?? "",
      summary: defaultValues?.summary ?? "",
    },
    mode: "onChange",
  });

  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Use useWatch to subscribe to form changes
  const watchedValues = useWatch({ control: form.control });

  // Auto-save on form value changes with debouncing
  useEffect(() => {
    if (!enabled) return;

    const hasName = watchedValues.firstName || watchedValues.lastName;
    const hasEmail = watchedValues.email;
    if (!hasName && !hasEmail) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for debounced save
    timeoutRef.current = setTimeout(() => {
      updateProfile(
        {
          id: profileId,
          data: {
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
          },
        },
        {
          onSuccess: () => {
            setLastSaved(new Date());
            setIsFadingOut(false);
            setError(null);
            setTimeout(() => {
              setIsFadingOut(true);
              setTimeout(() => {
                setLastSaved(null);
                setIsFadingOut(false);
              }, 500);
            }, 2500);
          },
          onError: (err) => {
            setError(err as Error);
          },
        },
      );
    }, 600);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [watchedValues, enabled, profileId, updateProfile]);

  // Handler to flip name order
  const handleFlipNameOrder = () => {
    const currentOrder = form.getValues("nameOrder");
    form.setValue("nameOrder", currentOrder === "firstLast" ? "lastFirst" : "firstLast");
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
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000,
        });
      });

      const { latitude, longitude } = position.coords;

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

      const parts: string[] = [];
      if (address.city || address.town || address.village || address.municipality) {
        parts.push(address.city || address.town || address.village || address.municipality);
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

  const formatLastSaved = (date: Date | null): string => {
    if (!date) return "";
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);

    if (diffSeconds < 10) return "Saved just now";
    if (diffSeconds < 60) return `Saved ${diffSeconds} seconds ago`;
    if (diffMinutes === 1) return "Saved 1 minute ago";
    if (diffMinutes < 60) return `Saved ${diffMinutes} minutes ago`;
    return `Saved at ${date.toLocaleTimeString()}`;
  };

  return (
    <div className="w-full space-y-4">
      <div className="text-muted-foreground flex items-center justify-end gap-1.5 text-[10px]">
        {isPending && (
          <>
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Saving...</span>
          </>
        )}
        {!isPending && lastSaved && (
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
                      {watchedValues.nameOrder === "lastFirst" ? "Last First" : "First Last"}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-xs">
                    Switch name order for different languages
                    <br />
                    <span className="text-muted-foreground">e.g., "John Doe" ↔ "Doe, John"</span>
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="grid grid-cols-2 gap-2">
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

          {/* Phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-[11px]">Phone</FormLabel>
                <FormControl>
                  <PhoneInput
                    {...field}
                    disabled={!enabled}
                    className="h-8 text-xs"
                    phoneFormat={watchedValues.phoneFormat}
                  />
                </FormControl>
                <FormDescription className="text-[10px]">
                  Format: {phoneFormatLabels[watchedValues.phoneFormat || "national"]} (
                  {phoneFormatExamples[watchedValues.phoneFormat || "national"]})
                </FormDescription>
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
                        <span className="hidden sm:inline">Auto</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="text-xs">Get location from your device</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="City, State, Country"
                    disabled={!enabled}
                    className="h-8 text-xs"
                  />
                </FormControl>
                {locationError && (
                  <div className="flex items-center gap-1 text-[10px] text-destructive">
                    <AlertTriangle className="h-3 w-3" />
                    <span>{locationError}</span>
                  </div>
                )}
                <FormMessage className="text-[10px]" />
              </FormItem>
            )}
          />

          {/* Summary */}
          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-[11px]">Professional Summary</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Brief professional summary or objective..."
                    disabled={!enabled}
                    rows={4}
                    className="text-xs resize-none"
                  />
                </FormControl>
                <FormDescription className="text-[10px]">
                  A brief overview of your professional background and goals
                </FormDescription>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}

