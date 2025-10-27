# CI/CD Quick Reference

## 🚀 Quick Commands

```bash
# Local checks (run before pushing)
bun run lint              # Lint code
bun test --run            # Run tests
bun run build             # Build production

# Validate workflow
node scripts/validate-workflow.js

# View CI status
gh run list --workflow=ci-cd.yml --limit 5

# Watch latest run
gh run watch
```

## 📊 Pipeline Overview

```
Push to GitHub
     ↓
┌────┴────┐
│ Lint    │ ← Code quality
│ Test    │ ← 2,444 tests
│ Security│ ← 36 security tests
└────┬────┘
     ↓
┌────┴────┐
│ Build   │ ← Production bundle
└────┬────┘
     ↓
┌────┴────┐
│ Deploy  │ ← GitHub Pages (main only)
└────┬────┘
     ↓
┌────┴────┐
│Lighthouse│ ← Performance check
└─────────┘

⏱️ Total: ~5-8 minutes
```

## ✅ Quality Gates

| Check | Requirement |
|-------|-------------|
| Lint | Must pass |
| Tests | Must pass (2,444+) |
| Coverage | ≥ 80% |
| Security | Must pass (36 tests) |
| Build | Must succeed |
| Bundle | Warning > 500KB |
| Lighthouse | Non-blocking |

## 🔄 Workflow Triggers

| Event | Runs | Deploys |
|-------|------|---------|
| Push to `main` | ✅ | ✅ |
| Push to `develop` | ✅ | ❌ |
| Pull Request | ✅ | ❌ |
| Manual | ✅ | Optional |

## 📦 Artifacts (Retention)

- Coverage Report (30 days)
- Build Files (7 days)
- Bundle Stats (7 days)
- Lighthouse Report (90 days)

## 🌐 Deployment

**Production URL:**  
https://prosperis.github.io/Resumier/

**Deploy Time:**  
~1-2 minutes after build

**Auto-Deploy:**  
On every push to `main`

## 🎯 Branch Strategy

```bash
# Feature development
git checkout -b feature/my-feature
git push origin feature/my-feature
# Creates PR → CI runs (no deploy)

# Merge to develop (testing)
git checkout develop
git merge feature/my-feature
git push origin develop
# CI runs (no deploy)

# Merge to main (production)
git checkout main
git merge develop
git push origin main
# CI runs + deploys ✅
```

## 🐛 Troubleshooting

### Build Fails
```bash
# Check locally
bun run build

# Check types
bunx tsc --noEmit
```

### Tests Fail
```bash
# Run tests
bun test --run

# Run specific test
bun test path/to/test.test.ts
```

### Lint Fails
```bash
# Check errors
bun run lint

# Auto-fix
bun run lint:fix
```

### Deploy Fails
1. Check GitHub Pages settings
2. Verify `gh-pages` branch
3. Check workflow permissions
4. Review deploy job logs

## 📈 Monitoring

### View Status
```bash
# Latest runs
gh run list --workflow=ci-cd.yml

# Specific run details
gh run view <run-id>

# Watch live run
gh run watch
```

### Download Artifacts
```bash
# List artifacts
gh run view <run-id> --log

# Download artifact
gh run download <run-id> -n coverage-report
```

## 🔒 Security

✅ Minimal permissions  
✅ No secrets exposed  
✅ Automated security tests  
✅ Dependency scanning  
✅ HTTPS enforced  

## 📊 Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| Pipeline | < 10 min | ~5-8 min |
| Lint | < 1 min | ~30s |
| Test | < 2 min | ~1 min |
| Build | < 2 min | ~1 min |
| Deploy | < 2 min | ~1 min |

## 🎓 Resources

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Full guide
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Workflow File](./.github/workflows/ci-cd.yml)

## 💡 Tips

1. **Run checks locally first** - Faster feedback
2. **Keep PRs small** - Easier to review
3. **Use draft PRs** - For WIP changes
4. **Watch the pipeline** - Learn from failures
5. **Check artifacts** - Review coverage & bundle stats

---

**Quick Help:** `gh run view --help`
