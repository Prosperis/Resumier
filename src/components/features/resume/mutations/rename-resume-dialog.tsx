import { Loader2, Pencil } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUpdateResume } from "@/hooks/api"
import { useToast } from "@/hooks/use-toast"

interface RenameResumeDialogProps {
  resumeId: string
  currentTitle: string
  trigger?: React.ReactNode
  onSuccess?: () => void
}

export function RenameResumeDialog({
  resumeId,
  currentTitle,
  trigger,
  onSuccess,
}: RenameResumeDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(currentTitle)
  const { toast } = useToast()

  const { mutate, isPending, error } = useUpdateResume()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a resume title",
        variant: "destructive",
      })
      return
    }

    if (title.trim() === currentTitle) {
      setOpen(false)
      return
    }

    mutate(
      {
        id: resumeId,
        data: {
          title: title.trim(),
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Resume title updated successfully",
          })
          setOpen(false)

          if (onSuccess) {
            onSuccess()
          }
        },
        onError: (err) => {
          toast({
            title: "Error",
            description: err.message || "Failed to update resume title",
            variant: "destructive",
          })
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Pencil className="mr-2 h-4 w-4" />
            Rename
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Rename Resume</DialogTitle>
            <DialogDescription>Enter a new title for your resume</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Label htmlFor="title">Resume Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Software Engineer Resume"
              disabled={isPending}
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-destructive">
                {error.message || "An error occurred"}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false)
                setTitle(currentTitle) // Reset on cancel
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
