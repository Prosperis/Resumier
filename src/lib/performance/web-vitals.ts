import { type Metric, onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals";

/**
 * Web Vitals tracking utilities
 * Monitors Core Web Vitals and reports them
 */

// Metric thresholds (Google's recommendations)
const THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  INP: { good: 200, poor: 500 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
};

/**
 * Get rating based on value and thresholds
 */
function getRating(
  value: number,
  thresholds: { good: number; poor: number }
): "good" | "needs-improvement" | "poor" {
  if (value <= thresholds.good) return "good";
  if (value <= thresholds.poor) return "needs-improvement";
  return "poor";
}

/**
 * Send metric to analytics (placeholder)
 * In production, replace with actual analytics service
 */
function sendToAnalytics(metric: Metric) {
  // Get rating
  const thresholds = THRESHOLDS[metric.name as keyof typeof THRESHOLDS];
  const rating = thresholds ? getRating(metric.value, thresholds) : "unknown";

  // Log to console in development
  if (import.meta.env.DEV) {
    const emoji = rating === "good" ? "✅" : rating === "needs-improvement" ? "⚠️" : "❌";
    console.group(
      `${emoji} ${metric.name}: ${metric.value.toFixed(2)}${metric.name === "CLS" ? "" : "ms"}`
    );
    console.log(`Rating: ${rating}`);
    console.log(`ID: ${metric.id}`);
    console.log(`Navigation Type: ${metric.navigationType}`);
    console.groupEnd();
  }

  // In production, send to analytics service
  // Example: Google Analytics 4
  // if (window.gtag) {
  //   window.gtag('event', metric.name, {
  //     value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
  //     metric_id: metric.id,
  //     metric_value: metric.value,
  //     metric_delta: metric.delta,
  //     metric_rating: rating,
  //   })
  // }

  // Example: Custom endpoint
  // if (import.meta.env.PROD) {
  //   fetch('/api/vitals', {
  //     method: 'POST',
  //     body: JSON.stringify({
  //       name: metric.name,
  //       value: metric.value,
  //       rating,
  //       id: metric.id,
  //       navigationType: metric.navigationType,
  //     }),
  //     keepalive: true,
  //   })
  // }
}

/**
 * Initialize web vitals tracking
 * Call this once at app startup
 */
export function initWebVitals() {
  // Only run in browser
  if (typeof window === "undefined") return;

  // Track all Core Web Vitals
  onCLS(sendToAnalytics);
  onFCP(sendToAnalytics);
  onINP(sendToAnalytics);
  onLCP(sendToAnalytics);
  onTTFB(sendToAnalytics);

  console.log("📊 Web Vitals tracking initialized");
}

/**
 * Get current web vitals summary
 * Useful for debugging or displaying in UI
 */
export async function getWebVitalsReport() {
  const { onCLS, onFCP, onINP, onLCP, onTTFB } = await import("web-vitals");

  return new Promise<Record<string, Metric>>((resolve) => {
    const vitals: Record<string, Metric> = {};
    let count = 0;
    const total = 5;

    const checkComplete = () => {
      count++;
      if (count === total) {
        resolve(vitals);
      }
    };

    onCLS((metric) => {
      vitals.CLS = metric;
      checkComplete();
    });
    onFCP((metric) => {
      vitals.FCP = metric;
      checkComplete();
    });
    onINP((metric) => {
      vitals.INP = metric;
      checkComplete();
    });
    onLCP((metric) => {
      vitals.LCP = metric;
      checkComplete();
    });
    onTTFB((metric) => {
      vitals.TTFB = metric;
      checkComplete();
    });
  });
}

// Export for development/debugging
if (import.meta.env.DEV) {
  // biome-ignore lint/suspicious/noExplicitAny: dev-only debugging utilities on window object
  (window as any).webVitals = {
    getReport: getWebVitalsReport,
  };
  console.log("💡 Web vitals available: window.webVitals.getReport()");
}
