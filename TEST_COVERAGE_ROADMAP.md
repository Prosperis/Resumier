# Test Coverage Roadmap to 80%

**Goal:** Achieve 80%+ test coverage
**Current Status:** 823 tests passing (100% pass rate)
**Current Coverage:** ~30-40% (estimated)
**Files Tested:** 47 / 171 source files (27.5%)

---

## 📊 Current State

### ✅ Completed (47 test files, 823 tests)
- ✅ All 6 business logic forms (229 tests)
  - ExperienceForm (34 tests)
  - EducationForm (37 tests) 
  - CertificationForm (35 tests)
  - LinkForm (36 tests)
  - SkillsForm (40 tests)
  - PersonalInfoForm (47 tests)
- ✅ 35+ UI component tests (Avatar, Badge, Button, Card, Dialog, etc.)
- ✅ Hooks tests (use-theme, use-mobile, use-resume-store)
- ✅ Store tests (resume-store, theme-store, ui-store, auth-store)
- ✅ Utility tests (utils.ts)
- ✅ API hooks tests (use-create-resume, use-update-resume, use-delete-resume)

---

## 🎯 Phase 1 - Core Features (Highest ROI)

**Target:** Add 5 critical component tests
**Expected Tests:** ~150-200 new tests
**Expected Coverage Gain:** +15-20%

### Priority Components:

#### 1. ✅ `resume-dashboard.tsx` - Main Dashboard
**Priority:** CRITICAL
**Lines:** ~150-200
**Test Focus:**
- Document grid/list rendering
- Empty state
- Create resume button
- Document actions (view, rename, delete)
- Loading states
- Search/filter functionality

#### 2. ⏳ `resume-builder.tsx` - Core Resume Editor
**Priority:** CRITICAL
**Lines:** ~100-150
**Test Focus:**
- Resume preview rendering
- Sidebar rendering
- Form dialog triggers
- Layout structure
- Integration with stores

#### 3. ⏳ `app-header.tsx` - Main Header
**Priority:** HIGH
**Lines:** ~80-100
**Test Focus:**
- Header rendering
- Action buttons (Personal Info, Job Info, Back)
- Logo/title display
- Responsive behavior
- Click handlers

#### 4. ⏳ `app-sidebar.tsx` - Navigation Sidebar
**Priority:** HIGH
**Lines:** ~100-120
**Test Focus:**
- Navigation menu rendering
- Active route highlighting
- Collapse/expand functionality
- User info display
- Menu item clicks

#### 5. ⏳ `login-form.tsx` - Authentication
**Priority:** HIGH
**Lines:** ~120-150
**Test Focus:**
- Form rendering
- Input validation
- Login submission
- Error handling
- Loading states
- Remember me functionality
- Forgot password link

---

## 🎯 Phase 2 - Resume Sections (High Value)

**Target:** Add 6 section component tests
**Expected Tests:** ~180-240 new tests
**Expected Coverage Gain:** +10-15%

### Section Components:

#### 1. ⏳ `basic-info-section.tsx`
**Test Focus:**
- Section rendering
- Data display from store
- Edit triggers
- Empty states

#### 2. ⏳ `experience-section.tsx`
**Test Focus:**
- Experience list rendering
- Add new experience
- Edit experience
- Delete experience
- Drag-n-drop reordering

#### 3. ⏳ `education-section.tsx`
**Test Focus:**
- Education list rendering
- CRUD operations
- Drag-n-drop reordering

#### 4. ⏳ `skills-section.tsx`
**Test Focus:**
- Skills display by category
- Add/remove skills
- Category management

#### 5. ⏳ `certifications-section.tsx`
**Test Focus:**
- Certification list rendering
- CRUD operations
- Drag-n-drop reordering

#### 6. ⏳ `links-section.tsx`
**Test Focus:**
- Links list rendering
- CRUD operations
- Link validation

---

## 🎯 Phase 3 - Supporting Features (Medium Priority)

**Target:** Add mutation dialogs and list components
**Expected Tests:** ~120-180 new tests
**Expected Coverage Gain:** +8-12%

### Mutation Dialogs:

#### 1. ⏳ `create-resume-dialog.tsx`
**Test Focus:**
- Dialog open/close
- Form input
- Create submission
- Validation

#### 2. ⏳ `rename-resume-dialog.tsx`
**Test Focus:**
- Dialog with existing name
- Rename validation
- Submission

#### 3. ⏳ `delete-resume-dialog.tsx`
**Test Focus:**
- Confirmation dialog
- Delete action
- Cancel action

### List Components:

