# Phase 19: Accessibility - Detailed Plan

**Date:** October 27, 2025  
**Status:** 🟡 IN PROGRESS  
**Goal:** Ensure comprehensive WCAG 2.1 AA compliance and exceptional accessibility

---

## 🎯 Objectives

Transform Resumier into a **fully accessible application** that exceeds WCAG 2.1 AA standards and provides an exceptional experience for users with disabilities.

### Current State (from Phase 18)
- ✅ Lighthouse Accessibility: **100/100** (automated tests)
- ✅ Excellent foundation with shadcn/ui (Radix UI primitives)
- ✅ Basic semantic HTML structure
- ⚠️ Manual testing and advanced patterns needed

### Target State
- 🎯 **WCAG 2.1 AA Compliance** (all criteria)
- 🎯 **Lighthouse Accessibility: 100/100** (verified)
- 🎯 **Full keyboard navigation** (all features)
- 🎯 **Screen reader tested** (NVDA/JAWS/VoiceOver)
- 🎯 **Color contrast verified** (all combinations)
- 🎯 **Focus management** (proper indicators & trapping)
- 🎯 **Accessible error handling** (clear announcements)

---

## 📋 Sub-Phases

### Phase 19.1: Accessibility Audit & Documentation
**Duration:** 0.5 day  
**Deliverable:** `PHASE_19.1_AUDIT.md`

#### Tasks:
- [ ] Review current Lighthouse accessibility report
- [ ] Document existing accessibility features
- [ ] Identify gaps and improvement areas
- [ ] Create accessibility testing checklist
- [ ] Document WCAG 2.1 AA criteria to verify
- [ ] Set up testing environment (screen readers, contrast checkers)

#### Tools:
- Lighthouse CI
- Chrome DevTools Accessibility Panel
- axe DevTools browser extension
- Wave accessibility evaluation tool

---

### Phase 19.2: Keyboard Navigation
**Duration:** 0.5 day  
**Deliverable:** Full keyboard accessibility

#### Tasks:
- [ ] Audit all interactive elements for keyboard access
  - [ ] Navigation menu (Tab, Arrow keys)
  - [ ] Forms (Tab, Enter, Space)
  - [ ] Buttons and links (Tab, Enter, Space)
  - [ ] Dialogs/modals (Escape, Tab trap)
  - [ ] Dropdowns (Arrow keys, Enter, Escape)
  - [ ] Tabs (Arrow keys, Tab)
  - [ ] Tables (if applicable)
  - [ ] Custom components (resume builder, etc.)

- [ ] Ensure logical tab order throughout app
- [ ] Test keyboard shortcuts don't conflict
- [ ] Document keyboard interactions in components

#### Success Criteria:
- ✅ All features accessible via keyboard only
- ✅ Logical tab order (left-to-right, top-to-bottom)
- ✅ No keyboard traps (except intentional in modals)
- ✅ Visible focus indicators on all interactive elements
- ✅ Escape key closes overlays/modals

---

### Phase 19.3: ARIA Implementation
**Duration:** 1 day  
**Deliverable:** Proper ARIA labels and roles

#### Tasks:
- [ ] Audit and fix ARIA labels
  - [ ] Form inputs (`aria-label`, `aria-describedby`)
  - [ ] Buttons without visible text (`aria-label`)
  - [ ] Icons (`aria-hidden="true"` or `aria-label`)
  - [ ] Status messages (`role="status"`, `aria-live`)
  - [ ] Error messages (`role="alert"`, `aria-invalid`)
  - [ ] Loading states (`aria-busy`, `aria-live`)
  - [ ] Modals/dialogs (`role="dialog"`, `aria-modal`)
  - [ ] Tooltips (`role="tooltip"`, `aria-describedby`)

- [ ] Implement proper ARIA roles
  - [ ] Navigation (`role="navigation"`)
  - [ ] Main content (`role="main"`)
  - [ ] Search (`role="search"`)
  - [ ] Complementary content (`role="complementary"`)
  - [ ] Lists and list items

- [ ] Add ARIA live regions for dynamic content
  - [ ] Toast notifications (`role="status"` or `role="alert"`)
  - [ ] Form validation messages
  - [ ] Loading states
  - [ ] Search results updates

- [ ] Document ARIA patterns used

