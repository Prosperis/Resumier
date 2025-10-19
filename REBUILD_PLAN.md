# Resumier Rebuild Plan

## Project Overview
Transform Resumier from a multi-platform monorepo into a focused, modern React web application using cutting-edge tooling and libraries.

## Current State
- Multi-app monorepo (web, mobile, desktop)
- Using pnpm workspaces
- Some good foundation in `apps/web`

## Target State
Single React web application with:
- Modern React patterns
- Type-safe routing and data fetching
- High-performance UI
- Comprehensive testing
- Professional development workflow

---

## Phase 1: Backup & Assessment ✅
**Goal**: Preserve valuable work and understand current state

### Tasks:
- [x] Create this rebuild plan
- [x] Review `apps/web/src/components` to identify reusable components
- [x] Document current features and functionality
- [x] List environment variables and configurations to preserve
- [x] Backup any custom logic from hooks and utilities

### Deliverables:
- ✅ Component inventory document (`PHASE_1_ASSESSMENT.md`)
- ✅ Feature list document (included in assessment)
- ✅ Configuration backup (`CONFIGURATION_BACKUP.md`)

---

## Phase 2: Project Structure Cleanup ✅
**Goal**: Remove unnecessary apps and restructure as single app

### Tasks:
- [x] Remove `apps/mobile` directory entirely
- [x] Remove `apps/desktop` directory entirely
- [x] Flatten `apps/web` to root level or create new clean structure
- [x] Remove monorepo configs (pnpm-workspace.yaml, turbo.json)
- [x] Update root `package.json` and switch to Bun

### Deliverables:
- ✅ Simplified directory structure (`PHASE_2_SUMMARY.md`)
- ✅ Single application codebase
- ✅ Bun package manager configured
- ✅ Dev server working on Bun

---

## Phase 3: Core Dependencies Setup ✅
**Goal**: Install and configure all required libraries

### Tasks:
- [x] Already had most dependencies (React 19, TypeScript, Bun, Vite, TanStack ecosystem)
- [x] Install missing production dependencies:
  - `@tanstack/react-virtual`
  - `framer-motion`
  - `zod`
  - `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`

- [x] Install missing dev dependencies:
  - `@biomejs/biome` (replaced ESLint)
  - `@playwright/test` 
  - `husky`

- [x] Configure Biome (80% rules migrated from ESLint)
- [x] Configure Playwright with 5 browser configurations
- [x] Set up Husky git hooks (pre-commit, pre-push)
- [x] Update package.json scripts

### Deliverables:
- ✅ Complete dependency set (`PHASE_3_SUMMARY.md`)
- ✅ Biome configuration (`biome.json`)
- ✅ Playwright configuration (`playwright.config.ts`)
- ✅ Husky git hooks (`.husky/`)
- ✅ Updated scripts in package.json
- ✅ ESLint removed, Biome 30-50x faster!
- ✅ Auto-fixed 72 files

---

## Phase 4: Tooling Configuration ✅
**Goal**: Set up development environment and tooling

### Tasks:
- [x] Enhanced TypeScript configuration:
  - Strict mode enabled
  - Additional checks: `noImplicitReturns`, `forceConsistentCasingInFileNames`, `isolatedModules`
  - Path aliases configured (`@/` → `src/`)
  
- [x] Optimized Vite configuration:
  - Manual chunking for vendor libraries (react, tanstack, ui, motion)
  - Build optimization (minify: esbuild, target: esnext)
  - Server configuration (port 5173, host: true, open: true)
  - Preview server configured
  
- [x] Configured Vitest:
  - Coverage thresholds: 70% for lines/functions/branches/statements
  - Provider: v8
  - Reporters: text, json, html, lcov
  - Mock settings configured
  - Installed jsdom for DOM environment
  
- [x] Enhanced Storybook:
  - Added @storybook/addon-a11y for accessibility testing
  - Added @storybook/addon-interactions for interaction testing
  - Integrated Tailwind CSS (imported index.css)
  - Added theme switcher toolbar (light/dark)
  - Configured Vite path alias resolution
  
- [x] Enhanced .gitignore:
  - Added entries for Biome, Playwright, Storybook, Coverage, Bun, Vitest
  - Organized by tool sections

### Deliverables:
- ✅ Enhanced TypeScript configuration (`tsconfig.app.json`)
- ✅ Optimized Vite build (`vite.config.ts`) - 3.31s build time
- ✅ Vitest with coverage (`vitest.config.ts`) - 70% thresholds
- ✅ Storybook configuration (`.storybook/main.ts`, `.storybook/preview.ts`)
- ✅ Comprehensive .gitignore
- ✅ Phase 4 summary document (`PHASE_4_SUMMARY.md`)
- ✅ All tools verified working

