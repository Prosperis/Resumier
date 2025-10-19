# Phase 12: Resume Preview & Export

**Goal**: Create resume preview and PDF export functionality  
**Status**: In Progress  
**Started**: October 19, 2025

---

## Overview

Complete the resume editing workflow by adding professional preview templates and PDF export functionality. Users can now edit, preview, and export their resumes.

## Objectives

1. ✅ Create professional resume preview component
2. ✅ Implement multiple template styles
3. ✅ Add PDF generation and export
4. ✅ Create print-friendly styling
5. ✅ Add preview/edit toggle in resume editor

---

## Technical Stack

### Libraries to Use

1. **@react-pdf/renderer** - PDF generation from React components
   - Most popular React PDF library (23k+ stars)
   - Declarative API similar to React
   - Good TypeScript support

2. **React Components** - Preview templates
   - Reusable template components
   - Multiple style variants
   - Responsive design

### Alternative Considered

- **html2canvas + jsPDF** - Convert HTML to PDF
  - ❌ Lower quality output
  - ❌ Inconsistent rendering
  - ✅ Easier to implement
  
- **Puppeteer/Playwright** - Server-side rendering
  - ❌ Requires backend
  - ❌ Overkill for this use case
  - ✅ Perfect pixel rendering

**Decision**: Use @react-pdf/renderer for quality and client-side generation

---

## Architecture

### Component Structure

```
src/components/features/resume/
├── preview/
│   ├── resume-preview.tsx          # Main preview component
│   ├── template-selector.tsx       # Template switcher
│   ├── templates/
│   │   ├── modern-template.tsx     # Modern design
│   │   ├── classic-template.tsx    # Traditional design
│   │   └── minimal-template.tsx    # Clean minimal design
│   └── pdf/
│       ├── pdf-document.tsx        # PDF wrapper component
│       ├── pdf-modern.tsx          # PDF version of modern
│       ├── pdf-classic.tsx         # PDF version of classic
│       └── pdf-minimal.tsx         # PDF version of minimal
├── export/
│   ├── export-menu.tsx             # Export options menu
│   └── export-utils.ts             # Export helper functions
└── resume-editor.tsx               # New: Combines builder + preview
```

### Data Flow

```
Resume Data (from API)
    ↓
ResumeEditor (parent component)
    ↓
├─→ ResumeBuilder (edit mode)
│       ↓
│   Forms & CRUD operations
│
└─→ ResumePreview (preview mode)
        ↓
    Template Selector
        ↓
    Selected Template Component
        ↓
    PDF Export Button
        ↓
    PDF Document (for download)
```

---

## Features to Implement

### 1. Resume Preview Component

**Features**:
- Display resume in professional format
- Real-time updates from form data
- Responsive design
- Print-friendly styling

**Props**:
```tsx
interface ResumePreviewProps {
  resume: Resume
  template: 'modern' | 'classic' | 'minimal'
  onTemplateChange: (template: string) => void
}
```

### 2. Template Styles

#### Modern Template
- Clean, modern design
- Two-column layout
- Bold typography
- Accent colors
- Icon integration

#### Classic Template
- Traditional format
- Single column
- Serif fonts
- Conservative styling
- ATS-friendly

#### Minimal Template
- Ultra-clean design
- Lots of white space
- Sans-serif fonts
- Monochrome
- Simple lines

### 3. PDF Export

**Features**:
- Generate PDF from resume data
- Download with resume title as filename
- High-quality output (300 DPI)
- Proper page breaks
- Embedded fonts

**Implementation**:
```tsx
const generatePDF = async (resume: Resume, template: string) => {
  const PDFDocument = getPDFTemplate(template)
  const blob = await pdf(<PDFDocument resume={resume} />).toBlob()
  saveAs(blob, `${resume.title}.pdf`)
}
```

### 4. Resume Editor Component

**New parent component** that combines:
- ResumeBuilder (edit mode)
- ResumePreview (preview mode)
- Mode toggle (Edit/Preview)
- Template selector (in preview mode)
- Export menu (in preview mode)

