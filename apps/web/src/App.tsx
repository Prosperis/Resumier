import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarRail,
} from "@/components/ui/sidebar"
import logo from "@/assets/logo_dark.png"
import { PdfViewer } from "@/components/pdf-viewer"
import { PersonalInfoDialog } from "@/components/personal-info-dialog"
import { JobInfoDialog } from "@/components/job-info-dialog"


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
  )
}