# Phase 9: Routing & Pages - Audit

## Current State Analysis

### ✅ What's Already Set Up

1. **TanStack Router v1.120.20** - Already installed and configured
   - Router CLI tools: `@tanstack/router-cli` v1.133.13
   - Router DevTools: `@tanstack/router-devtools` v1.133.13
   - File-based routing enabled

2. **TSR Configuration** (`tsr.config.json`)
   - Routes directory: `./src/routes`
   - Generated route tree: `./src/app/routeTree.gen.ts`
   - Route file ignore prefix: `-`
   - Quote style: `double`

3. **Router Instance** (`src/app/router.ts`)
   - Router created with generated route tree
   - Default preload on intent
   - Type safety registered

4. **Root Route** (`src/routes/__root.tsx`)
   - Root layout wrapper
   - Outlet for child routes
   - Router DevTools in development mode

5. **Existing Routes**
   - `/` - Index route with basic welcome content
   - `/test-components` - Test route (can be removed)

6. **Package Scripts**
   - `routes:generate` - Generate route tree
   - `routes:watch` - Watch mode for routes
   - Build includes route generation

### ❌ What's Missing

1. **Core Application Routes**
   - `/dashboard` - User dashboard with resume list
   - `/resume/new` - Create new resume
   - `/resume/$id` - Edit existing resume
   - `/resume/$id/preview` - Preview resume
   - `/settings` - User settings
   - `/login` - Authentication page

2. **Route Features**
   - Loading states (pendingComponent)
   - Error boundaries (errorComponent)
   - Route guards (beforeLoad)
   - 404 page (notFoundComponent)
   - Code splitting (lazy loading)

3. **Navigation Integration**
   - Sidebar still uses basic links, needs TanStack Router's Link
   - No navigation guards for protected routes
   - No breadcrumb implementation

4. **Layout System**
   - No authenticated layout (with sidebar/header)
   - No public layout (minimal for login)
   - Root layout exists but needs refinement

## Phase 9 Implementation Plan

### 1. Route Structure Design

```
src/routes/
├── __root.tsx                 ✅ EXISTS - Root layout
├── index.tsx                  ✅ EXISTS - Landing page
├── dashboard.tsx              ❌ CREATE - Dashboard with resume list
├── login.tsx                  ❌ CREATE - Login page
├── settings.tsx               ❌ CREATE - Settings page
├── resume/
│   ├── new.tsx               ❌ CREATE - Create resume
│   ├── $id.tsx               ❌ CREATE - Edit resume
│   └── $id.preview.tsx       ❌ CREATE - Preview resume
└── _authenticated/           ❌ CREATE - Layout route for protected pages
    └── (contains protected routes)
```

### 2. Route Guard Strategy

**Authentication Check:**
- Use `beforeLoad` hook on protected routes
- Check `useAuthStore` for `isAuthenticated`
- Redirect to `/login` if not authenticated
- Store intended destination for post-login redirect

**Implementation Pattern:**
```typescript
export const Route = createFileRoute('/dashboard')({
  beforeLoad: async ({ location }) => {
    const { isAuthenticated } = useAuthStore.getState()
    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: DashboardComponent,
})
```

### 3. Loading States Pattern

**Pending Component:**
```typescript
export const Route = createFileRoute('/dashboard')({
  pendingComponent: () => (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="h-8 w-8 animate-spin" />
      <span className="ml-2">Loading dashboard...</span>
    </div>
  ),
  pendingMs: 1000,
  component: DashboardComponent,
})
```

### 4. Error Boundary Pattern

**Error Component:**
```typescript
export const Route = createFileRoute('/dashboard')({
  errorComponent: ({ error, reset }) => (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <p className="text-muted-foreground mb-4">{error.message}</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  ),
  component: DashboardComponent,
})
```

### 5. Code Splitting Strategy

**Lazy Loading Components:**
```typescript
import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'

export const Route = createFileRoute('/resume/$id')({
  component: lazyRouteComponent(() => import('../components/features/resume/resume-builder')),
})
```

### 6. 404 Page Implementation

**Not Found Component on Root:**
```typescript
export const Route = createRootRoute({
  notFoundComponent: () => (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-8">Page not found</p>
      <Link to="/">
        <Button>Go home</Button>
      </Link>
    </div>
  ),
  component: RootComponent,
})
```

## Route Specifications

### 1. Landing Page (`/`)
**Status:** ✅ Exists, needs enhancement
**Purpose:** Welcome page with CTA
**Features:**
- Hero section
- Feature highlights
- CTA buttons (Get Started, Sign In)
**Access:** Public
**Loading:** Fast (static content)

### 2. Login Page (`/login`)
**Status:** ❌ Create
**Purpose:** User authentication
**Features:**
- Login form (from existing component)
- Redirect to dashboard on success
- Remember redirect location
**Access:** Public
**Components:** `<LoginForm />` (already exists)

