import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import path from "path"
import { visualizer } from "rollup-plugin-visualizer"
import { ViteImageOptimizer } from "vite-plugin-image-optimizer"
import { VitePWA } from "vite-plugin-pwa"
import viteCompression from "vite-plugin-compression"

export default defineConfig(() => {
  // Use "/" for Vercel deployment, "/Resumier/" only for GitHub Pages
  // Set VITE_BASE_PATH=/Resumier/ environment variable for GitHub Pages deployment
  const base = process.env.VITE_BASE_PATH || "/"
  
  return {
    base,
    plugins: [
      react(),
      tailwindcss(),
    visualizer({
      filename: "./dist/stats.html",
      open: true,
      gzipSize: true,
      brotliSize: true,
      template: "treemap", // 'sunburst', 'treemap', 'network'
    }),
    ViteImageOptimizer({
      // PNG optimization
      png: {
        quality: 80, // 0-100
      },
      // JPEG optimization
      jpeg: {
        quality: 80,
      },
      jpg: {
        quality: 80,
      },
      // WebP optimization
      webp: {
        quality: 80,
      },
      // AVIF optimization (best compression)
      avif: {
        quality: 70,
      },
      // SVG optimization
      svg: {
        multipass: true,
        plugins: [
          {
            name: "preset-default",
            params: {
              overrides: {
                cleanupNumericValues: false,
                removeViewBox: false, // Keep viewBox for proper scaling
              },
            },
          },
          "sortAttrs",
          {
            name: "addAttributesToSVGElement",
            params: {
              attributes: [{ xmlns: "http://www.w3.org/2000/svg" }],
            },
          },
        ],
      },
    }),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "robots.txt", "logo_dark.webp", "logo_light.webp"],
      manifest: {
        name: "Resumier - Professional Resume Builder",
        short_name: "Resumier",
        description: "Create professional, ATS-friendly resumes with ease",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        scope: base,
        start_url: base,
        icons: [
          {
            src: `${base}pwa-192x192.png`,
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: `${base}pwa-512x512.png`,
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        // Cache strategies
        // Use more specific patterns to avoid duplicate cache entries
        // (manifest icons and includeAssets are added separately)
        globPatterns: ["**/*.{js,css,html,ico,svg}"],
        // Exclude PWA icons and logos - they're added via manifest and includeAssets
        globIgnores: ["**/logo_*.webp", "**/pwa-*.png"],
        // Include additional assets explicitly via additionalManifestEntries if needed
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "gstatic-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
          {
            urlPattern: /\.(?:js|css)$/i,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "static-resources",
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: false, // Disable in dev for faster reloads
      },
    }),
    // Gzip compression
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240, // Only compress files > 10KB
      algorithm: "gzip",
      ext: ".gz",
    }),
    // Brotli compression (better than gzip)
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: "brotliCompress",
      ext: ".br",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Output directory
    outDir: "dist",
    // No sourcemaps for production (smaller files)
    sourcemap: false,
    // Minify with esbuild for faster builds and smaller output
    minify: "esbuild",
    // Target modern browsers for better optimization
    target: "esnext",
    // CSS code splitting
    cssCodeSplit: true,
    // Chunk size warnings
    chunkSizeWarningLimit: 500,
    // Don't report compressed size (faster builds, compression plugin shows it)
    reportCompressedSize: false,
    // Terser options for better minification (fallback if needed)
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true, // Remove debugger statements
        pure_funcs: ["console.log", "console.info"], // Remove specific console methods
      },
    },
    rollupOptions: {
      output: {
        // Manual chunking for better caching and code splitting
        manualChunks: (id) => {
          // Core React - must load first
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) {
            return "react"
          }
          
          // Lucide icons - bundle with React to ensure proper initialization order
          // lucide-react's createLucideIcon uses React.forwardRef which must be available
          if (id.includes("lucide-react") || id.includes("node_modules/lucide")) {
            return "react"
          }

          // TanStack Query (separate from other TanStack)
          if (id.includes("@tanstack/react-query")) {
            return "tanstack-query"
          }

          // TanStack Router (separate for better caching)
          if (id.includes("@tanstack/react-router")) {
            return "tanstack-router"
          }

          // TanStack Table (only loaded on dashboard)
          if (id.includes("@tanstack/react-table")) {
            return "tanstack-table"
          }

          // TanStack Form & Virtual (smaller libs)
          if (id.includes("@tanstack/react-form") || id.includes("@tanstack/react-virtual")) {
            return "tanstack-utils"
          }

          // Framer Motion (large animation library)
          if (id.includes("framer-motion")) {
            return "motion"
          }

          // Form libraries (react-hook-form, zod)
          if (id.includes("react-hook-form") || id.includes("@hookform/resolvers") || id.includes("zod")) {
            return "form"
          }

          // Radix UI primitives - split into logical groups
          if (id.includes("@radix-ui/")) {
            // Dialog-related components
            if (id.includes("dialog") || id.includes("alert-dialog")) {
              return "ui-dialogs"
            }
            // Dropdown & Menu components
            if (id.includes("dropdown") || id.includes("select") || id.includes("navigation-menu")) {
              return "ui-menus"
            }
            // Form-related UI
            if (id.includes("checkbox") || id.includes("radio") || id.includes("switch") || id.includes("slider")) {
              return "ui-forms"
            }
            // Other UI components
            return "ui-primitives"
          }

          // DnD Kit
          if (id.includes("@dnd-kit")) {
            return "dnd-kit"
          }

          // Date utilities (if any)
          if (id.includes("date-fns") || id.includes("dayjs")) {
            return "date-utils"
          }

          // Remaining node_modules
          if (id.includes("node_modules")) {
            return "vendor"
          }
        },
        // Better chunk naming for cache busting
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
  },
  server: {
    port: 5174,
    strictPort: false,
    open: false,
    host: true,
  },
  preview: {
    port: 4173,
    strictPort: false,
    open: false,
    headers: {
      // Security Headers
      "Content-Security-Policy": 
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
        "font-src 'self' https://fonts.gstatic.com data:; " +
        "img-src 'self' data: blob: https:; " +
        "connect-src 'self'; " +
        "frame-ancestors 'none'; " +
        "base-uri 'self'; " +
        "form-action 'self';",
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
      "X-XSS-Protection": "1; mode=block",
      // HSTS (Strict-Transport-Security) - only for HTTPS
      // "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload"
    },
  },
}
})
