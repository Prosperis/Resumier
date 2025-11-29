import { createLazyFileRoute } from "@tanstack/react-router";
import { useSettingsStore } from "@/stores";
import { useAuthStore } from "@/stores/auth-store";
import { useTheme } from "@/app/theme-provider";
import { DemoModeInfo } from "@/components/features/demo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export const Route = createLazyFileRoute("/settings")({
  component: SettingsComponent,
});

function SettingsComponent() {
  const { settings, updateSettings, resetSettings } = useSettingsStore();
  const { user, isGuest, isDemo } = useAuthStore();
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (value: "light" | "dark" | "system") => {
    // Update both the theme provider and settings store
    setTheme(value);
    updateSettings({ theme: value });
  };

  const handleResetSettings = () => {
    if (
      window.confirm("Reset all settings to defaults? This cannot be undone.")
    ) {
      resetSettings();
      // Also reset theme to system default
      setTheme("system");
    }
  };

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your preferences and configuration
        </p>
      </div>

      <div className="space-y-6">
        {/* Account Section */}
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              {isGuest
                ? "You're using Resumier as a guest"
                : `Logged in as ${user?.email || "User"}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Status</Label>
                <p className="text-sm text-muted-foreground">
                  {isDemo
                    ? "Demo Mode"
                    : isGuest
                      ? "Guest User"
                      : "Authenticated"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Mode Section */}
        {(isGuest || isDemo) && <DemoModeInfo />}

        {/* Appearance Section */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how Resumier looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="theme">Theme</Label>
                <p className="text-sm text-muted-foreground">
                  Select your color theme
                </p>
              </div>
              <Select
                value={theme}
                onValueChange={handleThemeChange}
              >
                <SelectTrigger id="theme" className="w-[180px]">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="reducedMotion">Reduced Motion</Label>
                <p className="text-sm text-muted-foreground">
                  Minimize animations
                </p>
              </div>
              <Switch
                id="reducedMotion"
                checked={settings.reducedMotion}
                onCheckedChange={(checked: boolean) =>
                  updateSettings({ reducedMotion: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Editor Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Editor Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoSave">Auto Save</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically save changes
                </p>
              </div>
              <Switch
                id="autoSave"
                checked={settings.autoSave}
                onCheckedChange={(checked: boolean) =>
                  updateSettings({ autoSave: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Export Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Export Settings</CardTitle>
            <CardDescription>
              Customize how your resumes are exported
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="promptExportFilename">
                  Prompt for Filename
                </Label>
                <p className="text-sm text-muted-foreground">
                  Ask for a filename before exporting (includes a smart default)
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
            <CardTitle>Reset Settings</CardTitle>
            <CardDescription>Restore defaults</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={handleResetSettings}
              className="w-full sm:w-auto"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset to Defaults
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
