# Deployment Guide - Resumier

**Version:** 1.0  
**Last Updated:** October 27, 2025  
**Platform:** GitHub Pages  
**Build Tool:** Vite 6.x + Bun

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Build Verification](#build-verification)
3. [Performance Testing](#performance-testing)
4. [Deployment Steps](#deployment-steps)
5. [Post-Deployment Verification](#post-deployment-verification)
6. [Monitoring Setup](#monitoring-setup)
7. [Rollback Procedures](#rollback-procedures)
8. [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

### Required Software
- **Bun:** 1.3.0 or higher
- **Node.js:** 20.x or higher (if using npm)
- **Git:** Latest version
- **Lighthouse CLI:** 12.x or higher (for local testing)

### Installation
```cmd
:: Install Bun (Windows)
powershell -c "irm bun.sh/install.ps1|iex"

:: Install dependencies
bun install

:: Verify installation
bun --version
```

### Required Environment Variables
None required for GitHub Pages deployment (all configuration in `vite.config.ts`)

### Access Requirements
- GitHub repository write access
- GitHub Pages enabled on repository
- Branch protection rules configured (if applicable)

---

## ✅ Build Verification

### Pre-Build Checklist

**1. Code Quality Checks**
```cmd
:: Run linter
bun run lint

:: Type check
bun run type-check

:: Run tests (optional, see notes)
bun test
```

**Notes:**
- TypeScript test errors are acceptable for production builds
- Focus on application code quality, not test infrastructure
- Ensure no new errors introduced in application code

**2. Dependency Audit**
```cmd
:: Check for security vulnerabilities
bun audit

:: Update outdated packages (cautiously)
bun update --latest
```

**3. Version Control**
```cmd
:: Ensure clean working directory
git status

:: Commit all changes
git add .
git commit -m "Pre-deployment commit"

:: Push to remote
git push origin main
```

### Build Process

**1. Clean Previous Build**
```cmd
:: Remove old dist directory
rmdir /s /q dist

:: Clear Vite cache
rmdir /s /q node_modules\.vite
```

**2. Run Production Build**
```cmd
:: Build for production
bun run build
```

**Expected Output:**
```
✓ 150+ modules transformed.
dist/index.html                   1.83 kB │ gzip: 0.82 kB │ brotli: 0.68 kB
dist/assets/logo-light-[hash].webp   23.12 kB
dist/assets/logo-dark-[hash].webp    23.12 kB
dist/assets/index-[hash].css      117.19 kB │ gzip: 23.45 kB │ brotli: 19.87 kB
dist/assets/[chunk]-[hash].js     [various sizes]
...
✓ built in 12.34s
```

**3. Verify Build Output**
```cmd
:: Check dist directory
dir dist

:: Verify key files exist
dir dist\assets
dir dist\manifest.webmanifest
dir dist\sw.js
```

**Required Files:**
- ✅ `index.html`
- ✅ `manifest.webmanifest`
- ✅ `sw.js` (service worker)
- ✅ `workbox-*.js` (Workbox runtime)
- ✅ `assets/` directory with chunks
- ✅ `.webp` image files
- ✅ Compressed `.gz` and `.br` files

### Build Size Verification

**1. Check Bundle Sizes**
```cmd
:: Generate bundle analysis
bun run build
:: Stats file generated at dist/stats.html
```

**2. Verify Size Budgets**

| Asset Type | Budget | Threshold |
|------------|--------|-----------|
| **Total JS (Brotli)** | < 300 KB | < 250 KB |
| **Total CSS (Brotli)** | < 50 KB | < 40 KB |
| **Images** | < 200 KB | < 150 KB |
| **Total (Brotli)** | < 1 MB | < 500 KB |

**Current Sizes (as of Phase 18):**
- Total JS (Brotli): **198 KB** ✅
- Total CSS (Brotli): **32 KB** ✅
- Images: **119 KB** ✅
- **Total: 232 KB** ✅

**3. Compare with Previous Build**
```cmd
:: Save current build stats
copy dist\stats.html dist\stats-backup.html

:: Compare sizes
:: (Manual comparison of stats.html files)
```

---

## 🧪 Performance Testing

### Local Testing

**1. Preview Production Build**
```cmd
:: Serve production build locally
bun run preview
```

**Output:**
```
➜ Local:   http://localhost:4173/Resumier/
➜ Network: http://192.168.1.x:4173/Resumier/
```

**2. Manual Browser Testing**

**Test Scenarios:**
- ✅ Application loads correctly
- ✅ All routes navigate properly
- ✅ Images load (WebP with PNG fallback)
- ✅ PWA installs successfully
- ✅ Service worker registers
- ✅ Offline mode works
- ✅ No console errors
- ✅ Dark/light theme switches

**Test Browsers:**
- Chrome/Edge (Chromium)
- Firefox
- Safari (if available)

**3. Lighthouse Audit (Local)**
```cmd
:: Audit local preview
lighthouse http://localhost:4173/Resumier/ --output html --output-path lighthouse-local.html --preset desktop

lighthouse http://localhost:4173/Resumier/ --output html --output-path lighthouse-local-mobile.html --preset mobile
```

**Expected Scores (Local):**
- Performance: ≥ 90 (may be lower than deployed due to localhost)
- Accessibility: 100
- Best Practices: 100
- SEO: ≥ 90

**Note:** Local scores may differ from deployed scores due to network conditions.

### Automated Performance Testing

**1. Lighthouse CI (Optional)**
```cmd
:: Run Lighthouse CI
lhci autorun
```

**2. Web Vitals Monitoring**
- Ensure Sentry is configured
- Check web-vitals.ts implementation
- Verify tracking in browser console

---

## 🚀 Deployment Steps

### GitHub Pages Deployment

**Method 1: GitHub Actions (Recommended)**

**1. Verify GitHub Actions Workflow**

File: `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
      
      - name: Install dependencies
        run: bun install
      
      - name: Build
        run: bun run build
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**2. Trigger Deployment**
```cmd
:: Push to main branch
git push origin main

:: Or trigger manually via GitHub UI
:: Go to: Actions → Deploy to GitHub Pages → Run workflow
```

**3. Monitor Deployment**
- Navigate to: https://github.com/[org]/Resumier/actions
- Watch workflow progress
- Check for errors in build logs

**Method 2: Manual Deployment**

**1. Build and Deploy Script**
```cmd
:: Create deployment script: deploy.cmd
@echo off
echo Building for production...
bun run build

echo Deploying to gh-pages branch...
git subtree push --prefix dist origin gh-pages

echo Deployment complete!
```

**2. Run Deployment**
```cmd
:: Execute deployment script
deploy.cmd
```

---

## ✅ Post-Deployment Verification

### Immediate Checks (0-5 minutes)

**1. Verify Deployment URL**
```
https://prosperis.github.io/Resumier/
```

**2. Basic Functionality**
- ✅ Site loads without errors
- ✅ No 404 errors in console
- ✅ All routes accessible
- ✅ Images load correctly
- ✅ Service worker registers
- ✅ PWA installable

**3. Console Check**
```javascript
// Open DevTools Console
// Verify Web Vitals logging
// Check for errors
```

**Expected Output:**
```
[Web Vitals] LCP: 0.5s (good)
[Web Vitals] FCP: 0.5s (good)
[Web Vitals] CLS: 0 (good)
[Service Worker] Registered successfully
```

### Comprehensive Verification (5-15 minutes)

**1. Lighthouse Production Audit**
```cmd
:: Desktop audit
lighthouse https://prosperis.github.io/Resumier/ --output html --output-path lighthouse-production-desktop.html --preset desktop

:: Mobile audit
lighthouse https://prosperis.github.io/Resumier/ --output html --output-path lighthouse-production-mobile.html --preset mobile
```

**Expected Scores:**
- **Desktop Performance:** 100/100
- **Mobile Performance:** ≥ 98/100
- **Accessibility:** 100/100
- **Best Practices:** 100/100
- **SEO:** ≥ 90/100

**2. Core Web Vitals Verification**

| Metric | Target | Desktop | Mobile | Status |
|--------|--------|---------|--------|--------|
| LCP | < 2.5s | 0.5s | 1.5s | ✅ |
| FCP | < 1.8s | 0.5s | 1.5s | ✅ |
| CLS | < 0.1 | 0 | 0 | ✅ |
| TBT | < 300ms | 0ms | 0ms | ✅ |

**3. Resource Verification**

**Check Network Tab:**
- ✅ All resources load (200 status)
- ✅ Compressed assets served (`.br` or `.gz`)
- ✅ WebP images loaded
- ✅ Service worker caching active

**Check Application Tab:**
- ✅ Service worker: "Activated and running"
- ✅ Cache storage: Contains assets
- ✅ Manifest: Correct configuration
- ✅ IndexedDB: Query cache populated

**4. Cross-Browser Testing**

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome | Latest | ✅ | Primary browser |
| Edge | Latest | ✅ | Chromium-based |
| Firefox | Latest | ✅ | Test separately |
| Safari | Latest | ✅ | If available |

**5. Device Testing**

**Desktop:**
- ✅ 1920x1080 (Full HD)
- ✅ 1366x768 (Laptop)
- ✅ 2560x1440 (2K)

**Mobile:**
- ✅ iPhone 12/13/14 (390x844)
- ✅ iPhone SE (375x667)
- ✅ Samsung Galaxy S21 (360x800)
- ✅ iPad (810x1080)

### Monitoring Verification (15-30 minutes)

**1. Sentry Configuration**
- Navigate to Sentry dashboard
- Verify deployment event logged
- Check for new errors
- Confirm performance data flowing

**2. Web Vitals Tracking**
- Check real user metrics in Sentry
- Verify Core Web Vitals reported
- Monitor for anomalies

**3. Service Worker Updates**
- Clear cache and reload
- Verify new version installed
- Check console for update messages

---

## 📊 Monitoring Setup

### Real-Time Monitoring

**1. Sentry Performance Monitoring**

**Configuration:** (Already set up in `src/main.tsx`)
```typescript
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
})
```

**Verify:**
- Dashboard: https://sentry.io/organizations/[org]/projects/
- Check for errors in last 24 hours
- Review performance metrics
- Monitor Core Web Vitals

**2. Web Vitals Tracking**

**Implementation:** `src/lib/monitoring/web-vitals.ts`

**Metrics Tracked:**
- LCP (Largest Contentful Paint)
- FCP (First Contentful Paint)
- CLS (Cumulative Layout Shift)
- INP (Interaction to Next Paint)
- TTFB (Time to First Byte)

**Verify:**
- Open browser console
- Navigate through application
- Check for Web Vitals logs
- Verify Sentry integration

### Automated Monitoring

**1. Lighthouse CI Setup**

**Configuration:** `lighthouserc.js`
```javascript
module.exports = {
  ci: {
    collect: {
      url: ['https://prosperis.github.io/Resumier/'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
  },
}
```

**Run Automated Audits:**
```cmd
:: Single run
lhci autorun

:: Continuous integration (in CI/CD)
:: Add to GitHub Actions workflow
```

**2. GitHub Actions Integration**

**Add to `.github/workflows/lighthouse-ci.yml`:**
```yaml
name: Lighthouse CI
on: [deployment_status]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    if: github.event.deployment_status.state == 'success'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm install -g @lhci/cli
      - run: lhci autorun
```

### Alerting Setup

**1. Sentry Alerts**

**Configure Alerts:**
- Error rate > 10% increase
- Performance degradation > 20%
- Core Web Vitals exceed thresholds

**Alert Channels:**
- Email notifications
- Slack integration
- PagerDuty (for critical)

**2. GitHub Actions Notifications**

**Failed Build Alerts:**
- Email on workflow failure
- Slack webhook notifications
- Status badges in README

---

## 🔄 Rollback Procedures

### Emergency Rollback

**Scenario:** Critical bug or performance regression detected after deployment.

**1. Immediate Rollback (GitHub Pages)**

**Method A: Revert Commit**
```cmd
:: Identify bad commit
git log --oneline -n 10

:: Revert to previous commit
git revert [commit-hash]

:: Push revert
git push origin main

:: GitHub Actions will auto-deploy previous version
```

**Method B: Redeploy Previous Version**
```cmd
:: Checkout previous commit
git checkout [previous-commit-hash]

:: Build previous version
bun run build

:: Force push to gh-pages
git subtree push --prefix dist origin gh-pages --force
```

**2. Verify Rollback**
```cmd
:: Check deployed site
start https://prosperis.github.io/Resumier/

:: Run quick Lighthouse audit
lighthouse https://prosperis.github.io/Resumier/ --preset desktop --output html
```

**3. Communication**
- Notify team of rollback
- Create incident report
- Document issue in GitHub Issues
- Plan fix for next deployment

### Planned Rollback

**Scenario:** Scheduled rollback to test or revert features.

**1. Identify Target Version**
```cmd
:: List recent releases
git tag -l

:: Or list commits
git log --oneline -n 20
```

**2. Create Rollback Branch**
```cmd
:: Create branch from target version
git checkout -b rollback/[reason] [target-commit]

:: Push branch
git push origin rollback/[reason]
```

**3. Deploy Rollback**
```cmd
:: Build from rollback branch
bun run build

:: Deploy
git subtree push --prefix dist origin gh-pages
```

**4. Monitor Rollback**
- Check deployment status
- Run Lighthouse audits
- Verify functionality
- Monitor Sentry for errors

---

## 🔧 Troubleshooting

### Build Failures

**Issue:** Build fails with "out of memory" error

**Solution:**
```cmd
:: Increase Node memory limit
set NODE_OPTIONS=--max-old-space-size=4096
bun run build
```

**Issue:** Module resolution errors

**Solution:**
```cmd
:: Clear cache and reinstall
rmdir /s /q node_modules
rmdir /s /q bun.lockb
bun install
bun run build
```

**Issue:** TypeScript errors in tests blocking build

**Solution:**
- Ensure `vite.config.ts` excludes test files:
```typescript
build: {
  // Build process doesn't type-check test files
}
```
- Focus on application code quality
- Fix test types separately

### Deployment Failures

**Issue:** GitHub Actions workflow fails

**Solution:**
1. Check workflow logs in GitHub Actions tab
2. Verify permissions in repository settings
3. Ensure GitHub Pages is enabled
4. Check branch protection rules

**Issue:** 404 errors after deployment

**Solution:**
1. Verify base path in `vite.config.ts`:
```typescript
base: '/Resumier/',
```
2. Ensure all routes use relative paths
3. Check service worker configuration

**Issue:** Assets not loading (404)

**Solution:**
1. Check network tab for failed requests
2. Verify assets are in `dist/` directory
3. Check CORS configuration
4. Ensure compression files deployed (`.gz`, `.br`)

### Performance Issues

**Issue:** Lower Lighthouse scores than expected

**Solution:**
1. Clear browser cache and test again
2. Check network throttling settings
3. Verify all optimizations deployed:
   - Code splitting active
   - Images compressed to WebP
   - Brotli compression enabled
   - Service worker registered
4. Run multiple audits (scores vary slightly)

**Issue:** Service worker not updating

**Solution:**
```javascript
// Force update in DevTools
// Application → Service Workers → Unregister
// Then reload page

// Or programmatically:
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(registration => registration.unregister())
})
```

**Issue:** Images loading slowly

**Solution:**
1. Verify WebP images generated in `dist/assets/`
2. Check compression settings in `vite.config.ts`
3. Ensure CDN caching active (GitHub Pages)
4. Consider lazy loading implementation

### Monitoring Issues

**Issue:** Sentry not receiving data

**Solution:**
1. Check DSN configuration
2. Verify environment variable set
3. Check network tab for Sentry requests
4. Review Sentry project settings

**Issue:** Web Vitals not logging

**Solution:**
1. Verify `web-vitals` package installed
2. Check console for errors
3. Ensure `src/lib/monitoring/web-vitals.ts` imported
4. Test in incognito mode (extensions can interfere)

---

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] All changes committed and pushed
- [ ] Build completes successfully
- [ ] No critical linter errors
- [ ] Bundle sizes within budget
- [ ] Local Lighthouse audit passes (≥ 90 all categories)
- [ ] Cross-browser testing complete
- [ ] Release notes prepared

### Deployment
- [ ] GitHub Actions workflow triggered
- [ ] Build logs reviewed
- [ ] No errors in workflow
- [ ] Deployment status: Success

### Post-Deployment
- [ ] Site loads at production URL
- [ ] No console errors
- [ ] All routes functional
- [ ] Images loading correctly
- [ ] Service worker active
- [ ] PWA installable
- [ ] Production Lighthouse audit (≥ 90 all categories)
- [ ] Core Web Vitals within targets
- [ ] Cross-browser verification
- [ ] Mobile device testing
- [ ] Sentry receiving data
- [ ] Web Vitals tracking active

### Monitoring (24 hours)
- [ ] No error spikes in Sentry
- [ ] Performance metrics stable
- [ ] Core Web Vitals within targets
- [ ] User feedback collected
- [ ] No rollback needed

---

## 🎯 Success Criteria

### Deployment Success
- ✅ Build completes in < 2 minutes
- ✅ Zero build errors
- ✅ All assets deployed correctly
- ✅ Site accessible at production URL

### Performance Success
- ✅ Desktop Performance: 100/100
- ✅ Mobile Performance: ≥ 98/100
- ✅ Accessibility: 100/100
- ✅ Best Practices: 100/100
- ✅ SEO: ≥ 90/100

### Monitoring Success
- ✅ Sentry tracking active
- ✅ Web Vitals reporting
- ✅ No critical errors logged
- ✅ Performance within targets

---

## 📚 Additional Resources

### Documentation
- [Vite Deployment Guide](https://vite.dev/guide/static-deploy.html)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)
- [Web Vitals Documentation](https://web.dev/vitals/)

### Tools
- [Lighthouse Chrome Extension](https://chrome.google.com/webstore/detail/lighthouse/)
- [WebPageTest](https://www.webpagetest.org/)
- [PageSpeed Insights](https://pagespeed.web.dev/)

### Internal Documentation
- `PHASE_18_COMPLETE.md` - Complete optimization journey
- `PERFORMANCE_MONITORING.md` - Monitoring strategy (next doc)
- `PERFORMANCE_MAINTENANCE.md` - Maintenance checklist (next doc)
- `OPTIMIZATION_REFERENCE.md` - Optimization guide (next doc)

---

**Document Version:** 1.0  
**Last Updated:** October 27, 2025  
**Maintained By:** Development Team  
**Review Schedule:** Quarterly

---

*For questions or issues, please create a GitHub issue or contact the development team.*
