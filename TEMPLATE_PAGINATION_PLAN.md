# Template Pagination Implementation Plan

## Overview
This document outlines the plan to add pagination support to all resume templates, allowing users to see where content breaks across pages when scrolling through longer resumes.

## Current Status
- ✅ **ResumePageWrapper component** - Created and ready for use
- ✅ **InteractiveModernTemplate** - Updated to use pagination wrapper
- ⏳ **All other templates** - Pending implementation

## Implementation Strategy

### Phase 1: Core Infrastructure (COMPLETED)
1. ✅ Created `ResumePageWrapper` component (`src/components/features/resume/preview/resume-page-wrapper.tsx`)
   - Handles page break calculations based on A4 dimensions (21cm x 29.7cm)
   - Shows visual page break indicators (dashed lines)
   - Displays page numbers
   - Automatically recalculates when content changes

### Phase 2: Interactive Templates (IN PROGRESS)
1. ✅ Updated `InteractiveModernTemplate` to use `ResumePageWrapper`
2. ⏳ Create interactive versions of other popular templates (if needed)

### Phase 3: Standard Templates (PENDING)
Update all standard (non-interactive) templates to use pagination wrapper.

## Template List

### Interactive Templates
- [x] `InteractiveModernTemplate` - ✅ COMPLETED

### Standard Templates (28 templates)
1. [ ] `ModernTemplate`
2. [ ] `StartupTemplate`
3. [ ] `ThreeColumnTemplate`
4. [ ] `TwoColumnTemplate`
5. [ ] `TechModernTemplate`
6. [ ] `TimelineTemplate`
7. [ ] `ProfessionalServicesTemplate`
8. [ ] `PortfolioTemplate`
9. [ ] `GeometricTemplate`
10. [ ] `InternationalTemplate`
11. [ ] `SplitScreenTemplate`
12. [ ] `ExecutiveTemplate` (from batch-templates-1.tsx)
13. [ ] `AcademicTemplate` (from batch-templates-1.tsx)
14. [ ] `CorporateTemplate` (from batch-templates-1.tsx)
15. [ ] `TechModernTemplate` (from batch-templates-1.tsx)
16. [ ] `CreativeProfessionalTemplate` (from batch-templates-1.tsx)
17. [ ] `GovernmentTemplate`
18. [ ] `MagazineStyleTemplate`
19. [ ] `MinimalTemplate`
20. [ ] `CompactTemplate`
21. [ ] `InfographicLiteTemplate`
22. [ ] `BorderAccentTemplate`
23. [ ] `ContemporaryTemplate`
24. [ ] `CreativeProTemplate`
25. [ ] `ElegantTemplate`
26. [ ] `CorporateTemplate` (standalone)
27. [ ] `ClassicTemplate`
28. [ ] `ColorBlockTemplate`
29. [ ] `BoldHeadersTemplate`
30. [ ] `AcademicTemplate` (standalone)

## Implementation Steps for Each Template

### Step 1: Import the ResumePageWrapper
```typescript
import { ResumePageWrapper } from "../resume-page-wrapper";
```

### Step 2: Wrap the Template Content
Find the outermost container div (usually has `max-w-[21cm]` or similar) and wrap it:

**Before:**
```tsx
return (
  <div className="mx-auto max-w-[21cm] bg-white shadow-lg">
    {/* template content */}
  </div>
);
```

**After:**
```tsx
return (
  <ResumePageWrapper>
    <div className="mx-auto max-w-[21cm] bg-white shadow-lg">
      {/* template content */}
    </div>
  </ResumePageWrapper>
);
```

### Step 3: Remove Duplicate Styling (if needed)
The `ResumePageWrapper` doesn't add `bg-white shadow-lg`, so templates should keep their own styling. However, ensure the wrapper doesn't conflict with template-specific styling.

### Step 4: Test
- Verify page breaks appear correctly for long resumes
- Check that page numbers display correctly
- Ensure scrolling works smoothly
- Test with different content lengths (1 page, 2 pages, 3+ pages)

## Special Considerations

