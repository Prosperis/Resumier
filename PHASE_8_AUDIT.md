# Phase 8 Audit: State Management

## Current State Analysis

### Existing Stores

1. **use-resume-store.ts** (114 lines)
   - **Purpose:** Manages resume data (user info, job info, content)
   - **Technology:** Zustand with persist middleware
   - **Storage:** IndexedDB (via idb-keyval)
   - **Types:** UserInfo, JobInfo, WorkExperience, Education, Skill, Certification, Link
   - **Actions:** setUserInfo, setJobInfo, addJob, removeJob, setContent, reset
   - **Issues:**
     - Good structure but could benefit from better action organization
     - Uses IndexedDB which is good for large data
     - Has tests (use-resume-store.test.ts)

2. **use-resume-documents.ts** (25 lines)
   - **Purpose:** Manages list of resume documents
   - **Technology:** Zustand with persist middleware
   - **Storage:** localStorage
   - **Types:** ResumeDocument (id, name)
   - **Actions:** addDocument
   - **Issues:**
     - Should be merged with resume store for consistency
     - Missing remove/update actions
     - No tests

3. **use-theme.ts** (28 lines)
   - **Purpose:** Manages light/dark theme
   - **Technology:** React useState + localStorage (NOT Zustand)
   - **Storage:** localStorage + DOM manipulation
   - **Actions:** setTheme, toggleTheme
   - **Issues:**
     - Not using Zustand (inconsistent with other stores)
     - Has tests but one is skipped (toggles theme test)
     - Should be refactored to Zustand for consistency

### Dependencies

**Current:**
- ✅ zustand: ^4.5.2
- ✅ idb-keyval: (for IndexedDB storage)

**Missing:**
- ❌ @redux-devtools/extension - for devtools integration

## Refactoring Plan

### Directory Structure

```
src/
├── stores/
│   ├── index.ts                    # Export all stores
│   ├── auth-store.ts               # NEW: Authentication state
│   ├── resume-store.ts             # REFACTOR: Merge resume + documents
│   ├── theme-store.ts              # REFACTOR: Convert to Zustand
│   ├── ui-store.ts                 # NEW: UI state (sidebar, dialogs)
│   └── __tests__/
│       ├── auth-store.test.ts
│       ├── resume-store.test.ts
│       ├── theme-store.test.ts
│       └── ui-store.test.ts
└── hooks/
    ├── use-mobile.ts               # KEEP: Not a store
    └── use-mobile.test.ts
```

### Store Design Patterns

#### 1. Theme Store (Refactor)
**Current:** React hook with localStorage
**Target:** Zustand store with persist + devtools

```typescript
interface ThemeStore {
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
  toggleTheme: () => void
}
```

#### 2. Resume Store (Refactor + Merge)
**Current:** Two separate stores (resume + documents)
**Target:** Single unified store with better organization

```typescript
interface ResumeStore {
  // Personal Info
  userInfo: UserInfo
  setUserInfo: (info: Partial<UserInfo>) => void
  updateUserInfo: (updates: Partial<UserInfo>) => void
  
  // Job Info
  jobInfo: JobInfo
  setJobInfo: (info: JobInfo) => void
  updateJobInfo: (updates: Partial<JobInfo>) => void
  
  // Jobs List
  jobs: JobInfo[]
  addJob: (job: JobInfo) => void
  updateJob: (index: number, job: Partial<JobInfo>) => void
  removeJob: (index: number) => void
  
  // Documents (merged from use-resume-documents)
  documents: ResumeDocument[]
  addDocument: (doc: ResumeDocument) => void
  updateDocument: (id: string, updates: Partial<ResumeDocument>) => void
  removeDocument: (id: string) => void
  
  // Content
  content: ResumeContent
  setContent: (data: ResumeContent) => void
  
  // Actions
  reset: () => void
  resetUserInfo: () => void
  resetJobInfo: () => void
}
```

#### 3. Auth Store (New)
**Purpose:** Manage authentication state

```typescript
interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  setUser: (user: User | null) => void
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  clearError: () => void
}
```

#### 4. UI Store (New)
**Purpose:** Manage app-level UI state

