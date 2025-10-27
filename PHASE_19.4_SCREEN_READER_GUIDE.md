# Phase 19.4: Screen Reader Testing Guide

**Date:** October 27, 2025  
**Status:** 🟡 IN PROGRESS  
**Goal:** Verify screen reader compatibility and proper announcements

---

## 📋 Overview

This guide provides step-by-step instructions for testing Resumier with screen readers to ensure all content is accessible and properly announced to users with visual impairments.

---

## 🛠️ Screen Reader Setup

### Windows Options

#### Option 1: NVDA (Recommended - Free)

**Installation:**
1. Download from https://www.nvaccess.org/download/
2. Run installer
3. Choose "Install NVDA on this computer"
4. Complete setup wizard

**Basic Commands:**
- `Ctrl` - Stop reading
- `Insert` - NVDA modifier key
- `Insert + N` - Open NVDA menu
- `Insert + Q` - Quit NVDA
- `Insert + Down Arrow` - Read all (from current position)
- `Insert + Up Arrow` - Read current line
- `Insert + T` - Read window title
- `Insert + Tab` - Read focused element

**Browser Shortcuts:**
- `H` - Next heading
- `Shift + H` - Previous heading
- `B` - Next button
- `Shift + B` - Previous button
- `F` - Next form field
- `E` - Next edit field
- `L` - Next list
- `K` - Next link
- `D` - Next landmark
- `Insert + F7` - Elements list

#### Option 2: JAWS (Trial Available)

**Installation:**
1. Download from https://support.freedomscientific.com/Downloads/JAWS
2. Run installer (40-minute trial mode available)
3. Restart computer

**Basic Commands:**
- Similar to NVDA but uses `Insert` or `CapsLock` as modifier
- `Insert + Down Arrow` - Say all
- `Insert + Up Arrow` - Current line
- Navigation keys similar to NVDA

### Mac Option

#### VoiceOver (Built-in)

**Activation:**
- `Cmd + F5` - Toggle VoiceOver on/off
- Or: System Preferences → Accessibility → VoiceOver

**Basic Commands:**
- `VO` = `Ctrl + Option` (VoiceOver modifier)
- `VO + A` - Start reading
- `VO + Right Arrow` - Next item
- `VO + Left Arrow` - Previous item
- `VO + Space` - Activate item
- `VO + Shift + H` - Next heading
- `VO + U` - Rotor (elements list)

---

## 🧪 Testing Checklist

### Pre-Testing Setup

- [ ] Install screen reader (NVDA recommended)
- [ ] Open Chrome or Firefox
- [ ] Navigate to http://localhost:5174/Resumier/
- [ ] Start screen reader
- [ ] Close eyes or look away (simulate visual impairment)

---

## 📝 Route-by-Route Testing

### 1. Homepage (`/`)

**URL:** `http://localhost:5174/Resumier/`

#### Expected Announcements

**On Page Load:**
```
"Resumier, banner"
"Main region"
"Welcome to Resumier" (or hero heading)
```

**Navigation Structure:**
```
1. "Skip to main content, link" (first Tab press, should be visible)
2. "Resumier home, link" (logo)
3. "Switch to dark theme, button" (theme toggle)
```

**Main Content:**
```
- Hero heading (h1)
- Description text
- "Get Started, button" or similar CTA
```

**Footer:**
```
"Content info, region" or "Footer"
"Built with React, TanStack, and shadcn/ui"
```

#### Test Actions

- [ ] **Tab Navigation**
  - Press Tab - Should announce skip link
  - Press Tab again - Should announce logo link
  - Press Tab again - Should announce theme toggle
  - Continue tabbing through all interactive elements

- [ ] **Heading Navigation**
  - Press `H` - Navigate through headings
  - Verify heading hierarchy (h1 → h2 → h3)
  - No skipped heading levels

- [ ] **Landmark Navigation**
  - Press `D` - Navigate between landmarks
  - Should announce: banner, main, contentinfo

- [ ] **Skip Link Test**
  - Press Tab to focus skip link
  - Press Enter
  - Verify focus moves to main content
  - Screen reader should announce main region

#### Issues to Document

- [ ] Are all interactive elements announced?
- [ ] Is the skip link working?
- [ ] Are headings in logical order?
- [ ] Is the theme toggle label clear?

---

### 2. Login Page (`/login`)

**URL:** `http://localhost:5174/Resumier/login`

#### Expected Announcements

**Page Structure:**
```
"Login, heading level 1"
"Sign in to your account to continue"
```

**Demo Credentials Banner:**
```
"Demo Credentials:"
"Email: demo@example.com"
"Password: demo123"
```

**Form Fields:**
```
"Email, edit, required"
"Password, edit, required"
"Forgot your password? button"
```

