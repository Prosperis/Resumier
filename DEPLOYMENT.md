# CI/CD Pipeline & Deployment Guide

## Overview

This document describes the automated Continuous Integration and Continuous Deployment (CI/CD) pipeline for Resumier.

## Pipeline Architecture

The CI/CD pipeline consists of 6 jobs that run automatically on every push and pull request:

```
┌─────────┐  ┌─────────┐  ┌──────────┐
│  Lint   │  │  Test   │  │ Security │
└────┬────┘  └────┬────┘  └────┬─────┘
     │            │             │
     └────────────┴─────────────┘
                  │
            ┌─────▼─────┐
            │   Build   │
            └─────┬─────┘
                  │
         ┌────────▼────────┐
         │     Deploy      │ (main branch only)
         └────────┬────────┘
                  │
         ┌────────▼────────┐
         │   Lighthouse    │ (performance check)
         └─────────────────┘
```

## Jobs Description

### 1. Lint & Format Check
**Purpose:** Ensure code quality and consistent formatting

**Actions:**
- Runs Biome linting on all source files
- Checks code formatting
- Fails if linting errors are found
- Reports formatting issues (non-blocking)

**Commands:**
```bash
bun run lint        # Check for linting errors
bun run format:check # Check formatting
```

### 2. Test & Coverage
**Purpose:** Run automated tests and generate coverage reports

**Actions:**
- Runs all Vitest test suites
- Generates coverage reports (HTML + JSON)
- Uploads coverage artifacts (retained for 30 days)
- Verifies 80% coverage threshold

**Commands:**
```bash
bun test --coverage --run
```

**Coverage Threshold:** 80% (2,444+ tests)

### 3. Security Audit
**Purpose:** Check for security vulnerabilities and run security tests

**Actions:**
- Checks for outdated packages
- Runs security utility tests
- Reports any vulnerabilities found

**Commands:**
```bash
bun outdated
bun test src/lib/security --run
```

### 4. Build & Bundle Analysis
**Purpose:** Build production bundle and analyze size

**Actions:**
- Builds production-ready application
- Analyzes bundle sizes
- Warns if main bundle exceeds 500KB
- Uploads build artifacts and bundle statistics
- Generates treemap visualization

**Commands:**
```bash
bun run build
```

**Bundle Size Limits:**
- Main bundle: < 500KB uncompressed (< 100KB gzipped)
- Total initial load: < 1MB

### 5. Deploy to GitHub Pages
**Purpose:** Automatically deploy to production (main branch only)

**Trigger:** Push to `main` branch only

**Actions:**
- Downloads build artifacts from build job
- Configures GitHub Pages
- Uploads to GitHub Pages
- Deploys to production
- Reports deployment URL

**Deployment URL:** https://prosperis.github.io/Resumier/

### 6. Lighthouse Performance Check
**Purpose:** Verify production performance (optional)

**Trigger:** After successful deployment to `main`

**Actions:**
- Waits 30 seconds for deployment to stabilize
- Runs Lighthouse CI tests
- Tests performance, accessibility, best practices, SEO
- Uploads results as artifacts

**Target Scores:**
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 95

## Workflow Triggers

### Automatic Triggers

1. **Push to `main`:**
   - Runs all jobs
   - Deploys to production
   - Runs Lighthouse checks

2. **Push to `develop`:**
   - Runs lint, test, security, and build
   - No deployment

3. **Pull Request to `main` or `develop`:**
   - Runs lint, test, security, and build
   - No deployment
   - Provides preview of changes

### Manual Trigger

You can manually trigger the workflow:
1. Go to Actions tab in GitHub
2. Select "CI/CD Pipeline"
3. Click "Run workflow"
4. Choose the branch
5. Click "Run workflow"

## Environment Configuration

### Required Secrets

No secrets required for basic deployment. Optional:

- `VITE_API_URL` - Production API URL (if using real backend)
- `VITE_SENTRY_DSN` - Sentry error tracking DSN (optional)

### Environment Variables

Set in workflow file or repository settings:

```yaml
NODE_ENV: production
VITE_APP_VERSION: ${{ github.sha }}
```

## Local Testing

Before pushing, test the pipeline locally:

### 1. Run Linting
```bash
bun run lint
bun run format:check
```

### 2. Run Tests
```bash
bun test --coverage --run
```

### 3. Run Security Tests
```bash
bun test src/lib/security --run
```

### 4. Build Production Bundle
```bash
bun run build
```

### 5. Preview Production Build
```bash
bun run preview
```

## Deployment Process

### Automatic Deployment (Recommended)

1. Commit your changes
2. Push to `main` branch
3. Pipeline automatically runs
4. If all checks pass, deploys to GitHub Pages
5. Check deployment at https://prosperis.github.io/Resumier/

### Manual Deployment

If needed, you can deploy manually:

```bash
# Build the project
bun run build

# Deploy to GitHub Pages (requires gh CLI)
gh-pages -d dist -b gh-pages
```

## Monitoring Deployments

### GitHub Actions Dashboard

1. Go to repository → Actions tab
2. View workflow runs
3. Click on a run to see details
4. View logs for each job

### Checking Deployment Status

```bash
# Check latest deployment
gh run list --workflow=ci-cd.yml --limit 1

# View run details
gh run view <run-id>
```

### Artifacts

After each run, the following artifacts are available:

