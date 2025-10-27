# Phase 18: Performance Optimization - Plan

**Status**: Planning  
**Started**: October 27, 2025  
**Goal**: Optimize application for production performance

## Overview

With Phases 1-14 complete and Phase 15 (Testing) at 87% completion, it's time to focus on performance optimization. This phase will ensure the application loads fast, runs smoothly, and provides an excellent user experience.

## Current State Assessment

### What We Have
- ✅ Vite build configured with manual chunking
- ✅ React 19 with automatic optimizations
- ✅ Framer Motion with reduced motion support
- ✅ TanStack Query with caching
- ✅ TanStack Router with file-based routing
- ✅ Lazy loading for some components
- ✅ Tailwind CSS v4 (CSS-first approach)

### What's Missing
- ❌ Route-based code splitting
- ❌ Component lazy loading strategy
- ❌ Image optimization
- ❌ Service Worker / PWA
- ❌ Advanced caching strategies
- ❌ Bundle size analysis
- ❌ Lighthouse performance audit
- ❌ Performance monitoring

## Phase 18 Tasks

### 18.1: Bundle Analysis & Baseline ⏳

**Goal**: Understand current bundle size and identify optimization opportunities

#### Tasks
- [ ] Install bundle analysis tools:
  ```bash
  bun add -D vite-bundle-visualizer rollup-plugin-visualizer
  ```

- [ ] Add bundle analysis script to package.json:
  ```json
  "scripts": {
    "build:analyze": "vite build --mode production && vite-bundle-visualizer"
  }
  ```

- [ ] Run production build and analyze:
  ```bash
  bun run build:analyze
  ```

- [ ] Document current metrics:
  - [ ] Total bundle size
  - [ ] Main chunk size
  - [ ] Vendor chunk sizes
  - [ ] Number of chunks
  - [ ] Load time estimates

- [ ] Run initial Lighthouse audit:
  ```bash
  npm install -g @lhci/cli
  lhci autorun --upload.target=temporary-public-storage
  ```

- [ ] Document baseline scores:
  - [ ] Performance
  - [ ] Accessibility
  - [ ] Best Practices
  - [ ] SEO

#### Deliverables
- Bundle analysis report (`bundle-analysis.html`)
- Lighthouse baseline scores document
- Optimization opportunities list

---

### 18.2: Route-Based Code Splitting ⏳

**Goal**: Implement lazy loading for all routes to reduce initial bundle size

#### Tasks
- [ ] Update route definitions to use React.lazy():
  ```typescript
  // Before
  import { Dashboard } from '@/components/dashboard'
  
  // After
  const Dashboard = lazy(() => import('@/components/dashboard'))
  ```

- [ ] Routes to lazy load:
  - [ ] `/dashboard` - Dashboard component
  - [ ] `/resume/new` - ResumeBuilder component
  - [ ] `/resume/$id` - ResumeBuilder component
  - [ ] `/resume/$id/preview` - ResumePreview component
  - [ ] `/settings` - Settings component
  - [ ] `/login` - LoginForm component

- [ ] Add Suspense boundaries with loading states:
  ```typescript
  <Suspense fallback={<RouteLoading />}>
    <Outlet />
  </Suspense>
  ```

- [ ] Test all routes load correctly
- [ ] Verify loading states appear during navigation
- [ ] Measure bundle size reduction

#### Expected Improvements
- 30-50% reduction in initial bundle size
- Faster Time to Interactive (TTI)
- Better code organization

---

### 18.3: Component Lazy Loading ⏳

**Goal**: Lazy load heavy components that aren't needed immediately

#### Tasks
- [ ] Identify heavy components:
  - [ ] PDF viewer/generator components
  - [ ] Rich text editor (if added)
  - [ ] Chart libraries (if added)
  - [ ] Dialog content (non-critical dialogs)

- [ ] Create lazy-loaded wrappers:
  ```typescript
  // src/components/lazy/index.ts
  export const LazyPDFViewer = lazy(() => import('@/components/pdf-viewer'))
  export const LazyResumePreview = lazy(() => import('@/components/resume-preview'))
  ```

- [ ] Replace imports with lazy versions:
  ```typescript
  // Before
  import { PDFViewer } from '@/components/pdf-viewer'
  
  // After
  import { LazyPDFViewer } from '@/components/lazy'
  
  <Suspense fallback={<Skeleton />}>
    <LazyPDFViewer />
  </Suspense>
  ```

