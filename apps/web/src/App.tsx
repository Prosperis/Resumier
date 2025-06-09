import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import logo from "@/assets/logo_dark.png";

function PdfViewer() {
  return (
    <iframe
      src="/blank.pdf"
      className="h-full w-full border-0"
      title="Resume Preview"
    />
  );
}

function PersonalInfoDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Personal Information</DialogTitle>
        </DialogHeader>
        <form className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Your name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
          <Button type="submit" className="mt-2 w-full">
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function JobInfoDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Job Information</DialogTitle>
        </DialogHeader>
        <form className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="job">Job Title</Label>
            <Input id="job" placeholder="Desired role" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" placeholder="Company name" />
          </div>
          <Button type="submit" className="mt-2 w-full">
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function App() {
  const [openPersonal, setOpenPersonal] = useState(false)
  const [openJob, setOpenJob] = useState(false)

  return (
    <SidebarProvider className="min-h-screen">
      {/* Left Sidebar */}
      <Sidebar side="left" collapsible="icon">
        <SidebarRail />
        <SidebarContent className="p-4 text-sm">Left Sidebar</SidebarContent>
      </Sidebar>

      {/* Main Content Area */}
      <SidebarInset>
        <div className="flex min-h-screen flex-col">
          <header className="flex items-center justify-between gap-4 border-b p-4">
            <div className="flex items-center gap-2">
              <img src={logo} alt="Logo" className="h-8" />
            </div>
            <h1 className="flex-1 text-center text-lg font-semibold">Resume</h1>
            <nav className="flex gap-2">
              <Button variant="outline" onClick={() => setOpenPersonal(true)}>
                Personal Info
              </Button>
              <Button variant="outline" onClick={() => setOpenJob(true)}>
                Job Info
              </Button>
            </nav>
          </header>

          <div className="flex-1 overflow-hidden p-4">
            <PdfViewer />
          </div>
        </div>
      </SidebarInset>

      {/* Right Sidebar */}
      <Sidebar side="right" collapsible="icon">
        <SidebarRail />
        <SidebarContent className="p-4 text-sm">Right Sidebar</SidebarContent>
      </Sidebar>

      <PersonalInfoDialog open={openPersonal} onOpenChange={setOpenPersonal} />
      <JobInfoDialog open={openJob} onOpenChange={setOpenJob} />
    </SidebarProvider>
  );
}
