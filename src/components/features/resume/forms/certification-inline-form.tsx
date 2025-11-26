import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, X } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
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
import { useAutoSave } from "@/hooks/use-auto-save";
import type { Certification } from "@/lib/api/types";
import {
  type CreateCertificationFormData,
  createCertificationSchema,
} from "@/lib/validations/certification";

interface CertificationInlineFormProps {
  resumeId: string;
  editingId?: string | null;
  existingCertifications: Certification[];
  defaultValues?: Partial<CreateCertificationFormData>;
  onClose: () => void;
  isNew?: boolean;
}

export function CertificationInlineForm({
  resumeId,
  editingId,
  existingCertifications,
  defaultValues,
  onClose,
  isNew = false,
}: CertificationInlineFormProps) {
  const newIdRef = useRef<string>(crypto.randomUUID());

  const form = useForm<CreateCertificationFormData>({
    resolver: zodResolver(createCertificationSchema),
    defaultValues: {
      name: "",
      issuer: "",
      date: "",
      expiryDate: "",
      credentialId: "",
      url: "",
      ...defaultValues,
    },
  });

  const { save, isSaving, lastSaved } = useAutoSave({
    resumeId,
    debounceMs: 600,
  });

  // Use useWatch to properly subscribe to form changes
  const watchedValues = useWatch({ control: form.control });

  const triggerSave = useCallback(() => {
    const currentData = watchedValues;

    if (!currentData.name || !currentData.issuer || !currentData.date) {
      return;
    }

    let updatedCertifications: Certification[];
    if (editingId) {
      updatedCertifications = existingCertifications.map((cert) =>
        cert.id === editingId ? { ...cert, ...currentData } : cert,
      );
    } else if (isNew) {
      const existingNew = existingCertifications.find(
        (c) => c.id === newIdRef.current,
      );
      if (existingNew) {
        updatedCertifications = existingCertifications.map((cert) =>
          cert.id === newIdRef.current ? { ...cert, ...currentData } : cert,
        );
      } else {
        updatedCertifications = [
          ...existingCertifications,
          { id: newIdRef.current, ...currentData } as Certification,
        ];
      }
    } else {
      return;
    }

    save({ content: { certifications: updatedCertifications } });
  }, [watchedValues, editingId, isNew, existingCertifications, save]);

  useEffect(() => {
    triggerSave();
  }, [triggerSave]);

  return (
    <Card className="gap-2 py-2 border-primary/50 bg-primary/5">
      <CardContent className="px-3 pt-2">
        <Form {...form}>
          <form className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-primary">
                  {isNew ? "New Certification" : "Edit Certification"}
                </span>
                {isSaving && (
                  <span className="flex items-center gap-1 text-[9px] text-muted-foreground">
                    <Loader2 className="h-2.5 w-2.5 animate-spin" />
                    Saving...
                  </span>
                )}
                {!isSaving && lastSaved && (
                  <span className="flex items-center gap-1 text-[9px] text-green-600">
                    <CheckCircle2 className="h-2.5 w-2.5" />
                    Saved
                  </span>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                onClick={onClose}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <FormLabel className="text-[10px]">
                    Certification Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="AWS Solutions Architect"
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
              name="issuer"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <FormLabel className="text-[10px]">
                    Issuing Organization
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Amazon Web Services"
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
                name="date"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <FormLabel className="text-[10px]">Issue Date</FormLabel>
                    <FormControl>
                      <Input
                        type="month"
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
                name="expiryDate"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <FormLabel className="text-[10px]">
                      Expiry
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="month"
                        className="h-7 text-[11px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[9px]" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="credentialId"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <FormLabel className="text-[10px]">
                    Credential ID
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ABC123XYZ"
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
                      placeholder="https://credly.com/badges/..."
                      className="h-7 text-[11px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[9px]" />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                className="h-6 text-[10px] px-3"
              >
                Done
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
