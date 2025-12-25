import { AlertCircle, FileText, Plus, User } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { FadeIn } from "@/components/ui/animated";
import { Button } from "@/components/ui/button";
import { DashboardSkeleton } from "@/components/ui/loading-skeletons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDuplicateResume, useResumes } from "@/hooks/api";
import { useToast } from "@/hooks/use-toast";
import type { Resume } from "@/lib/api/types";
import type { Profile } from "@/lib/api/profile-types";
import { ProfileManager, CreateProfileDialog, ImportProfileDialog } from "@/components/features/profile";
import { CreateResumeDialog } from "./mutations";
import { ResumeTable } from "./resume-table";

interface ResumeDashboardProps {
  onResumeClick?: (id: string) => void;
  onEditProfile?: (profileId: string) => void;
  defaultTab?: "resumes" | "profiles";
}

export function ResumeDashboard({
  onResumeClick,
  onEditProfile,
  defaultTab = "resumes",
}: ResumeDashboardProps) {
  const { data: resumes, isLoading, error } = useResumes();
  const { mutate: duplicateResume } = useDuplicateResume();
  const { toast } = useToast();
  const { t } = useTranslation("dashboard");
  const { t: tCommon } = useTranslation("common");
  const [activeTab, setActiveTab] = useState<"resumes" | "profiles">(defaultTab);
  const [createResumeFromProfile, setCreateResumeFromProfile] = useState<Profile | null>(null);

  // Handle duplicate action
  const handleDuplicate = (resume: Resume) => {
    duplicateResume(resume, {
      onSuccess: (newResume) => {
        toast({
          title: tCommon("status.success"),
          description: t("messages.duplicateSuccess", { title: newResume.title }),
        });
      },
      onError: (err) => {
        toast({
          title: tCommon("status.error"),
          description: err instanceof Error ? err.message : t("messages.duplicateError"),
          variant: "destructive",
        });
      },
    });
  };

  // Handle creating resume from profile
  const handleCreateResumeFromProfile = (profile: Profile) => {
    setCreateResumeFromProfile(profile);
  };

  if (isLoading) {
    return (
      <FadeIn>
        <DashboardSkeleton />
      </FadeIn>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="border-destructive bg-destructive/10 rounded-lg border p-4" role="alert">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-destructive mt-0.5 h-5 w-5" aria-hidden="true" />
            <div>
              <h3 className="text-destructive font-semibold">{t("errors.loadFailed")}</h3>
              <p className="text-destructive/90 mt-1 text-sm">
                {error instanceof Error ? error.message : tCommon("errors.generic")}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <FadeIn>
      <div className="space-y-6 bg-background">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between px-4 pt-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
            <p className="text-muted-foreground mt-1 text-sm">{t("subtitle")}</p>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "resumes" | "profiles")}
          className="px-4"
        >
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="resumes" className="gap-2">
                <FileText className="h-4 w-4" />
                {t("tabs.resumes")}
                {resumes && resumes.length > 0 && (
                  <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs">
                    {resumes.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="profiles" className="gap-2">
                <User className="h-4 w-4" />
                {t("tabs.profiles")}
              </TabsTrigger>
            </TabsList>

            {/* Action buttons based on active tab */}
            <div className="flex items-center gap-2">
              {activeTab === "resumes" && (
                <CreateResumeDialog
                  onSuccess={(id) => onResumeClick?.(id)}
                  trigger={
                    <Button size="default" aria-label={t("newResume")}>
                      <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                      {t("newResume")}
                    </Button>
                  }
                />
              )}
              {activeTab === "profiles" && (
                <>
                  <ImportProfileDialog />
                  <CreateProfileDialog
                    trigger={
                      <Button size="default" aria-label={t("newProfile")}>
                        <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                        {t("newProfile")}
                      </Button>
                    }
                  />
                </>
              )}
            </div>
          </div>

          {/* Resumes Tab Content */}
          <TabsContent value="resumes" className="mt-6">
            {!resumes || resumes.length === 0 ? (
              <div className="rounded-lg border-2 border-dashed p-12 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{t("noResumes.title")}</h3>
                <p className="text-muted-foreground mb-4 max-w-md mx-auto text-sm">
                  {t("noResumes.description")}
                </p>
                <CreateResumeDialog
                  onSuccess={(id) => onResumeClick?.(id)}
                  trigger={
                    <Button aria-label={t("noResumes.cta")}>
                      <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                      {t("noResumes.cta")}
                    </Button>
                  }
                />
              </div>
            ) : (
              <ResumeTable
                resumes={resumes}
                onEdit={(resume) => onResumeClick?.(resume.id)}
                onDuplicate={handleDuplicate}
              />
            )}
          </TabsContent>

          {/* Profiles Tab Content */}
          <TabsContent value="profiles" className="mt-6">
            <ProfileManager
              onEditProfile={onEditProfile}
              onCreateResumeFromProfile={handleCreateResumeFromProfile}
            />
          </TabsContent>
        </Tabs>

        {/* Dialog for creating resume from profile */}
        {createResumeFromProfile && (
          <CreateResumeDialog
            defaultProfileId={createResumeFromProfile.id}
            onSuccess={(id) => {
              setCreateResumeFromProfile(null);
              setActiveTab("resumes");
              onResumeClick?.(id);
            }}
            trigger={<span />}
          />
        )}
      </div>
    </FadeIn>
  );
}
