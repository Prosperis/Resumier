import * as Sentry from "@sentry/react"

/**
 * Initialize Sentry error tracking and performance monitoring
 * Only enabled in production builds
 */
export function initSentry() {
  // Only initialize if DSN is provided and we're in production
  const dsn = import.meta.env.VITE_SENTRY_DSN
  if (!dsn) {
    console.info("Sentry DSN not configured, skipping initialization")
    return
  }

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    enabled: import.meta.env.PROD,

    // Performance Monitoring
    integrations: [
      // Browser tracing for performance monitoring
      Sentry.browserTracingIntegration({
        // Track React Router navigation
        enableInp: true,
      }),

      // Session replay for debugging
      Sentry.replayIntegration({
        // Privacy: mask all text and block all media by default
        maskAllText: true,
        blockAllMedia: true,
        // Capture console logs for better debugging
        maskAllInputs: true,
      }),

      // User feedback widget
      Sentry.feedbackIntegration({
        colorScheme: "system",
        showBranding: false,
        triggerLabel: "Report an Issue",
        formTitle: "Report an Issue",
        submitButtonLabel: "Send Feedback",
        messagePlaceholder: "What went wrong? Please describe the issue...",
        successMessageText: "Thank you for your feedback!",
      }),
    ],

    // Performance traces: 10% in prod, 100% in dev
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,

    // Session replay: only on errors to save quota
    replaysSessionSampleRate: 0.0,
    replaysOnErrorSampleRate: 1.0,

    // Release tracking for better debugging
    release: import.meta.env.VITE_APP_VERSION || "development",

    // Error filtering
    beforeSend(event, hint) {
      // Filter out known browser extension errors
      const error = hint.originalException
      if (error instanceof Error) {
        // Ignore browser extension errors
        if (
          error.message.includes("chrome-extension://") ||
          error.message.includes("moz-extension://")
        ) {
          return null
        }

        // Ignore ResizeObserver errors (common, harmless)
        if (error.message.includes("ResizeObserver")) {
          return null
        }
      }

      return event
    },

    // Ignore certain errors
    ignoreErrors: [
      // Browser extension errors
      "chrome-extension://",
      "moz-extension://",
      // Network errors (user's connection, not our fault)
      "NetworkError",
      "Failed to fetch",
      // ResizeObserver loop errors (harmless)
      "ResizeObserver loop",
    ],
  })

  console.info("✅ Sentry initialized", {
    environment: import.meta.env.MODE,
    release: import.meta.env.VITE_APP_VERSION,
  })
}

/**
 * Set user context for better error tracking
 */
export function setUser(user: { id: string; email: string; name?: string } | null) {
  if (user) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.name,
    })
  } else {
    Sentry.setUser(null)
  }
}

/**
 * Track custom breadcrumb for debugging
 */
export function trackBreadcrumb(
  category: string,
  message: string,
  data?: Record<string, unknown>,
  level: Sentry.SeverityLevel = "info",
) {
  Sentry.addBreadcrumb({
    category,
    message,
    level,
    data,
    timestamp: Date.now() / 1000,
  })
}

/**
 * Track custom operation with performance timing
 */
export async function trackOperation<T>(
  name: string,
  operation: () => Promise<T>,
  tags?: Record<string, string>,
): Promise<T> {
  return await Sentry.startSpan(
    {
      name,
      op: "custom",
      attributes: tags,
    },
    async () => {
      try {
        return await operation()
      } catch (error) {
        Sentry.captureException(error, {
          tags: {
            operation: name,
            ...tags,
          },
        })
        throw error
      }
    },
  )
}

/**
 * Manually capture an exception with context
 */
export function captureError(
  error: Error,
  context?: {
    tags?: Record<string, string>
    level?: Sentry.SeverityLevel
    extra?: Record<string, unknown>
  },
) {
  Sentry.captureException(error, {
    level: context?.level || "error",
    tags: context?.tags,
    extra: context?.extra,
  })
}

/**
 * Capture a message (for non-error tracking)
 */
export function captureMessage(
  message: string,
  level: Sentry.SeverityLevel = "info",
  context?: Record<string, unknown>,
) {
  Sentry.captureMessage(message, {
    level,
    extra: context,
  })
}