- [ ] Add loading skeletons for lazy components
- [ ] Test component mounting and unmounting
- [ ] Verify performance improvements

#### Target Components
- PDF generation/preview components
- Settings panels (lazy load each tab)
- Non-critical dialogs (duplicate, delete confirmations)
- Analytics dashboard (if added)

---

### 18.4: Image Optimization ⏳

**Goal**: Optimize images for faster loading and better performance

#### Tasks
- [ ] Audit current images:
  - [ ] List all static images
  - [ ] Check file sizes
  - [ ] Identify optimization opportunities

- [ ] Install image optimization tools:
  ```bash
  bun add -D vite-plugin-image-optimizer sharp
  ```

- [ ] Configure Vite plugin:
  ```typescript
  // vite.config.ts
  import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
  
  plugins: [
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      jpg: { quality: 80 },
      webp: { quality: 80 }
    })
  ]
  ```

- [ ] Convert images to modern formats:
  - [ ] Create WebP versions
  - [ ] Add AVIF versions (optional)
  - [ ] Keep fallback formats

- [ ] Implement lazy loading for images:
  ```typescript
  <img loading="lazy" src="..." alt="..." />
  ```

- [ ] Add responsive images:
  ```typescript
  <picture>
    <source srcset="image.avif" type="image/avif" />
    <source srcset="image.webp" type="image/webp" />
    <img src="image.jpg" alt="..." />
  </picture>
  ```

- [ ] Optimize logo and favicon
- [ ] Test image loading performance

#### Expected Improvements
- 40-60% reduction in image file sizes
- Faster page load times
- Better mobile performance

---

### 18.5: Service Worker & PWA ⏳

**Goal**: Add offline support and PWA capabilities

#### Tasks
- [ ] Install PWA plugin:
  ```bash
  bun add -D vite-plugin-pwa
  ```

- [ ] Configure Vite PWA plugin:
  ```typescript
  // vite.config.ts
  import { VitePWA } from 'vite-plugin-pwa'
  
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Resumier - Professional Resume Builder',
        short_name: 'Resumier',
        description: 'Create beautiful resumes with ease',
        theme_color: '#0f172a',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.resumier\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              }
            }
          }
        ]
      }
    })
  ]
  ```

- [ ] Create PWA icons:
  - [ ] 192x192 PNG
  - [ ] 512x512 PNG
  - [ ] Apple touch icon (180x180)
  - [ ] Favicon variants

- [ ] Add manifest link to HTML:
  ```html
  <link rel="manifest" href="/manifest.webmanifest" />
  ```

- [ ] Test PWA installation on mobile
- [ ] Test offline functionality
- [ ] Verify service worker updates

#### Expected Improvements
- Offline support for static assets
- App-like experience on mobile
- Better caching strategy
- Improved repeat visit performance

---

### 18.6: Advanced Caching Strategies ⏳

**Goal**: Implement intelligent caching for API requests and assets

#### Tasks
- [ ] Configure TanStack Query cache:
  ```typescript
  // src/app/query-client.ts
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnWindowFocus: true,
        refetchOnReconnect: true
      }
    }
  })
  ```

- [ ] Implement cache persistence:
  ```bash
  bun add @tanstack/query-persist-client-core
  bun add @tanstack/query-sync-storage-persister
  ```

- [ ] Configure persister:
  ```typescript
  import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
  import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
  
  const persister = createSyncStoragePersister({
    storage: window.localStorage,
    key: 'RESUMIER_QUERY_CACHE'
  })
  ```

- [ ] Add cache warming for critical data:
  ```typescript
  // Prefetch dashboard data on login
  await queryClient.prefetchQuery({
    queryKey: ['resumes'],
    queryFn: fetchResumes
  })
  ```

- [ ] Implement optimistic updates for all mutations
- [ ] Add stale-while-revalidate pattern for non-critical data
- [ ] Configure cache invalidation strategies

#### Expected Improvements
- Instant data on repeat visits
- Better offline experience
- Reduced API calls
- Smoother user experience

---

### 18.7: Build Optimization ⏳

**Goal**: Optimize Vite build configuration for maximum performance

