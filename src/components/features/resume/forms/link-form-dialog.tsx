import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { type CreateLinkFormData, createLinkSchema } from "@/lib/validations/links"

interface LinkFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: CreateLinkFormData) => void
  defaultValues?: Partial<CreateLinkFormData>
  title?: string
  description?: string
}

export function LinkFormDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  title = "Add Link",
  description = "Add a link to your portfolio, social media, or other profiles.",
}: LinkFormDialogProps) {
  const form = useForm<CreateLinkFormData>({
    resolver: zodResolver(createLinkSchema),
    defaultValues: {
      label: "",
      url: "",
      type: "other",
      ...defaultValues,
    },
  })

  const handleSubmit = (values: CreateLinkFormData) => {
    onSubmit(values)
    onOpenChange(false)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link Type</FormLabel>
                  <FormControl>
                    <Select {...field}>
                      <option value="portfolio">Portfolio</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="github">GitHub</option>
                      <option value="other">Other</option>
                    </Select>
                  </FormControl>
                  <FormDescription>Choose the type of link you're adding</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input placeholder="My Portfolio" {...field} />
                  </FormControl>
                  <FormDescription>Display name for this link</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormDescription>Full URL including https://</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