```typescript
interface UIStore {
  // Sidebar
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  
  // Dialogs
  activeDialog: string | null
  dialogData: Record<string, unknown>
  openDialog: (name: string, data?: Record<string, unknown>) => void
  closeDialog: () => void
  
  // Toast/Notifications
  notifications: Notification[]
  addNotification: (notification: Notification) => void
  removeNotification: (id: string) => void
  
  // Loading states
  globalLoading: boolean
  setGlobalLoading: (loading: boolean) => void
}
```

### Middleware Strategy

All stores will use:
1. **persist** - localStorage for small data, IndexedDB for large data
2. **devtools** - Redux DevTools integration for debugging
3. **immer** (optional) - For easier nested state updates

### Selectors Pattern

Create optimized selectors to prevent unnecessary re-renders:

```typescript
// Bad: Re-renders on any userInfo change
const userInfo = useResumeStore((state) => state.userInfo)

// Good: Only re-renders when name changes
const userName = useResumeStore((state) => state.userInfo.name)

// Better: Shallow comparison for objects
import { shallow } from 'zustand/shallow'
const { name, email } = useResumeStore(
  (state) => ({ name: state.userInfo.name, email: state.userInfo.email }),
  shallow
)
```

## Migration Tasks

### Phase 8.1: Setup & Dependencies
- [ ] Install @redux-devtools/extension
- [ ] Create src/stores/ directory structure
- [ ] Create stores/index.ts barrel export

### Phase 8.2: Refactor Theme Store
- [ ] Create stores/theme-store.ts with Zustand
- [ ] Add persist middleware (localStorage)
- [ ] Add devtools middleware
- [ ] Update theme provider to use new store
- [ ] Fix broken theme toggle test
- [ ] Update all components using useTheme

### Phase 8.3: Refactor Resume Store
- [ ] Create stores/resume-store.ts
- [ ] Merge use-resume-documents logic
- [ ] Add better action methods (update vs set)
- [ ] Keep IndexedDB for large data
- [ ] Add devtools middleware
- [ ] Migrate tests from hooks/ to stores/__tests__/
- [ ] Update all components using resume stores

### Phase 8.4: Create Auth Store
- [ ] Create stores/auth-store.ts
- [ ] Add persist middleware (localStorage)
- [ ] Add devtools middleware
- [ ] Create comprehensive tests
- [ ] Update login-form.tsx to use auth store

### Phase 8.5: Create UI Store
- [ ] Create stores/ui-store.ts
- [ ] Add persist middleware for sidebar state
- [ ] Add devtools middleware
- [ ] Create comprehensive tests
- [ ] Update app-sidebar.tsx and other UI components

### Phase 8.6: Cleanup & Documentation
- [ ] Remove old hooks/use-resume-store.ts
- [ ] Remove old hooks/use-resume-documents.ts
- [ ] Remove old hooks/use-theme.ts
- [ ] Update all imports across codebase
- [ ] Run tests (ensure all pass)
- [ ] Create selectors documentation
- [ ] Create Phase 8 summary document

## Testing Strategy

Each store needs:
1. **Initial state tests** - Verify default values
2. **Action tests** - Test each action updates state correctly
3. **Persistence tests** - Verify localStorage/IndexedDB integration
4. **Selector tests** - Verify optimized selectors work
5. **Integration tests** - Test store interactions

## Success Criteria

- ✅ All 4 stores implemented (theme, resume, auth, ui)
- ✅ Devtools integration working for all stores
- ✅ All existing functionality preserved
- ✅ All tests passing (including fixed theme toggle test)
- ✅ No components importing from hooks/ (except use-mobile)
- ✅ Comprehensive documentation
- ✅ Clear patterns for future store additions

## Estimated Impact

**Files to Create:** ~8 (4 stores + 4 test files + index)
**Files to Modify:** ~15 (components using stores)
**Files to Delete:** 3 (old store hooks)
**Test Coverage:** Should maintain or exceed current 70% threshold

## Notes

- **Backward Compatibility:** Keep data structure compatible with existing localStorage/IndexedDB data
- **Performance:** Use selectors to prevent unnecessary re-renders
- **DevEx:** Devtools will make debugging state much easier
- **Consistency:** All state management now follows same pattern (Zustand)
