/**
 * Personal Info Inline Editor
 * Compact editor for personal information that appears in the popover
 */

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import type { PersonalInfo } from "@/lib/api/types";
import {
  type PersonalInfoFormData,
  personalInfoSchema,
} from "@/lib/validations";

interface PersonalInfoEditorProps {
  data: PersonalInfo;
  onChange: (data: Partial<PersonalInfo>) => void;
}

export function PersonalInfoEditor({
  data,
  onChange,
}: PersonalInfoEditorProps) {
  const form = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      nameOrder: data.nameOrder || "firstLast",
      email: data.email || "",
      phone: data.phone || "",
      phoneFormat: data.phoneFormat || "national",
      location: data.location || "",
      summary: data.summary || "",
    },
    mode: "onChange",
  });

  // Sync changes to parent
  useEffect(() => {
    const subscription = form.watch((values) => {
      onChange(values as Partial<PersonalInfo>);
    });
    return () => subscription.unsubscribe();
  }, [form, onChange]);

  return (
    <Form {...form}>
      <form className="space-y-3">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <Label className="text-xs">First Name</Label>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="John"
                    className="h-8 text-xs"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <Label className="text-xs">Last Name</Label>
                <FormControl>
                  <Input {...field} placeholder="Doe" className="h-8 text-xs" />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <Label className="text-xs">Email</Label>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="john@example.com"
                  className="h-8 text-xs"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* Phone */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <Label className="text-xs">Phone</Label>
              <FormControl>
                <Input
                  {...field}
                  placeholder="(555) 123-4567"
                  className="h-8 text-xs"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* Location */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <Label className="text-xs">Location</Label>
              <FormControl>
                <Input
                  {...field}
                  placeholder="San Francisco, CA"
                  className="h-8 text-xs"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* Summary */}
        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <Label className="text-xs">Professional Summary</Label>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Brief overview of your professional background..."
                  className="text-xs min-h-[80px]"
                  rows={3}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
