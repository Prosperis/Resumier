# Resumier - Professional Resume Builder

[![CI/CD Pipeline](https://github.com/Prosperis/Resumier/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/Prosperis/Resumier/actions/workflows/ci-cd.yml)
[![Test Coverage](https://img.shields.io/badge/coverage-83.5%25-brightgreen)](./coverage)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE.txt)

A modern, feature-rich resume builder application built with React, TypeScript, and TanStack Router.

🌐 **Live Demo:** [https://prosperis.github.io/Resumier/](https://prosperis.github.io/Resumier/)

## ✨ Features

- 📝 **Multiple Templates** - Choose from Classic, Modern, and Minimal designs
- 🎨 **Real-time Preview** - See changes instantly as you edit
- 💾 **Local Storage** - Your data is saved locally in your browser
- 🔒 **Privacy First** - No data sent to servers, everything stays on your device
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🌙 **Dark Mode** - Eye-friendly dark theme support
- 🖨️ **Print & Export** - Print-optimized layouts for PDF generation
- ♿ **Accessible** - Built with accessibility in mind (WCAG 2.1 AA)
- 🚀 **Fast & Lightweight** - Optimized bundle size (< 100KB gzipped)
- 🔐 **Secure** - Comprehensive security headers and input sanitization

## 🛠️ Tech Stack

- **Framework:** React 19 + TypeScript 5
- **Routing:** TanStack Router 1.x
- **State Management:** Zustand 4.x + TanStack Query
- **Styling:** Tailwind CSS 4.x
- **UI Components:** Radix UI + shadcn/ui
- **Animations:** Framer Motion
- **Forms:** TanStack Form + React Hook Form + Zod
- **Build Tool:** Vite 6.x
- **Testing:** Vitest + Testing Library (83.5% coverage)
- **E2E Testing:** Playwright
- **Linting:** Biome
- **Package Manager:** Bun 1.3.0

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) 1.3.0 or later
- Node.js 18+ (for compatibility)

### Installation

```bash
# Clone the repository
git clone https://github.com/Prosperis/Resumier.git
cd Resumier

# Install dependencies
bun install

# Start development server
bun run dev
```

The app will be available at `http://localhost:5173/Resumier/`

## 📜 Available Scripts

```bash
# Development
bun run dev              # Start dev server with HMR
bun run build            # Build for production
bun run preview          # Preview production build

# Testing
bun test                 # Run unit tests
bun test --coverage      # Run tests with coverage
bun test:watch           # Run tests in watch mode
bun test:e2e             # Run E2E tests with Playwright
bun test:e2e:ui          # Run E2E tests with UI

# Code Quality
bun run lint             # Check for linting errors
bun run lint:fix         # Fix linting errors
bun run format           # Format code with Biome
bun run format:check     # Check code formatting

# Routing
bun run routes:generate  # Generate route types
bun run routes:watch     # Watch and generate routes
```

## 🏗️ Project Structure

```
Resumier/
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # CI/CD pipeline
├── public/
│   └── _headers               # Netlify security headers
├── src/
│   ├── app/                   # App configuration
│   │   ├── providers.tsx      # App providers
│   │   ├── query-client.ts    # TanStack Query setup
│   │   └── router.tsx         # Router configuration
│   ├── components/            # React components
│   │   ├── features/          # Feature-specific components
│   │   ├── layout/            # Layout components
│   │   └── ui/                # Reusable UI components
│   ├── lib/                   # Utilities and libraries
│   │   ├── api/               # API client and mock data
│   │   ├── security/          # Security utilities
│   │   ├── store/             # Zustand stores
│   │   └── utils/             # Helper functions
│   ├── routes/                # Route components
│   ├── styles/                # Global styles
│   └── main.tsx               # App entry point
├── .htaccess                  # Apache security headers
├── vercel.json                # Vercel deployment config
├── vite.config.ts             # Vite configuration
├── vitest.config.ts           # Test configuration
└── tsconfig.json              # TypeScript configuration
```

## 🧪 Testing

The project has comprehensive test coverage:

- **Unit Tests:** 2,444+ tests with 83.5% coverage
- **Component Tests:** Testing Library + Vitest
- **E2E Tests:** Playwright
- **Security Tests:** 36 security utility tests

```bash
# Run all tests
bun test --run

# Run with coverage
bun test --coverage

# Run specific test file
bun test src/components/features/resume/resume-builder.test.tsx

# Run E2E tests
bun test:e2e
```

## 🚀 Deployment

### Automatic Deployment (Recommended)

Push to `main` branch triggers automatic deployment to GitHub Pages via CI/CD pipeline.

### Manual Deployment

```bash
# Build for production
bun run build

# Deploy to GitHub Pages
gh-pages -d dist
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 📊 Monitoring & Observability

Resumier uses **Sentry** for error tracking and **Web Vitals** for performance monitoring.

### Features

- ✅ **Error Tracking** - Automatic error capture with Sentry
- ✅ **Performance Monitoring** - Core Web Vitals (LCP, FID, INP, CLS)
- ✅ **Session Replay** - Debug errors with session recordings
- ✅ **User Feedback** - Built-in feedback widget
- ✅ **Error Boundaries** - Graceful error handling with fallback UI

### Setup (Optional)

For production error tracking:

```bash
# 1. Create free Sentry account at https://sentry.io
# 2. Create new React project and copy DSN
# 3. Add to .env file
echo "VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx" >> .env

# 4. Build and deploy
bun run build
```

See [MONITORING.md](./MONITORING.md) for detailed monitoring setup and usage.

### Web Vitals Targets

| Metric | Target | Description |
|--------|--------|-------------|
| **LCP** | < 2.0s | Largest Contentful Paint (loading) |
| **FID** | < 50ms | First Input Delay (interactivity) |
| **INP** | < 200ms | Interaction to Next Paint (responsiveness) |
| **CLS** | < 0.05 | Cumulative Layout Shift (visual stability) |

## 🔒 Security

Security is a top priority. The application implements:

- **Content Security Policy (CSP)** - Prevents XSS attacks
- **Security Headers** - X-Frame-Options, X-Content-Type-Options, etc.
- **Input Sanitization** - All user inputs are sanitized
- **Rate Limiting** - Prevents abuse
- **No Data Transmission** - All data stays in your browser

See [SECURITY.md](./SECURITY.md) for security details.

## 📊 Performance

- **Lighthouse Score:** 90+ across all metrics
- **Bundle Size:**
  - Main bundle: 87KB gzipped
  - Total initial load: ~171KB
  - Lazy-loaded chunks: 1-4KB each
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3s

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`bun test --run`)
5. Run linting (`bun run lint`)
6. Commit your changes (`git commit -m 'feat: add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Test changes
- `chore:` Build process or tooling changes

## 📝 License

This project is licensed under the MIT License - see the [LICENSE.txt](./LICENSE.txt) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [TanStack](https://tanstack.com/) - Amazing React tools
- [Radix UI](https://www.radix-ui.com/) - Accessible component primitives
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Lucide Icons](https://lucide.dev/) - Beautiful icons

## 📚 Documentation

- [Deployment Guide](./DEPLOYMENT.md) - CI/CD and deployment instructions
- [Security Guide](./SECURITY.md) - Security implementation details
- [Phase Summaries](./PHASE_16_PART3_SUMMARY.md) - Development phase documentation

## 🐛 Bug Reports

Found a bug? Please [open an issue](https://github.com/Prosperis/Resumier/issues) with:
- Description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Browser and OS information

## 💬 Support

- 📧 Email: support@resumier.app
- 🐛 Issues: [GitHub Issues](https://github.com/Prosperis/Resumier/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/Prosperis/Resumier/discussions)

---

**Built with ❤️ by the Prosperis team**

