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

// biome-ignore lint/style/noNonNullAssertion: root element is guaranteed to exist in index.html
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </StrictMode>,
);