**Buttons:**
```
"Login, button"
"Login with GitHub, button"
"Sign up, button"
```

#### Test Actions

- [ ] **Form Navigation**
  - Press `F` - Navigate form fields
  - Each field should announce: label, type, required status

- [ ] **Enter Invalid Data**
  - Leave email empty
  - Click login button
  - **Expected:** "Error, alert: Please enter a resume title" or similar
  - Error should interrupt reading (assertive)

- [ ] **Enter Valid Data**
  - Enter demo@example.com
  - Enter demo123
  - Press Enter or click Login
  - **Expected:** "Logging in..." button label change
  - Loading spinner should be silent (aria-hidden)

- [ ] **GitHub Button**
  - Tab to GitHub button
  - **Expected:** "Login with GitHub, button"
  - Icon should be silent

#### Issues to Document

- [ ] Are all form fields properly labeled?
- [ ] Are errors announced immediately?
- [ ] Is loading state announced?
- [ ] Are button labels clear?

---

### 3. Dashboard (`/dashboard`)

**URL:** `http://localhost:5174/Resumier/dashboard`

#### Expected Announcements

**Page Structure:**
```
"Resumes, heading level 2"
"Manage your resume documents (X)"
"Create new resume, button" or "New Resume, button"
```

**Empty State (if no resumes):**
```
"No resumes yet, heading level 3"
"Create your first resume to get started"
"Create your first resume, button"
```

**Resume List (if resumes exist):**
```
"Table with X rows and Y columns"
"Title, column header"
"Created, column header"
"Updated, column header"
"Actions, column header"
```

**Each Resume Row:**
```
"[Resume Title], table cell"
"[Creation Date], table cell"
"[Update Date], table cell"
"Actions for [Resume Title], button"
```

#### Test Actions

- [ ] **Create Resume**
  - Tab to "New Resume" button
  - Press Enter
  - **Expected:** Dialog opens
  - **Expected:** "Create New Resume, dialog"
  - **Expected:** Focus moves to title input
  - **Expected:** "Resume Title, edit, required"

- [ ] **Resume Actions Menu**
  - Tab to actions button
  - Press Enter
  - **Expected:** "Actions, menu" opens
  - Press Arrow Down
  - **Expected:** "Edit, menu item"
  - **Expected:** "Rename, menu item"
  - **Expected:** "Duplicate, menu item"
  - **Expected:** "Delete, menu item"

- [ ] **Delete Resume**
  - Select "Delete" from menu
  - **Expected:** Alert dialog opens
  - **Expected:** "Are you absolutely sure? dialog"
  - **Expected:** Description mentions resume title
  - Press Tab to navigate buttons
  - Press Escape to cancel

#### Issues to Document

- [ ] Is table structure announced?
- [ ] Are action buttons clearly labeled?
- [ ] Do dialogs announce properly?
- [ ] Is focus managed in dialogs?

---

### 4. Resume Builder (`/resume/[id]`)

**URL:** `http://localhost:5174/Resumier/resume/[some-id]`

**Most Complex Route - Critical Testing**

#### Expected Announcements

**Tab Navigation:**
```
"Edit, tab, selected"
"Preview, tab"
"[Template Selector], combo box"
"Export, button"
```

**Tab Panel:**
```
"Edit, tab panel"
```

**Personal Info Section:**
```
"Personal Information, heading level 2" or similar
"Full Name, edit, required"
"Email, edit, required"
"Phone, edit"
"Location, edit"
"Professional Summary, edit, multi-line"
```

**Lists (Education, Experience, etc.):**
```
"Education, heading level 2"
"Add Education, button"
"[Education Entry], group or region"
"Edit, button"
"Delete, button"
"Reorder, button" or drag handle
```

**Auto-Save Status:**
```
"Saving changes..., status" (polite, won't interrupt)
"Saved 2 minutes ago, status" (polite)
"Error: [message], alert" (assertive, will interrupt)
```

#### Test Actions

- [ ] **Tab Navigation**
  - Press `Tab` to move through tabs
  - Press `Arrow Left/Right` to switch tabs
  - Verify tab panel content changes
  - Focus should move into panel content with Tab

- [ ] **Form Fields**
  - Navigate through personal info fields
  - Each field should announce label and type
  - Enter some text
  - Wait 1 second
  - **Expected:** "Saving changes..." (should be announced)
  - Wait for save
  - **Expected:** "Saved [time] ago" (should be announced)

- [ ] **Add Education Entry**
  - Tab to "Add Education" button
  - Press Enter
  - **Expected:** Dialog opens with focus on first field
  - Fill in fields
  - Tab to "Save" button
  - Press Enter
  - **Expected:** Dialog closes
  - **Expected:** "Education added successfully, status" or similar