**Layout**:
```
┌─────────────────────────────────────────┐
│  [Edit] [Preview]     [Template ▼]  [⬇] │
├─────────────────────────────────────────┤
│                                         │
│  Edit Mode:                             │
│  ┌─────────────────────────────────┐   │
│  │ Personal Info Form              │   │
│  │ Experience List                 │   │
│  │ Education List                  │   │
│  │ Skills Form                     │   │
│  │ ...                             │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Preview Mode:                          │
│  ┌─────────────────────────────────┐   │
│  │ ┌───────────────────────────┐   │   │
│  │ │  JOHN DOE                 │   │   │
│  │ │  john@example.com         │   │   │
│  │ │                           │   │   │
│  │ │  EXPERIENCE               │   │   │
│  │ │  • Senior Developer       │   │   │
│  │ │  ...                      │   │   │
│  │ └───────────────────────────┘   │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### 5. Export Menu

**Options**:
- Download PDF
- Print (opens print dialog)
- Copy shareable link (future)
- Export JSON (future)

---

## Implementation Plan

### Phase 12.1: Setup & Preview Components (2-3 hours)

1. **Install Dependencies**
   ```bash
   bun add @react-pdf/renderer
   bun add -d @types/react-pdf
   bun add file-saver
   bun add -d @types/file-saver
   ```

2. **Create Directory Structure**
   - `src/components/features/resume/preview/`
   - `src/components/features/resume/preview/templates/`
   - `src/components/features/resume/preview/pdf/`
   - `src/components/features/resume/export/`

3. **Build Modern Template** (HTML version)
   - Create `modern-template.tsx`
   - Two-column layout
   - Style with Tailwind
   - Use resume data

4. **Build Classic Template** (HTML version)
   - Create `classic-template.tsx`
   - Single column layout
   - Traditional styling

5. **Build Minimal Template** (HTML version)
   - Create `minimal-template.tsx`
   - Clean, minimal design

6. **Create ResumePreview Component**
   - Template selector
   - Render selected template
   - Responsive container
   - Print styles

### Phase 12.2: PDF Generation (2-3 hours)

1. **Create PDF Templates**
   - `pdf-modern.tsx` - Convert modern to @react-pdf
   - `pdf-classic.tsx` - Convert classic to @react-pdf
   - `pdf-minimal.tsx` - Convert minimal to @react-pdf

2. **Create PDF Document Wrapper**
   - `pdf-document.tsx`
   - Page settings
   - Font registration
   - Metadata

3. **Create Export Utilities**
   - `export-utils.ts`
   - `generatePDF()` function
   - `downloadPDF()` function
   - `printResume()` function

4. **Create Export Menu**
   - `export-menu.tsx`
   - Dropdown with options
   - Loading states
   - Error handling

### Phase 12.3: Editor Integration (1-2 hours)

1. **Create ResumeEditor Component**
   - Wrap ResumeBuilder
   - Add mode state (edit/preview)
   - Add template state
   - Mode toggle buttons

2. **Update Routes**
   - Replace ResumeBuilder with ResumeEditor in routes
   - `/resume/$id` - uses ResumeEditor
   - `/resume/new` - uses ResumeEditor

3. **Add Responsive Layout**
   - Mobile: Stack edit/preview vertically
   - Desktop: Side-by-side option (future)
   - Tablet: Full-width with toggle

### Phase 12.4: Polish & Testing (1 hour)

1. **Add Loading States**
   - PDF generation spinner
   - Template switching animation

2. **Add Error Handling**
   - Failed PDF generation
   - Missing data warnings
   - Browser compatibility

3. **Test All Templates**
   - Verify data mapping
   - Test empty states
   - Test long content
   - Test special characters

4. **Cross-browser Testing**
   - Chrome
   - Firefox
   - Safari
   - Edge

5. **Create Documentation**
   - Update REBUILD_PLAN.md
   - Create PHASE_12_SUMMARY.md

---

## Template Specifications

### Modern Template

**Layout**:
- Two columns: 35% sidebar, 65% main
- Sidebar: Photo, contact, skills, links
- Main: Summary, experience, education, certifications

**Typography**:
- Headers: Inter Bold, 18-24px
- Body: Inter Regular, 11-12px
- Accent: Primary color

**Colors**:
- Primary: `hsl(var(--primary))`
- Text: `hsl(var(--foreground))`
- Muted: `hsl(var(--muted-foreground))`

### Classic Template

**Layout**:
- Single column
- Center-aligned header
- Left-aligned sections

**Typography**:
- Headers: Georgia/Serif, 16-20px
- Body: Times New Roman, 11-12px
- All black text

**Colors**:
- Monochrome (black/gray)
- Conservative

### Minimal Template

**Layout**:
- Single column
- Left-aligned header
- Minimal dividers

**Typography**:
- Headers: Helvetica/Arial, 14-18px
- Body: Arial, 10-11px
- Subtle hierarchy

**Colors**:
- Black and light gray only
- Lots of white space

---

## PDF Considerations

### Page Breaks

```tsx
<View break={experience.length > 3}>
  {/* Content that might need page break */}