#### Success Criteria:
- ✅ All interactive elements properly labeled
- ✅ Dynamic content changes announced to screen readers
- ✅ Form errors clearly associated with inputs
- ✅ Loading states announced
- ✅ No misuse of ARIA (prefer semantic HTML)

---

### Phase 19.4: Screen Reader Testing
**Duration:** 0.5 day  
**Deliverable:** Screen reader test report

#### Tasks:
- [ ] Set up screen readers
  - [ ] NVDA (Windows) - free
  - [ ] JAWS (Windows) - trial or demo
  - [ ] VoiceOver (Mac) - built-in
  - [ ] TalkBack (Android) - optional
  - [ ] VoiceOver (iOS) - optional

- [ ] Test all major user flows
  - [ ] Homepage navigation
  - [ ] Sign up / login process
  - [ ] Dashboard navigation
  - [ ] Resume creation flow
  - [ ] Form filling and validation
  - [ ] Template selection
  - [ ] Settings modification
  - [ ] Error handling

- [ ] Document issues found
- [ ] Fix critical screen reader issues
- [ ] Re-test fixed issues

#### Success Criteria:
- ✅ All content readable by screen readers
- ✅ Proper heading hierarchy (h1 → h2 → h3)
- ✅ Form labels announced correctly
- ✅ Error messages announced clearly
- ✅ Loading states announced
- ✅ Dynamic content changes announced
- ✅ Navigation landmarks work properly

---

### Phase 19.5: Color Contrast Audit
**Duration:** 0.25 day  
**Deliverable:** Color contrast compliance report

#### Tasks:
- [ ] Audit all color combinations
  - [ ] Body text (WCAG AA: 4.5:1 minimum)
  - [ ] Large text (WCAG AA: 3:1 minimum)
  - [ ] UI components (borders, icons: 3:1)
  - [ ] Focus indicators (3:1 against background)
  - [ ] Link text (distinguish from body text)

- [ ] Test both light and dark themes
- [ ] Use contrast checker tools
  - [ ] Chrome DevTools color picker
  - [ ] WebAIM Contrast Checker
  - [ ] axe DevTools

- [ ] Fix failing contrast ratios
- [ ] Document color system with ratios

#### Success Criteria:
- ✅ All text meets WCAG AA contrast (4.5:1)
- ✅ Large text meets WCAG AA contrast (3:1)
- ✅ UI components meet 3:1 contrast
- ✅ Both themes compliant
- ✅ Focus indicators clearly visible

---

### Phase 19.6: Focus Management
**Duration:** 0.5 day  
**Deliverable:** Proper focus handling

#### Tasks:
- [ ] Implement visible focus indicators
  - [ ] Consistent focus ring style across all elements
  - [ ] Use `outline` or custom focus styles
  - [ ] Ensure focus visible in both themes
  - [ ] Test focus visibility on all backgrounds

- [ ] Implement focus trapping in modals/dialogs
  - [ ] Focus moves to modal when opened
  - [ ] Tab cycles within modal only
  - [ ] Escape closes modal
  - [ ] Focus returns to trigger element when closed

- [ ] Manage focus for route changes
  - [ ] Focus moves to main content on navigation
  - [ ] Skip link implemented and functional
  - [ ] Announce route changes to screen readers

- [ ] Test focus order in complex components
  - [ ] Resume builder (drag-and-drop alternative)
  - [ ] Form wizards / multi-step forms
  - [ ] Nested interactive elements

#### Success Criteria:
- ✅ All interactive elements have visible focus indicators
- ✅ Focus trapped in modals/dialogs
- ✅ Focus restored when modals close
- ✅ Focus moves to main content on navigation
- ✅ Logical focus order maintained

---

### Phase 19.7: Skip Links
**Duration:** 0.25 day  
**Deliverable:** Functional skip navigation

#### Tasks:
- [ ] Implement "Skip to main content" link
  - [ ] Visible on focus (hidden otherwise)
  - [ ] First focusable element on page
  - [ ] Moves focus to main content area
  - [ ] Works on all pages

- [ ] Consider additional skip links
  - [ ] Skip to navigation
  - [ ] Skip to search (if applicable)
  - [ ] Skip to footer

- [ ] Style skip link appropriately
  - [ ] High contrast, clear text
  - [ ] Large enough target (44x44px minimum)
  - [ ] Smooth focus transition

