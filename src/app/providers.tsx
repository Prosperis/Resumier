import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

import { queryClient } from "./query-client";
import { ThemeProvider } from "./theme-provider";

// Initialize i18n - must be imported before any components that use translations
import "@/lib/i18n";

type ProvidersProps = {
  children: React.ReactNode;
};

/**
 * Application providers wrapper
 * Wraps the app with all necessary context providers
 */
export function Providers({ children }: ProvidersProps) {
  const [showDevtools, setShowDevtools] = useState(false);

  return (
    <ThemeProvider storageKey="resumier-theme">
      <QueryClientProvider client={queryClient}>
        {children}
        {/* Show React Query devtools in development - hidden by default, shows on hover */}
        {import.meta.env.DEV && (
          <>
            <div
              onMouseEnter={() => setShowDevtools(true)}
              onMouseLeave={() => setShowDevtools(false)}
              style={{
                position: "fixed",
                bottom: 0,
                right: 0,
                width: "100px",
                height: "100px",
                zIndex: 9998,
              }}
            />
            {showDevtools && (
              <ReactQueryDevtools
                initialIsOpen={false}
                buttonPosition="bottom-right"
                position="bottom"
              />
            )}
          </>
        )}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
