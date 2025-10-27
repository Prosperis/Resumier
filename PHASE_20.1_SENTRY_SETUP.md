# Phase 20.1: Sentry Error Tracking Setup - Complete Guide

**Status**: ✅ **INFRASTRUCTURE READY** - Awaiting Sentry Project Creation  
**Date**: October 27, 2025  
**Duration**: 30-60 minutes

---

## 🎯 Overview

Sentry is already fully integrated into the Resumier codebase with comprehensive error tracking, performance monitoring, session replay, and user feedback features. This guide provides steps to activate the monitoring by creating a Sentry project and configuring the DSN.

---

## ✅ What's Already Implemented

### 1. **Sentry Integration** (`src/lib/monitoring/sentry.ts`)
- ✅ Smart initialization (production only)
- ✅ Browser tracing for performance monitoring
- ✅ Session replay (captures errors only to save quota)
- ✅ User feedback widget
- ✅ Error filtering (browser extensions, network errors)
- ✅ Release tracking
- ✅ Privacy-first configuration (masks sensitive data)

### 2. **Error Boundary** (`src/components/errors/error-boundary.tsx`)
- ✅ Sentry-integrated error boundary
- ✅ User-friendly error UI
- ✅ Automatic error reporting to Sentry
- ✅ Recovery actions (reload, go home)
- ✅ Development mode error details

### 3. **Web Vitals Monitoring** (`src/lib/monitoring/web-vitals.ts`)
- ✅ Core Web Vitals tracking (LCP, FID, CLS, TTFB, INP)
- ✅ Automatic reporting to Sentry
- ✅ Performance insights

### 4. **API Error Tracking** (`src/lib/api/client.ts`)
- ✅ Automatic Sentry breadcrumbs for API calls
- ✅ Error context (method, URL, status, response)
- ✅ Request/response logging

### 5. **Build Configuration** (`vite.config.ts`)
- ✅ Source maps enabled for production
- ✅ Sentry Vite plugin configured (commented out until auth token available)
- ✅ Automatic upload ready (when token provided)

---

## 🚀 Setup Steps

### Step 1: Create Sentry Project (5 minutes)

1. **Go to Sentry**: https://sentry.io
2. **Sign Up / Login**: Create a free account (10,000 errors/month free)
3. **Create New Project**:
   - Platform: **React**
   - Alert Frequency: **On every new issue**
   - Project Name: **Resumier** (or your preferred name)
4. **Copy DSN**: After creation, copy the DSN URL (looks like: `https://xxx@xxx.ingest.sentry.io/xxx`)

### Step 2: Configure Environment Variables (2 minutes)

1. **Create `.env` file** (already gitignored):
   ```bash
   # Create .env file from template
   copy .env.example .env
   ```

2. **Add your Sentry DSN** to `.env`:
   ```bash
   # App Configuration
   VITE_APP_VERSION=1.0.0
   
   # API Configuration (Optional - defaults to mock API)
   VITE_API_BASE_URL=http://localhost:3000/api
   
   # Monitoring (Production error tracking)
   VITE_SENTRY_DSN=https://YOUR_DSN_HERE@YOUR_ORG.ingest.sentry.io/YOUR_PROJECT_ID
   
   # Sentry Build Configuration (For CI/CD source maps upload)
   SENTRY_ORG=your-org-name
   SENTRY_PROJECT=resumier
   SENTRY_AUTH_TOKEN=your-auth-token
   ```

### Step 3: Test Error Tracking (5 minutes)

1. **Build for production**:
   ```bash
   bun run build
   ```

2. **Preview production build**:
   ```bash
   bun run preview
   ```

3. **Test error capture**:
   - Open browser console
   - Navigate to the app
   - Trigger an error (e.g., add a test button that throws an error)
   - Check Sentry dashboard for the error

4. **Test user feedback**:
   - Look for "Report an Issue" widget (if feedback integration is active)
   - Submit test feedback
   - Verify in Sentry dashboard

### Step 4: Configure Source Maps Upload (10 minutes)