#### Success Criteria:
- ✅ Skip link is first focusable element
- ✅ Visible when focused
- ✅ Successfully moves focus to main content
- ✅ Works on all routes
- ✅ Clearly styled and easy to use

---

### Phase 19.8: Form Accessibility
**Duration:** 0.5 day  
**Deliverable:** Fully accessible forms

#### Tasks:
- [ ] Audit all forms in the application
  - [ ] Login form
  - [ ] Sign-up form
  - [ ] Resume builder forms (personal info, education, experience)
  - [ ] Settings forms
  - [ ] Any other forms

- [ ] Ensure proper labeling
  - [ ] All inputs have associated labels (not just placeholders)
  - [ ] Use `<label>` with `htmlFor` or wrap inputs
  - [ ] Required fields marked (`aria-required` or `required`)
  - [ ] Field descriptions use `aria-describedby`

- [ ] Implement accessible error handling
  - [ ] Error messages associated with inputs (`aria-describedby`)
  - [ ] Invalid inputs marked (`aria-invalid="true"`)
  - [ ] Error summary at top of form (announced on submit)
  - [ ] Focus moves to first error on submit
  - [ ] Errors announced to screen readers (`role="alert"`)

- [ ] Test form validation flow
  - [ ] Inline validation timing (not too aggressive)
  - [ ] Clear error messages (actionable guidance)
  - [ ] Success confirmations announced

#### Success Criteria:
- ✅ All form inputs properly labeled
- ✅ Required fields clearly indicated
- ✅ Validation errors announced to screen readers
- ✅ Focus moves to first error on submit
- ✅ Error messages associated with inputs
- ✅ Success messages announced

---

### Phase 19.9: Automated Accessibility Testing
**Duration:** 0.5 day  
**Deliverable:** Automated test suite

#### Tasks:
- [ ] Install accessibility testing tools
  ```bash
  bun add -D axe-core @axe-core/react vitest-axe
  ```

- [ ] Create accessibility test utilities
  - [ ] Set up axe-core with Vitest
  - [ ] Create custom test helpers
  - [ ] Configure axe rules

- [ ] Write accessibility tests for all routes
  - [ ] Homepage (`src/routes/index.tsx`)
  - [ ] Login (`src/routes/login.lazy.tsx`)
  - [ ] Dashboard (`src/routes/dashboard/index.lazy.tsx`)
  - [ ] Resume builder (`src/routes/resume/$id.lazy.tsx`)
  - [ ] Resume preview (`src/routes/resume/$id.preview.lazy.tsx`)
  - [ ] Settings (`src/routes/settings.lazy.tsx`)

- [ ] Write accessibility tests for components
  - [ ] Form components
  - [ ] Button components
  - [ ] Modal/dialog components
  - [ ] Navigation components

- [ ] Set up Playwright accessibility tests
  - [ ] Install @axe-core/playwright
  - [ ] Create E2E accessibility tests
  - [ ] Run on all major user flows

- [ ] Integrate into CI/CD pipeline
  - [ ] Add accessibility check to test command
  - [ ] Fail build on accessibility violations
  - [ ] Generate accessibility report

#### Success Criteria:
- ✅ Automated tests run on all routes
- ✅ No critical accessibility violations
- ✅ Tests integrated into CI/CD
- ✅ Coverage for major components
- ✅ Clear reporting of issues

---

### Phase 19.10: Final Accessibility Audit
**Duration:** 0.25 day  
**Deliverable:** `PHASE_19.10_AUDIT.md`

#### Tasks:
- [ ] Run comprehensive Lighthouse audit
  - [ ] Desktop audit
  - [ ] Mobile audit
  - [ ] All major routes

- [ ] Run axe DevTools on all pages
- [ ] Run WAVE evaluation
- [ ] Manual WCAG 2.1 AA checklist
  - [ ] Perceivable (color, text alternatives, time-based media)
  - [ ] Operable (keyboard, timing, navigation)
  - [ ] Understandable (readable, predictable, input assistance)
  - [ ] Robust (compatible with assistive technologies)

- [ ] Document any remaining issues
- [ ] Create action plan for any issues found
- [ ] Verify all Phase 19 tasks completed

