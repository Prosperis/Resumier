# Monitoring & Observability

## Overview

Resumier uses **Sentry** for error tracking and performance monitoring, combined with **Web Vitals** for Core Web Vitals measurement. This provides comprehensive visibility into application health, performance, and user experience.

## Table of Contents

- [Setup](#setup)
- [Error Tracking](#error-tracking)
- [Performance Monitoring](#performance-monitoring)
- [User Feedback](#user-feedback)
- [Dashboards](#dashboards)
- [Alerting](#alerting)
- [Debugging](#debugging)
- [Best Practices](#best-practices)

## Setup

### 1. Create Sentry Account

1. Go to [sentry.io](https://sentry.io) and create a free account
2. Create a new project for "React"
3. Copy your DSN (Data Source Name)

### 2. Configure Environment Variables

Add to your `.env` file:

```bash
# Required for production error tracking
VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx

# Optional: For uploading source maps in CI/CD
SENTRY_ORG=your-organization-slug
SENTRY_PROJECT=resumier
SENTRY_AUTH_TOKEN=your-auth-token
```

### 3. Generate Source Maps (Optional)

For better stack traces in production:

```bash
# Create auth token at https://sentry.io/settings/account/api/auth-tokens/
# Add to .env
SENTRY_AUTH_TOKEN=your-token

# Build with source maps
bun run build
```

Source maps will be automatically uploaded during the build process if configured.

## Error Tracking

### Automatic Error Capture

All errors are automatically captured by Sentry:

- **React Errors**: Caught by Error Boundary
- **API Errors**: Tracked in API client
- **Promise Rejections**: Automatically captured
- **Console Errors**: Captured in production

### Manual Error Tracking

```typescript
import { captureError } from '@/lib/monitoring/sentry'

try {
  await riskyOperation()
} catch (error) {
  captureError(error as Error, {
    tags: { operation: 'export-pdf' },
    level: 'error',
    extra: { userId: user.id }
  })
  throw error
}
```

### Adding Context with Breadcrumbs

```typescript
import { trackBreadcrumb } from '@/lib/monitoring/sentry'

// Track user actions for debugging
trackBreadcrumb(
  'resume',
  'User created new resume',
  { resumeId: 'abc123', template: 'modern' },
  'info'
)
```

### Performance Tracking

```typescript
import { trackOperation } from '@/lib/monitoring/sentry'

const result = await trackOperation(
  'export-resume-pdf',
  async () => {
    return await generatePDF(resume)
  },
  { resumeId: resume.id }
)
```

## Performance Monitoring

### Web Vitals

Core Web Vitals are automatically tracked:

| Metric | Description | Good | Needs Improvement | Poor |
|--------|-------------|------|-------------------|------|
| **LCP** | Largest Contentful Paint | ≤ 2.5s | ≤ 4.0s | > 4.0s |
| **FID** | First Input Delay | ≤ 100ms | ≤ 300ms | > 300ms |
| **INP** | Interaction to Next Paint | ≤ 200ms | ≤ 500ms | > 500ms |
| **CLS** | Cumulative Layout Shift | ≤ 0.1 | ≤ 0.25 | > 0.25 |
| **TTFB** | Time to First Byte | ≤ 800ms | ≤ 1800ms | > 1800ms |
| **FCP** | First Contentful Paint | ≤ 1.8s | ≤ 3.0s | > 3.0s |

### Viewing Performance Data

1. Go to Sentry Dashboard → Performance
2. View transaction performance
3. Check Web Vitals tab for Core Web Vitals breakdown
4. Use "User Misery" metric to prioritize issues

### Performance Optimization Tips

**Improve LCP:**
- Optimize images (use WebP, lazy loading)
- Minimize render-blocking resources
- Use CDN for static assets

**Improve FID/INP:**
- Code splitting and lazy loading
- Defer non-critical JavaScript
- Optimize event handlers

**Improve CLS:**
- Set explicit dimensions for images/videos
- Avoid dynamic content injection above fold
- Use CSS transforms instead of layout changes

**Improve TTFB:**
- Enable CDN caching
- Optimize server response time
- Use HTTP/2 or HTTP/3

## User Feedback

### Feedback Widget

Users can report issues directly from the app:

```typescript
// Trigger feedback widget programmatically
const feedbackButton = document.querySelector('[data-sentry-feedback]')
feedbackButton?.click()
```

Or users can click "Report an Issue" link in the Error Boundary.

### Viewing Feedback

1. Go to Sentry Dashboard → User Feedback
2. View submitted feedback with context
3. Link feedback to related errors
4. Respond to users (if email provided)

## Dashboards

### Main Dashboard Widgets

Create custom dashboard at `sentry.io/organizations/[org]/dashboards/`:

**1. Error Frequency**
```
Type: Line Chart
Query: events.type:error
Group By: time
```

**2. Most Common Errors**
```
Type: Table
Query: events.type:error
Group By: issue.title
Order By: count DESC
Limit: 10
```

**3. Web Vitals Overview**
```
Type: Table
Query: transaction.op:pageload
Columns: p75(measurements.lcp), p75(measurements.fid), p75(measurements.cls)
```

**4. API Error Rate**
```
Type: Line Chart
Query: tags.type:api_error
Group By: time, tags.status
```

**5. Release Comparison**
```
Type: Line Chart
Query: events.type:error
Group By: release
```

**6. Browser/OS Distribution**
```
Type: Pie Chart
Query: events.type:error
Group By: browser.name, os.name
```

### Recommended Views

- **Today's Errors**: Last 24 hours
- **This Week**: Last 7 days for trends
- **Release Comparison**: Compare current vs previous release
- **User Impact**: Affected users count

## Alerting

### Recommended Alert Rules

Create alerts at `sentry.io/organizations/[org]/alerts/rules/`:

**1. Error Spike Alert**
```
Trigger: When error count increases by 50%
Threshold: > 10 errors in 5 minutes
Actions: Email, Slack notification
Priority: High
```

**2. Poor Web Vitals Alert**
```
Trigger: When p75(LCP) > 2500ms
Threshold: For 5 consecutive minutes
Actions: Email notification
Priority: Medium
```

**3. API Error Rate Alert**
```
Trigger: When API error rate > 5%
Threshold: In 10 minutes
Actions: Email, PagerDuty (if configured)
Priority: High
```

**4. Critical Error Alert**
```
Trigger: Any error tagged 'critical'
Actions: Immediate Slack notification
Priority: Critical
```

**5. New Issue Alert**
```
Trigger: New issue first seen
Filter: production environment
Actions: Slack notification
Priority: Low
```

### Alert Integrations

Configure integrations for:
- **Slack**: Real-time notifications
- **Email**: Daily digests
- **PagerDuty**: On-call alerts
- **Jira**: Auto-create tickets

## Debugging

### Session Replay

When an error occurs, session replay captures:
- User interactions (clicks, scrolls, inputs)
- Network requests
- Console logs
- DOM changes

**To view:**
1. Go to issue details
2. Click "Replays" tab
3. Watch the session leading to the error

**Privacy:** All text and media are masked by default.

### Stack Traces

View full stack traces with source maps:
1. Click on error event
2. View "Exception" section
3. Click to expand stack frames
4. Source maps resolve to original code

### Breadcrumbs

View user actions before error:
1. Click on error event
2. Scroll to "Breadcrumbs" section
3. See chronological list of actions

### Context

Additional context captured:
- **User**: ID, email, username
- **Tags**: Custom tags (operation, feature, etc.)
- **Extra**: Additional data (request body, state, etc.)
- **Environment**: Browser, OS, device
- **Release**: App version

## Best Practices

### 1. Tagging Strategy

Use consistent tags for filtering:

```typescript
Sentry.setTag('feature', 'resume-export')
Sentry.setTag('user_plan', 'free')
Sentry.setTag('template', 'modern')
```

### 2. Error Boundaries

Place error boundaries at route level:

```tsx
import { RouteErrorBoundary } from '@/components/errors/error-boundary'

// In route definition
export const Route = createFileRoute('/resume/$id')({
  component: ResumeEditor,
  errorComponent: RouteErrorBoundary
})
```

### 3. User Context

Always set user context after login:

```typescript
import { setUser } from '@/lib/monitoring/sentry'

setUser({
  id: user.id,
  email: user.email,
  name: user.name
})
```

### 4. Performance Budget

Set performance budgets:
- LCP < 2.0s
- FID < 50ms
- CLS < 0.05
- Bundle size < 200KB

### 5. Release Tracking

Tag releases for better tracking:

```bash
# In package.json
{
  "version": "1.2.3"
}

# Set in env
VITE_APP_VERSION=1.2.3
```

### 6. Error Filtering

Filter noise in `sentry.ts`:

```typescript
beforeSend(event, hint) {
  // Ignore known issues
  if (error.message.includes('chrome-extension://')) {
    return null
  }
  return event
}
```

### 7. Sampling Rates

Balance cost vs visibility:

```typescript
// Production
tracesSampleRate: 0.1  // 10% of transactions
replaysSessionSampleRate: 0.0  // Only on errors
replaysOnErrorSampleRate: 1.0  // 100% of errors

// Development
tracesSampleRate: 1.0  // All transactions
```

## Metrics & KPIs

### Error Metrics

- **Error Rate**: < 1% of total requests
- **Mean Time to Resolution (MTTR)**: < 24 hours
- **Unhandled Errors**: 0
- **Critical Errors**: Resolve within 1 hour

### Performance Metrics

- **P75 LCP**: < 2.0s
- **P75 FID**: < 50ms
- **P75 CLS**: < 0.05
- **Apdex Score**: > 0.95 (satisfied users)

### User Experience

- **Session Errors**: < 5% of sessions
- **User Misery**: Low (few frustrated users)
- **Crash-Free Sessions**: > 99.9%

## Costs

### Sentry Free Tier

- 5,000 errors/month
- 10,000 performance units/month
- 50 replay sessions/month
- **Cost: $0**

### When to Upgrade

Upgrade to Team ($26/month) when:
- > 5,000 errors/month
- Need more replay sessions
- Want advanced features (dashboards, integrations)

### Cost Optimization

1. **Sample wisely**: Use 10% sampling in production
2. **Filter noise**: Ignore browser extension errors
3. **Archive old issues**: Reduce active issue count
4. **Use replay sparingly**: Only on errors, not all sessions

## Troubleshooting

### Common Issues

**Issue: Source maps not uploaded**
```bash
# Solution: Check auth token and build config
echo $SENTRY_AUTH_TOKEN
bun run build --debug
```

**Issue: Too many errors**
```bash
# Solution: Increase sampling or filter noise
tracesSampleRate: 0.05  # Reduce to 5%
```

**Issue: No performance data**
```bash
# Solution: Check DSN and environment
console.log(import.meta.env.VITE_SENTRY_DSN)
```

## Resources

- [Sentry Documentation](https://docs.sentry.io/)
- [Web Vitals Guide](https://web.dev/vitals/)
- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Performance Best Practices](https://web.dev/fast/)

## Support

For monitoring issues:
1. Check Sentry docs
2. Review GitHub issues
3. Contact [your team/email]

---

**Last Updated:** Phase 16 Part 5
**Version:** 1.0.0
