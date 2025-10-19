# Phase 7: Component Migration Audit

## Current Component Inventory

### ✅ Already Migrated (21 UI Components)
Located in `src/components/ui/`:
- avatar, badge, breadcrumb, button, calendar, card, collapsible
- dialog, dropdown-menu, input, label, select, separator, sheet
- sidebar, skeleton, textarea, tooltip

### 🔄 Components to Migrate

#### Navigation Components (5)
- `app-header.tsx` → `features/navigation/app-header.tsx`
- `app-sidebar.tsx` → `features/navigation/app-sidebar.tsx`
- `nav-main.tsx` → `features/navigation/nav-main.tsx`
- `nav-projects.tsx` → `features/navigation/nav-projects.tsx`
- `nav-secondary.tsx` → `features/navigation/nav-secondary.tsx`
- `nav-user.tsx` → `features/navigation/nav-user.tsx`
- `theme-toggle.tsx` → `features/navigation/theme-toggle.tsx`

#### Resume Feature Components (3)
- `resume-builder.tsx` → `features/resume/resume-builder.tsx`
- `resume-dashboard.tsx` → `features/resume/resume-dashboard.tsx`
- `pdf-viewer.tsx` → `features/resume/pdf-viewer.tsx`

#### Dialog Components (2)
- `personal-info-dialog.tsx` → `features/resume/personal-info-dialog.tsx`
- `job-info-dialog.tsx` → `features/resume/job-info-dialog.tsx`

#### Personal Info Sections (7)
- `personal-info/basic-info-section.tsx` → `features/resume/sections/basic-info-section.tsx`
- `personal-info/certifications-section.tsx` → `features/resume/sections/certifications-section.tsx`
- `personal-info/education-section.tsx` → `features/resume/sections/education-section.tsx`
- `personal-info/experience-section.tsx` → `features/resume/sections/experience-section.tsx`
- `personal-info/links-section.tsx` → `features/resume/sections/links-section.tsx`
- `personal-info/skills-section.tsx` → `features/resume/sections/skills-section.tsx`
- `personal-info/index.ts` → `features/resume/sections/index.ts`

#### Auth Components (1)
- `login-form.tsx` → `features/auth/login-form.tsx`

#### Settings Components (1)
- `settings-dialog.tsx` → `features/settings/settings-dialog.tsx`

#### Layout Components (1)
- `layouts/root-layout.tsx` ✅ Already in correct location

**Total to migrate: 20 components**

---

## Lint Warnings to Fix (12)

### 1. `href="#"` Issues (5 warnings)
**Files:**
- `login-form.tsx` line 23: "Forgot password" link
- `login-form.tsx` line 49: "Sign up" link
- `ui/badge.test.tsx` line 15: Test file (OK to keep)
- `ui/button.test.tsx` line 19: Test file (OK to keep)
- `settings-dialog.tsx` line 97: Breadcrumb link

**Fix:** Use proper TanStack Router `Link` component or remove href

### 2. Missing SVG Titles (1 warning)
**Files:**
- `login-form.tsx` line 38: GitHub icon SVG

**Fix:** Add `<title>` element inside SVG or use `aria-label`

### 3. Nested Component Definitions (3 warnings)
**Files:**
- `ui/calendar.tsx` lines 106, 109, 121: Root, Chevron, WeekNumber components

**Fix:** Move component definitions outside the main Calendar component

### 4. document.cookie Usage (1 warning)
**Files:**
- `ui/sidebar.tsx` line 61: Direct cookie assignment

**Fix:** This is from shadcn/ui - will address in future or keep as warning

### 5. Non-null Assertion (1 warning)
**Files:**
- `main.tsx` line 8: `document.getElementById("root")!`

**Fix:** Add null check or keep as warning (standard pattern)

### 6. Breadcrumb Accessibility (2 warnings)
**Files:**
- `ui/breadcrumb.tsx` line 54: Not focusable
- `ui/breadcrumb.tsx` line 56: Should use semantic element

**Fix:** This is from shadcn/ui - may need upstream fix or keep as warning

---

## Migration Strategy

### Phase 7.1: Directory Structure ✅
Create new feature directories:
```
src/components/features/
├── auth/
│   └── login-form.tsx
├── navigation/
│   ├── app-header.tsx
│   ├── app-sidebar.tsx
│   ├── nav-main.tsx
│   ├── nav-projects.tsx
│   ├── nav-secondary.tsx
│   ├── nav-user.tsx
│   └── theme-toggle.tsx
├── resume/
│   ├── resume-builder.tsx
│   ├── resume-dashboard.tsx
│   ├── pdf-viewer.tsx
│   ├── personal-info-dialog.tsx
│   ├── job-info-dialog.tsx
│   └── sections/
│       ├── basic-info-section.tsx
│       ├── certifications-section.tsx
│       ├── education-section.tsx
│       ├── experience-section.tsx
│       ├── links-section.tsx
│       ├── skills-section.tsx
│       └── index.ts
└── settings/
    └── settings-dialog.tsx
```

### Phase 7.2: Fix Lint Warnings
1. Fix `href="#"` in login-form.tsx (2 instances)
2. Add SVG title in login-form.tsx
3. Fix `href="#"` in settings-dialog.tsx
4. Fix nested components in calendar.tsx
5. Consider fixes for breadcrumb, sidebar, main.tsx (or document as acceptable)

### Phase 7.3: Move and Refactor Components
For each component:
1. Move to new location
2. Update imports (use @/ alias)
3. Update to use TanStack Router `Link` where needed
4. Ensure proper TypeScript types
5. Update any hard-coded paths

### Phase 7.4: Update Import References
Search and replace all imports pointing to old locations:
- Routes that use these components
- Other components that import them
- Storybook stories

### Phase 7.5: Test
1. Run lint check (should have 0-3 warnings remaining)
2. Run unit tests
3. Start dev server and verify app works
4. Check all routes render correctly

---

## Expected Outcomes

- ✅ 20 components organized in features/ directory
- ✅ 9 lint warnings fixed (12 - 3 acceptable = 9)
- ✅ All imports updated to new locations
- ✅ Components use TanStack Router patterns
- ✅ App functions identically to before migration
- ✅ Cleaner, more maintainable codebase structure

---

## Next Steps After Phase 7

Phase 8 will focus on proper state management with Zustand stores, which will clean up any remaining state-related issues in the migrated components.