</View>
```

### Font Registration

```tsx
Font.register({
  family: 'Inter',
  fonts: [
    { src: '/fonts/Inter-Regular.ttf' },
    { src: '/fonts/Inter-Bold.ttf', fontWeight: 'bold' },
  ]
})
```

### Styling Differences

@react-pdf uses a subset of CSS:
- ✅ Flexbox
- ✅ Padding, margin
- ✅ Colors, fonts
- ❌ Grid
- ❌ CSS transforms
- ❌ Pseudo-elements

### Performance

- Generate PDF on-demand (not auto)
- Show loading spinner
- Use Web Worker if needed (future)

---

## User Experience

### Edit Mode

1. User fills out forms (from Phase 11)
2. Data auto-saves to API
3. Click "Preview" to see result

### Preview Mode

1. See formatted resume
2. Select template style
3. Click "Download PDF" to export
4. Click "Edit" to go back

### Export Flow

1. User clicks "Download PDF"
2. Loading spinner appears
3. PDF generates (1-3 seconds)
4. Browser downloads file
5. Success toast appears

---

## Validation & Edge Cases

### Empty Data

- Show placeholder text
- Gracefully handle missing sections
- Hide empty sections

### Long Content

- Proper text wrapping
- Page breaks where needed
- Truncation warnings (future)

### Special Characters

- Proper encoding
- Emoji support (limited in PDF)
- Non-Latin characters

### Browser Compatibility

- Modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- Fallback for older browsers
- Mobile support

---

## Success Criteria

1. ✅ Three professional templates available
2. ✅ Preview updates in real-time
3. ✅ PDF export works in all major browsers
4. ✅ Downloaded PDFs are high quality
5. ✅ No data loss in PDF conversion
6. ✅ Templates are ATS-friendly (especially classic)
7. ✅ Print functionality works
8. ✅ Responsive on all devices
9. ✅ Error handling for edge cases
10. ✅ Documentation complete

---

## Future Enhancements

### Phase 12+ Features

1. **More Templates**
   - Creative template
   - Developer template
   - Designer template
   - Executive template

2. **Customization**
   - Color picker
   - Font selector
   - Spacing adjustments
   - Section reordering

3. **Advanced Export**
   - DOCX export
   - HTML export
   - Markdown export
   - LaTeX export

4. **Collaboration**
   - Shareable preview link
   - Public/private toggle
   - Comments/feedback

5. **AI Features**
   - Content suggestions
   - Grammar checking
   - ATS optimization score
   - Template recommendations

---

## Dependencies

### New Packages

```json
{
  "@react-pdf/renderer": "^3.x",
  "file-saver": "^2.x"
}
```

### Dev Dependencies

```json
{
  "@types/react-pdf": "^x.x.x",
  "@types/file-saver": "^2.x"
}
```

---

## Files to Create

### Preview Components (6 files)
1. `src/components/features/resume/preview/resume-preview.tsx`
2. `src/components/features/resume/preview/template-selector.tsx`
3. `src/components/features/resume/preview/templates/modern-template.tsx`
4. `src/components/features/resume/preview/templates/classic-template.tsx`
5. `src/components/features/resume/preview/templates/minimal-template.tsx`
6. `src/components/features/resume/preview/templates/index.ts`

### PDF Components (4 files)
7. `src/components/features/resume/preview/pdf/pdf-document.tsx`
8. `src/components/features/resume/preview/pdf/pdf-modern.tsx`
9. `src/components/features/resume/preview/pdf/pdf-classic.tsx`
10. `src/components/features/resume/preview/pdf/pdf-minimal.tsx`

### Export Components (2 files)
11. `src/components/features/resume/export/export-menu.tsx`
12. `src/components/features/resume/export/export-utils.ts`

### Editor Component (1 file)
13. `src/components/features/resume/resume-editor.tsx`

### Types (1 file)
14. `src/lib/types/templates.ts`

### Documentation (1 file)
15. `PHASE_12_SUMMARY.md`

**Total**: 15 new files + route updates

---

## Estimated Timeline

- **Phase 12.1** (Setup & Preview): 2-3 hours
- **Phase 12.2** (PDF Generation): 2-3 hours  
- **Phase 12.3** (Editor Integration): 1-2 hours
- **Phase 12.4** (Polish & Testing): 1 hour

**Total**: 6-9 hours of development

---

## Notes

- Focus on quality over quantity (3 great templates > 6 mediocre)
- Ensure ATS compatibility (especially for classic template)
- Keep PDF file size reasonable (<500KB for typical resume)
- Test with various content lengths
- Consider accessibility in templates

---

**Status**: Ready to implement  
**Next Step**: Install dependencies and create directory structure
