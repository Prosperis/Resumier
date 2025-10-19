import { useNavigate } from "@tanstack/react-router"
import { Loader2, Plus } from "lucide-react"
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
import { useCreateResume } from "@/hooks/api"
import { useToast } from "@/hooks/use-toast"

interface CreateResumeDialogProps {
  trigger?: React.ReactNode
  onSuccess?: (id: string) => void
}

export function CreateResumeDialog({ trigger, onSuccess }: CreateResumeDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const navigate = useNavigate()
  const { toast } = useToast()

  const { mutate, isPending, error } = useCreateResume()

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

    mutate(
      {
        title: title.trim(),
        content: {
          personalInfo: {
            name: "",
            email: "",
            phone: "",
            location: "",
            summary: "",
          },
          experience: [],
          education: [],
          skills: {
            technical: [],
            languages: [],
            tools: [],
            soft: [],
          },
          certifications: [],
          links: [],
        },
      },
      {
        onSuccess: (data) => {
          toast({
            title: "Success",
            description: "Resume created successfully",
          })
          setOpen(false)
          setTitle("")

          if (onSuccess) {
            onSuccess(data.id)
          } else {
            // Default: navigate to edit page
            navigate({ to: "/resume/$id", params: { id: data.id } })
          }
        },
        onError: (err) => {
          toast({
            title: "Error",
            description: err.message || "Failed to create resume",
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
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Resume
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Resume</DialogTitle>
            <DialogDescription>Give your resume a title to get started</DialogDescription>
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
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Resume
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
