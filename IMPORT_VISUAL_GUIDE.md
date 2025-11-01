# Import Feature - Visual Guide

## 🎨 UI Overview

### 1. Import Card in Resume Builder

Located at the top of the resume builder with an eye-catching gradient:

```
┌─────────────────────────────────────────────────────────┐
│  📤 Quick Start                    [Import Resume]       │
│  Import your resume from LinkedIn, JSON, or other       │
│  sources to get started quickly                          │
└─────────────────────────────────────────────────────────┘
```

### 2. Import Dialog - Source Selection

When clicking "Import Resume", users see:

```
┌───────────────────────────────────────────────┐
│  Import Resume                        [X]     │
│  Choose a source to import your resume data   │
├───────────────────────────────────────────────┤
│                                               │
│  ┌────────────┐  ┌────────────┐             │
│  │ 📎 LinkedIn│  │ 📄 JSON    │             │
│  │            │  │ File       │             │
│  │ Import from│  │ Import from│             │
│  │ LinkedIn   │  │ JSON       │             │
│  └────────────┘  └────────────┘             │
│                                               │
│  ┌────────────┐  ┌────────────┐             │
│  │ 📋 PDF     │  │ 💼 Indeed  │             │
│  │ Resume     │  │            │             │
│  │ (Soon)     │  │ Import     │             │
│  │            │  │ (Soon)     │             │
│  └────────────┘  └────────────┘             │
│                                               │
│  ┌────────────┐                              │
│  │ 🐙 GitHub  │                              │
│  │            │                              │
│  │ Import     │                              │
│  │ (Soon)     │                              │
│  └────────────┘                              │
│                                               │
├───────────────────────────────────────────────┤
│                             [Cancel]          │
└───────────────────────────────────────────────┘
```

### 3. LinkedIn Import

After selecting LinkedIn:

```
┌───────────────────────────────────────────────┐
│  Import from LinkedIn                 [X]     │
│  Import your profile from LinkedIn            │
├───────────────────────────────────────────────┤
│                                               │
│  LinkedIn Profile URL                         │
│  ┌───────────────────────────────────────┐   │
│  │ https://www.linkedin.com/in/username  │   │
│  └───────────────────────────────────────┘   │
│  Make sure your LinkedIn profile is public   │
│  or accessible                                │
│                                               │
│  ┌─────────────────────────────────────┐     │
│  │ What will be imported?              │     │
│  │ • Personal information              │     │
│  │ • Work experience                   │     │
│  │ • Education history                 │     │
│  │ • Skills and certifications         │     │
│  │ • Links and contact information     │     │
│  │                                     │     │
│  │ Note: Imported data will be merged │     │
│  │ with your existing resume.          │     │
│  └─────────────────────────────────────┘     │
│                                               │
├───────────────────────────────────────────────┤
│                    [Back]    [📤 Import]      │
└───────────────────────────────────────────────┘
```

### 4. JSON Import

After selecting JSON File:

```
┌───────────────────────────────────────────────┐
│  Import from JSON File                [X]     │
│  Import from a previously exported JSON file  │
├───────────────────────────────────────────────┤
│                                               │
│  Select JSON File                             │
│  ┌────────────────────────────────┐  [X]     │
│  │ Choose file...                 │          │
│  └────────────────────────────────┘          │
│  Import a resume previously exported from    │
│  Resumier                                     │
│                                               │
│  ┌─────────────────────────────────────┐     │
│  │ What will be imported?              │     │
│  │ • Personal information              │     │
│  │ • Work experience                   │     │
│  │ • Education history                 │     │
│  │ • Skills and certifications         │     │
│  │ • Links and contact information     │     │
│  │                                     │     │
│  │ Note: Imported data will be merged │     │
│  │ with your existing resume.          │     │
│  └─────────────────────────────────────┘     │
│                                               │
├───────────────────────────────────────────────┤
│                    [Back]    [📤 Import]      │
└───────────────────────────────────────────────┘
```

### 5. During Import

While importing:

```
┌───────────────────────────────────────────────┐
│  Import from LinkedIn                 [X]     │
│  Import your profile from LinkedIn            │
├───────────────────────────────────────────────┤
│                                               │
│  LinkedIn Profile URL                         │
│  ┌───────────────────────────────────────┐   │
│  │ https://www.linkedin.com/in/username  │   │
│  └───────────────────────────────────────┘   │
│                                               │
│  ┌─────────────────────────────────────┐     │
│  │              🔄                      │     │
│  │         Importing data...            │     │
│  └─────────────────────────────────────┘     │
│                                               │
├───────────────────────────────────────────────┤
│           [Back]    [⏳ Importing...]         │
└───────────────────────────────────────────────┘
```

