# Phase 16 Part 5: Monitoring & Observability

## Overview
Add comprehensive monitoring, error tracking, analytics, and user feedback systems to gain visibility into application health, performance, and user experience.

## Goals
- ✅ Track and report errors in production
- ✅ Monitor application performance (Web Vitals)
- ✅ Collect user feedback
- ✅ Set up alerting for critical issues
- ✅ Create observability dashboard

## Implementation Plan

### 1. Error Tracking with Sentry

**Why Sentry?**
- Best-in-class error tracking
- React integration with Error Boundaries
- Performance monitoring built-in
- Session replay for debugging
- Free tier: 5K errors/month, sufficient for MVP

**Installation:**
```bash
bun add @sentry/react @sentry/vite-plugin
```

**Configuration:**
```typescript
// src/lib/monitoring/sentry.ts
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  enabled: import.meta.env.PROD,
  
  // Performance Monitoring
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  
  // Performance traces: 10% in prod, 100% in dev
  tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
  
  // Session replay: only on errors
  replaysSessionSampleRate: 0.0,
  replaysOnErrorSampleRate: 1.0,
  
  // Release tracking
  release: import.meta.env.VITE_APP_VERSION,
})
```

**Error Boundary:**
```typescript
// src/components/errors/error-boundary.tsx
import * as Sentry from "@sentry/react"

export const ErrorBoundary = Sentry.withErrorBoundary(
  ({ children }) => children,
  {
    fallback: <ErrorFallback />,
    showDialog: true,
  }
)
```

**Vite Plugin for Source Maps:**
```typescript
// vite.config.ts
import { sentryVitePlugin } from "@sentry/vite-plugin"

export default defineConfig({
  plugins: [
    sentryVitePlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      sourcemaps: {
        assets: "./dist/**",
      },
    }),
  ],
})
```

### 2. Web Vitals Performance Monitoring

**Metrics to Track:**
- **LCP** (Largest Contentful Paint): Loading performance (<2.5s good)
- **FID** (First Input Delay): Interactivity (<100ms good)
- **CLS** (Cumulative Layout Shift): Visual stability (<0.1 good)
- **TTFB** (Time to First Byte): Server response (<800ms good)
- **FCP** (First Contentful Paint): Perceived load (<1.8s good)

**Installation:**
```bash
bun add web-vitals
```

**Implementation:**
```typescript
// src/lib/monitoring/web-vitals.ts
import { onCLS, onFID, onLCP, onTTFB, onFCP } from 'web-vitals'
import * as Sentry from "@sentry/react"

export function reportWebVitals() {
  function sendToSentry(metric: Metric) {
    // Send to Sentry as measurement
    Sentry.setMeasurement(metric.name, metric.value, metric.unit)
    
    // Log poor performance
    if (metric.rating === 'poor') {
      Sentry.captureMessage(
        `Poor ${metric.name}: ${metric.value}${metric.unit}`,
        'warning'
      )
    }
  }

  onCLS(sendToSentry)
  onFID(sendToSentry)
  onLCP(sendToSentry)
  onTTFB(sendToSentry)
  onFCP(sendToSentry)
}
```

**Hook:**
```typescript
// src/hooks/use-web-vitals.ts
import { useEffect } from 'react'
import { reportWebVitals } from '@/lib/monitoring/web-vitals'

export function useWebVitals() {
  useEffect(() => {
    if (import.meta.env.PROD) {
      reportWebVitals()
    }
  }, [])
}
```

### 3. User Feedback System

**Two Approaches:**

**Option A: Sentry Feedback Widget (Recommended)**
```typescript
import { feedbackIntegration } from "@sentry/react"

Sentry.init({
  integrations: [
    feedbackIntegration({
      colorScheme: "system",
      showBranding: false,
      triggerLabel: "Report an Issue",
      formTitle: "Report an Issue",
      submitButtonLabel: "Send Feedback",
      messagePlaceholder: "What went wrong?",
    }),
  ],
})
```

**Option B: Custom Feedback Widget**
```typescript
// src/components/feedback/feedback-widget.tsx
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

const feedbackSchema = z.object({
  message: z.string().min(10).max(1000),
  sentiment: z.enum(['positive', 'neutral', 'negative']),
  email: z.string().email().optional(),
})

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false)
  
  const submitFeedback = useMutation({
    mutationFn: async (data: z.infer<typeof feedbackSchema>) => {
      // Send to backend or Sentry
      await fetch('/api/feedback', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
  })
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Feedback form UI */}
    </Dialog>
  )
}
```

