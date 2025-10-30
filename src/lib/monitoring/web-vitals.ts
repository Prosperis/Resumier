import * as Sentry from "@sentry/react";
import type { Metric } from "web-vitals";
import { onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals";

/**
 * Web Vitals thresholds (Core Web Vitals)
 * @see https://web.dev/vitals/
 */
const THRESHOLDS = {
  // Largest Contentful Paint - measures loading performance
  LCP: { good: 2500, needsImprovement: 4000 },
  // First Input Delay - measures interactivity
  FID: { good: 100, needsImprovement: 300 },
  // Interaction to Next Paint - measures responsiveness
  INP: { good: 200, needsImprovement: 500 },
  // Cumulative Layout Shift - measures visual stability
  CLS: { good: 0.1, needsImprovement: 0.25 },
  // Time to First Byte - measures server response
  TTFB: { good: 800, needsImprovement: 1800 },
  // First Contentful Paint - measures perceived load
  FCP: { good: 1800, needsImprovement: 3000 },
} as const;

/**
 * Determine metric rating based on thresholds
 */
function getRating(
  name: keyof typeof THRESHOLDS,
  value: number,
): "good" | "needs-improvement" | "poor" {
  const threshold = THRESHOLDS[name];
  if (value <= threshold.good) return "good";
  if (value <= threshold.needsImprovement) return "needs-improvement";
  return "poor";
}

/**
 * Send Web Vitals metric to Sentry
 */
function sendToSentry(metric: Metric) {
  const rating = getRating(
    metric.name as keyof typeof THRESHOLDS,
    metric.value,
  );

  // Set measurement in Sentry for performance monitoring
  Sentry.setMeasurement(metric.name, metric.value, "millisecond");

  // Log poor performance as warning
  if (rating === "poor") {
    Sentry.captureMessage(`Poor ${metric.name}: ${metric.value}ms`, {
      level: "warning",
      tags: {
        type: "web-vitals",
        metric: metric.name,
        rating,
      },
      extra: {
        value: metric.value,
        delta: metric.delta,
        id: metric.id,
        navigationType: metric.navigationType,
      },
    });
  }

  // Console log in development
  if (import.meta.env.DEV) {
    console.log(
      `[Web Vitals] ${metric.name}: ${metric.value.toFixed(2)}ms (${rating})`,
      metric,
    );
  }
}

/**
 * Initialize Web Vitals tracking
 * Tracks Core Web Vitals and reports to Sentry
 */
export function reportWebVitals() {
  // Only track in production
  if (!import.meta.env.PROD) {
    console.info("Web Vitals tracking disabled in development");
    return;
  }

  try {
    // Core Web Vitals
    onCLS(sendToSentry); // Cumulative Layout Shift
    onINP(sendToSentry); // Interaction to Next Paint
    onLCP(sendToSentry); // Largest Contentful Paint

    // Other important metrics
    onFCP(sendToSentry); // First Contentful Paint
    onTTFB(sendToSentry); // Time to First Byte

    console.info("✅ Web Vitals tracking initialized");
  } catch (error) {
    console.error("Failed to initialize Web Vitals tracking:", error);
    Sentry.captureException(error, {
      tags: {
        type: "monitoring-init-error",
      },
    });
  }
}

/**
 * Get current Web Vitals metrics (for testing or manual reporting)
 */
export async function getCurrentMetrics(): Promise<Record<string, number>> {
  const metrics: Record<string, number> = {};

  return new Promise((resolve) => {
    let count = 0;
    const total = 5;

    const callback = (metric: Metric) => {
      metrics[metric.name] = metric.value;
      count++;
      if (count === total) {
        resolve(metrics);
      }
    };

    onCLS(callback);
    onFCP(callback);
    onINP(callback);
    onLCP(callback);
    onTTFB(callback);

    // Timeout after 5 seconds if not all metrics are collected
    setTimeout(() => resolve(metrics), 5000);
  });
}

/**
 * Log Web Vitals summary to console
 */
export async function logWebVitalsSummary() {
  const metrics = await getCurrentMetrics();

  console.group("📊 Web Vitals Summary");
  for (const [name, value] of Object.entries(metrics)) {
    const rating = getRating(name as keyof typeof THRESHOLDS, value);
    const emoji =
      rating === "good" ? "✅" : rating === "needs-improvement" ? "⚠️" : "❌";
    console.log(`${emoji} ${name}: ${value.toFixed(2)}ms (${rating})`);
  }
  console.groupEnd();
}
