export default {
  ci: {
    collect: {
      // Build command
      startServerCommand: 'bun run preview',
      // URL to test
      url: ['http://localhost:4173/Resumier/'],
      // Number of runs (more = better average)
      numberOfRuns: 3,
      // Settings for the Lighthouse run
      settings: {
        preset: 'desktop',
        // Only run performance, accessibility, best-practices, SEO
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo', 'pwa'],
      },
    },
    assert: {
      // Performance budgets - minimum scores
      assertions: {
        // Performance metrics
        'categories:performance': ['error', { minScore: 0.9 }], // 90+
        'categories:accessibility': ['error', { minScore: 0.9 }], // 90+
        'categories:best-practices': ['error', { minScore: 0.9 }], // 90+
        'categories:seo': ['error', { minScore: 0.9 }], // 90+
        'categories:pwa': ['warn', { minScore: 0.8 }], // 80+ (warning only)

        // Core Web Vitals
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }], // < 2s
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }], // < 2.5s
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }], // < 0.1
        'total-blocking-time': ['warn', { maxNumericValue: 300 }], // < 300ms
        'speed-index': ['warn', { maxNumericValue: 3000 }], // < 3s

        // Resource budgets
        'resource-summary:script:size': ['warn', { maxNumericValue: 300000 }], // < 300 KB
        'resource-summary:stylesheet:size': ['warn', { maxNumericValue: 50000 }], // < 50 KB
        'resource-summary:image:size': ['warn', { maxNumericValue: 200000 }], // < 200 KB
        'resource-summary:total:size': ['warn', { maxNumericValue: 1000000 }], // < 1 MB
      },
    },
    upload: {
      // Store results locally for now
      target: 'filesystem',
      outputDir: './lighthouse-results',
    },
  },
}
