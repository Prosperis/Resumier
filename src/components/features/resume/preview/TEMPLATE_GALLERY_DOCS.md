# Template Gallery - Visual Portal for Template Selection

## Overview

A comprehensive, full-screen template selection portal that provides users with a beautiful interface to browse, filter, and preview resume templates.

## Features

### 🎨 Visual Design
- **Full-screen dialog** - Immersive template browsing experience
- **Grid and List views** - Switch between visual grid cards or detailed list items
- **Mini previews** - Each template shows a simulated resume preview with its color scheme
- **Hover effects** - Interactive hover states with subtle overlays
- **Selected indicators** - Clear checkmark badges on selected templates

### 🔍 Filtering & Search
- **Category filters** - Filter by Professional, Modern, Creative, Industry-specific, Experience-level, Specialized
- **Search bar** - Real-time search across template names, descriptions, tags, and industries
- **Results count** - Shows how many templates match current filters
- **Clear filters** - Quick reset button when no results found

### 🏷️ Template Metadata Display
- **Badges** - Popular, New, ATS Score indicators
- **Tags** - Quick visual tags (professional, colorful, two-column, etc.)
- **Meta info** - Style, layout, "Best for" information
- **Color-coded previews** - Each template preview uses its actual color scheme

### 📱 Responsive Design
- **Modal layout** - Clean header with search and controls
- **Sidebar categories** - Easy navigation through template types
- **Scrollable content** - Smooth scrolling through template grid/list
- **Adaptive grid** - 1-3 columns depending on screen size

## Component Structure

### Main Component: `TemplateGallery`

**Props:**
```typescript
interface TemplateGalleryProps {
  open: boolean;                    // Dialog open state
  onOpenChange: (open: boolean) => void;  // Toggle dialog
  selected: TemplateType;            // Currently selected template
  onSelect: (template: TemplateType) => void;  // Selection handler
  resume?: Resume;                   // Optional: for live preview
}
```

**Features:**
- Search state management
- Category filtering
- View mode toggle (grid/list)
- Hover state tracking
- Template filtering logic

### Sub-Component: `TemplateCard` (Grid View)

