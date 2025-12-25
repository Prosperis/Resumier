import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Providers } from "./app/providers";
import { router } from "./app/router";
import "./index.css";

// Initialize monitoring in production
import { initSentry } from "./lib/monitoring/sentry";
import { reportWebVitals } from "./lib/monitoring/web-vitals";

// Initialize Sentry error tracking
initSentry();

// Initialize Web Vitals performance monitoring
if (import.meta.env.PROD) {
  reportWebVitals();
}

// Global error handler to catch DOM manipulation errors that occur during React cleanup
// This prevents "removeChild" errors from bubbling up to error boundaries
// These errors typically occur when React tries to clean up portals after the DOM has been modified
if (typeof window !== "undefined") {
  const originalErrorHandler = window.onerror;
  window.onerror = (message, source, lineno, colno, error) => {
    // Only suppress specific DOM cleanup errors that occur during React portal cleanup
    // These are harmless race conditions that happen when React unmounts components
    const errorMessage = typeof message === "string" ? message : error?.message || "";
    const errorName = error?.name || "";

    // Check for various forms of DOM cleanup errors
    const isDOMCleanupError =
      // Standard removeChild error
      (errorMessage.includes("removeChild") && errorMessage.includes("not a child")) ||
      // NotFoundError with removeChild
      (errorName === "NotFoundError" && errorMessage.includes("removeChild")) ||
      // DOMException NotFoundError
      (error instanceof DOMException &&
        error.name === "NotFoundError" &&
        (errorMessage.includes("removeChild") || errorMessage.includes("remove")));

    if (isDOMCleanupError) {
      // Log in development for debugging, but don't show to users
      if (import.meta.env.DEV) {
        console.warn("Suppressed React portal cleanup error:", errorMessage);
      }
      return true; // Prevent error from bubbling up to error boundaries
    }

    // Call original error handler for other errors
    if (originalErrorHandler) {
      return originalErrorHandler(message, source, lineno, colno, error);
    }
    return false;
  };

  // Also catch unhandled promise rejections that might contain DOM errors
  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    const errorMessage =
      reason instanceof Error ? reason.message : typeof reason === "string" ? reason : "";
    const errorName = reason instanceof Error ? reason.name : "";

    // Check for various forms of DOM cleanup errors
    const isDOMCleanupError =
      (errorMessage.includes("removeChild") && errorMessage.includes("not a child")) ||
      (errorName === "NotFoundError" && errorMessage.includes("removeChild")) ||
      (reason instanceof DOMException &&
        reason.name === "NotFoundError" &&
        (errorMessage.includes("removeChild") || errorMessage.includes("remove")));

    if (isDOMCleanupError) {
      // Log in development for debugging, but don't show to users
      if (import.meta.env.DEV) {
        console.warn("Suppressed React portal cleanup error in promise:", errorMessage);
      }
      event.preventDefault(); // Prevent error from bubbling up
    }
  });
}

// biome-ignore lint/style/noNonNullAssertion: root element is guaranteed to exist in index.html
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </StrictMode>,
);