1. **coverage-report** (30 days)
   - HTML coverage report
   - JSON coverage data
   - LCOV report

2. **dist** (7 days)
   - Production build files
   - All assets

3. **bundle-stats** (7 days)
   - Bundle size visualization
   - Treemap of dependencies

## Troubleshooting

### Build Fails

**Symptom:** Build job fails with compilation errors

**Solution:**
```bash
# Run type checking locally
bun run build

# Check for TypeScript errors
bunx tsc --noEmit
```

### Tests Fail

**Symptom:** Test job fails

**Solution:**
```bash
# Run tests locally
bun test --run

# Run specific test file
bun test src/path/to/test.test.ts
```

### Lint Fails

**Symptom:** Lint job fails

**Solution:**
```bash
# Check linting errors
bun run lint

# Auto-fix linting issues
bun run lint:fix

# Format code
bun run format
```

### Deployment Fails

**Symptom:** Deploy job fails

**Solutions:**
1. Check GitHub Pages is enabled in repository settings
2. Verify branch is set to `gh-pages`
3. Check repository permissions
4. Ensure workflow has `pages: write` permission

### Bundle Size Warning

**Symptom:** Warning about bundle size exceeding 500KB

**Solutions:**
1. Review bundle stats in artifacts
2. Identify large dependencies
3. Use code splitting for heavy components
4. Consider lazy loading

## GitHub Pages Configuration

### Initial Setup

1. Go to repository Settings → Pages
2. Source: Deploy from a branch
3. Branch: `gh-pages`
4. Folder: `/ (root)`
5. Save

### Custom Domain (Optional)

If you want to use a custom domain:

1. Add `CNAME` file to `public/` folder:
   ```
   yourdomain.com
   ```

2. Configure DNS:
   ```
   Type: CNAME
   Name: @
   Value: prosperis.github.io
   ```

3. Enable "Enforce HTTPS" in Pages settings

## Performance Optimization

### Cache Strategy

The workflow uses these caching strategies:

1. **Dependencies Cache:**
   - Bun automatically caches dependencies
   - Speeds up installation

2. **Build Cache:**
   - Vite caches build outputs
   - Faster subsequent builds

### Optimization Tips

1. **Reduce Bundle Size:**
   - Use dynamic imports
   - Remove unused dependencies
   - Enable tree shaking

2. **Faster CI Runs:**
   - Use `--frozen-lockfile` for installs
   - Run jobs in parallel
   - Cache dependencies

3. **Improve Lighthouse Scores:**
   - Optimize images
   - Minimize JavaScript
   - Use proper caching headers

## Branch Strategy

### Recommended Workflow

1. **Feature Development:**
   ```bash
   git checkout -b feature/new-feature
   # Make changes
   git commit -m "feat: add new feature"
   git push origin feature/new-feature
   # Create PR to develop
   ```

2. **Development Testing:**
   ```bash
   # Merge to develop for integration testing
   git checkout develop
   git merge feature/new-feature
   git push origin develop
   # CI runs all checks
   ```

3. **Production Release:**
   ```bash
   # Merge to main for deployment
   git checkout main
   git merge develop
   git push origin main
   # CI runs all checks + deploys
   ```

## Security Considerations

### Workflow Security

1. **Limited Permissions:**
   - Workflows run with minimal permissions
   - Only required permissions granted

2. **Dependency Updates:**
   - Regular security audits
   - Automated dependency updates (optional)

3. **Secrets Management:**
   - Use GitHub Secrets for sensitive data
   - Never commit secrets to repository

### Security Headers

All security headers are automatically applied:
- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

See `SECURITY.md` for details.

## Metrics & Analytics

### Key Metrics

Track these metrics over time:

1. **Build Time:** < 2 minutes
2. **Test Time:** < 1 minute
3. **Bundle Size:** < 100KB gzipped
4. **Coverage:** > 80%
5. **Lighthouse Score:** > 90

### Monitoring

1. **GitHub Actions:**
   - View run duration
   - Check success rate
   - Monitor artifact sizes

2. **Bundle Analysis:**
   - Review `stats.html` after each build
   - Track bundle size trends

3. **Coverage Reports:**
   - Download coverage artifacts
   - Review untested code

## Cost & Resource Usage

### GitHub Actions Free Tier

- 2,000 minutes/month for free
- This pipeline uses ~5-10 minutes per run
- Typical usage: 200-400 runs/month (well within limits)

### Storage

- Artifacts stored for 7-30 days
- Typical usage: ~100MB per artifact
- Free tier: 500MB storage

## Best Practices

1. **Run Checks Locally:**
   - Always run lint, test, and build before pushing
   - Catches issues early

2. **Small, Focused Commits:**
   - Easier to debug failed runs
   - Clearer history

3. **Meaningful Commit Messages:**
   - Use conventional commits
   - Helps with changelog generation

4. **Regular Dependency Updates:**
   - Keep dependencies up to date
   - Run `bun outdated` regularly

5. **Monitor Pipeline Health:**
   - Check for slow jobs
   - Optimize when needed

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Bundle Size Optimization](https://web.dev/reduce-javascript-payloads-with-code-splitting/)

## Support

For issues with the CI/CD pipeline:
1. Check workflow logs in GitHub Actions
2. Review this documentation
3. Open an issue on GitHub
4. Contact the development team

---

**Last Updated:** Phase 16 Part 4 - October 26, 2025
