import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createContext, useContext, useState, useCallback } from "react";

import { queryClient } from "./query-client";
import { ThemeProvider } from "./theme-provider";

// Initialize i18n - must be imported before any components that use translations
import "@/lib/i18n";

// Devtools context for controlling visibility from sidebar
interface DevtoolsContextType {
  isOpen: boolean;
  toggle: () => void;
}

const DevtoolsContext = createContext<DevtoolsContextType | null>(null);

export function useDevtools() {
  const context = useContext(DevtoolsContext);
  if (!context) {
    return { isOpen: false, toggle: () => {} };
  }
  return context;
}

type ProvidersProps = {
  children: React.ReactNode;
};

/**
 * Application providers wrapper
 * Wraps the app with all necessary context providers
 */
export function Providers({ children }: ProvidersProps) {
  const [devtoolsOpen, setDevtoolsOpen] = useState(false);

  const toggleDevtools = useCallback(() => {
    setDevtoolsOpen((prev) => !prev);
  }, []);

  return (
    <ThemeProvider storageKey="resumier-theme">
      <QueryClientProvider client={queryClient}>
        <DevtoolsContext.Provider value={{ isOpen: devtoolsOpen, toggle: toggleDevtools }}>
          {children}
        </DevtoolsContext.Provider>
        {/* Show React Query devtools in development - controlled by context */}
        {import.meta.env.DEV && devtoolsOpen && (
          <ReactQueryDevtools
            initialIsOpen={true}
            buttonPosition="bottom-right"
            position="bottom"
          />
        )}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
