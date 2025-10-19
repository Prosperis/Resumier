# Configuration Backup

**Date**: October 18, 2025
**Purpose**: Preserve important configurations before rebuild

---

## Environment Variables

**Status**: No .env files found in current project

**Future Environment Variables to Set Up**:

```bash
# Development
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_ENV=development

# Production
VITE_API_BASE_URL=https://api.resumier.com
VITE_APP_ENV=production

# Optional
VITE_ANALYTICS_ID=
VITE_SENTRY_DSN=
```

---

## Vite Configuration

**File**: `apps/web/vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  base: '/Resumier/',  // GitHub Pages base path
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**Key Points**:
- Base path set to `/Resumier/` for GitHub Pages deployment
- Path alias `@` points to `src` directory
- Using Tailwind CSS v4 Vite plugin

---

## TypeScript Configuration

**File**: `apps/web/tsconfig.json`

```jsonc
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" },
    { "path": "./tsconfig.vitest.json" }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Key Points**:
- Project references for better build performance
- Path aliases matching Vite config
- Separate configs for app, node, and vitest

---

## shadcn/ui Configuration

**File**: `apps/web/components.json`

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

**Key Points**:
- Using "new-york" style
- CSS variables enabled for theming
- Neutral base color
- Lucide icons

---

## Package Scripts (apps/web)

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "vitest",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}
```

---

## Git Configuration

**Repository**: adriandarian/Resumier
**Branch**: main
**Remote**: github.com

---

## Current Deployment

**Platform**: GitHub Pages (inferred from vite.config.ts base path)
**URL**: Likely `https://adriandarian.github.io/Resumier/`

---

## Zustand Persistence Keys

**localStorage keys**:
- `resumier-documents` - Document list store

**IndexedDB**:
- `resumier-web-store` - Main resume data store (via idb-keyval)

**Important**: Preserve these keys during migration to avoid data loss for existing users

---

## GitHub Actions Setup

**Current Status**: Need to check `.github/workflows/` directory

**Required for New Setup**:
- CI workflow for testing
- CD workflow for deployment
- Branch protection rules

---

## Notes

1. **Base Path**: Remember to keep `/Resumier/` base path for GitHub Pages
2. **Path Aliases**: Maintain `@/` alias pattern throughout new structure
3. **Theme**: Using CSS variables for theming - preserve this pattern
4. **Storage Keys**: Don't change Zustand persistence keys to avoid breaking existing users
5. **shadcn Style**: Keep "new-york" style for consistency