### 3. Dashboard Page (`/dashboard`)
**Status:** ❌ Create
**Purpose:** Resume management dashboard
**Features:**
- List all user resumes
- Create new resume button
- Edit/delete resume actions
- Search and filter
**Access:** Protected (requires auth)
**Components:** `<ResumeDashboard />` (already exists)
**Loading:** Show skeleton while loading resumes

### 4. Create Resume (`/resume/new`)
**Status:** ❌ Create
**Purpose:** Create new resume
**Features:**
- Personal info form
- Job info form
- Save as draft
- Preview
**Access:** Protected
**Components:** `<ResumeBuilder />` (already exists)

### 5. Edit Resume (`/resume/$id`)
**Status:** ❌ Create
**Purpose:** Edit existing resume
**Features:**
- Load resume by ID
- Full resume editor
- Auto-save
- Preview toggle
**Access:** Protected
**Components:** `<ResumeBuilder />` (already exists)
**Loading:** Load resume data
**Error:** Handle resume not found

### 6. Preview Resume (`/resume/$id/preview`)
**Status:** ❌ Create
**Purpose:** Full-page resume preview
**Features:**
- Full resume display
- Print/PDF export
- Back to editor
**Access:** Protected (or shareable link)
**Components:** `<PDFViewer />` or new preview component

### 7. Settings Page (`/settings`)
**Status:** ❌ Create
**Purpose:** User settings and preferences
**Features:**
- Profile settings
- Theme preferences
- Account management
**Access:** Protected
**Components:** `<SettingsDialog />` content (adapt existing)

## Layout Architecture

### Root Layout (Already exists)
- Basic wrapper
- Router DevTools
- Outlet for child routes

### Authenticated Layout (To create)
- App sidebar
- App header
- Main content area
- Footer (optional)

**Pattern:**
```
_authenticated/
└── route.tsx  (layout route)
```

All protected routes become children of this layout.

### Public Layout (To create if needed)
- Minimal header
- Full-width content
- No sidebar

## Navigation Updates

### Current State
- `app-sidebar.tsx` - Uses basic links or custom navigation
- `app-header.tsx` - May have basic links
- `nav-*.tsx` components - Need Link updates

### Required Changes
Replace navigation with TanStack Router's Link:

```typescript
import { Link } from '@tanstack/react-router'

// Before
<a href="/dashboard">Dashboard</a>

// After
<Link to="/dashboard" activeProps={{ className: 'active' }}>
  Dashboard
</Link>
```

## Testing Strategy

### Manual Testing Checklist
- [ ] All routes render correctly
- [ ] Navigation between routes works
- [ ] Auth guards redirect to login
- [ ] Login redirects to intended destination
- [ ] Loading states show appropriately
- [ ] Error boundaries catch errors
- [ ] 404 page shows for invalid routes
- [ ] Browser back/forward works
- [ ] Breadcrumbs update correctly

### E2E Testing (Future)
- Navigation flows
- Auth flows
- Protected route access

## Implementation Order

### Phase 9.1: Core Routes Setup
1. ✅ Audit current routing (this document)
2. Create login page route
3. Create dashboard route with guards
4. Create settings route with guards
5. Test basic navigation and guards

### Phase 9.2: Resume Routes
6. Create `/resume/new` route
7. Create `/resume/$id` route
8. Create `/resume/$id/preview` route
9. Integrate existing components
10. Test resume creation/editing flow

### Phase 9.3: Enhanced Features
11. Add loading states to all routes
12. Add error boundaries to all routes
13. Implement 404 page
14. Add code splitting where beneficial
15. Update all navigation components to use Link

### Phase 9.4: Polish & Testing
16. Test all routes and navigation
17. Verify auth guards work correctly
18. Test error scenarios
19. Document routing patterns
20. Create Phase 9 summary

## Success Criteria

- ✅ All 7 core routes created and functional
- ✅ Auth guards protect private routes correctly
- ✅ Loading states show during navigation
- ✅ Error boundaries catch and display errors
- ✅ 404 page handles invalid routes
- ✅ Navigation components use TanStack Router Link
- ✅ Route guards check authentication properly
- ✅ TypeScript compiles without errors
- ✅ All routes accessible via sidebar navigation

## Notes

- TanStack Router uses file-based routing convention
- Route parameters use `$` prefix (e.g., `$id`)
- Layout routes use `_` prefix (e.g., `_authenticated`)
- Route file ignore prefix is `-` (for utility files)
- Routes auto-generate type-safe navigation
- DevTools available in development mode

## Dependencies Status

All required dependencies already installed:
- ✅ `@tanstack/react-router` v1.120.20
- ✅ `@tanstack/router-cli` v1.133.13
- ✅ `@tanstack/router-devtools` v1.133.13
- ✅ `@tanstack/react-query` v5.80.6 (for future data loading)

No additional installations required for Phase 9.
