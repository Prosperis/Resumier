import { useState } from "react"
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
import { AppHeader } from "@/components/app-header"


export default function App() {
  const [openPersonal, setOpenPersonal] = useState(false)
  const [openJob, setOpenJob] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader
        onPersonalInfoClick={() => setOpenPersonal(true)}
        onJobInfoClick={() => setOpenJob(true)}
      />
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
