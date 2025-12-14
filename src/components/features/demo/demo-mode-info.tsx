import { useState } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDemoMode } from "@/hooks/use-demo-mode";
import { useAuthStore } from "@/stores/auth-store";

/**
 * Demo Mode Info Component
 * Shows demo mode status and provides controls for demo mode
 */
export function DemoModeInfo() {
  const { isDemo, initializeDemo, exitDemo, refreshData } = useDemoMode();
  const loginAsDemo = useAuthStore((state) => state.loginAsDemo);
  const setDemo = useAuthStore((state) => state.setDemo);

  const [isInitializing, setIsInitializing] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleStartDemo = async () => {
    setIsInitializing(true);
    try {
      // Initialize demo mode with data (backs up existing data)
      await initializeDemo({ multipleResumes: true, clearExisting: true });

      // Set auth state to demo
      loginAsDemo();

      // Refresh to load demo data
      await refreshData();

      setIsInitializing(false);
    } catch (error) {
      console.error("Failed to start demo:", error);
      alert("Failed to start demo mode. Please try again.");
      setIsInitializing(false);
    }
  };

  const handleExitDemo = async () => {
    setIsExiting(true);
    try {
      // Update Zustand store state
      setDemo(false);

      // Exit demo mode and restore user data
      await exitDemo();

      // Refresh the data to show restored content
      await refreshData();

      setIsExiting(false);
    } catch (error) {
      console.error("Failed to exit demo:", error);
      alert("Failed to exit demo mode. Please try again.");
      setIsExiting(false);
    }
  };

  // If not in demo mode, show option to start demo
  if (!isDemo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🎭</span>
            Demo Mode
          </CardTitle>
          <CardDescription>Try Resumier with pre-populated sample data</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleStartDemo} disabled={isInitializing} size="sm">
            <Play className="mr-2 h-4 w-4" />
            {isInitializing ? "Starting..." : "Start Demo"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // If in demo mode, show exit option
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🎭</span>
          Demo Mode
        </CardTitle>
        <CardDescription>Currently exploring with demo data</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" size="sm" onClick={handleExitDemo} disabled={isExiting}>
          {isExiting ? "Exiting..." : "Exit Demo Mode"}
        </Button>
      </CardContent>
    </Card>
  );
}
