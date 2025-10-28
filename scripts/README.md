# Resumier Wiki Scripts

This folder contains various utility scripts used during development and testing.

## Script Categories

### Build & Optimization
- `generate-pwa-icons.mjs` - Generate PWA icons from source images
- `optimize-images.mjs` - Optimize project images

### Testing & Import Fixes
- `fix-imports.cjs` - Fix module imports
- `fix-mock-hoisting.mjs` - Fix mock hoisting issues
- `fix-vi-mocked.mjs` - Fix vi.mocked() calls
- `fix-vitest-imports.mjs` - Fix Vitest imports
- `fix-vitest-imports.ps1` - PowerShell script for fixing Vitest imports
- `revert-vitest-imports.mjs` - Revert Vitest import changes
- `update-vi-imports.mjs` - Update vi imports

### Test Utilities
- `remove-reset-mocks.mjs` - Remove reset mocks from tests
- `replace-clear-with-reset.mjs` - Replace clearAllMocks with resetAllMocks

### Debug
- `debug.compiled.js` - Compiled debug utilities

## Usage

Most scripts can be run directly with Node.js:

```bash
node scripts/<script-name>.mjs
```

Or with Bun:

```bash
bun scripts/<script-name>.mjs
```

For PowerShell scripts:

```powershell
.\scripts\<script-name>.ps1
```

## Note

These are utility scripts used during development. Most are not part of the regular build or test process.
