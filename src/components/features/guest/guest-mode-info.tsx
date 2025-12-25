import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGuestStorage } from "@/hooks/use-guest-storage";
import { useAuthStore } from "@/stores/auth-store";
import { Download, LogIn, Trash2 } from "lucide-react";
import { useState } from "react";

/**
 * Guest Mode Info Component
 * Shows guest users their status and provides data management options
 */
export function GuestModeInfo() {
  const { isGuest, hasData, isChecking, clearData, exportData } = useGuestStorage();
  const logout = useAuthStore((state) => state.logout);
  const [isClearing, setIsClearing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Only show for guest users
  if (!isGuest) {
    return null;
  }

  const handleClearData = async () => {
    if (
      !window.confirm(
        "Are you sure? This will permanently delete all your resume data. This action cannot be undone.",
      )
    ) {
      return;
    }

    setIsClearing(true);
    try {
      await clearData();
      logout();
      window.location.reload();
    } catch (error) {
      console.error("Failed to clear data:", error);
      alert("Failed to clear data. Please try again.");
    } finally {
      setIsClearing(false);
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
      a.download = `resumier-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      // Use remove() which is safer than removeChild()
      try {
        if (a.parentNode) {
          a.remove();
        }
      } catch (cleanupError) {
        // Silently ignore cleanup errors - the element may have already been removed
        console.warn("Error during cleanup:", cleanupError);
      }
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export data:", error);
      alert("Failed to export data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-900 dark:text-orange-100">
          <span className="text-2xl">👤</span>
          Guest Mode
        </CardTitle>
        <CardDescription className="text-orange-700 dark:text-orange-300">
          You're using Resumier as a guest. Your data is stored locally on this device.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isChecking ? (
          <p className="text-sm text-muted-foreground">Checking your data...</p>
        ) : (
          <>
            {hasData ? (
              <div className="space-y-3">
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  ✓ You have saved resume data on this device
                </p>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportData}
                    disabled={isExporting}
                    className="border-orange-300 dark:border-orange-700"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {isExporting ? "Exporting..." : "Backup Data"}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearData}
                    disabled={isClearing}
                    className="border-red-300 dark:border-red-700 text-red-700 dark:text-red-300"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {isClearing ? "Clearing..." : "Clear All Data"}
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No saved data yet. Start creating your resume!
              </p>
            )}

            <div className="pt-3 border-t border-orange-200 dark:border-orange-900">
              <p className="text-sm text-orange-700 dark:text-orange-300 mb-2">
                Want to sync across devices?
              </p>
              <Button
                size="sm"
                variant="default"
                className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign Up to Save
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
