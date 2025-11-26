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
  type CreateCertificationFormData,
  createCertificationSchema,
} from "@/lib/validations/certification";

interface CertificationInlineFormProps {
  defaultValues?: Partial<CreateCertificationFormData>;
  onSubmit: (values: CreateCertificationFormData) => void;
  onCancel: () => void;
  isNew?: boolean;
}

export function CertificationInlineForm({
  defaultValues,
  onSubmit,
  onCancel,
  isNew = false,
}: CertificationInlineFormProps) {
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

  const handleSubmit = (values: CreateCertificationFormData) => {
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
                {isNew ? "New Certification" : "Edit Certification"}
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
                      Expiry (optional)
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
                    Credential ID (optional)
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
                  <FormLabel className="text-[10px]">URL (optional)</FormLabel>
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
