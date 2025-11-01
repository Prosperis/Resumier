import { useState } from "react";
import { Download, Play, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { useDemoMode } from "@/hooks/use-demo-mode";
import { useAuthStore } from "@/stores/auth-store";
import { useNavigate } from "@tanstack/react-router";

/**
 * Demo Mode Info Component
 * Shows demo mode status and provides controls for demo mode
 */
export function DemoModeInfo() {
  const navigate = useNavigate();
  const { isDemo, hasData, isChecking, demoResumes, initializeDemo, exitDemo, exportData, refreshData } =
    useDemoMode();
  const loginAsDemo = useAuthStore((state) => state.loginAsDemo);
  const logout = useAuthStore((state) => state.logout);
  
  const [isInitializing, setIsInitializing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleStartDemo = async () => {
    setIsInitializing(true);
    try {
      // Initialize demo mode with data
      await initializeDemo({ multipleResumes: true, clearExisting: true });
      
      // Set auth state to demo
      loginAsDemo();
      
      // Refresh to load demo data
      await refreshData();
      
      // Navigate to dashboard
      navigate({ to: "/dashboard" });
    } catch (error) {
      console.error("Failed to start demo:", error);
      alert("Failed to start demo mode. Please try again.");
    } finally {
      setIsInitializing(false);
    }
  };

  const handleExitDemo = async () => {
    if (
      !window.confirm(
        "Exit demo mode? This will clear all demo data and return you to the home screen."
      )
    ) {
      return;
    }

    setIsExiting(true);
    try {
      await exitDemo();
      logout();
      navigate({ to: "/" });
    } catch (error) {
      console.error("Failed to exit demo:", error);
      alert("Failed to exit demo mode. Please try again.");
    } finally {
      setIsExiting(false);
    }
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const data = await exportData();

      // Convert to JSON and download
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `resumier-demo-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export data:", error);
      alert("Failed to export demo data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // If not in demo mode, show option to start demo
  if (!isDemo) {
    return (
      <Card className="border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
            <span className="text-2xl">🎭</span>
            Try Demo Mode
          </CardTitle>
          <CardDescription className="text-blue-700 dark:text-blue-300">
            Explore Resumier with a fully populated resume example featuring John Doe's professional profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-blue-300 dark:border-blue-800">
            <AlertTitle className="text-blue-900 dark:text-blue-100">
              What's included in Demo Mode:
            </AlertTitle>
            <AlertDescription className="text-blue-800 dark:text-blue-200">
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Complete resume with personal information</li>
                <li>Multiple work experiences with detailed descriptions</li>
                <li>Education history with honors</li>
                <li>Technical skills, languages, and tools</li>
                <li>Professional certifications</li>
                <li>Portfolio and social media links</li>
              </ul>
            </AlertDescription>
          </Alert>

          <Button
            onClick={handleStartDemo}
            disabled={isInitializing}
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            <Play className="mr-2 h-4 w-4" />
            {isInitializing ? "Loading Demo..." : "Start Demo Mode"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // If in demo mode, show demo controls
  return (
    <Card className="border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
          <span className="text-2xl">🎭</span>
          Demo Mode Active
        </CardTitle>
        <CardDescription className="text-blue-700 dark:text-blue-300">
          You're exploring Resumier with demo data. All changes are temporary.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isChecking ? (
          <p className="text-sm text-muted-foreground">Loading demo data...</p>
        ) : (
          <>
            {hasData ? (
              <div className="space-y-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-md">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                    📊 Demo Data Loaded
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    {demoResumes.length} resume{demoResumes.length !== 1 ? "s" : ""} available
                  </p>
                  <ul className="mt-2 space-y-1">
                    {demoResumes.map((resume) => (
                      <li
                        key={resume.id}
                        className="text-xs text-blue-800 dark:text-blue-200"
                      >
                        • {resume.title}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportData}
                    disabled={isExporting}
                    className="border-blue-300 dark:border-blue-700"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {isExporting ? "Exporting..." : "Export Demo Data"}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExitDemo}
                    disabled={isExiting}
                    className="border-red-300 dark:border-red-700 text-red-700 dark:text-red-300"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {isExiting ? "Exiting..." : "Exit Demo"}
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Demo data is loading...
              </p>
            )}

            <Alert className="border-blue-300 dark:border-blue-800">
              <AlertDescription className="text-blue-800 dark:text-blue-200 text-xs">
                <strong>Note:</strong> Demo mode uses temporary storage. Your changes won't be saved permanently. Sign up to save your own resumes!
              </AlertDescription>
            </Alert>
          </>
        )}
      </CardContent>
    </Card>
  );
}