- [ ] **Delete Entry**
  - Tab to delete button on an entry
  - **Expected:** "Delete [entry type], button" announced
  - Press Enter
  - **Expected:** Confirmation dialog
  - Confirm deletion
  - **Expected:** "Education deleted successfully, status"

- [ ] **Reorder with Keyboard**
  - Tab to education/experience entry
  - Press Space to grab (if using dnd-kit)
  - Press Arrow keys to move
  - Press Space to drop
  - Verify reorder is announced

#### Issues to Document

- [ ] Are tabs keyboard accessible?
- [ ] Is auto-save announced?
- [ ] Are form fields properly labeled?
- [ ] Is dynamic content (add/delete) announced?
- [ ] Can lists be reordered with keyboard?
- [ ] Are success/error messages announced?

---

### 5. Resume Preview (`/resume/[id]/preview`)

**URL:** `http://localhost:5174/Resumier/resume/[id]/preview`

#### Expected Announcements

**Navigation:**
```
"Back, button"
"[Template Name], combo box" or "Template selector"
"Print, button"
```

**Preview Content:**
```
"[Resume Content]" - Should read through all resume content
Including: Name, Contact Info, Experience, Education, etc.
```

#### Test Actions

- [ ] **Template Selector**
  - Tab to template selector
  - Press Enter or Space
  - Press Arrow Down/Up
  - **Expected:** Each template option announced
  - Press Enter to select
  - **Expected:** Preview updates (but may be silent)

- [ ] **Print Button**
  - Tab to print button
  - **Expected:** "Print, button" announced
  - Press Enter
  - **Expected:** Print dialog opens

- [ ] **Read Preview**
  - Use `Insert + Down Arrow` (NVDA) to read all
  - Verify all resume content is readable
  - Check heading structure
  - Verify no content is skipped

#### Issues to Document

- [ ] Is template selector accessible?
- [ ] Is preview content readable?
- [ ] Are headings in logical order?
- [ ] Is print functionality announced?

---

### 6. Settings Page (`/settings`)

**URL:** `http://localhost:5174/Resumier/settings`

#### Expected Announcements

**Form Fields:**
```
"[Setting Name], edit/checkbox/combo box"
"[Setting Description]" (if present)
```

**Theme Toggle:**
```
"Switch to [theme], button"
```

**Save Button:**
```
"Save, button" or "Save Changes, button"
```

#### Test Actions

- [ ] **Navigate Settings**
  - Tab through all settings
  - Each should announce clearly
  - Change a setting
  - Tab to Save button
  - Press Enter
  - **Expected:** "Saving..., button" then success message

#### Issues to Document

- [ ] Are all settings accessible?
- [ ] Are save states announced?
- [ ] Is feedback provided?

---

## 🎯 Common Issues to Check

### ARIA Attributes

- [ ] **role="alert"** - Errors announced immediately
- [ ] **role="status"** - Status updates announced politely
- [ ] **aria-live="assertive"** - Interrupts reading
- [ ] **aria-live="polite"** - Waits for pause
- [ ] **aria-label** - Button labels clear and concise
- [ ] **aria-hidden="true"** - Decorative icons not announced
- [ ] **aria-describedby** - Descriptions associated correctly
- [ ] **aria-invalid** - Invalid fields marked

### Focus Management