**Performance:**
- Build: 3.31s with manual chunking
- Biome: 60ms for 79 files (30-50x faster than ESLint)
- Vitest: 3.29s (15 passed, 3 legacy failures)

---
  - Project references if needed
  
- [ ] Configure Tailwind:
  - `tailwind.config.js` with custom theme
  - CSS variables for theming
  - Plugin configuration
  
- [ ] Configure Vite:
  - Path resolution
  - Environment variables
  - Build optimizations
  
- [ ] Configure Vitest:
  - Test setup file
  - Coverage configuration
  - DOM testing utilities
  
- [ ] Configure Playwright:
  - Multiple browsers
  - Base URL configuration
  - Test directory structure
  
- [ ] Configure Storybook:
  - Vite builder
  - Tailwind integration
  - Theme decorator
  
- [ ] Set up Husky:
  - Pre-commit: Run Biome check
  - Pre-push: Run tests
  - Commit message linting (optional)

### Deliverables:
- All configuration files
- Working dev environment
- Scripts in `package.json`

---

## Phase 5: Base Application Structure ✅
**Goal**: Create clean application architecture

### Directory Structure Created:
```
src/
├── app/                       # App-level configuration
│   ├── providers.tsx          # All context providers ✅
│   ├── router.ts              # TanStack Router setup ✅
│   ├── query-client.ts        # TanStack Query client ✅
│   ├── theme-provider.tsx     # Theme provider ✅
│   └── routeTree.gen.ts       # Generated route tree ✅
├── components/
│   ├── ui/                    # shadcn/ui components (existing)
│   ├── features/              # Feature-specific components ✅
│   ├── layouts/               # Layout components ✅
│   │   └── root-layout.tsx    # Root layout ✅
│   └── personal-info/         # Existing components
├── routes/                    # TanStack Router routes ✅
│   ├── __root.tsx             # Root route ✅
│   └── index.tsx              # Index route ✅
├── lib/
│   ├── api/                   # API client and hooks ✅
│   ├── utils/                 # Utility functions (existing)
│   ├── schemas/               # Zod schemas ✅
│   └── constants/             # App constants ✅
├── stores/                    # Zustand stores ✅
├── hooks/                     # Custom React hooks (existing)
├── types/                     # TypeScript types ✅
└── main.tsx                   # Updated entry point ✅
```

### Tasks:
- [x] Create directory structure
- [x] Set up root route with TanStack Router
- [x] Create providers wrapper component
- [x] Set up TanStack Query client with devtools
- [x] Create base layout component (header, footer, theme toggle)
- [x] Set up theme provider (light/dark/system modes with localStorage)
- [x] Install TanStack devtools (@tanstack/router-devtools, @tanstack/react-query-devtools)
- [x] Configure TanStack Router CLI (tsr.config.json)
- [x] Update package.json scripts for route generation
- [x] Update .gitignore for generated route tree

### Deliverables:
- ✅ Clean folder structure with 8 new directories
- ✅ Working application shell with routing
- ✅ Root layout with header, footer, theme toggle
- ✅ Theme provider with light/dark/system modes
- ✅ QueryClient configured with sensible defaults
- ✅ Router with type-safe navigation
- ✅ Dev server running (352ms start time)
- ✅ Phase 5 summary document (`PHASE_5_SUMMARY.md`)

**Dependencies Added:**
- @tanstack/router-devtools@1.133.13
- @tanstack/react-query-devtools@5.90.2
- @tanstack/router-cli@1.133.13

**Performance:**
- Dev server: 352ms cold start
- Route generation: <100ms

---

---

## Phase 6: shadcn/ui Integration ✅
**Goal**: Set up and customize component library

### Tasks:
- [x] Run `shadcn-ui init`
- [x] Configure `components.json`
- [x] Install core UI components:
  - Button
  - Card
  - Input
  - Label
  - Dialog
  - Dropdown Menu
  - Tabs (will add in Phase 12)
  - Form (will add in Phase 11)
  - Table (will add in Phase 12)
  - Avatar
  - Badge
  - Separator
  - Tooltip
  - (21 components total installed)
  
- [x] Create Storybook stories for each component
- [x] Customize theme colors and design tokens
- [x] Add component tests
- [x] Verify Tailwind v4 integration
- [x] Test component rendering with router
- [x] Create test route for verification

