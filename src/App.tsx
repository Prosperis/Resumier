import { useState } from "react"
import { AppHeader } from "@/components/features/navigation/app-header"
import { JobInfoDialog } from "@/components/features/resume/job-info-dialog"
import { PersonalInfoDialog } from "@/components/features/resume/personal-info-dialog"
import { ResumeBuilder } from "@/components/features/resume/resume-builder"
import { ResumeDashboard } from "@/components/features/resume/resume-dashboard"
import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useResumeStore, useThemeStore } from "@/stores"

export default function App() {
  // Ensure the saved theme is applied on initial load
  useThemeStore()
  const [openPersonal, setOpenPersonal] = useState(false)
  const [openJob, setOpenJob] = useState(false)
  const [page, setPage] = useState<"dashboard" | "builder">("dashboard")
  const documents = useResumeStore((s) => s.documents)
  const addDocument = useResumeStore((s) => s.addDocument)

  function handleCreateResume() {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2)
    addDocument({ id, name: `Resume ${documents.length + 1}` })
    setPage("builder")
  }

  return page === "dashboard" ? (
    <div className="min-h-screen flex flex-col">
      <h1 className="text-2xl font-bold p-4">Resumes</h1>
      <ResumeDashboard onCreateResume={handleCreateResume} />
    </div>
  ) : (
    <div className="min-h-screen flex flex-col">
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
    </div>
  )
}