For better error debugging with source maps in production:

1. **Generate Sentry Auth Token**:
   - Go to Sentry → Settings → Account → Auth Tokens
   - Create new token with permissions: `project:read`, `project:releases`, `org:read`
   - Copy the token

2. **Add token to `.env`**:
   ```bash
   SENTRY_AUTH_TOKEN=your-generated-token-here
   ```

3. **Enable Sentry Vite Plugin** in `vite.config.ts`:
   
   Currently commented out at the bottom of the config:
   ```typescript
   // Uncomment when ready to upload source maps to Sentry
   // sentryVitePlugin({
   //   org: process.env.SENTRY_ORG,
   //   project: process.env.SENTRY_PROJECT,
   //   authToken: process.env.SENTRY_AUTH_TOKEN,
   //   sourcemaps: {
   //     assets: ["./dist/**"],
   //     filesToDeleteAfterUpload: ["./dist/**/*.map"],
   //   },
   // }),
   ```
   
   Uncomment and verify:
   ```typescript
   sentryVitePlugin({
     org: process.env.SENTRY_ORG,
     project: process.env.SENTRY_PROJECT,
     authToken: process.env.SENTRY_AUTH_TOKEN,
     sourcemaps: {
       assets: ["./dist/**"],
       filesToDeleteAfterUpload: ["./dist/**/*.map"],
     },
   }),
   ```

4. **Test source maps**:
   ```bash
   bun run build
   ```
   
   You should see output indicating source maps were uploaded to Sentry.

### Step 5: Configure CI/CD for GitHub Actions (10 minutes)

1. **Add Sentry secrets to GitHub**:
   - Go to GitHub repo → Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `VITE_SENTRY_DSN`: Your Sentry DSN
     - `SENTRY_ORG`: Your Sentry organization slug
     - `SENTRY_PROJECT`: Your Sentry project name
     - `SENTRY_AUTH_TOKEN`: Your Sentry auth token

2. **Update GitHub Actions workflow** (if not already configured):
   
   The CI/CD workflow at `.github/workflows/deploy-web.yml` should include:
   ```yaml
   env:
     VITE_SENTRY_DSN: ${{ secrets.VITE_SENTRY_DSN }}
     SENTRY_ORG: ${{ secrets.SENTRY_ORG }}
     SENTRY_PROJECT: ${{ secrets.SENTRY_PROJECT }}
     SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
   ```

3. **Test deployment**:
   - Push to main branch
   - Verify build succeeds
   - Check Sentry for new release

---

## 🧪 Testing Checklist

### Error Tracking
- [ ] Create Sentry project and get DSN
- [ ] Configure `.env` with VITE_SENTRY_DSN
- [ ] Build and preview production app
- [ ] Verify Sentry is initialized (check console)
- [ ] Trigger test error and verify it appears in Sentry
- [ ] Check error details, stack trace, and context

### Performance Monitoring
- [ ] Navigate through multiple pages
- [ ] Verify page load transactions in Sentry Performance tab
- [ ] Check Web Vitals measurements (LCP, FID, CLS)
- [ ] Review slow transactions

### Session Replay
- [ ] Trigger an error
- [ ] Check Sentry Issue details for session replay
- [ ] Verify replay shows user actions leading to error
- [ ] Confirm sensitive data is masked

### User Feedback
- [ ] Locate "Report an Issue" widget in app
- [ ] Submit test feedback
- [ ] Verify feedback appears in Sentry

### Source Maps
- [ ] Generate auth token
- [ ] Configure Sentry Vite plugin
- [ ] Build production bundle
- [ ] Verify source maps uploaded (check build output)
- [ ] Check error in Sentry shows original source code (not minified)

### CI/CD Integration
- [ ] Add GitHub secrets
- [ ] Update workflow (if needed)
- [ ] Push to GitHub
- [ ] Verify automated deployment includes Sentry
- [ ] Check Sentry release tracking

---

## 📊 Sentry Dashboard Configuration

### Recommended Alert Rules