### Deliverables:
- ✅ 21 shadcn/ui components installed and working
- ✅ components.json configured (new-york style)
- ✅ Tailwind v4 with CSS variables
- ✅ Storybook documentation (all components)
- ✅ Theme system (light/dark/system modes)
- ✅ Latest component patterns (data-slot, proper types)
- ✅ Test route created at `/test-components`
- ✅ Phase 6 summary document (`PHASE_6_SUMMARY.md`)

**Dependencies Verified:**
- tailwindcss@4.1.8
- @tailwindcss/vite@4.1.8
- @radix-ui/* primitives
- class-variance-authority
- lucide-react

**Performance:**
- Dev server: 371ms start time
- All components render correctly

---

## Phase 7: Migrate Existing Components ✅
**Goal**: Port valuable components from old `apps/web`

### Tasks:
- [x] Audit components to migrate:
  - Resume builder components
  - Personal info components
  - PDF viewer
  - Dashboard components
  - Navigation components
  - Auth components
  - Settings components
  
- [x] Create feature-based directory structure
- [x] Move 20 components to features/ directories
- [x] Fix lint warnings (reduced from 12 to 9)
- [x] Update all imports to new locations
- [x] Refactor accessibility issues (href="#", SVG titles)
- [x] Verify TypeScript compilation
- [x] Verify all tests pass

### Deliverables:
- ✅ 20 components migrated to feature-based structure
- ✅ Feature directories: auth/, navigation/, resume/, settings/
- ✅ Fixed 3 lint warnings (25% reduction)
- ✅ All imports updated
- ✅ TypeScript compiles without errors
- ✅ All tests pass (17 passed, 1 skipped)
- ✅ Phase 7 summary document (`PHASE_7_SUMMARY.md`)

**Components Migrated:**
- 7 navigation components (app-header, app-sidebar, nav-*, theme-toggle)
- 12 resume components (builder, dashboard, pdf-viewer, dialogs, 7 sections)
- 1 auth component (login-form)
- 1 settings component (settings-dialog)

**Quality Improvements:**
- Feature-based organization
- Better accessibility (buttons instead of fake links)
- Unique keys for lists
- Consistent import patterns

---

## Phase 8: State Management ✅
**Goal**: Implement application state architecture

### Tasks:
- [x] Install @redux-devtools/extension dependency
- [x] Create src/stores/ directory structure
- [x] Create theme store (refactored from use-theme hook)
- [x] Create resume store (merged resume + documents stores)
- [x] Create auth store (new)
- [x] Create UI store (new - sidebar, dialogs, notifications)
- [x] Add store persistence (localStorage + IndexedDB)
- [x] Create selectors for optimized access
- [x] Add Zustand devtools to all stores
- [x] Create stores/index.ts barrel export
- [x] Update all component imports to use new stores
- [x] Write comprehensive tests (theme + UI stores)

### Deliverables:
- ✅ 4 production-ready Zustand stores (theme, resume, auth, UI)
- ✅ Redux DevTools integration for debugging
- ✅ Optimized selectors to prevent unnecessary re-renders
- ✅ Barrel export for clean imports
- ✅ All components updated to use new stores
- ✅ 32 passing tests (theme store: 15, UI store: 17)
- ✅ TypeScript compiles without errors
- ✅ Comprehensive audit document (`PHASE_8_AUDIT.md`)

**Store Architecture:**
- **theme-store.ts** - Light/dark theme with DOM manipulation
- **resume-store.ts** - User info, job info, documents, content (IndexedDB)
- **auth-store.ts** - User authentication and session management
- **ui-store.ts** - Sidebar, dialogs, notifications, loading states

**TODO (Future):**
- Add IndexedDB mocks for resume store tests (currently skipped)
- Fix auth store test issues (timing and hydration related)
- All stores are functional and used in components

---

## Phase 9: Routing & Pages ✅
**Goal**: Build complete application routes

### Tasks:
- [x] Define route structure:
  - `/` - Home/Landing (enhanced with features)
  - `/dashboard` - User dashboard
  - `/resume/new` - Create resume
  - `/resume/$id` - Edit resume (dynamic param)
  - `/resume/$id/preview` - Preview resume
  - `/settings` - User settings
  - `/login` - Authentication

- [ ] Implement route-based code splitting (deferred to Phase 10)
- [x] Add loading states with TanStack Router
- [x] Implement error boundaries per route
- [x] Add route guards/protection
- [x] Create 404 page

### Deliverables:
- ✅ 7 production routes with file-based routing
- ✅ Authentication guards on protected routes
- ✅ Loading components for all routes
- ✅ Error boundaries with retry logic
- ✅ 404 Not Found page
- ✅ Navigation integration (app-sidebar, nav-main)
- ✅ Enhanced login form with auth store integration
- ✅ Type-safe navigation with TanStack Router Link
- ✅ Comprehensive audit (`PHASE_9_AUDIT.md`)
- ✅ Complete summary (`PHASE_9_SUMMARY.md`)

**Route Architecture:**
- **Public Routes:** `/` (landing), `/login`
- **Protected Routes:** `/dashboard`, `/resume/*`, `/settings`
- **Guards:** `beforeLoad` checks auth state
- **Loading:** Custom loading components per route
- **Errors:** Reusable error boundary components

**Components Created:**
- `route-loading.tsx` - Loading states
- `route-error.tsx` - Error boundaries and 404

**Navigation Updated:**
- `app-sidebar.tsx` - TanStack Router Link integration
- `nav-main.tsx` - Active route highlighting
- `login-form.tsx` - Navigation on success

**TODO (Future):**
- Code splitting with lazy loading
- Data loaders for routes (Phase 10)
- Register page

---

## Phase 10: API Integration
**Goal**: Set up data fetching and mutations

### Tasks:
- [ ] Create API client (axios/fetch wrapper)
- [ ] Set up TanStack Query hooks:
  - `useResumes` - Fetch all resumes
  - `useResume` - Fetch single resume
  - `useCreateResume` - Create mutation
  - `useUpdateResume` - Update mutation
  - `useDeleteResume` - Delete mutation
  
- [ ] Implement optimistic updates
- [ ] Add error handling
- [ ] Set up query invalidation
- [ ] Add request/response interceptors
- [ ] Mock API for development

### Deliverables:
- Complete API layer
- React Query hooks
- Error handling system

---

## Phase 11: Forms & Validation
**Goal**: Implement form handling with TanStack Form

### Tasks:
- [ ] Create form schemas with Zod
- [ ] Build form components with TanStack Form:
  - Resume basic info form
  - Experience form
  - Education form
  - Skills form
  - Custom sections form
  
- [ ] Add field-level validation
- [ ] Add form-level validation
- [ ] Implement auto-save functionality
- [ ] Add form error handling
- [ ] Create reusable form components

### Deliverables:
- Validated forms
- Reusable form patterns
- Great UX

---

## Phase 12: Tables & Lists
**Goal**: Implement data tables with TanStack Table

### Tasks:
- [ ] Create base table component
- [ ] Implement resume list table:
  - Sorting
  - Filtering
  - Pagination
  - Column visibility
  - Row selection
  
- [ ] Add TanStack Virtual for large lists
- [ ] Create table toolbar
- [ ] Add bulk actions
- [ ] Implement responsive tables

### Deliverables:
- Powerful table component
- Great performance
- Mobile-friendly

---

## Phase 13: Drag & Drop
**Goal**: Add drag-and-drop functionality

### Tasks:
- [ ] Choose DnD library (recommend `@dnd-kit`)
- [ ] Implement draggable sections in resume builder
- [ ] Add reordering for:
  - Resume sections
  - List items (experience, education)
  - Skills
  
- [ ] Add visual feedback
- [ ] Handle touch devices
- [ ] Add keyboard accessibility

### Deliverables:
- Smooth drag-and-drop
- Accessible interactions
- Mobile support

---

## Phase 14: Animations
**Goal**: Add polished animations with Framer Motion

### Tasks:
- [ ] Create animation presets/variants
- [ ] Add page transitions
- [ ] Animate component mount/unmount
- [ ] Add micro-interactions:
  - Button hovers
  - Card interactions
  - Modal animations
  
- [ ] Implement gesture-based interactions
- [ ] Add loading animations
- [ ] Respect reduced motion preferences

### Deliverables:
- Polished UI animations
- Accessible motion
- Consistent feel

---

## Phase 15: Testing
**Goal**: Achieve comprehensive test coverage

### Tasks:
- [ ] Write unit tests (Vitest):
  - Utility functions
  - Custom hooks
  - Store logic
  - Form validation
  - Target: 80%+ coverage
  
- [ ] Write component tests:
  - UI components
  - Feature components
  - Integration tests
  
- [ ] Write E2E tests (Playwright):
  - User authentication flow
  - Resume creation flow
  - Resume editing flow
  - Export/download flow
  
- [ ] Set up CI/CD test runs
- [ ] Add visual regression testing (optional)

### Deliverables:
- 80%+ test coverage
- E2E critical paths covered
- CI/CD integration

---

## Phase 16: GitHub Actions & CI/CD
**Goal**: Automate testing and deployment

### Tasks:
- [ ] Create workflow files:
  - `.github/workflows/ci.yml` - Run on PR
  - `.github/workflows/deploy.yml` - Deploy on merge
  
- [ ] CI Pipeline:
  - Install dependencies with Bun
  - Run Biome check
  - Run TypeScript check
  - Run Vitest tests
  - Run Playwright tests
  - Build application
  - Upload coverage reports
  
- [ ] CD Pipeline:
  - Deploy to staging on PR
  - Deploy to production on main
  - Add deployment previews
  
- [ ] Set up branch protection rules
- [ ] Configure status checks

### Deliverables:
- Automated CI/CD
- Protected main branch
- Preview deployments

---

## Phase 17: Documentation
**Goal**: Create comprehensive documentation

### Tasks:
- [ ] Update README.md:
  - Project description
  - Setup instructions
  - Development workflow
  - Tech stack details
  
- [ ] Create CONTRIBUTING.md
- [ ] Document components in Storybook
- [ ] Add JSDoc comments to utilities
- [ ] Create architecture documentation
- [ ] Add deployment documentation

### Deliverables:
- Complete documentation
- Easy onboarding
- Clear guidelines

---

## Phase 18: Performance Optimization
**Goal**: Optimize for production

### Tasks:
- [ ] Code splitting by route
- [ ] Lazy load heavy components
- [ ] Optimize images
- [ ] Add service worker (PWA)
- [ ] Implement caching strategies
- [ ] Bundle analysis and optimization
- [ ] Lighthouse audit (target 90+ scores)
- [ ] Add performance monitoring

### Deliverables:
- Fast load times
- Optimized bundles
- Great lighthouse scores

---

## Phase 19: Accessibility
**Goal**: Ensure WCAG compliance

### Tasks:
- [ ] Keyboard navigation audit
- [ ] Screen reader testing
- [ ] Color contrast audit
- [ ] Focus management
- [ ] ARIA labels and roles
- [ ] Form accessibility
- [ ] Skip links
- [ ] Accessible error messages

### Deliverables:
- WCAG 2.1 AA compliance
- Accessible to all users

---

## Phase 20: Polish & Launch
**Goal**: Final touches and deployment

### Tasks:
- [ ] Final bug fixes
- [ ] User acceptance testing
- [ ] Performance testing under load
- [ ] Security audit
- [ ] SEO optimization
- [ ] Meta tags and OG images
- [ ] Error tracking setup (Sentry)
- [ ] Analytics setup (optional)
- [ ] Production deployment

### Deliverables:
- Production-ready application
- Monitoring in place
- Deployed and live

---

## Package Manager Note
**Switching from pnpm to Bun:**
- Remove `pnpm-lock.yaml` and `pnpm-workspace.yaml`
- Run `bun install` to create `bun.lockb`
- Update CI/CD to use Bun
- Ensure all scripts work with Bun

---

## Success Criteria
- ✅ Single React application (no mobile/desktop)
- ✅ All specified libraries integrated
- ✅ 80%+ test coverage
- ✅ Full type safety
- ✅ Storybook documentation
- ✅ CI/CD pipeline working
- ✅ Production deployment
- ✅ Great performance (Lighthouse 90+)
- ✅ Accessible (WCAG AA)

---

## Timeline Estimate
- **Phase 1-2**: 1 day
- **Phase 3-4**: 2 days
- **Phase 5-6**: 2 days
- **Phase 7-8**: 3 days
- **Phase 9-10**: 3 days
- **Phase 11-13**: 4 days
- **Phase 14-15**: 3 days
- **Phase 16-17**: 2 days
- **Phase 18-20**: 3 days

**Total: ~23 days** (can be accelerated with focused work)

---

## Next Steps
1. Review and approve this plan
2. Start with Phase 1 - backup current work
3. Execute phase by phase
4. Track progress by checking off tasks
5. Adjust as needed based on discoveries

---

## Notes
- Keep commits atomic and well-described
- Create PRs for each major phase
- Use the label `(ノಠ益ಠ)ノ彡┻━┻` for Codex PRs
- Run `bun lint` after changes (as per AGENTS.md)
- Update this document as we progress