### Templates with Custom Layouts
Some templates may have unique layouts that require special handling:
- **Multi-column layouts**: Ensure page breaks work correctly across columns
- **Fixed-height sections**: May need adjustments to prevent awkward breaks
- **Background colors/images**: Ensure page break indicators are visible

### Interactive vs Non-Interactive
- **Interactive templates**: Already wrapped in `InteractiveResumePreview`, which handles the wrapper
- **Non-interactive templates**: Need direct integration in `ResumePreview` component or individual templates

## Integration Points

### Option A: Wrap in ResumePreview Component (RECOMMENDED)
Update `ResumePreview` component to wrap all templates:

```typescript
// src/components/features/resume/preview/resume-preview.tsx
import { ResumePageWrapper } from "./resume-page-wrapper";

export function ResumePreview({ resume, template }: ResumePreviewProps) {
  // ... existing code ...
  
  return (
    <ResumePageWrapper>
      <div className="mx-auto w-full max-w-[21cm] bg-white shadow-xl">
        <div className="resume-light-mode light print:bg-white print:p-0">
          <Suspense fallback={<TemplateLoadingSkeleton />}>
            <TemplateComponent resume={resume} config={config} />
          </Suspense>
        </div>
      </div>
    </ResumePageWrapper>
  );
}
```

**Pros:**
- Single point of change
- Consistent behavior across all templates
- Easier to maintain

**Cons:**
- May conflict with templates that have custom outer containers
- Less flexibility for template-specific needs

### Option B: Update Each Template Individually
Update each template file to wrap its content.

**Pros:**
- More control per template
- Can handle template-specific edge cases

**Cons:**
- More work (30+ files to update)
- Higher maintenance burden
- Risk of inconsistency

## Recommended Approach

**Use Option A (ResumePreview wrapper)** for the following reasons:
1. Centralized implementation
2. Consistent user experience
3. Easier to maintain and update
4. Less code duplication

If specific templates need custom pagination behavior, they can opt out or use a different wrapper.

## Testing Checklist

For each template, verify:
- [ ] Page breaks appear at correct positions (every ~1123px)
- [ ] Page numbers display correctly
- [ ] Scrolling is smooth
- [ ] Page break indicators are visible (dashed lines)
- [ ] Works with 1-page resumes (no breaks shown)
- [ ] Works with 2+ page resumes (breaks shown)
- [ ] Content doesn't overlap with page break indicators
- [ ] Print/PDF export still works correctly

## Rollout Plan

### Week 1: Core Implementation
- ✅ Create ResumePageWrapper component
- ✅ Update InteractiveModernTemplate
- ⏳ Update ResumePreview to wrap all templates (Option A)

### Week 2: Testing & Refinement
- Test with various resume lengths
- Test with different templates
- Fix any template-specific issues
- Optimize performance if needed

### Week 3: Edge Cases & Polish
- Handle special template layouts
- Improve visual indicators if needed
- Add any missing features
- Documentation updates

## Future Enhancements

1. **Page Break Controls**: Allow users to manually adjust page breaks
2. **Page Break Prevention**: Prevent breaks within specific sections (e.g., keep experience entries together)
3. **Page Break Hints**: Show warnings when content is close to breaking awkwardly
4. **Print Preview Mode**: Toggle between scroll view and page-by-page view
5. **Page Break Customization**: Allow different page sizes (Letter, A4, Legal, etc.)

## Notes

- The pagination wrapper uses A4 dimensions (21cm x 29.7cm) by default
- Page breaks are calculated dynamically based on content height
- Visual indicators are non-intrusive and don't affect printing/PDF export
- The wrapper uses ResizeObserver to recalculate breaks when content changes

## Questions & Decisions Needed

1. **Should we use Option A (ResumePreview wrapper) or Option B (individual template updates)?**
   - Recommendation: Option A

2. **Should page breaks be visible in print/PDF export?**
   - Recommendation: No, only in preview mode

3. **Should we allow users to toggle pagination on/off?**
   - Recommendation: Yes, as a future enhancement

4. **How should we handle templates with very different layouts?**
   - Recommendation: Test each template and adjust wrapper if needed