#### Tasks
- [ ] Update Vite config for optimal chunking:
  ```typescript
  // vite.config.ts
  export default defineConfig({
    build: {
      target: 'esnext',
      minify: 'esbuild',
      cssMinify: 'lightningcss',
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'tanstack-vendor': [
              '@tanstack/react-query',
              '@tanstack/react-router',
              '@tanstack/react-table'
            ],
            'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
            'motion': ['framer-motion'],
            'form': ['react-hook-form', 'zod']
          },
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]'
        }
      },
      chunkSizeWarningLimit: 1000,
      reportCompressedSize: false // Faster builds
    }
  })
  ```

- [ ] Enable CSS code splitting:
  ```typescript
  css: {
    devSourcemap: true,
    modules: {
      localsConvention: 'camelCase'
    }
  }
  ```

- [ ] Configure tree shaking:
  ```json
  // package.json
  {
    "sideEffects": false
  }
  ```

- [ ] Add preload hints for critical chunks
- [ ] Optimize font loading with `font-display: swap`
- [ ] Test build output and verify chunk sizes

#### Expected Improvements
- Smaller bundle sizes
- Better caching (stable chunk hashes)
- Faster builds
- Optimized loading priority

---

### 18.8: Performance Monitoring ⏳

**Goal**: Add runtime performance monitoring and analytics

#### Tasks
- [ ] Add Web Vitals monitoring:
  ```bash
  bun add web-vitals
  ```

- [ ] Create performance monitoring hook:
  ```typescript
  // src/hooks/use-web-vitals.ts
  import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals'
  
  export function useWebVitals() {
    useEffect(() => {
      onCLS(console.log)
      onFID(console.log)
      onFCP(console.log)
      onLCP(console.log)
      onTTFB(console.log)
    }, [])
  }
  ```

- [ ] Add to root component:
  ```typescript
  // src/app/App.tsx
  function App() {
    useWebVitals() // Track performance metrics
    return <RouterProvider router={router} />
  }
  ```

- [ ] Set up performance budget:
  ```json
  // lighthouse-budget.json
  [
    {
      "path": "/*",
      "resourceSizes": [
        { "resourceType": "script", "budget": 300 },
        { "resourceType": "stylesheet", "budget": 50 },
        { "resourceType": "image", "budget": 200 },
        { "resourceType": "total", "budget": 600 }
      ],
      "resourceCounts": [
        { "resourceType": "script", "budget": 10 },
        { "resourceType": "stylesheet", "budget": 5 },
        { "resourceType": "third-party", "budget": 5 }
      ]
    }
  ]
  ```

- [ ] Add performance markers:
  ```typescript
  // Mark key user interactions
  performance.mark('resume-builder-mount')
  performance.mark('resume-save-start')
  performance.mark('resume-save-end')
  
  // Measure durations
  performance.measure('resume-save', 'resume-save-start', 'resume-save-end')
  ```

- [ ] Create performance dashboard (optional)
- [ ] Set up alerts for performance regressions

#### Expected Improvements
- Visibility into real-world performance
- Early detection of regressions
- Data-driven optimization decisions

---

### 18.9: Final Lighthouse Audit ⏳

**Goal**: Run comprehensive Lighthouse audit and achieve 90+ scores

#### Tasks
- [ ] Run Lighthouse CI:
  ```bash
  lhci autorun --upload.target=temporary-public-storage
  ```

- [ ] Test on multiple pages:
  - [ ] Home page (`/`)
  - [ ] Dashboard (`/dashboard`)
  - [ ] Resume builder (`/resume/new`)
  - [ ] Resume preview (`/resume/$id/preview`)

- [ ] Audit all metrics:
  - [ ] Performance (target: 90+)
    - [ ] First Contentful Paint < 1.8s
    - [ ] Largest Contentful Paint < 2.5s
    - [ ] Cumulative Layout Shift < 0.1
    - [ ] Total Blocking Time < 200ms
    - [ ] Speed Index < 3.4s
  
  - [ ] Accessibility (target: 95+)
    - [ ] All images have alt text
    - [ ] Proper heading hierarchy
    - [ ] Sufficient color contrast
    - [ ] ARIA labels where needed
  
  - [ ] Best Practices (target: 95+)
    - [ ] HTTPS only
    - [ ] No console errors
    - [ ] Secure headers
    - [ ] No vulnerable libraries
  
  - [ ] SEO (target: 95+)
    - [ ] Meta descriptions
    - [ ] Proper title tags
    - [ ] Mobile-friendly
    - [ ] Valid robots.txt

