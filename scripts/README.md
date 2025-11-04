# Resumier Scripts

This folder contains utility scripts for build optimization and testing.

## Available Scripts

### Build & Optimization
- **`generate-pwa-icons.mjs`** - Generate PWA icons from source images
  ```bash
  npm run generate:pwa-icons
  ```

- **`optimize-images.mjs`** - Optimize project images (PNG to WebP conversion)
  ```bash
  npm run optimize:images
  ```

### Testing & Validation
- **`test-security-headers.js`** - Test security headers on preview server
  ```bash
  node scripts/test-security-headers.js
  ```

- **`validate-workflow.js`** - Validate GitHub Actions workflow configuration
  ```bash
  node scripts/validate-workflow.js
  ```

## Usage

Scripts can be run directly with Node.js or Bun:

```bash
node scripts/<script-name>.mjs
bun scripts/<script-name>.mjs
```

Some scripts are also available as npm/bun commands (see individual script descriptions above).