#### 4. ⏳ `experience-list.tsx`
**Test Focus:**
- List rendering
- Empty state
- Item actions

#### 5. ⏳ `education-list.tsx`
#### 6. ⏳ `certification-list.tsx`
#### 7. ⏳ `link-list.tsx`

---

## 🎯 Phase 4 - Navigation & Settings (Lower Priority)

**Target:** Add navigation and settings tests
**Expected Tests:** ~80-120 new tests
**Expected Coverage Gain:** +5-8%

### Navigation Components:

#### 1. ⏳ `nav-main.tsx`
#### 2. ⏳ `nav-projects.tsx`
#### 3. ⏳ `nav-secondary.tsx`
#### 4. ⏳ `nav-user.tsx`
#### 5. ⏳ `theme-toggle.tsx`

### Settings:

#### 6. ⏳ `settings-dialog.tsx`

---

## 🎯 Phase 5 - Resume Features (Nice to Have)

**Target:** Add preview, export, and template tests
**Expected Tests:** ~100-150 new tests
**Expected Coverage Gain:** +5-10%

### Resume Features:

#### 1. ⏳ `resume-preview.tsx`
#### 2. ⏳ `template-selector.tsx`
#### 3. ⏳ `export-menu.tsx`
#### 4. ⏳ `pdf-viewer.tsx`
#### 5. ⏳ Template components (classic, modern, minimal)
#### 6. ⏳ Drag-n-drop components (sortable-item, drag-handle)

---

## 🎯 Phase 6 - Additional Components

**Target:** Cover remaining UI components and utilities
**Expected Tests:** ~50-100 new tests
**Expected Coverage Gain:** +3-5%

### Additional Components:

#### 1. ⏳ `resume-table.tsx`
#### 2. ⏳ `resume-table-columns.tsx`
#### 3. ⏳ `resume-editor.tsx`
#### 4. ⏳ `job-info-dialog.tsx`
#### 5. ⏳ `personal-info-dialog.tsx` (legacy)

---

## 📈 Expected Progress

| Phase | Tests Added | Cumulative Tests | Estimated Coverage |
|-------|-------------|------------------|-------------------|
| **Baseline** | 823 | 823 | ~30-40% |
| **Phase 1** | +180 | 1,003 | ~50-55% |
| **Phase 2** | +210 | 1,213 | ~65-70% |
| **Phase 3** | +150 | 1,363 | ~75-80% |
| **Phase 4** | +100 | 1,463 | **~82-85%** ✅ |
| **Phase 5** | +125 | 1,588 | ~88-90% |
| **Phase 6** | +75 | 1,663 | ~92-95% |

**Target Achievement:** End of Phase 3 or early Phase 4

---

## 🚀 Action Plan

### Immediate Next Steps (Phase 1):
1. ✅ Create this roadmap document
2. ⏳ Test `resume-dashboard.tsx` (~35-40 tests)
3. ⏳ Test `resume-builder.tsx` (~30-35 tests)
4. ⏳ Test `app-header.tsx` (~25-30 tests)
5. ⏳ Test `app-sidebar.tsx` (~35-40 tests)
6. ⏳ Test `login-form.tsx` (~35-40 tests)
7. ⏳ Run coverage analysis
8. ⏳ Adjust plan based on actual coverage

### Success Criteria:
- ✅ All tests passing (maintain 100% pass rate)
- ✅ Achieve 80%+ total coverage
- ✅ No regressions in existing tests
- ✅ Follow established testing patterns
- ✅ Comprehensive test scenarios (happy path + edge cases)

---

## 📝 Testing Patterns to Follow

### Established Patterns:
1. **Use `user.paste()`** for special characters and long text
2. **Use `getByPlaceholderText()`** for custom wrapped components
3. **Test only explicit input types** (email, tel), not default (text)
4. **Mock external dependencies** (API calls, stores when needed)
5. **Test both happy paths and error scenarios**
6. **Use descriptive test names** (what/when/expected)
7. **Group tests logically** with describe blocks

### Standard Test Structure:
```typescript
describe("ComponentName", () => {
  describe("Rendering", () => {
    it("renders with default props")
    it("renders with custom props")
    it("renders in loading state")
    it("renders in error state")
  })

  describe("User Interactions", () => {
    it("handles button clicks")
    it("handles form submissions")
    it("handles input changes")
  })

  describe("Edge Cases", () => {
    it("handles empty data")
    it("handles invalid data")
    it("handles long text")
  })
})
```

---

**Last Updated:** October 20, 2025
**Status:** Phase 1 In Progress