- [ ] Document findings and create issues for any failures
- [ ] Fix critical issues
- [ ] Re-run audit to verify improvements

#### Target Scores
- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 95+

---

### 18.10: Performance Documentation ⏳

**Goal**: Document all optimization strategies and results

#### Tasks
- [ ] Create performance guide:
  - [ ] Bundle optimization strategies
  - [ ] Code splitting patterns
  - [ ] Caching strategies
  - [ ] Image optimization workflow
  - [ ] PWA setup guide

- [ ] Document metrics:
  - [ ] Before/after bundle sizes
  - [ ] Before/after Lighthouse scores
  - [ ] Load time improvements
  - [ ] Performance budget compliance

- [ ] Create performance checklist for future development:
  - [ ] Lazy load new routes
  - [ ] Optimize new images
  - [ ] Test bundle size impact
  - [ ] Run Lighthouse before merging

- [ ] Add performance section to README.md
- [ ] Update CONTRIBUTING.md with performance guidelines

#### Deliverables
- `PERFORMANCE.md` - Complete performance guide
- `PHASE_18_SUMMARY.md` - Results and improvements
- Updated README.md and CONTRIBUTING.md

---

## Success Criteria

### Performance Metrics
- ✅ Initial bundle size < 300KB (gzipped)
- ✅ Main chunk < 150KB
- ✅ First Contentful Paint < 1.8s
- ✅ Largest Contentful Paint < 2.5s
- ✅ Time to Interactive < 3.0s
- ✅ Cumulative Layout Shift < 0.1
- ✅ Total Blocking Time < 200ms

### Lighthouse Scores
- ✅ Performance: 90+
- ✅ Accessibility: 95+
- ✅ Best Practices: 95+
- ✅ SEO: 95+

### User Experience
- ✅ App loads in < 3 seconds on 3G
- ✅ Smooth 60fps animations
- ✅ No layout shifts during load
- ✅ Instant navigation with prefetching
- ✅ Offline support for core features

### Development
- ✅ Performance budget enforced
- ✅ Automated Lighthouse CI
- ✅ Bundle analysis in CI
- ✅ Performance monitoring in production

---

## Timeline Estimate

- **18.1**: Bundle Analysis (0.5 day)
- **18.2**: Route Code Splitting (0.5 day)
- **18.3**: Component Lazy Loading (0.5 day)
- **18.4**: Image Optimization (0.5 day)
- **18.5**: Service Worker & PWA (1 day)
- **18.6**: Caching Strategies (0.5 day)
- **18.7**: Build Optimization (0.5 day)
- **18.8**: Performance Monitoring (0.5 day)
- **18.9**: Final Audit (0.5 day)
- **18.10**: Documentation (0.5 day)

**Total: 5-6 days**

---

## Dependencies

### Before Starting Phase 18
- ✅ Phase 15 (Testing) should be at least 80% complete
- ✅ All critical bugs fixed
- ✅ Feature development complete

### Parallel Work
- Can run alongside Phase 17 (Documentation)
- Can run alongside Phase 16 (CI/CD setup)

---

## Tools & Libraries

### Analysis Tools
- `vite-bundle-visualizer` - Bundle visualization
- `rollup-plugin-visualizer` - Rollup bundle analysis
- `@lhci/cli` - Lighthouse CI
- `web-vitals` - Real-world performance metrics

### Optimization Tools
- `vite-plugin-image-optimizer` - Image compression
- `vite-plugin-pwa` - PWA support
- `@tanstack/query-persist-client-core` - Query cache persistence
- `sharp` - Image processing

### Monitoring Tools
- `web-vitals` - Core Web Vitals tracking
- Performance API - Custom metrics
- Lighthouse CI - Automated audits

---

## Next Steps

1. ✅ Review and approve this plan
2. ⏳ Run initial bundle analysis (18.1)
3. ⏳ Start with quick wins (route splitting, lazy loading)
4. ⏳ Set up PWA and caching
5. ⏳ Run final audit and document results

---

## Notes

- Focus on user-facing improvements first
- Test on real devices (mobile, tablet, desktop)
- Monitor performance in production
- Iterate based on real user data
- Don't over-optimize prematurely

**Remember**: Performance is a feature, not an afterthought! 🚀
