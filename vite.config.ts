import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import path from "path"

export default defineConfig({
  base: "/Resumier/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Output directory
    outDir: "dist",
    // Generate sourcemaps for production debugging
    sourcemap: false,
    // Minify with esbuild for faster builds
    minify: "esbuild",
    // Target modern browsers
    target: "esnext",
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Manual chunking for better caching
        manualChunks: {
          react: ["react", "react-dom"],
          tanstack: [
            "@tanstack/react-query",
            "@tanstack/react-router",
            "@tanstack/react-table",
            "@tanstack/react-form",
            "@tanstack/react-virtual",
          ],
          ui: ["@radix-ui/react-avatar", "@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"],
          motion: ["framer-motion"],
        },
      },
    },
  },
  server: {
    port: 5173,
    strictPort: false,
    open: false,
    host: true,
  },
  preview: {
    port: 4173,
    strictPort: false,
    open: false,
  },
})
