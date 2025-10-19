import { Loader2, Trash2 } from "lucide-react"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useDeleteResume } from "@/hooks/api"
import { useToast } from "@/hooks/use-toast"

interface DeleteResumeDialogProps {
  resumeId: string
  resumeTitle: string
  trigger?: React.ReactNode
  onSuccess?: () => void
}

export function DeleteResumeDialog({
  resumeId,
  resumeTitle,
  trigger,
  onSuccess,
}: DeleteResumeDialogProps) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const { mutate, isPending } = useDeleteResume()

  const handleDelete = () => {
    mutate(resumeId, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Resume deleted successfully",
        })
        setOpen(false)

        if (onSuccess) {
          onSuccess()
        }
      },
      onError: (err) => {
        toast({
          title: "Error",
          description: err.message || "Failed to delete resume",
          variant: "destructive",
        })
      },
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger || (
          <Button variant="destructive" size="sm">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the resume{" "}
            <strong>"{resumeTitle}"</strong> from your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault()
              handleDelete()
            }}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Resume
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