#### Success Criteria:
- 🎯 **Lighthouse Accessibility: 100/100** (desktop & mobile)
- 🎯 **axe DevTools: 0 violations**
- 🎯 **WAVE: 0 errors**
- 🎯 **WCAG 2.1 AA: Full compliance**

---

### Phase 19.11: Accessibility Documentation
**Duration:** 0.25 day  
**Deliverable:** `PHASE_19_SUMMARY.md`, updated README

#### Tasks:
- [ ] Document accessibility features
  - [ ] Keyboard navigation guide
  - [ ] Screen reader compatibility
  - [ ] Color contrast ratios
  - [ ] ARIA patterns used
  - [ ] Testing approach

- [ ] Create accessibility statement
  - [ ] Compliance level (WCAG 2.1 AA)
  - [ ] Date of evaluation
  - [ ] Known limitations (if any)
  - [ ] Contact for accessibility issues

- [ ] Update README with accessibility info
- [ ] Create accessibility testing guide for contributors
- [ ] Document before/after metrics
- [ ] Create `PHASE_19_SUMMARY.md`

---

## 🛠️ Tools & Libraries

### Browser Extensions
- **axe DevTools** - Automated accessibility testing
- **WAVE** - Visual accessibility evaluation
- **Lighthouse** - Performance & accessibility audits
- **Chrome DevTools** - Accessibility panel

### Screen Readers
- **NVDA** (Windows) - Free, widely used
- **JAWS** (Windows) - Industry standard (trial available)
- **VoiceOver** (Mac/iOS) - Built-in
- **TalkBack** (Android) - Built-in

### Testing Libraries
```bash
bun add -D axe-core @axe-core/react vitest-axe @axe-core/playwright
```

### Color Contrast Tools
- **WebAIM Contrast Checker** - Online tool
- **Chrome DevTools** - Built-in color picker
- **Stark** - Figma/Sketch plugin (design phase)

---

## 📊 Success Criteria

### Automated Tests
- ✅ Lighthouse Accessibility: **100/100** (desktop & mobile)
- ✅ axe-core: **0 violations**
- ✅ WAVE: **0 errors**

### Manual Testing
- ✅ Full keyboard navigation (no mouse required)
- ✅ Screen reader tested (NVDA/JAWS/VoiceOver)
- ✅ All forms accessible and usable
- ✅ All error states handled accessibly
- ✅ Color contrast meets WCAG AA

### WCAG 2.1 AA Compliance
- ✅ **Perceivable** - All 4 principles
- ✅ **Operable** - All 4 principles
- ✅ **Understandable** - All 3 principles
- ✅ **Robust** - All principles

### Documentation
- ✅ Accessibility statement published
- ✅ Testing guide for contributors
- ✅ Keyboard navigation documented
- ✅ Phase 19 summary completed

---

## ⏱️ Timeline

**Total Duration:** ~4-5 days

| Phase | Duration | Priority |
|-------|----------|----------|
| 19.1: Audit & Documentation | 0.5 day | High |
| 19.2: Keyboard Navigation | 0.5 day | High |
| 19.3: ARIA Implementation | 1 day | High |
| 19.4: Screen Reader Testing | 0.5 day | High |
| 19.5: Color Contrast | 0.25 day | Medium |
| 19.6: Focus Management | 0.5 day | High |
| 19.7: Skip Links | 0.25 day | Medium |
| 19.8: Form Accessibility | 0.5 day | High |
| 19.9: Automated Testing | 0.5 day | High |
| 19.10: Final Audit | 0.25 day | High |
| 19.11: Documentation | 0.25 day | Medium |

---

## 🚀 Getting Started

### Phase 19.1: Initial Audit
1. Run Lighthouse audit on all major routes
2. Install and run axe DevTools
3. Review current ARIA implementation
4. Create accessibility testing checklist
5. Document baseline metrics

Let's start with Phase 19.1! 🎯

---

## 📝 Notes

- Radix UI primitives (used by shadcn/ui) provide excellent accessibility foundation
- Focus on manual testing - automated tools catch ~30% of issues
- Screen reader testing is critical - can't be automated
- Test with real users if possible
- Maintain accessibility in future development (add to checklist)

---

## 📚 References

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN: ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)
- [Radix UI Accessibility](https://www.radix-ui.com/primitives/docs/overview/accessibility)
- [WebAIM Resources](https://webaim.org/resources/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
