import { useState } from "react"
import { AppHeader } from "@/components/features/navigation/app-header"
import { JobInfoDialog } from "@/components/features/resume/job-info-dialog"
import { PersonalInfoDialog } from "@/components/features/resume/personal-info-dialog"
import { ResumeBuilder } from "@/components/features/resume/resume-builder"
import { ResumeDashboard } from "@/components/features/resume/resume-dashboard"
import { PageTransition } from "@/components/ui/animated"
import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useThemeStore } from "@/stores"

export default function App() {
  // Ensure the saved theme is applied on initial load
  useThemeStore()
  const [openPersonal, setOpenPersonal] = useState(false)
  const [openJob, setOpenJob] = useState(false)
  const [page, setPage] = useState<"dashboard" | "builder">("dashboard")

  return (
    <PageTransition pageKey={page} mode="wait" className="min-h-screen flex flex-col">
      {page === "dashboard" ? (
        <>
          <h1 className="text-2xl font-bold p-4">Resumes</h1>
          <ResumeDashboard onResumeClick={() => setPage("builder")} />
        </>
      ) : (
        <>
          <AppHeader
            onPersonalInfoClick={() => setOpenPersonal(true)}
            onJobInfoClick={() => setOpenJob(true)}
            onBackClick={() => setPage("dashboard")}
          />
          <SidebarProvider className="flex flex-1 mt-16">
            <Sidebar side="left" collapsible="icon">
              <SidebarRail />
              <SidebarContent className="p-4 text-sm">Left Sidebar</SidebarContent>
            </Sidebar>
            <SidebarInset>
              <div className="flex flex-col flex-1 min-h-0">
                <div className="flex-1 overflow-auto p-4 flex items-start justify-center">
                  <ResumeBuilder />
                </div>
              </div>
            </SidebarInset>
            <Sidebar side="right" collapsible="icon">
              <SidebarRail />
              <SidebarContent className="p-4 text-sm">Right Sidebar</SidebarContent>
            </Sidebar>
          </SidebarProvider>
          <PersonalInfoDialog open={openPersonal} onOpenChange={setOpenPersonal} />
          <JobInfoDialog open={openJob} onOpenChange={setOpenJob} />
        </>
      )}
    </PageTransition>
  )
}
