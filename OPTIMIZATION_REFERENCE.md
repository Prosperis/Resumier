# Performance Optimization Reference Guide - Resumier

**Version:** 1.0  
**Last Updated:** October 27, 2025  
**Audience:** Developers, DevOps, Technical Leads

---

## 📋 Table of Contents

1. [Quick Reference](#quick-reference)
2. [Optimization Techniques](#optimization-techniques)
3. [Tool Configuration](#tool-configuration)
4. [Command Reference](#command-reference)
5. [Troubleshooting Guide](#troubleshooting-guide)
6. [Performance Patterns](#performance-patterns)
7. [Anti-Patterns to Avoid](#anti-patterns-to-avoid)
8. [Measurement & Analysis](#measurement--analysis)
9. [Resources](#resources)

---

## 🚀 Quick Reference

### Performance Targets

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| **Lighthouse Performance (Desktop)** | ≥ 90 | **100** | 🏆 |
| **Lighthouse Performance (Mobile)** | ≥ 90 | **98** | 🏆 |
| **LCP** | < 2.5s | 0.5s / 1.5s | 🏆 |
| **FCP** | < 1.8s | 0.5s / 1.5s | 🏆 |
| **CLS** | < 0.1 | 0 | 🏆 |
| **TBT** | < 300ms | 0ms | 🏆 |
| **Total Size (Brotli)** | < 1 MB | **232 KB** | 🏆 |

### Common Commands

```cmd
:: Build for production
bun run build

:: Preview production build
bun run preview

:: Analyze bundle
bun run build
start dist\stats.html

:: Run Lighthouse
lighthouse https://prosperis.github.io/Resumier/ --preset desktop

:: Check dependencies
bun outdated

:: Security audit
bun audit

:: Type check
bun run type-check

:: Lint code
bun run lint
```

### Critical Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Build configuration |
| `lighthouserc.js` | Lighthouse CI budgets |
| `src/lib/monitoring/web-vitals.ts` | Performance tracking |
| `src/main.tsx` | Sentry initialization |
| `src/app/query-client.ts` | Query caching config |
| `.github/workflows/deploy.yml` | CI/CD pipeline |

---

## ⚡ Optimization Techniques

### 1. Code Splitting

#### Route-Based Splitting
**Impact:** 🔥🔥🔥🔥🔥 (91% main bundle reduction)

**Technique:**
```typescript
// Before: Eager loading
import Dashboard from './routes/dashboard'

// After: Lazy loading
import { lazy } from 'react'
const Dashboard = lazy(() => import('./routes/dashboard.lazy'))

// With Suspense boundary
<Suspense fallback={<LoadingSpinner />}>
  <Dashboard />
</Suspense>
```

**When to Use:**
- ✅ All routes
- ✅ Heavy page components
- ✅ Admin/settings pages

**When NOT to Use:**
- ❌ Landing page
- ❌ Critical above-fold content
- ❌ Components < 5 KB

**Configuration:**
```typescript
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor-react': ['react', 'react-dom'],
        'vendor-router': ['@tanstack/react-router'],
      }
    }
  }
}
```

#### Component-Level Splitting
**Impact:** 🔥🔥🔥🔥 (70% component reduction)

**Technique:**
```typescript
// Split heavy components
const ResumeEditor = lazy(() => import('./ResumeEditor'))
const ExportDialog = lazy(() => import('./ExportDialog'))

// Use in modal/dialog
function ExportButton() {
  const [open, setOpen] = useState(false)
  
  return (
    <>
      <Button onClick={() => setOpen(true)}>Export</Button>
      {open && (
        <Suspense fallback={<LoadingDialog />}>
          <ExportDialog onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </>
  )
}
```

**Best For:**
- Heavy form libraries
- Rich text editors
- Chart libraries
- PDF generators
- Image editors

#### Library Splitting
**Impact:** 🔥🔥🔥 (Better caching, parallel downloads)

**Technique:**
```javascript
// vite.config.ts - Manual chunking
manualChunks(id) {
  // Core framework
  if (id.includes('node_modules/react')) {
    return 'vendor-react'
  }
  
  // Heavy libraries
  if (id.includes('framer-motion')) {
    return 'lib-motion'
  }
  
  if (id.includes('@dnd-kit')) {
    return 'lib-dnd'
  }
  
  // Form libraries
  if (id.includes('react-hook-form') || id.includes('@tanstack/react-form')) {
    return 'lib-forms'
  }
}
```

**Benefits:**
- Long-term caching of vendor code
- Parallel chunk downloads
- Better compression (similar code together)

---

### 2. Image Optimization

#### WebP Conversion
**Impact:** 🔥🔥🔥🔥🔥 (96% reduction)

**Configuration:**
```typescript
// vite.config.ts
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

ViteImageOptimizer({
  png: {
    quality: 80,
  },
  jpg: {
    quality: 80,
  },
  webp: {
    quality: 80,
    lossless: false,
  },
})
```

**Usage:**
```tsx
// Automatic processing at build time
import logoLight from '@/assets/logo-light.png'

// Vite generates optimized WebP
<img src={logoLight} alt="Logo" />

// Manual <picture> element
<picture>
  <source srcset="/assets/logo.webp" type="image/webp" />
  <img src="/assets/logo.png" alt="Logo" />
</picture>
```

**Results:**
- PNG (1.37 MB) → WebP (23 KB) = 98% reduction
- Maintained visual quality
- Automatic fallback for old browsers

#### Lazy Loading Images
**Impact:** 🔥🔥🔥 (Faster initial load)

**Technique:**
```tsx
// Native lazy loading
<img 
  src="/image.webp" 
  alt="Description"
  loading="lazy"
  width="800"
  height="600"
/>

// Intersection Observer (advanced)
function LazyImage({ src, alt }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const ref = useRef(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsLoaded(true)
        observer.disconnect()
      }
    })
    
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  
  return (
    <img 
      ref={ref}
      src={isLoaded ? src : '/placeholder.svg'}
      alt={alt}
    />
  )
}
```

**When to Use:**
- ✅ Below-fold images
- ✅ Image galleries
- ✅ Long articles with images

**When NOT to Use:**
- ❌ Hero images
- ❌ Above-fold content
- ❌ Critical brand assets (logo)

---

### 3. Compression

#### Brotli Compression
**Impact:** 🔥🔥🔥🔥🔥 (75% reduction)

**Configuration:**
```typescript
// vite.config.ts
import viteCompression from 'vite-plugin-compression'

export default {
  plugins: [
    // Gzip (fallback)
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240, // 10 KB minimum
      deleteOriginFile: false,
    }),
    // Brotli (best compression)
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240,
      deleteOriginFile: false,
    }),
  ],
}
```

**Results:**
- Uncompressed: 932 KB
- Gzip: 264 KB (-72%)
- **Brotli: 232 KB (-75%)** ✅

**Server Configuration:**
```
// GitHub Pages automatically serves .br files
// No additional configuration needed

// For other hosting:
// Nginx: Enable brotli module
// Apache: Enable mod_brotli
// Cloudflare: Enable Brotli automatically
```

---

### 4. PWA & Caching

#### Service Worker
**Impact:** 🔥🔥🔥🔥 (Offline support, faster repeat visits)

**Configuration:**
```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa'

VitePWA({
  registerType: 'autoUpdate',
  manifest: {
    name: 'Resumier',
    short_name: 'Resumier',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts-cache',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
    ],
  },
})
```

**Benefits:**
- Offline access to app
- Installable PWA
- Faster repeat visits
- Background sync (if configured)

**Overhead:**
- Service worker: ~5 KB
- Workbox runtime: ~8 KB
- Manifest: < 1 KB
- **Total: ~13 KB** (excellent ROI)

#### Query Caching
**Impact:** 🔥🔥🔥 (Faster navigation, offline data)

**Configuration:**
```typescript
// src/app/query-client.ts
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

const persister = createSyncStoragePersister({
  storage: window.localStorage,
})

persistQueryClient({
  queryClient,
  persister,
  maxAge: 1000 * 60 * 60 * 24, // 24 hours
})
```

**Cache Warming:**
```typescript
// Route loaders
export const Route = createFileRoute('/dashboard')({
  loader: async ({ context: { queryClient } }) => {
    // Prefetch data before route renders
    await queryClient.ensureQueryData(getResumesQueryOptions())
  },
})
```

**Benefits:**
- Instant navigation (cached data)
- Offline data access
- Reduced API calls
- Better UX

**Overhead:** ~7 KB

---

### 5. Performance Monitoring

#### Web Vitals
**Impact:** 🔥🔥🔥🔥 (Visibility into real user experience)

**Implementation:**
```typescript
// src/lib/monitoring/web-vitals.ts
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals'
import * as Sentry from '@sentry/react'

export function reportWebVitals() {
  function sendToAnalytics(metric: Metric) {
    // Send to Sentry
    Sentry.metrics.distribution(metric.name, metric.value, {
      unit: 'millisecond',
      tags: {
        page: window.location.pathname,
      },
    })
    
    // Log in development
    if (import.meta.env.DEV) {
      console.log(`[Web Vitals] ${metric.name}: ${metric.value}`)
    }
  }
  
  onCLS(sendToAnalytics)
  onFCP(sendToAnalytics)
  onINP(sendToAnalytics)
  onLCP(sendToAnalytics)
  onTTFB(sendToAnalytics)
}
```

**Initialization:**
```typescript
// src/main.tsx
import { reportWebVitals } from './lib/monitoring/web-vitals'

reportWebVitals()
```

#### Sentry Integration
**Impact:** 🔥🔥🔥🔥 (Error tracking, performance monitoring)

**Configuration:**
```typescript
// src/main.tsx
import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
})
```

**Benefits:**
- Automatic error capture
- Performance transaction tracking
- Session replay
- Real User Monitoring (RUM)

---

## 🔧 Tool Configuration

### Vite Configuration

**File:** `vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import viteCompression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite(),
    VitePWA({ /* config */ }),
    ViteImageOptimizer({ /* config */ }),
    viteCompression({ algorithm: 'gzip' }),
    viteCompression({ algorithm: 'brotliCompress' }),
    visualizer({ filename: 'dist/stats.html' }),
  ],
  
  base: '/Resumier/', // GitHub Pages path
  
  build: {
    target: 'esnext',
    minify: 'terser',
    cssCodeSplit: true,
    
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },
    
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react/jsx-runtime'],
          'vendor-router': ['@tanstack/react-router'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-form': ['@tanstack/react-form'],
          'lib-dnd': ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
          'lib-motion': ['framer-motion'],
          'lib-ui': ['@radix-ui/react-dropdown-menu', '@radix-ui/react-dialog', /* ... */],
          'lib-utils': ['clsx', 'tailwind-merge', 'class-variance-authority'],
        },
      },
    },
  },
  
  server: {
    port: 3000,
  },
  
  preview: {
    port: 4173,
  },
})
```

### Lighthouse CI Configuration

**File:** `lighthouserc.js`

```javascript
module.exports = {
  ci: {
    collect: {
      url: ['https://prosperis.github.io/Resumier/'],
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
      },
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        // Category scores
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        
        // Core Web Vitals
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        
        // Resource budgets
        'resource-summary:script:size': ['error', { maxNumericValue: 307200 }], // 300 KB
        'resource-summary:stylesheet:size': ['error', { maxNumericValue: 51200 }], // 50 KB
        'resource-summary:image:size': ['error', { maxNumericValue: 204800 }], // 200 KB
        'resource-summary:total:size': ['error', { maxNumericValue: 1048576 }], // 1 MB
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
```

### TypeScript Configuration

**File:** `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    
    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    
    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    
    /* Paths */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

---

## 💻 Command Reference

### Build Commands

```cmd
:: Clean build
rmdir /s /q dist
bun run build

:: Build with analysis
bun run build
start dist\stats.html

:: Preview production build
bun run preview

:: Build and deploy (GitHub Pages)
bun run build
git subtree push --prefix dist origin gh-pages
```

### Testing Commands

```cmd
:: Run all tests
bun test

:: Run tests in watch mode
bun test --watch

:: Run specific test file
bun test src\components\Button.test.tsx

:: Generate coverage
bun test --coverage
```

### Lint & Type Check

```cmd
:: Run linter
bun run lint

:: Fix lint issues
bun run lint --fix

:: Type check
bun run type-check

:: Format code
bun run format
```

### Performance Audits

```cmd
:: Lighthouse desktop
lighthouse https://prosperis.github.io/Resumier/ ^
  --output html json ^
  --output-path lighthouse-desktop.html ^
  --preset desktop

:: Lighthouse mobile
lighthouse https://prosperis.github.io/Resumier/ ^
  --output html json ^
  --output-path lighthouse-mobile.html ^
  --preset mobile

:: Lighthouse CI
lhci autorun

:: Custom Lighthouse options
lighthouse https://prosperis.github.io/Resumier/ ^
  --throttling-method=devtools ^
  --throttling.cpuSlowdownMultiplier=4 ^
  --output html
```

### Dependency Management

```cmd
:: Install dependencies
bun install

:: Add dependency
bun add [package]

:: Add dev dependency
bun add -d [package]

:: Remove dependency
bun remove [package]

:: Update all dependencies
bun update

:: Check outdated packages
bun outdated

:: Security audit
bun audit

:: Check package size before installing
bunx bundle-size [package-name]
```

### Git Commands

```cmd
:: Check status
git status

:: Add all changes
git add .

:: Commit changes
git commit -m "Description"

:: Push to remote
git push origin main

:: Create branch
git checkout -b feature/name

:: View recent commits
git log --oneline -n 10

:: Revert commit
git revert [commit-hash]

:: View diff
git diff
```

---

## 🔍 Troubleshooting Guide

### Build Issues

#### Error: "Out of memory"

**Symptoms:**
```
FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
```

**Solution:**
```cmd
:: Increase Node memory limit
set NODE_OPTIONS=--max-old-space-size=4096
bun run build
```

#### Error: "Module not found"

**Symptoms:**
```
Error: Cannot find module '@/components/Button'
```

**Solution:**
```cmd
:: Clear cache
rmdir /s /q node_modules
del bun.lockb

:: Reinstall
bun install

:: Check tsconfig.json paths configuration
```

#### Error: "Build takes too long"

**Symptoms:**
- Build time > 30 seconds

**Solutions:**
1. Check bundle analysis for large dependencies
2. Ensure proper code splitting
3. Verify cache working (`node_modules/.vite`)
4. Consider incremental builds

```typescript
// vite.config.ts
build: {
  sourcemap: false, // Disable source maps in production
  reportCompressedSize: false, // Skip gzip size reporting
}
```

---

### Performance Issues

#### Issue: Lighthouse score dropped

**Diagnosis:**
```cmd
:: Compare scores
lighthouse [url] --preset desktop
:: Note current score

:: Check recent changes
git diff [last-good-commit]

:: Review bundle size
bun run build
start dist\stats.html
```

**Common Causes:**
1. **New large dependency added**
   - Check bundle analyzer
   - Find lighter alternative
   - Lazy load if possible

2. **Images not optimized**
   - Verify WebP generation
   - Check image sizes
   - Ensure optimizer configured

3. **Code splitting broken**
   - Check lazy() imports
   - Verify Suspense boundaries
   - Review manualChunks config

4. **Service worker issues**
   - Clear cache
   - Unregister service worker
   - Rebuild and redeploy

**Solution:**
```cmd
:: Rollback if critical
git revert [bad-commit]
git push origin main

:: Or fix and redeploy
:: Fix the issue
bun run build
git commit -am "Fix performance regression"
git push origin main
```

#### Issue: High LCP

**Symptoms:**
- LCP > 2.5s
- Lighthouse reports slow content rendering

**Diagnosis:**
```typescript
// Check web-vitals in console
// Open DevTools Console
// Look for: [Web Vitals] LCP: [value]
```

**Common Causes:**
1. **Slow image loading**
   - Large images above fold
   - Not using WebP
   - No dimensions specified

2. **Render-blocking resources**
   - Large CSS bundles
   - Synchronous scripts
   - Fonts blocking render

3. **Slow server response**
   - TTFB > 600ms
   - API delays
   - CDN issues

**Solutions:**
```tsx
// Optimize images
<img 
  src="/hero.webp"
  alt="Hero"
  width="1200"
  height="800"  // Prevent CLS
  fetchpriority="high"  // Prioritize loading
/>

// Preload critical assets
<link rel="preload" href="/hero.webp" as="image" />

// Optimize fonts
<link 
  rel="preconnect" 
  href="https://fonts.googleapis.com" 
/>
<link 
  rel="preload"
  href="/fonts/inter-var.woff2"
  as="font"
  type="font/woff2"
  crossorigin="anonymous"
/>
```

#### Issue: Non-zero CLS

**Symptoms:**
- CLS > 0
- Content shifts during load

**Common Causes:**
1. **Images without dimensions**
2. **Dynamically injected content**
3. **Web fonts causing FOIT/FOUT**
4. **Ads or embeds**

**Solutions:**
```tsx
// Always specify image dimensions
<img 
  src="/image.webp"
  width="800"
  height="600"
  alt="Description"
/>

// Reserve space for dynamic content
<div 
  style={{ minHeight: '200px' }}
  className="skeleton-loader"
>
  {dynamicContent}
</div>

// Use font-display for web fonts
@font-face {
  font-family: 'Inter';
  font-display: swap; /* Prevent FOIT */
  src: url('/fonts/inter.woff2') format('woff2');
}
```

---

### Deployment Issues

#### Issue: 404 errors after deployment

**Symptoms:**
- Assets not loading
- Blank page
- Console errors: "Failed to load resource"

**Common Cause:**
- Incorrect base path

**Solution:**
```typescript
// vite.config.ts
export default {
  base: '/Resumier/', // Must match GitHub repo name
}
```

```cmd
:: Rebuild with correct base
bun run build
git add dist
git commit -m "Fix base path"
git push origin main
```

#### Issue: Service worker not updating

**Symptoms:**
- Old version still loaded after deployment
- Changes not visible

**Solution:**
```javascript
// Force unregister in DevTools
// Application → Service Workers → Unregister

// Or programmatically
navigator.serviceWorker.getRegistrations()
  .then(registrations => {
    registrations.forEach(reg => reg.unregister())
  })

// Then hard reload
// Ctrl + Shift + R
```

---

## 🎯 Performance Patterns

### Pattern 1: Progressive Enhancement

**Principle:** Start with basic functionality, enhance with JavaScript

**Example:**
```tsx
// Base: Works without JS
<form action="/api/save" method="POST">
  <input name="title" required />
  <button type="submit">Save</button>
</form>

// Enhanced: Better UX with JS
function ResumeForm() {
  const [title, setTitle] = useState('')
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    // Optimistic UI update
    // API call with error handling
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <button type="submit">Save</button>
    </form>
  )
}
```

### Pattern 2: Optimistic Updates

**Principle:** Update UI immediately, sync in background

**Example:**
```typescript
function useOptimisticUpdate() {
  const queryClient = useQueryClient()
  
  const mutation = useMutation({
    mutationFn: updateResume,
    
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['resume'] })
      
      // Snapshot previous value
      const previous = queryClient.getQueryData(['resume'])
      
      // Optimistically update
      queryClient.setQueryData(['resume'], newData)
      
      return { previous }
    },
    
    onError: (err, newData, context) => {
      // Rollback on error
      queryClient.setQueryData(['resume'], context.previous)
    },
    
    onSettled: () => {
      // Refetch to ensure sync
      queryClient.invalidateQueries({ queryKey: ['resume'] })
    },
  })
  
  return mutation
}
```

### Pattern 3: Virtualization

**Principle:** Only render visible items in long lists

**Example:**
```tsx
import { useVirtualizer } from '@tanstack/react-virtual'

function VirtualList({ items }) {
  const parentRef = useRef(null)
  
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  })
  
  return (
    <div ref={parentRef} style={{ height: '500px', overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map(virtualRow => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            {items[virtualRow.index]}
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Pattern 4: Debouncing & Throttling

**Principle:** Limit frequency of expensive operations

**Example:**
```typescript
import { useDebounce } from '@/hooks/useDebounce'

function SearchInput() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  
  const { data } = useQuery({
    queryKey: ['search', debouncedSearch],
    queryFn: () => searchResumes(debouncedSearch),
    enabled: debouncedSearch.length > 2,
  })
  
  return (
    <input
      value={search}
      onChange={e => setSearch(e.target.value)}
      placeholder="Search..."
    />
  )
}

// useDebounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    
    return () => clearTimeout(timeout)
  }, [value, delay])
  
  return debouncedValue
}
```

---

## ❌ Anti-Patterns to Avoid

### 1. Importing Entire Libraries

**❌ Bad:**
```typescript
import _ from 'lodash' // Imports entire library (~70 KB)
import moment from 'moment' // Large library (~300 KB)
```

**✅ Good:**
```typescript
import { debounce } from 'lodash-es' // Tree-shakeable
import { format } from 'date-fns' // Smaller, modular
```

### 2. No Code Splitting

**❌ Bad:**
```typescript
import HeavyEditor from './HeavyEditor'

function App() {
  return <HeavyEditor /> // Always loaded
}
```

**✅ Good:**
```typescript
import { lazy, Suspense } from 'react'

const HeavyEditor = lazy(() => import('./HeavyEditor'))

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyEditor />
    </Suspense>
  )
}
```

### 3. Inline Styles Over CSS

**❌ Bad:**
```tsx
<div style={{ backgroundColor: 'blue', padding: '20px' }}>
  {/* Creates new object on every render */}
</div>
```

**✅ Good:**
```tsx
// styles.module.css
.container {
  background-color: blue;
  padding: 20px;
}

// Component
<div className={styles.container}>
  {/* Reuses CSS, better performance */}
</div>
```

### 4. Excessive Re-renders

**❌ Bad:**
```typescript
function Parent() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>
        Count: {count}
      </button>
      <HeavyChild /> {/* Re-renders on every count change */}
    </div>
  )
}
```

**✅ Good:**
```typescript
const HeavyChild = memo(function HeavyChild() {
  // Only re-renders when props change
  return <div>Heavy computation</div>
})

function Parent() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>
        Count: {count}
      </button>
      <HeavyChild />
    </div>
  )
}
```

### 5. Not Using Production Build

**❌ Bad:**
```cmd
:: Deploying development build
bun run dev
:: (Never do this in production)
```

**✅ Good:**
```cmd
:: Always use production build
bun run build
bun run preview
```

---

## 📊 Measurement & Analysis

### Lighthouse

**Desktop Audit:**
```cmd
lighthouse https://prosperis.github.io/Resumier/ ^
  --output html json ^
  --output-path report-desktop.html ^
  --preset desktop
```

**Mobile Audit:**
```cmd
lighthouse https://prosperis.github.io/Resumier/ ^
  --output html json ^
  --output-path report-mobile.html ^
  --preset mobile
```

**Interpreting Scores:**
- 🟢 90-100: Good
- 🟠 50-89: Needs Improvement
- 🔴 0-49: Poor

### Bundle Analyzer

**Generate Report:**
```cmd
bun run build
start dist\stats.html
```

**What to Look For:**
- Large dependencies (> 50 KB)
- Duplicate libraries
- Unused code
- Poor chunking

### Chrome DevTools

**Performance Tab:**
1. Open DevTools (F12)
2. Performance tab
3. Click Record
4. Interact with page
5. Stop recording
6. Analyze flame graph

**Coverage Tab:**
1. Open DevTools
2. Cmd+Shift+P → "Show Coverage"
3. Click Record
4. Use application
5. Stop recording
6. Identify unused code (red bars)

**Network Tab:**
1. Open DevTools
2. Network tab
3. Reload page
4. Check:
   - Total size
   - Number of requests
   - Waterfall (loading order)
   - Compression (Content-Encoding: br)

---

## 📚 Resources

### Official Documentation

- [Vite Documentation](https://vite.dev/)
- [React Documentation](https://react.dev/)
- [TanStack Router](https://tanstack.com/router/latest)
- [TanStack Query](https://tanstack.com/query/latest)
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)

### Tools

- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Sentry](https://sentry.io/)
- [Bundle Analyzer](https://github.com/btd/rollup-plugin-visualizer)
- [WebPageTest](https://www.webpagetest.org/)
- [PageSpeed Insights](https://pagespeed.web.dev/)

### Learning Resources

- [Web.dev Performance](https://web.dev/performance/)
- [MDN Performance](https://developer.mozilla.org/en-US/docs/Web/Performance)
- [Chrome DevTools Docs](https://developer.chrome.com/docs/devtools/)
- [React Performance](https://react.dev/learn/render-and-commit)

### Internal Documentation

- `PHASE_18_COMPLETE.md` - Complete optimization journey
- `DEPLOYMENT_GUIDE.md` - Deployment procedures
- `PERFORMANCE_MONITORING.md` - Monitoring strategy
- `PERFORMANCE_MAINTENANCE.md` - Maintenance checklist

---

## 🎓 Quick Tips

1. **Measure First:** Always baseline before optimizing
2. **Target P90/P95:** Don't just optimize for average users
3. **Real Users Matter:** Synthetic tests ≠ real experience
4. **Progressive Enhancement:** Start simple, add complexity
5. **Bundle Size:** Every KB counts, especially on mobile
6. **Images:** Usually biggest optimization opportunity
7. **Code Splitting:** Most impactful performance win
8. **Caching:** Fast requests = no requests
9. **Monitor Continuously:** Regressions happen
10. **Document Everything:** Future you will thank you

---

**Document Version:** 1.0  
**Last Updated:** October 27, 2025  
**Maintained By:** Development Team  
**Review Schedule:** Quarterly

---

*Performance is a feature, not an afterthought. Build fast, stay fast!* 🚀
