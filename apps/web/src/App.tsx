import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarRail,
} from "@/components/ui/sidebar"
import { ResumeBuilder } from "@/components/resume-builder"
import { PersonalInfoDialog } from "@/components/personal-info-dialog"
import { JobInfoDialog } from "@/components/job-info-dialog"
import { ThemeToggle } from "@/components/theme-toggle"


export default function App() {
  const [openPersonal, setOpenPersonal] = useState(false)
  const [openJob, setOpenJob] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between gap-4 border-b p-4 z-20">
        <div className="flex items-center gap-2">
          <img src="/logo_dark.png" alt="Logo" className="h-8" />
        </div>
        <h1 className="flex-1 text-center text-lg font-semibold">Resume</h1>
        <nav className="flex gap-2">
          <Button variant="outline" onClick={() => setOpenPersonal(true)}>
            Personal Info
          </Button>
          <Button variant="outline" onClick={() => setOpenJob(true)}>
            Job Info
          </Button>
          <ThemeToggle />
        </nav>
      </header>
      <SidebarProvider className="flex flex-1 mt-16">
      {/* Left Sidebar */}
      <Sidebar side="left" collapsible="icon">
        <SidebarRail />
        <SidebarContent className="p-4 text-sm">Left Sidebar</SidebarContent>
      </Sidebar>

      {/* Main Content Area */}
      <SidebarInset>
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-auto p-4 flex items-start justify-center">
            <ResumeBuilder />
          </div>
        </div>
      </SidebarInset>

      {/* Right Sidebar */}
        <Sidebar side="right" collapsible="icon">
          <SidebarRail />
          <SidebarContent className="p-4 text-sm">Right Sidebar</SidebarContent>
        </Sidebar>
      </SidebarProvider>
      <PersonalInfoDialog open={openPersonal} onOpenChange={setOpenPersonal} />
      <JobInfoDialog open={openJob} onOpenChange={setOpenJob} />
    </div>
  )
}
