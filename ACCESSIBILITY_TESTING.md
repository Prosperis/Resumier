# Accessibility Testing - Quick Reference

## Running Tests

```bash
# All accessibility tests
npm run test:accessibility

# Watch mode
npm run test:watch

# All tests
npm test
```

## Test Files

- `src/test/accessibility/basic.test.tsx` - HTML/ARIA validation (15 tests)
- `src/test/accessibility/routes.test.tsx` - Route structure (5 tests)
- `src/test/accessibility-utils.tsx` - Testing utilities

## Test Coverage

### ✅ Automated (20 tests)
- Image alt text
- Button/link names  
- ARIA attributes
- Form labels
- Landmark structure
- Focus management
- Route tree structure

### 🔧 Manual Testing Required
- Keyboard navigation (Phase 19.2)
- Screen reader (Phase 19.4)
- Visual focus indicators
- Production Lighthouse audit (Phase 19.10)

## Key Commands

```bash
# Run accessibility tests only
npm run test:accessibility

# Generate test coverage
npx vitest run --coverage

# Debug a specific test
npx vitest run src/test/accessibility/basic.test.tsx

# Watch mode for development
npm run test:watch
```

## What's Tested

1. **Images**: Alt text presence
2. **Buttons**: Accessible names (text or aria-label)
3. **Forms**: Label associations, required fields
4. **ARIA**: Valid attributes and values
5. **Landmarks**: header, nav, main structure
6. **Focus**: No positive tabindex values
7. **Routes**: Import and structure validation

## Test Results

```
✅ 20/20 tests passing
✅ ~3.5s execution time
✅ WCAG 2.1 AA rules enforced
```

## Important Notes

- **Use Node**: Tests must run with `npm` (not `bun test`)
- **Warnings OK**: jsdom warnings about getComputedStyle are normal
- **Manual Testing**: Keyboard and screen reader testing still required

## Next Steps

1. ✅ Automated tests complete
2. 🔧 Manual keyboard testing (PHASE_19.2_KEYBOARD_TESTING.md)
3. 🔧 Optional screen reader testing (PHASE_19.4_SCREEN_READER_GUIDE.md)
4. 🔧 Final Lighthouse audit (Phase 19.10)

---

For full details, see `PHASE_19.9_COMPLETE.md`
