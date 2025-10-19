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

## Phase 2: Project Structure Cleanup
**Goal**: Remove unnecessary apps and restructure as single app

### Tasks:
- [ ] Remove `apps/mobile` directory entirely
- [ ] Remove `apps/desktop` directory entirely
- [ ] Flatten `apps/web` to root level or create new clean structure
- [ ] Update `pnpm-workspace.yaml` to remove workspace references
- [ ] Clean up root `package.json` scripts

### Deliverables:
- Simplified directory structure
- Single application codebase

---

## Phase 3: Core Dependencies Setup
**Goal**: Install and configure all required libraries

### Tasks:
- [ ] Initialize new `package.json` with core dependencies:
  - React 18+
  - TypeScript
  - Bun as runtime/package manager
  - Vite as build tool
  
- [ ] Install TanStack ecosystem:
  - `@tanstack/react-router`
  - `@tanstack/react-query`
  - `@tanstack/react-form`
  - `@tanstack/react-table`
  - `@tanstack/react-virtual`
  
- [ ] Install UI libraries:
  - `shadcn/ui` (via CLI)
  - Radix UI primitives (via shadcn)
  - `framer-motion`
  - `tailwindcss`
  
- [ ] Install state management:
  - `zustand`
  - `zod` for validation
  
- [ ] Install drag and drop:
  - `@dnd-kit/core` or `react-beautiful-dnd` or `pragmatic-drag-and-drop`
  
- [ ] Install dev dependencies:
  - `biome` for linting/formatting
  - `vitest` for unit testing
  - `@playwright/test` for e2e testing
  - `storybook` for component development
  - `husky` for git hooks

### Deliverables:
- Complete `package.json` with all dependencies
- Lock file (`bun.lockb`)

---

## Phase 4: Tooling Configuration
**Goal**: Set up development environment and tooling

### Tasks:
- [ ] Configure Biome:
  - Create `biome.json`
  - Set up formatting rules
  - Configure linting rules
  - Add import sorting
  
- [ ] Configure TypeScript:
  - Strict mode enabled
  - Path aliases (`@/components`, `@/lib`, etc.)
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

## Phase 5: Base Application Structure
**Goal**: Create clean application architecture

### Directory Structure:
```
src/
├── app/                    # App-level configuration
│   ├── providers.tsx       # All context providers
│   ├── router.tsx         # TanStack Router setup
│   └── query-client.ts    # TanStack Query client
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── features/          # Feature-specific components
│   └── layouts/           # Layout components
├── routes/                # TanStack Router routes
│   ├── __root.tsx
│   ├── index.tsx
│   └── ...
├── lib/
│   ├── api/              # API client and hooks
│   ├── utils/            # Utility functions
│   ├── schemas/          # Zod schemas
│   └── constants/        # App constants
├── stores/               # Zustand stores
├── hooks/                # Custom React hooks
├── types/                # TypeScript types
├── styles/               # Global styles
└── main.tsx              # Application entry
```

### Tasks:
- [ ] Create directory structure
- [ ] Set up root route with TanStack Router
- [ ] Create providers wrapper component
- [ ] Set up TanStack Query client with devtools
- [ ] Create base layout component
- [ ] Set up theme provider (dark/light mode)

### Deliverables:
- Clean folder structure
- Working application shell
- Router navigation working

---

## Phase 6: shadcn/ui Integration
**Goal**: Set up and customize component library

### Tasks:
- [ ] Run `shadcn-ui init`
- [ ] Configure `components.json`
- [ ] Install core UI components:
  - Button
  - Card
  - Input
  - Label
  - Dialog
  - Dropdown Menu
  - Tabs
  - Form
  - Table
  - Avatar
  - Badge
  - Separator
  - Tooltip
  - (others as needed)
  
- [ ] Create Storybook stories for each component
- [ ] Customize theme colors and design tokens
- [ ] Add component tests

### Deliverables:
- Complete UI component library
- Storybook documentation
- Theme system

---

## Phase 7: Migrate Existing Components
**Goal**: Port valuable components from old `apps/web`

### Tasks:
- [ ] Audit components to migrate:
  - Resume builder components
  - Personal info components
  - PDF viewer
  - Dashboard components
  
- [ ] Refactor to use new patterns:
  - TanStack Form instead of old form library
  - TanStack Query for data fetching
  - Zustand for local state
  - New UI components
  
- [ ] Update with proper TypeScript types
- [ ] Add comprehensive tests
- [ ] Create Storybook stories
- [ ] Implement drag-and-drop where needed

### Deliverables:
- Migrated and improved components
- Test coverage
- Component documentation

---

## Phase 8: State Management
**Goal**: Implement application state architecture

### Tasks:
- [ ] Create Zustand stores:
  - User/auth store
  - Resume store
  - UI state store
  - Theme store
  
- [ ] Add store persistence (localStorage)
- [ ] Create selectors and actions
- [ ] Add Zustand devtools
- [ ] Write store tests

### Deliverables:
- Complete state management system
- Tested stores
- Clear patterns for state updates

---

## Phase 9: Routing & Pages
**Goal**: Build complete application routes

### Tasks:
- [ ] Define route structure:
  - `/` - Home/Landing
  - `/dashboard` - User dashboard
  - `/resume/new` - Create resume
  - `/resume/:id` - Edit resume
  - `/resume/:id/preview` - Preview resume
  - `/settings` - User settings
  - `/login` - Authentication
  
- [ ] Implement route-based code splitting
- [ ] Add loading states with TanStack Router
- [ ] Implement error boundaries per route
- [ ] Add route guards/protection
- [ ] Create 404 page

### Deliverables:
- Complete routing system
- All main pages scaffolded
- Navigation working

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
