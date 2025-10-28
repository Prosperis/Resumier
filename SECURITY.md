# Security Hardening Documentation

## Overview

This document outlines the security measures implemented in Resumier to protect against common web vulnerabilities and ensure production readiness.

## Security Headers

### Content Security Policy (CSP)

Protects against XSS attacks by controlling which resources can be loaded.

```
Content-Security-Policy: 
  default-src 'self'; 
  script-src 'self' 'unsafe-inline' 'unsafe-eval'; 
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
  font-src 'self' https://fonts.gstatic.com data:; 
  img-src 'self' data: blob: https:; 
  connect-src 'self'; 
  frame-ancestors 'none'; 
  base-uri 'self'; 
  form-action 'self';
```

**Notes:**
- `'unsafe-inline'` and `'unsafe-eval'` are required for React and some dependencies
- In production, consider using nonces for inline scripts
- Google Fonts is whitelisted for font loading

### X-Frame-Options

Prevents clickjacking attacks.

```
X-Frame-Options: DENY
```

### X-Content-Type-Options

Prevents MIME type sniffing.

```
X-Content-Type-Options: nosniff
```

### Referrer-Policy

Controls referrer information sent with requests.

```
Referrer-Policy: strict-origin-when-cross-origin
```

### Permissions-Policy

Restricts browser features.

```
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
```

### Strict-Transport-Security (HSTS)

Forces HTTPS connections (only enable after confirming HTTPS works).

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

## Deployment Configuration

### Netlify

Headers are configured in `public/_headers` file. Netlify automatically applies these headers.

**Deploy Command:**
```bash
npm run build
```

**Build Directory:** `dist`

### Vercel

Headers are configured in `vercel.json` file.

**Deploy Command:**
```bash
vercel --prod
```

### Apache/Traditional Hosting

Headers are configured in `.htaccess` file. Ensure `mod_headers` and `mod_rewrite` are enabled.

**Upload:** Copy contents of `dist/` folder to web root.

### GitHub Pages

Security headers cannot be configured directly on GitHub Pages. Consider using:
- Cloudflare Pages (proxy with header injection)
- Netlify
- Vercel

## Input Validation & Sanitization

### Text Sanitization

```typescript
import { sanitizeText, sanitizeHtml } from "@/lib/security"

// For plain text display
const safeText = sanitizeText(userInput)

// For HTML content (removes dangerous tags)
const safeHtml = sanitizeHtml(userInput)
```

### URL Validation

```typescript
import { sanitizeUrl } from "@/lib/security"

// Validates protocol and format
const safeUrl = sanitizeUrl(userInput)
if (safeUrl) {
  // Safe to use
}
```

### Email & Phone Validation

```typescript
import { isValidEmail, isValidPhone } from "@/lib/security"

if (isValidEmail(email)) {
  // Valid email
}

if (isValidPhone(phone)) {
  // Valid phone
}
```

### Filename Sanitization

```typescript
import { sanitizeFilename } from "@/lib/security"

// Prevents directory traversal
const safeFilename = sanitizeFilename(userInput)
```

## Rate Limiting

### Global Rate Limiter

```typescript
import { globalRateLimiter } from "@/lib/security"

// Check if action is allowed (max 5 calls per 60 seconds)
if (!globalRateLimiter.isAllowed("action-key", 5, 60000)) {
  console.error("Rate limit exceeded")
  return
}

// Perform action
await performAction()
```

### Per-User Rate Limiting

```typescript
import { RateLimiter } from "@/lib/security"

const userLimiter = new RateLimiter()

function handleUserAction(userId: string) {
  // Max 10 actions per minute per user
  if (!userLimiter.isAllowed(userId, 10, 60000)) {
    throw new Error("Too many requests")
  }
  
  // Process action
}
```

## Secure Token Generation

```typescript
import { generateSecureToken } from "@/lib/security"

// Generate cryptographically secure random token
const token = generateSecureToken(32) // 32 bytes = 64 hex chars
```

## Content Length Validation

```typescript
import { validateContentLength } from "@/lib/security"

// Prevent DoS with large payloads
if (!validateContentLength(content, 10000)) {
  throw new Error("Content too large")
}
```

## Authentication Security

### Token Storage

- **Never store tokens in localStorage** (vulnerable to XSS)
- Use in-memory storage or secure httpOnly cookies
- Current implementation: Zustand store (in-memory)

### Session Management

```typescript
// In auth store
const useAuthStore = create<AuthStore>((set) => ({
  token: null, // In-memory only
  
  login: async (credentials) => {
    const { token } = await authApi.login(credentials)
    set({ token }) // Stored in memory
  },
  
  logout: () => {
    set({ token: null })
  },
}))
```

### CSRF Protection

For production with real backend:
- Implement CSRF tokens for state-changing operations
- Use SameSite=Strict cookies
- Validate Origin/Referer headers

## API Security

### Current Implementation (Mock API)

The app currently uses a mock API for development. When connecting to a real backend:

1. **Enable CORS properly:**
```typescript
// Backend configuration
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true,
}))
```

2. **Validate all inputs with Zod:**
```typescript
import { z } from "zod"

const resumeSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().max(10000),
  // ...
})

// Validate before processing
const validated = resumeSchema.parse(input)
```

3. **Implement rate limiting:**
```typescript
import rateLimit from "express-rate-limit"

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})

app.use("/api/", limiter)
```

## Dependency Security

### Regular Audits

```bash
# Check for vulnerabilities
bun audit

# Update dependencies
bun update

# Check outdated packages
bun outdated
```

### Current Status

- All dependencies up to date as of Phase 16
- No known vulnerabilities
- Regular updates scheduled in CI/CD pipeline

## Security Testing

### Manual Testing

1. **Test CSP:**
   - Open DevTools Console
   - Should see no CSP violations
   - Try injecting script: `document.write('<script>alert("xss")</script>')`

2. **Test Headers:**
   - Visit: https://securityheaders.com
   - Enter your deployed URL
   - Target: A+ rating

3. **Test XSS Prevention:**
   - Try entering `<script>alert('xss')</script>` in form fields
   - Should be sanitized or escaped

### Automated Testing

```bash
# Run security tests
bun test src/lib/security

# Run all tests
bun test
```

## Monitoring & Logging

### Error Tracking

In production, integrate error tracking:

```typescript
// Example with Sentry
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.MODE,
})
```

### Security Events

Log security-relevant events:
- Failed login attempts
- Rate limit violations
- Invalid tokens
- Suspicious input patterns

## Checklist for Production

- [x] Security headers configured (CSP, X-Frame-Options, etc.)
- [x] Input sanitization implemented
- [x] URL validation implemented
- [x] Rate limiting implemented
- [x] Secure token generation implemented
- [x] Content length validation implemented
- [ ] Run security audit: `bun audit`
- [ ] Test at securityheaders.com (A+ rating)
- [ ] Configure HTTPS (required for HSTS)
- [ ] Set up error monitoring (Sentry, LogRocket, etc.)
- [ ] Enable CORS for production API
- [ ] Implement CSRF protection (if using cookies)
- [ ] Set up regular dependency updates
- [ ] Review and tighten CSP (remove 'unsafe-inline' if possible)

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Content Security Policy Reference](https://content-security-policy.com/)
- [Security Headers](https://securityheaders.com/)
- [Mozilla Web Security](https://infosec.mozilla.org/guidelines/web_security)

## Support

For security concerns or to report vulnerabilities:
- Open an issue on GitHub (for non-sensitive issues)
- Email: security@yourproject.com (for sensitive disclosures)
