/**
 * Certification Inline Editor
 * Compact editor for certifications that appears in the popover
 */

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { MonthPicker } from "@/components/ui/month-picker";
import type { Certification } from "@/lib/api/types";
import {
  type CreateCertificationFormData,
  createCertificationSchema,
} from "@/lib/validations/certification";

interface CertificationEditorProps {
  data: Certification;
  onChange: (data: Partial<Certification>) => void;
}

export function CertificationEditor({
  data,
  onChange,
}: CertificationEditorProps) {
  const form = useForm<CreateCertificationFormData>({
    resolver: zodResolver(createCertificationSchema),
    defaultValues: {
      name: data.name || "",
      issuer: data.issuer || "",
      date: data.date || "",
      expiryDate: data.expiryDate || "",
      credentialId: data.credentialId || "",
      url: data.url || "",
    },
    mode: "onChange",
  });

  const watchedValues = useWatch({ control: form.control });

  // Sync changes to parent
  useEffect(() => {
    onChange(watchedValues as Partial<Certification>);
  }, [watchedValues, onChange]);

  return (
    <Form {...form}>
      <form className="space-y-3">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <Label className="text-xs">Certification Name</Label>
              <FormControl>
                <Input
                  {...field}
                  placeholder="AWS Solutions Architect"
                  className="h-8 text-xs"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* Issuer */}
        <FormField
          control={form.control}
          name="issuer"
          render={({ field }) => (
            <FormItem>
              <Label className="text-xs">Issuing Organization</Label>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Amazon Web Services"
                  className="h-8 text-xs"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* Dates */}
        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <Label className="text-xs">Issue Date</Label>
                <FormControl>
                  <MonthPicker
                    className="h-8 text-xs"
                    value={field.value}
                    onChange={field.onChange}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem>
                <Label className="text-xs">Expiry Date (optional)</Label>
                <FormControl>
                  <MonthPicker
                    className="h-8 text-xs"
                    value={field.value || ""}
                    onChange={field.onChange}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        {/* Credential ID */}
        <FormField
          control={form.control}
          name="credentialId"
          render={({ field }) => (
            <FormItem>
              <Label className="text-xs">Credential ID (optional)</Label>
              <FormControl>
                <Input
                  {...field}
                  placeholder="ABC123XYZ"
                  className="h-8 text-xs"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* URL */}
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <Label className="text-xs">Verification URL (optional)</Label>
              <FormControl>
                <Input
                  {...field}
                  type="url"
                  placeholder="https://verify.example.com/..."
                  className="h-8 text-xs"
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
