import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import path from "path"

export default defineConfig({
  // @ts-expect-error - Plugin type mismatch between vite versions
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts", "./src/setupTests.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", "dist", "build", "e2e"],
    // Ensure tests wait for environment to be ready
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: false,
      },
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: [
        "node_modules/",
        "src/setupTests.ts",
        "**/*.d.ts",
        "**/*.config.*",
        "**/mockData",
        "**/*.stories.tsx",
        "dist/",
        "e2e/",
        ".storybook/",
        "**/*.cjs",
        "**/*.mjs",
        "**/debug.compiled.js",
        "**/vitest.setup.ts",
        "**/fix-imports.cjs",
        "src/test/**",
        "src/main.tsx",
        "src/App.tsx",
        "**/index.ts",
        "**/routeTree.gen.ts",
        "**/__tests__/**",
        "**/*.test.ts",
        "**/*.test.tsx",
        "**/*.spec.ts",
        "**/*.spec.tsx",
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
})
