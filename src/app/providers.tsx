import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./query-client";
import { ThemeProvider } from "./theme-provider";

type ProvidersProps = {
  children: React.ReactNode;
};

/**
 * Application providers wrapper
 * Wraps the app with all necessary context providers
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="resumier-theme">
      <QueryClientProvider client={queryClient}>
        {children}
        {/* Show React Query devtools in development */}
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