### 4. API Error Tracking

**Enhance API Client:**
```typescript
// src/lib/api/client.ts
import * as Sentry from "@sentry/react"

async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = new ApiError(response.status, await response.text())
    
    // Track API errors in Sentry
    Sentry.captureException(error, {
      tags: {
        type: 'api_error',
        status: response.status,
        url: response.url,
      },
      level: response.status >= 500 ? 'error' : 'warning',
    })
    
    throw error
  }
  
  return response.json()
}
```

### 5. Custom Performance Metrics

**Track Custom Operations:**
```typescript
// src/lib/monitoring/performance.ts
import * as Sentry from "@sentry/react"

export function trackOperation<T>(
  name: string,
  operation: () => Promise<T>
): Promise<T> {
  const transaction = Sentry.startTransaction({
    name,
    op: 'custom',
  })
  
  return operation()
    .then((result) => {
      transaction.setStatus('ok')
      return result
    })
    .catch((error) => {
      transaction.setStatus('error')
      Sentry.captureException(error)
      throw error
    })
    .finally(() => {
      transaction.finish()
    })
}

// Usage
await trackOperation('export-resume-pdf', async () => {
  return await generatePDF(resume)
})
```

### 6. User Context

**Add User Info to Errors:**
```typescript
// In auth store or provider
Sentry.setUser({
  id: user.id,
  email: user.email,
  username: user.name,
})

// On logout
Sentry.setUser(null)
```

### 7. Breadcrumbs

**Track User Actions:**
```typescript
// Automatic breadcrumbs
Sentry.addBreadcrumb({
  category: 'resume',
  message: 'User created new resume',
  level: 'info',
  data: {
    resumeId: newResume.id,
    template: newResume.template,
  },
})
```

## Environment Variables

Add to `.env`:
```bash
# Sentry
VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_ORG=your-org
SENTRY_PROJECT=resumier
SENTRY_AUTH_TOKEN=your-token

# App Version
VITE_APP_VERSION=1.0.0
```

Add to `.env.example`:
```bash
# Monitoring (Optional - only needed for production)
VITE_SENTRY_DSN=
SENTRY_ORG=
SENTRY_PROJECT=
SENTRY_AUTH_TOKEN=
```

## Monitoring Dashboard

**Sentry Dashboard Widgets:**
1. Error frequency over time
2. Most common errors
3. Performance metrics (LCP, FID, CLS)
4. User feedback submissions
5. Release comparison
6. Browser/OS distribution
7. Session replay count

**Alerts to Configure:**
1. Error spike (>10 errors in 5 minutes)
2. Poor Web Vitals (LCP >2.5s)
3. API error rate >5%
4. Critical error in production

## Testing

**Test Error Tracking:**
```typescript
// src/__tests__/monitoring/error-tracking.test.ts
import * as Sentry from "@sentry/react"

describe("Error Tracking", () => {
  it("captures exceptions", () => {
    const captureException = vi.spyOn(Sentry, 'captureException')
    
    try {
      throw new Error("Test error")
    } catch (error) {
      Sentry.captureException(error)
    }
    
    expect(captureException).toHaveBeenCalled()
  })
})
```

## Cost Estimate

**Sentry Free Tier:**
- 5,000 errors/month
- 10,000 performance units/month
- 50 replay sessions/month
- **Cost: $0** (sufficient for MVP)

**Sentry Team Plan (if needed):**
- 50,000 errors/month
- 100,000 performance units
- 500 replay sessions
- **Cost: $26/month**

## Success Metrics

After implementation:
- ✅ All production errors tracked
- ✅ Error rate <1% of total requests
- ✅ Average LCP <2.0s
- ✅ Average FID <50ms
- ✅ Average CLS <0.05
- ✅ 100% critical paths monitored
- ✅ User feedback collected
- ✅ Alert response time <5 minutes

## Documentation

Create `MONITORING.md`:
- Sentry dashboard walkthrough
- How to investigate errors
- Performance optimization guide
- Alerting rules and response procedures
- Debugging with session replay
- User feedback triage

## Timeline

- **Day 1:** Sentry setup + Error Boundaries (2 hours)
- **Day 2:** Web Vitals tracking (1 hour)
- **Day 3:** Feedback system (2 hours)
- **Day 4:** Testing + documentation (2 hours)

**Total: 7 hours**

## Next Steps

After Part 5:
- Phase 17: Advanced features
- Phase 18: Mobile optimization
- Phase 19: Accessibility audit
- Phase 20: Production launch

---

**Ready to begin implementation!**
