import { useState } from "react";
import { AppHeader } from "@/components/features/navigation/app-header";
import { JobInfoDialog } from "@/components/features/resume/job-info-dialog";
import { PersonalInfoDialog } from "@/components/features/resume/personal-info-dialog";
import { ResumeBuilder } from "@/components/features/resume/resume-builder";
import { ResumeDashboard } from "@/components/features/resume/resume-dashboard";
import { PageTransition } from "@/components/ui/animated";
import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useThemeStore } from "@/stores";

export default function App() {
  // Ensure the saved theme is applied on initial load
  useThemeStore();
  const [openPersonal, setOpenPersonal] = useState(false);
  const [openJob, setOpenJob] = useState(false);
  const [page, setPage] = useState<"dashboard" | "builder">("dashboard");

  return (
    <PageTransition pageKey={page} mode="wait" className="flex min-h-screen flex-col">
      {page === "dashboard" ? (
        <>
          <ResumeDashboard onResumeClick={() => setPage("builder")} />
        </>
      ) : (
        <>
          <AppHeader
            onPersonalInfoClick={() => setOpenPersonal(true)}
            onJobInfoClick={() => setOpenJob(true)}
            onBackClick={() => setPage("dashboard")}
          />
          <SidebarProvider className="mt-16 flex flex-1">
            <Sidebar side="left" collapsible="icon">
              <SidebarRail />
              <SidebarContent className="p-4 text-sm">Left Sidebar</SidebarContent>
            </Sidebar>
            <SidebarInset>
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="flex flex-1 items-start justify-center overflow-auto p-4">
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
  );
}