**Visual Elements:**
- Aspect ratio 8.5:11 (mimics US Letter paper)
- Simulated resume preview with:
  - Header area (colored based on template's primary color)
  - Content lines (varying widths for realism)
  - Section dividers
- Template info section with:
  - Name and description
  - Badges (Popular, New, ATS score)
  - Tags (first 3 tags shown)
- Selected state with checkmark overlay
- Hover overlay effect

### Sub-Component: `TemplateListItem` (List View)

**Layout:**
- Horizontal layout with mini preview on left
- Larger template name and description
- More badges and tags visible (up to 4)
- Additional meta information
- Full-width clickable area

## Usage

### Basic Implementation

```tsx
import { TemplateSelector } from "@/components/features/resume/preview/template-selector";

function ResumeEditor() {
  const [template, setTemplate] = useState<TemplateType>("modern");

  return (
    <div>
      <TemplateSelector 
        selected={template} 
        onSelect={setTemplate} 
      />
    </div>
  );
}
```

The `TemplateSelector` button will open the full gallery when clicked.

### Direct Gallery Usage

```tsx
import { TemplateGallery } from "@/components/features/resume/preview/template-gallery";

function MyComponent() {
  const [open, setOpen] = useState(false);
  const [template, setTemplate] = useState<TemplateType>("modern");

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Choose Template
      </Button>
      
      <TemplateGallery
        open={open}
        onOpenChange={setOpen}
        selected={template}
        onSelect={setTemplate}
      />
    </>
  );
}
```

## Visual Preview Simulation

The gallery generates realistic template previews without needing actual images:

```tsx
// Simulated header
<div style={{ 
  backgroundColor: template.colorScheme.primary,
  opacity: 0.2 
}} />

// Simulated content lines with varying widths
{[...Array(8)].map((_, i) => (
  <div style={{
    backgroundColor: template.colorScheme.text,
    opacity: 0.1,
    width: `${Math.random() * 40 + 60}%`
  }} />
))}
```

This creates:
- **Realistic previews** without needing screenshots
- **Dynamic color schemes** - Each template shows its actual colors
- **Fast loading** - No image files to download
- **Consistent sizing** - All previews render identically

## Filtering Logic

### Category Filter
```typescript
filtered = filtered.filter((t: TemplateInfo) => t.category === category);
```

### Search Filter
Searches across multiple fields:
- Template name
- Description
- Tags
- Industries

```typescript
filtered = filtered.filter((t: TemplateInfo) =>
  t.name.toLowerCase().includes(searchLower) ||
  t.description.toLowerCase().includes(searchLower) ||
  t.tags.some((tag: string) => tag.toLowerCase().includes(searchLower)) ||
  t.industries.some((ind: string) => ind.toLowerCase().includes(searchLower))
);
```

## UI States

### Empty State
When no templates match filters:
- Filter icon
- "No templates found" message
- Helpful description
- "Clear Filters" button

### Grid View
- 3-column grid on large screens
- 2-column on medium screens
- 1-column on small screens
- Card-based layout with previews
- Hover effects

### List View
- Horizontal cards with mini preview
- More detailed information visible
- Better for comparing template details
- Faster scanning of options

## Badge System

Templates can have multiple badges:

1. **Popular** (TrendingUp icon)
   - `template.isPopular === true`
   - Purple/secondary badge

2. **New** (Sparkles icon)
   - `template.isNew === true`
   - Purple/secondary badge

3. **ATS Score** (Award icon)
   - Shows for `template.atsScore >= 9`
   - Displays score out of 10
   - Indicates ATS-friendliness

## Styling System

### Colors
- **Primary actions**: Violet/purple theme
- **Selected state**: Violet-600 border and shadow
- **Hover state**: Violet-300 border
- **Backgrounds**: Gray-50 for sidebar, white for content
- **Text**: Gray-900 for headings, gray-600 for descriptions

### Spacing
- **Card padding**: p-4 (16px)
- **Card gap**: gap-6 (24px)
- **Dialog padding**: p-6 (24px)
- **Border radius**: rounded-lg (8px)

### Transitions
- All interactive elements have `transition-all`
- Hover states animate smoothly
- Border and shadow changes are animated

## Accessibility

- ✅ **Keyboard navigation** - Dialog can be closed with Escape
- ✅ **Clear labels** - DialogTitle and DialogDescription
- ✅ **Interactive elements** - All clickable areas properly sized
- ✅ **Visual feedback** - Clear selected and hover states
- ✅ **Search UX** - Clear button appears when search has text
- ✅ **Empty states** - Helpful messaging when no results

## Performance

### Optimizations
- **useMemo** for filtered templates - Prevents unnecessary recalculations
- **Lazy rendering** - Only renders visible templates
- **No images** - Simulated previews load instantly
- **Efficient filtering** - Single pass through templates

### Future Enhancements
- [ ] Virtual scrolling for 100+ templates
- [ ] Template preview on hover (live render)
- [ ] Side-by-side comparison mode
- [ ] Favorite templates
- [ ] Recently used templates
- [ ] Template recommendations based on content
- [ ] Print preview in gallery
- [ ] Template customization preview (color picker)

## Integration Points

### Template Registry
Pulls all templates from:
```typescript
import { getAllTemplates } from "../templates/template-registry";
```

### Template Types
Uses enhanced type system:
```typescript
import type { TemplateCategory, TemplateInfo } from "@/lib/types/templates";
```

### UI Components
Uses shadcn/ui components:
- Dialog (modal)
- Button
- Input (search)
- Badge (indicators)

## Customization

### Adding New Categories
Edit the `categories` array:
```typescript
const categories: { id: FilterCategory; label: string }[] = [
  { id: "all", label: "All Templates" },
  { id: "yourcategory", label: "Your Category" },
];
```

### Changing Grid Columns
Modify the grid classes:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
```

### Custom Preview Generation
Edit the preview simulation in `TemplateCard`:
```tsx
<div className="w-full h-full p-6 space-y-3 scale-90">
  {/* Customize your preview structure here */}
</div>
```

## Testing

### Manual Testing Checklist
- [ ] Dialog opens and closes correctly
- [ ] Search filters templates in real-time
- [ ] Category filters work
- [ ] View mode toggle switches views
- [ ] Clicking template selects and closes dialog
- [ ] Selected template shows checkmark
- [ ] Empty state displays when no matches
- [ ] Clear filters resets search and category
- [ ] Badges display correctly (Popular, New, ATS)
- [ ] Hover states work smoothly
- [ ] Mobile responsive

### Edge Cases
- [ ] No templates available
- [ ] All templates filtered out
- [ ] Very long template names
- [ ] Many tags/industries
- [ ] Search with special characters

## Screenshots/Mockup Description

### Grid View
```
┌──────────────────────────────────────────────────────────────┐
│  ✨ Choose Your Template      [Search...]  [Grid][List]   X  │
│  Select from 3 professional resume templates                  │
├──────────────┬───────────────────────────────────────────────┤
│ Categories   │                                                │
│ ────────────│                                                │
│ ✓ All        │  ┌──────┐  ┌──────┐  ┌──────┐               │
│   Professional│  │ Prev │  │ Prev │  │ Prev │               │
│   Modern     │  │ iew  │  │ iew  │  │ iew  │               │
│   Creative   │  │      │  │      │  │ ✓    │               │
│   Industry   │  └──────┘  └──────┘  └──────┘               │
│   Experience │  Modern     Classic   Minimal ⭐             │
│   Specialized│  [Popular] [ATS 10/10] [New]                │
│              │                                                │
└──────────────┴───────────────────────────────────────────────┘
```

### List View
```
┌──────────────────────────────────────────────────────────────┐
│  ✨ Choose Your Template      [Search...]  [Grid][List]   X  │
├──────────────┬───────────────────────────────────────────────┤
│ Categories   │  ┌────┐  Modern Template            ✓        │
│              │  │Prev│  Clean two-column design...          │
│              │  └────┘  [Popular] [ATS: 8/10]               │
│              │          professional • two-column            │
│              ├───────────────────────────────────────────────┤
│              │  ┌────┐  Classic Template                    │
│              │  │Prev│  Traditional format...                │
│              │  └────┘  [Popular] [ATS: 10/10]              │
└──────────────┴───────────────────────────────────────────────┘
```

## Summary

The Template Gallery provides a **professional, visual, and intuitive** way for users to:
1. **Browse** all available templates
2. **Filter** by category and search
3. **Preview** template designs with actual colors
4. **Compare** templates side-by-side
5. **Select** their preferred template

This creates a much better UX than a simple dropdown menu and scales beautifully to 50+ templates.