1. **High Error Rate Alert**:
   - Condition: Error count > 10 in 1 hour
   - Action: Email + Slack notification

2. **New Issue Alert**:
   - Condition: First seen error
   - Action: Email notification

3. **Performance Degradation**:
   - Condition: P95 response time > 3 seconds
   - Action: Email notification

### Performance Budget

Set performance budgets in Sentry:
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **TTFB (Time to First Byte)**: < 600ms

### Issue Tracking Integration

Connect Sentry to GitHub Issues:
1. Go to Sentry → Settings → Integrations
2. Install GitHub integration
3. Link to Resumier repository
4. Enable automatic issue creation

---

## 🎯 Expected Outcomes

### After Setup
- ✅ Errors automatically captured and reported
- ✅ Performance metrics tracked in real-time
- ✅ Session replays available for debugging
- ✅ User feedback collected through widget
- ✅ Source maps working for readable stack traces
- ✅ CI/CD pipeline uploads releases automatically

### Monitoring Metrics
- **Error Rate**: < 0.1% of sessions
- **Performance Score**: P95 < 3 seconds
- **User Feedback**: Response time < 24 hours
- **Issue Resolution**: < 7 days for critical issues

---

## 🔧 Configuration Files Reference

### Already Configured ✅
- `src/lib/monitoring/sentry.ts` - Sentry initialization
- `src/lib/monitoring/web-vitals.ts` - Web Vitals tracking
- `src/components/errors/error-boundary.tsx` - Error boundary
- `src/lib/api/client.ts` - API error tracking
- `src/main.tsx` - Sentry initialization on app start
- `vite.config.ts` - Build-time source maps
- `.env.example` - Environment template

### Needs Configuration ⚠️
- `.env` - Create with your Sentry DSN (gitignored)
- `vite.config.ts` - Uncomment `sentryVitePlugin` after adding auth token
- `.github/workflows/deploy-web.yml` - Add GitHub secrets

---

## 🐛 Troubleshooting

### Issue: "Sentry DSN not configured"
**Solution**: Add `VITE_SENTRY_DSN` to your `.env` file

### Issue: Source maps not working
**Solution**: 
1. Verify `SENTRY_AUTH_TOKEN` is set
2. Uncomment `sentryVitePlugin` in `vite.config.ts`
3. Rebuild: `bun run build`

### Issue: Errors not showing in Sentry
**Solution**:
1. Check browser console for Sentry initialization message
2. Verify `import.meta.env.PROD` is true (production build)
3. Check Sentry project quota (free tier: 10k errors/month)

### Issue: Too many noise errors
**Solution**: Add to `ignoreErrors` array in `sentry.ts`:
```typescript
ignoreErrors: [
  "chrome-extension://",
  "moz-extension://",
  "NetworkError",
  "Failed to fetch",
  "ResizeObserver loop",
  // Add your own patterns here
],
```

---

## 📈 Next Steps

After Sentry is configured:
1. ✅ Monitor error dashboard daily for first week
2. ✅ Set up alert rules for critical errors
3. ✅ Review performance metrics weekly
4. ✅ Address high-priority issues first
5. ✅ Move to Phase 20.2: SEO Enhancement

---

## 🎉 Success Criteria

- [x] Sentry packages installed (@sentry/react, @sentry/vite-plugin)
- [x] Error tracking infrastructure implemented
- [x] Performance monitoring configured
- [x] Session replay enabled (error-only)
- [x] User feedback widget integrated
- [x] Error boundary in place
- [x] API error tracking active
- [x] Web Vitals monitoring working
- [ ] Sentry project created (requires manual action)
- [ ] DSN configured in .env (requires manual action)
- [ ] Production build tested with Sentry
- [ ] Source maps upload working
- [ ] CI/CD secrets configured
- [ ] Monitoring dashboard set up

---

**Status**: Infrastructure 100% complete. Requires:
1. Create Sentry account and project (5 min)
2. Add DSN to `.env` file (1 min)
3. Test in production build (5 min)

**Next Phase**: Phase 20.2 - SEO Enhancement
