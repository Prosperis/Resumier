# Security Quick Reference

## 🛡️ Security Headers (Configured)

| Header | Value | Purpose |
|--------|-------|---------|
| `Content-Security-Policy` | Strict policy | Prevents XSS attacks |
| `X-Frame-Options` | DENY | Prevents clickjacking |
| `X-Content-Type-Options` | nosniff | Prevents MIME sniffing |
| `Referrer-Policy` | strict-origin-when-cross-origin | Controls referrer data |
| `Permissions-Policy` | All restricted | Limits browser features |
| `X-XSS-Protection` | 1; mode=block | Legacy XSS protection |

## 🔧 Security Utilities

### Text Sanitization
```typescript
import { sanitizeText, sanitizeHtml } from "@/lib/security"

sanitizeText("<script>alert('xss')</script>")  // Safe HTML entities
sanitizeHtml("<p>Safe</p><script>Bad</script>")  // Remove dangerous tags
```

### URL Validation
```typescript
import { sanitizeUrl } from "@/lib/security"

sanitizeUrl("https://example.com")  // ✅ "https://example.com/"
sanitizeUrl("javascript:alert(1)")  // ❌ ""
```

### Email & Phone
```typescript
import { isValidEmail, isValidPhone } from "@/lib/security"

isValidEmail("user@example.com")  // ✅ true
isValidPhone("+1234567890")       // ✅ true
```

### Rate Limiting
```typescript
import { globalRateLimiter } from "@/lib/security"

// Max 5 calls per 60 seconds
if (!globalRateLimiter.isAllowed("action", 5, 60000)) {
  throw new Error("Rate limit exceeded")
}
```

### Secure Tokens
```typescript
import { generateSecureToken, hashString } from "@/lib/security"

const token = generateSecureToken(32)  // 64-char hex string
const hash = await hashString("data")  // SHA-256 hash
```

## 📦 Deployment

### Netlify
Files: `public/_headers`
```bash
npm run build
netlify deploy --prod
```

### Vercel
Files: `vercel.json`
```bash
npm run build
vercel --prod
```

### Apache
Files: `.htaccess`
```bash
npm run build
# Upload dist/ to web root
```

## ✅ Testing

### Local Testing
```bash
bunx vite preview
bun run scripts/test-security-headers.js
```

### Production Testing
1. Deploy to production
2. Visit https://securityheaders.com
3. Enter your URL
4. Target: **A+ rating**

## 🚨 Security Checklist

- [x] CSP configured
- [x] XSS prevention
- [x] Input sanitization
- [x] Rate limiting
- [x] Dependency audit
- [ ] HTTPS enabled
- [ ] Error monitoring
- [ ] Regular updates

## 📚 Resources

- Full documentation: `SECURITY.md`
- Test suite: `src/lib/security/__tests__/`
- Utilities: `src/lib/security/index.ts`
- Summary: `PHASE_16_PART3_SUMMARY.md`