### 6. Success Toast

After successful import:

```
┌─────────────────────────────────────┐
│  ✓ Import Successful                │
│  Successfully imported data from    │
│  LinkedIn                           │
└─────────────────────────────────────┘
```

### 7. Error Toast

If import fails:

```
┌─────────────────────────────────────┐
│  ✗ Import Failed                    │
│  Invalid LinkedIn URL. Please check │
│  and try again.                     │
└─────────────────────────────────────┘
```

## 🎨 Design Features

### Colors
- **Primary gradient**: Soft blue-purple gradient for import card
- **Accent**: Primary color for icons and buttons
- **Coming Soon badge**: Muted background with subtle text

### Icons
- 📎 LinkedIn - Linkedin icon from lucide-react
- 📄 JSON - FileJson2 icon
- 📋 PDF - FileText icon
- 💼 Indeed - Briefcase icon
- 🐙 GitHub - Github icon
- 📤 Upload icon for buttons

### Spacing
- Generous padding for touch targets
- Clear visual hierarchy
- Proper spacing between elements

### States
- **Default**: Soft border, subtle shadow
- **Hover**: Primary border, stronger shadow
- **Focus**: Ring indicator for accessibility
- **Disabled**: Reduced opacity, no interaction
- **Coming Soon**: Muted with badge

### Responsive Design
- 2-column grid on larger screens
- Single column on mobile
- Touch-friendly targets (min 44x44px)

## 📱 Mobile View

```
┌────────────────────┐
│ Import Resume  [X] │
│ Choose a source    │
├────────────────────┤
│                    │
│ ┌────────────────┐ │
│ │  📎 LinkedIn  │ │
│ │  Import from  │ │
│ │  LinkedIn     │ │
│ └────────────────┘ │
│                    │
│ ┌────────────────┐ │
│ │  📄 JSON File │ │
│ │  Import from  │ │
│ │  JSON         │ │
│ └────────────────┘ │
│                    │
│ ┌────────────────┐ │
│ │  📋 PDF       │ │
│ │  Resume       │ │
│ │  (Soon)       │ │
│ └────────────────┘ │
│                    │
├────────────────────┤
│       [Cancel]     │
└────────────────────┘
```

## ♿ Accessibility

### Keyboard Navigation
- `Tab` - Navigate between sources
- `Enter` / `Space` - Select source
- `Esc` - Close dialog
- `Tab` in form - Navigate inputs

### Screen Reader Announcements
- "Import Resume dialog"
- "LinkedIn source, requires URL input"
- "JSON File source, requires file upload"
- "Coming soon badge" for unavailable sources
- Success/error messages announced

### ARIA Labels
- Dialog has proper role and labels
- Buttons have descriptive labels
- Form inputs have associated labels
- Error messages linked to inputs

## 🎭 Interactions

### Source Selection
1. Hover shows subtle elevation
2. Click/tap selects source
3. Smooth transition to input view
4. Focus moves to first input

### Back Button
1. Returns to source selection
2. Clears any input data
3. Resets validation errors
4. Smooth animation

### Import Button
1. Validates input first
2. Shows loading spinner
3. Disables during import
4. Shows success/error feedback

### File Upload
1. Click input to browse
2. Drag & drop support (future)
3. Shows selected filename
4. Clear button to remove

## 🔄 State Management

### Dialog State
- `open` - Dialog visibility
- `selectedSource` - Current source
- `urlInput` - URL field value
- `fileInput` - Selected file
- `isImporting` - Loading state

### Reset on Close
All state resets when dialog closes:
- Selected source cleared
- Input fields cleared
- Validation errors cleared
- Ready for next use

## 📊 Data Flow Visualization

```
User Action
    ↓
[Select Source] → LinkedIn / JSON / PDF / etc.
    ↓
[Enter Input] → URL or File
    ↓
[Click Import]
    ↓
[Validate Input] → Valid? → Yes → [Call Service]
    ↓                          ↓
    No                    [Process Data]
    ↓                          ↓
[Show Error]              [Merge with Existing]
                               ↓
                          [Update Resume]
                               ↓
                          [Show Success]
                               ↓
                          [Close Dialog]
```

## 🎯 User Experience Goals

1. **Quick Start** - Minimize friction for new users
2. **Clear Options** - Easy to understand sources
3. **Helpful Guidance** - Explain what will happen
4. **Error Recovery** - Clear error messages
5. **Feedback** - Loading and success states
6. **Accessibility** - Works for all users
7. **Mobile-Friendly** - Touch optimized

---

This visual guide helps developers and designers understand the complete user journey through the import feature! 🎨
