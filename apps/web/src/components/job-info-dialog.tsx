import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useResumeStore } from "@/hooks/use-resume-store"

export function JobInfoDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { jobInfo, setJobInfo } = useResumeStore()
  const typedJobInfo = jobInfo as { title?: string; company?: string }
  const [title, setTitle] = useState(typedJobInfo.title ?? "")
  const [company, setCompany] = useState(typedJobInfo.company ?? "")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setJobInfo({ title, company })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Job Information</DialogTitle>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="job">Job Title</Label>
            <Input
              id="job"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Desired role"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Company name"
            />
          </div>
          <Button type="submit" className="mt-2 w-full">
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
