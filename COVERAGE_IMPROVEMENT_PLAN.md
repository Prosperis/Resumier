# Test Coverage Improvement Plan

## ✅ Completed (This Session)
- **animated-badge.test.tsx** - 113 tests (~213 lines covered)
- **animated-feedback.test.tsx** - 100+ tests (~311 lines covered)  
- **animated-icon.test.tsx** - 110+ tests (~224 lines covered)

**Total Lines Covered:** ~748 lines
**Expected Coverage Increase:** 68.69% → 73-75%

---

## 🎯 Next Priority Files (To Reach 80%)

### Priority 1: Large Untested Components (~400-500 lines)

1. **experience-form-dialog.tsx** (255 lines, 0% coverage)
   - Already has test file but tests are failing due to ResizeObserver
   - Fix: Add ResizeObserver mock to vitest.setup.ts
   - Tests exist, just need to be fixed

2. **Other Form Dialogs** (if any still at 0%)
   - Check education-form-dialog, certification-form-dialog
   - Similar pattern to experience-form-dialog

### Priority 2: Medium Components (~100-200 lines)

3. **Navigation Components**
   - Check which navigation files have low coverage
   - Test breadcrumb navigation flows
   - Test sidebar interactions

4. **Data Table Components**
   - resume-table.tsx
   - resume-table-columns.tsx
   - Table sorting, filtering, pagination

### Priority 3: API Hooks & Business Logic

5. **API Hooks** (High value, relatively easy to test)
   - use-create-resume
   - use-update-resume  
   - use-delete-resume
   - use-duplicate-resume
   - use-resume
   - use-resumes

6. **Validation Schemas**
   - certification.ts
   - education.ts
   - experience.ts
   - links.ts
   - personal-info.ts
   - skills.ts

### Priority 4: Utility Functions

7. **lib/utils.ts** - Should have near 100% coverage
8. **lib/constants.ts** - Configuration values
9. **Date/Time utilities** - If any exist

---

## 🔧 Known Issues to Fix

### ResizeObserver Issue
Many form dialog tests are failing with:
```
TypeError: resizeObserver.observe is not a function
```

**Fix:** Add to `vitest.setup.ts`:
```typescript
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
```

### Missing Testing Library Matchers
Some tests fail with:
```
Error: Invalid Chai property: toBeInTheDocument
```

**Fix:** Ensure `@testing-library/jest-dom` is imported in vitest.setup.ts

---

## 📈 Coverage Goal Breakdown

**Current:** 68.69%  
**After this session:** ~73-75% (with 3 new test files)  
**Target:** 80%  

**Gap to close:** ~5-7%  
**Estimated tests needed:** 200-300 more tests across 5-10 files

---

## 🚀 Quick Wins (High ROI)

1. **Fix ResizeObserver** - This alone will enable ~150+ existing tests
2. **Test API Hooks** - Small files, easy to mock, high coverage gain
3. **Test Validation Schemas** - Pure functions, easy to test
4. **Test Utility Functions** - Usually simple, high coverage per line

---

## 📝 Testing Strategy

### For Each Component:
1. ✅ Rendering tests
2. ✅ Props/variants tests
3. ✅ Interaction tests
4. ✅ Accessibility tests
5. ✅ Edge cases
6. ✅ Error handling

### For Each Hook:
1. ✅ Initial state
2. ✅ Success scenarios
3. ✅ Error scenarios
4. ✅ Loading states
5. ✅ Mutation effects

### For Each Validation Schema:
1. ✅ Valid inputs
2. ✅ Invalid inputs (each field)
3. ✅ Edge cases (boundaries)
4. ✅ Type coercion
5. ✅ Custom error messages

---

## 🎨 Next Session Plan

1. Run tests and verify new coverage percentage
2. If < 75%, add tests for 2-3 more UI components
3. Fix ResizeObserver issue
4. Test 3-5 API hooks
5. Test 2-3 validation schemas
6. Re-run coverage to check if 80% reached