- [ ] Focus visible on all interactive elements
- [ ] Focus trapped in modals (can't Tab out)
- [ ] Focus restored when modal closes
- [ ] Skip link moves focus to main content
- [ ] No unexpected focus jumps

### Content Structure

- [ ] Headings in logical order (h1 → h2 → h3)
- [ ] No skipped heading levels
- [ ] Landmarks properly labeled
- [ ] Lists properly marked up
- [ ] Tables have headers

### Form Accessibility

- [ ] All inputs have labels
- [ ] Required fields announced
- [ ] Error messages associated with inputs
- [ ] Success messages announced
- [ ] Loading states announced

---

## 📊 Testing Results Template

Use this template to document findings:

### Route: [Route Name]

**Tested with:** NVDA / JAWS / VoiceOver  
**Browser:** Chrome / Firefox / Safari  
**Date:** [Date]

#### ✅ Working Well
- List what works correctly
- Note clear announcements
- Good keyboard navigation

#### ⚠️ Issues Found
- Issue description
- Expected behavior
- Actual behavior
- Severity: Critical / High / Medium / Low

#### 📝 Recommendations
- Suggested fixes
- Improvements to consider

---

## 🚨 Critical Issues (Must Fix)

These issues should be addressed immediately:

### Missing Announcements
- [ ] Errors not announced (`role="alert"` missing)
- [ ] Form submission not announced
- [ ] Page changes not announced
- [ ] Modal opening not announced

### Unclear Labels
- [ ] Buttons without labels
- [ ] Form fields without labels
- [ ] Ambiguous link text ("click here")
- [ ] Icon buttons without `aria-label`

### Focus Problems
- [ ] Focus trap broken (can Tab out of modal)
- [ ] Focus not restored after modal closes
- [ ] Focus moves unexpectedly
- [ ] Focus not visible

### Structure Issues
- [ ] Missing headings
- [ ] Skipped heading levels
- [ ] Missing landmarks
- [ ] Poor reading order

---

## 💡 Testing Tips

### Best Practices

1. **Close Your Eyes**
   - Simulate visual impairment
   - Rely only on audio feedback
   - Note when you get confused

2. **Test Real User Flows**
   - Complete entire task (e.g., create resume)
   - Don't just Tab through page
   - Try to accomplish actual goals

3. **Listen for Redundancy**
   - Are things announced twice?
   - Are decorative elements announced?
   - Is there too much verbosity?

4. **Check Context**
   - Can you understand without seeing?
   - Do button labels make sense?
   - Is navigation clear?

5. **Test Error States**
   - Trigger validation errors
   - Verify errors are announced
   - Check error recovery

### Common Pitfalls

❌ **Decorative icons not hidden**
```tsx
<Icon className="mr-2" /> {/* Will be announced */}
```

✅ **Proper implementation**
```tsx
<Icon className="mr-2" aria-hidden="true" />
```

❌ **Missing button labels**
```tsx
<Button><X /></Button> {/* Just announces "button" */}
```

✅ **Proper implementation**
```tsx
<Button aria-label="Close"><X aria-hidden="true" /></Button>
```

❌ **Errors not announced**
```tsx
{error && <div>{error}</div>} {/* Silent error */}
```

✅ **Proper implementation**
```tsx
{error && <div role="alert" aria-live="assertive">{error}</div>}
```

---

## 📈 Expected Results

Based on our ARIA implementation (Phase 19.3), we expect:

### ✅ Should Work Well

1. **Navigation**
   - Skip link functional
   - Landmarks properly labeled
   - Heading structure logical

2. **Buttons**
   - All buttons labeled
   - Icons hidden from screen readers
   - Loading states announced

3. **Errors**
   - Immediate announcement
   - Clear, actionable messages
   - Proper role="alert"

4. **Forms**
   - All inputs labeled
   - Required fields announced
   - Validation feedback

5. **Dialogs**
   - Announced when opened
   - Focus trapped
   - Title and description read

6. **Status Updates**
   - Auto-save announced politely
   - Success messages announced
   - Progress indicators accessible

### ⚠️ May Need Improvement

1. **Complex Interactions**
   - Drag-and-drop alternative
   - Multi-step forms
   - Dynamic content updates

2. **Error Details**
   - Error associations (aria-describedby)
   - Field-level errors
   - Error recovery guidance

3. **Rich Content**
   - Resume preview formatting
   - PDF viewer (if applicable)
   - Complex tables

---

## 🎯 Success Criteria

- [ ] All routes navigable with screen reader
- [ ] All interactive elements have clear labels
- [ ] All form fields properly announced
- [ ] Errors announced immediately (role="alert")
- [ ] Success messages announced (role="status")
- [ ] Loading states announced
- [ ] Dialogs properly announced
- [ ] Focus management works correctly
- [ ] Heading structure logical
- [ ] No critical accessibility violations
- [ ] User can complete core tasks without vision

---

## 📝 Next Steps After Testing

1. **Document Findings**
   - Create detailed test results
   - List all issues found
   - Prioritize by severity

2. **Fix Critical Issues**
   - Address blocking problems
   - Re-test after fixes
   - Verify improvements

3. **Move to Phase 19.9**
   - Automated testing with axe-core
   - Continuous accessibility monitoring

---

## 📚 Resources

### Screen Reader Guides
- [NVDA User Guide](https://www.nvaccess.org/files/nvda/documentation/userGuide.html)
- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)
- [JAWS Documentation](https://support.freedomscientific.com/Downloads/JAWS)
- [VoiceOver User Guide](https://support.apple.com/guide/voiceover/welcome/mac)

### Testing Resources
- [Screen Reader Keyboard Shortcuts](https://dequeuniversity.com/screenreaders/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)

---

**Status:** Ready for manual testing with screen reader  
**Estimated Time:** 1-2 hours for comprehensive testing  
**Tester:** User-led manual testing session required

---

## 🚀 Quick Start

1. Install NVDA: https://www.nvaccess.org/download/
2. Start NVDA (`Ctrl + Alt + N` after install)
3. Open http://localhost:5174/Resumier/ in Chrome
4. Press `Insert + Down Arrow` to start reading
5. Press `Tab` to navigate interactive elements
6. Follow testing checklist above
7. Document any issues found

**Good luck with testing!** 🎯
