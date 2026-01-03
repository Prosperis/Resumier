import { createLazyFileRoute, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Cloud, Folder, LogOut, RotateCcw, Trash2 } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

import { useTheme } from "@/app/theme-provider";
import { queryClient } from "@/app/query-client";
import { DemoModeInfo } from "@/components/features/demo";
import { FolderPickerDialog } from "@/components/features/cloud-storage/folder-picker-dialog";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { clearAllLocalStorage } from "@/lib/utils/guest-storage";
import { useAuthStore, useSettingsStore } from "@/stores";
import { useCloudStorageStore } from "@/stores/cloud-storage-store";

export const Route = createLazyFileRoute("/settings")({
  component: SettingsComponent,
});

function SettingsComponent() {
  const router = useRouter();
  const { settings, updateSettings, resetSettings } = useSettingsStore();
  const { user, isGuest, isDemo } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation("settings");
  const { t: tCommon } = useTranslation("common");
  const { toast } = useToast();
  const [isClearingStorage, setIsClearingStorage] = React.useState(false);

  // Cloud storage state
  const cloudSettings = useCloudStorageStore((state) => state.settings);
  const cloudUserInfo = useCloudStorageStore((state) => state.userInfo);
  const isCloudAuthenticated = useCloudStorageStore((state) => state.isAuthenticated);
  const startAuth = useCloudStorageStore((state) => state.startAuth);
  const signOut = useCloudStorageStore((state) => state.signOut);
  const openFolderPicker = useCloudStorageStore((state) => state.openFolderPicker);
  const updateCloudSettings = useCloudStorageStore((state) => state.updateSettings);
  const syncFromAuthStore = useCloudStorageStore((state) => state.syncFromAuthStore);

  // Sync cloud storage state from auth store on mount
  React.useEffect(() => {
    syncFromAuthStore();
  }, [syncFromAuthStore]);

  const handleThemeChange = (value: "light" | "dark" | "system") => {
    // Update both the theme provider and settings store
    setTheme(value);
    updateSettings({ theme: value });
  };

  const handleResetSettings = () => {
    if (window.confirm(tCommon("confirmation.deleteMessage"))) {
      resetSettings();
      // Also reset theme to system default
      setTheme("system");
    }
  };

  const handleGoBack = () => {
    // Use router history to go back to the previous page
    router.history.back();
  };

  const handleClearLocalStorage = async () => {
    setIsClearingStorage(true);
    try {
      // Clear all localStorage data
      await clearAllLocalStorage();

      // Invalidate all React Query cache
      queryClient.clear();

      // Show success toast
      toast({
        title: "Local Storage Cleared",
        description: "All local data has been cleared. You will be redirected to the home page.",
      });

      // Redirect to home page after a short delay
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (error) {
      console.error("Failed to clear localStorage:", error);
      toast({
        title: "Error",
        description: "Failed to clear local storage. Please try again.",
        variant: "destructive",
      });
      setIsClearingStorage(false);
    }
  };

  // Get account status text
  const getAccountStatus = () => {
    if (isDemo) return t("sections.account.demoMode");
    if (isGuest) return t("sections.account.guestUser");
    return t("sections.account.authenticated");
  };

  const getAccountDescription = () => {
    if (isGuest) return t("sections.account.guestMode");
    return t("sections.account.loggedInAs", { email: user?.email || "User" });
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="container mx-auto max-w-4xl p-4 md:p-8">
        <div className="mb-8">
          <div className="mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoBack}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              {tCommon("actions.back")}
            </Button>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="space-y-6">
          {/* Account Section */}
          <Card>
            <CardHeader>
              <CardTitle>{t("sections.account.title")}</CardTitle>
              <CardDescription>{getAccountDescription()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t("sections.account.status")}</Label>
                  <p className="text-sm text-muted-foreground">{getAccountStatus()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Demo Mode Section */}
          {(isGuest || isDemo) && <DemoModeInfo />}

          {/* Cloud Storage Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5" />
                Cloud Storage
              </CardTitle>
              <CardDescription>Sync your resumes across devices with cloud storage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isCloudAuthenticated ? (
                <>
                  {/* Connected account info */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      {cloudUserInfo?.picture ? (
                        <img
                          src={cloudUserInfo.picture}
                          alt={cloudUserInfo.name}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Cloud className="h-5 w-5 text-primary" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-sm">
                          {cloudUserInfo?.name || "Google Drive"}
                        </p>
                        <p className="text-xs text-muted-foreground">{cloudUserInfo?.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={signOut}
                      className="text-destructive hover:text-destructive"
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      Disconnect
                    </Button>
                  </div>

                  {/* Storage folder */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Storage Folder</Label>
                      <p className="text-sm text-muted-foreground">
                        {cloudSettings.folderName
                          ? `Resumes saved to: ${cloudSettings.folderPath || cloudSettings.folderName}`
                          : "No folder selected"}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={openFolderPicker}>
                      <Folder className="h-4 w-4 mr-1" />
                      {cloudSettings.folderName ? "Change" : "Select Folder"}
                    </Button>
                  </div>

                  {/* Auto-sync toggle */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="autoSync">Auto-sync</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically sync changes to cloud storage
                      </p>
                    </div>
                    <Switch
                      id="autoSync"
                      checked={cloudSettings.autoSync}
                      onCheckedChange={(checked: boolean) =>
                        updateCloudSettings({ autoSync: checked })
                      }
                    />
                  </div>

                  {/* Sync on save toggle */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="syncOnSave">Sync on Save</Label>
                      <p className="text-sm text-muted-foreground">
                        Save to cloud whenever you save a resume
                      </p>
                    </div>
                    <Switch
                      id="syncOnSave"
                      checked={cloudSettings.syncOnSave}
                      onCheckedChange={(checked: boolean) =>
                        updateCloudSettings({ syncOnSave: checked })
                      }
                    />
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <Cloud className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Connect a cloud storage provider to sync your resumes
                  </p>
                  <Button onClick={() => startAuth("google-drive")}>
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 87.3 78">
                      <path
                        fill="#0066DA"
                        d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3L29 52.2H0c0 1.55.4 3.1 1.2 4.5l5.4 10.15z"
                      />
                      <path
                        fill="#00AC47"
                        d="M43.65 25.25L29 1.2C27.65 2 26.5 3.1 25.7 4.5L1.2 46.5c-.8 1.4-1.2 2.95-1.2 4.5h29l14.65-25.75z"
                      />
                      <path
                        fill="#EA4335"
                        d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75L86.1 58.7c.8-1.4 1.2-2.95 1.2-4.5H58.3L43.65 78h16.2c2.65 0 5.2-.7 7.5-2.1l6.2-1.1z"
                      />
                      <path
                        fill="#00832D"
                        d="M43.65 25.25L58.3 0H29c-2.65 0-5.2.7-7.5 2.1l22.15 23.15z"
                      />
                      <path
                        fill="#2684FC"
                        d="M58.3 52.2H29l-15.25 26.6c2.3 1.4 4.85 2.1 7.5 2.1h44.3c2.65 0 5.2-.7 7.5-2.1L58.3 52.2z"
                      />
                      <path
                        fill="#FFBA00"
                        d="M73.35 26.5L58.3 0h-14.65l14.65 25.25L87.3 52.2c0-1.55-.4-3.1-1.2-4.5L73.35 26.5z"
                      />
                    </svg>
                    Connect Google Drive
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Folder Picker Dialog */}
          <FolderPickerDialog />

          {/* Appearance Section */}
          <Card>
            <CardHeader>
              <CardTitle>{t("sections.appearance.title")}</CardTitle>
              <CardDescription>{t("sections.appearance.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="theme">{t("sections.appearance.theme")}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t("sections.appearance.selectTheme")}
                  </p>
                </div>
                <Select value={theme} onValueChange={handleThemeChange}>
                  <SelectTrigger id="theme" className="w-[180px]">
                    <SelectValue placeholder={t("sections.appearance.theme")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">{t("sections.appearance.themeLight")}</SelectItem>
                    <SelectItem value="dark">{t("sections.appearance.themeDark")}</SelectItem>
                    <SelectItem value="system">{t("sections.appearance.themeSystem")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="language">{t("sections.appearance.language")}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t("sections.appearance.selectLanguage")}
                  </p>
                </div>
                <LanguageSwitcher variant="outline" size="default" />
              </div>
            </CardContent>
          </Card>

          {/* Editor Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>{t("sections.editor.title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoSave">{t("sections.editor.autoSave")}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t("sections.editor.autoSaveDescription")}
                  </p>
                </div>
                <Switch
                  id="autoSave"
                  checked={settings.autoSave}
                  onCheckedChange={(checked: boolean) => updateSettings({ autoSave: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Export Settings */}
          <Card>
            <CardHeader>
              <CardTitle>{t("sections.data.title")}</CardTitle>
              <CardDescription>{t("sections.data.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="promptExportFilename">
                    {t("sections.export.promptFilename")}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {t("sections.export.promptFilenameDescription")}
                  </p>
                </div>
                <Switch
                  id="promptExportFilename"
                  checked={settings.promptExportFilename}
                  onCheckedChange={(checked: boolean) =>
                    updateSettings({ promptExportFilename: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Reset Settings */}
          <Card>
            <CardHeader>
              <CardTitle>{t("sections.reset.title")}</CardTitle>
              <CardDescription>{t("sections.reset.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={handleResetSettings} className="w-full sm:w-auto">
                <RotateCcw className="mr-2 h-4 w-4" />
                {tCommon("actions.reset")}
              </Button>
            </CardContent>
          </Card>

          {/* Clear Local Storage */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-destructive" />
                Clear Local Storage
              </CardTitle>
              <CardDescription>
                Clear all local data including resumes, profiles, settings, and authentication
                state. This action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    disabled={isClearingStorage}
                    className="w-full sm:w-auto"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {isClearingStorage ? "Clearing..." : "Clear All Local Storage"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear All Local Storage?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all local data including:
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>All resumes and resume data</li>
                        <li>All profiles</li>
                        <li>Application settings and preferences</li>
                        <li>Authentication state (you will be logged out)</li>
                        <li>All cached data</li>
                      </ul>
                      <strong className="block mt-3 text-destructive">
                        This action cannot be undone. Are you sure you want to continue?
                      </strong>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isClearingStorage}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleClearLocalStorage}
                      disabled={isClearingStorage}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isClearingStorage ? "Clearing..." : "Clear All Data"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
