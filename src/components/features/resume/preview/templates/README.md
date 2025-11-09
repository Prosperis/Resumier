# Resume Templates Architecture

## Overview

This directory contains the resume template system for Resumier. The architecture is designed to support 50+ templates with shared components, consistent styling, and easy maintenance.

## Directory Structure

```
templates/
├── shared/                    # Shared reusable components
│   ├── section-header.tsx    # Reusable section headers
│   ├── contact-info.tsx      # Contact information displays
│   ├── experience-entry.tsx  # Work experience entries
│   ├── education-entry.tsx   # Education entries
│   ├── skills-display.tsx    # Skills displays (inline, tags, bars, etc.)
│   ├── certifications-list.tsx # Certifications lists
│   └── index.ts              # Shared components export
├── modern-template.tsx        # Modern template (existing)
├── classic-template.tsx       # Classic template (existing)
├── minimal-template.tsx       # Minimal template (existing)
├── template-registry.ts       # Central template registry
└── README.md                  # This file
```

## Architecture Components

### 1. Type System (`src/lib/types/templates.ts`)

**Enhanced Types:**
- `TemplateInfo` - Complete template metadata
- `TemplateCategory` - professional, modern, creative, etc.
- `TemplateStyle` - traditional, contemporary, minimal, etc.
- `TemplateLayout` - single-column, two-column, timeline, etc.
- `ColorScheme` - Color configuration
- `Typography` - Font configuration
- `TemplateConfig` - User customization options
- `TemplateFilterOptions` - Filtering criteria

**Predefined Resources:**
- `COLOR_SCHEMES` - 7 predefined color palettes
- `TYPOGRAPHY_PRESETS` - 5 font pairings

### 2. Shared Component Library (`shared/`)

All templates can use these reusable building blocks:

#### SectionHeader
Multiple styles: minimal, accented, bordered, icons, cards
```tsx
<SectionHeader 
  title="Experience" 
  icon={Briefcase}
  style="icons"
  colorScheme={colorScheme}
/>
```

#### ContactInfo
Multiple layouts: centered, left, split, minimal
```tsx
<ContactInfo 
  personalInfo={personalInfo}
  links={links}
  style="centered"
  showIcons={true}
/>
```

#### ExperienceEntry
Multiple variants: default, compact, detailed, timeline
```tsx
<ExperienceEntry 
  experience={exp}
  variant="timeline"
  colorScheme={colorScheme}
/>
```

#### EducationEntry
Multiple variants: default, compact, detailed
```tsx
<EducationEntry 
  education={edu}
  variant="detailed"
  colorScheme={colorScheme}
/>
```

#### SkillsDisplay
Multiple variants: inline, tags, columns, bars, grid
```tsx
<SkillsDisplay 
  skills={skills}
  variant="tags"
  colorScheme={colorScheme}
/>
```

#### CertificationsList
Multiple variants: default, compact, detailed
```tsx
<CertificationsList 
  certifications={certifications}
  variant="compact"
  colorScheme={colorScheme}
/>
```

### 3. Template Registry (`template-registry.ts`)

Central registry system for managing all templates:

```typescript
// Template metadata
export const TEMPLATE_INFO: Record<string, TemplateInfo> = {
  modern: { /* metadata */ },
  classic: { /* metadata */ },
  // ... more templates
};

// Template components
export const TEMPLATE_REGISTRY: TemplateRegistry = {
  modern: { info: TEMPLATE_INFO.modern, component: ModernTemplate },
  classic: { info: TEMPLATE_INFO.classic, component: ClassicTemplate },
  // ... more templates
};
```

**Helper Functions:**
- `getAllTemplates()` - Get all template info
- `getTemplateInfo(id)` - Get specific template metadata
- `getTemplateComponent(id)` - Get template React component
- `getTemplatesByCategory(category)` - Filter by category
- `getTemplatesByIndustry(industry)` - Filter by industry
- `getTemplatesByExperience(level)` - Filter by experience level

### 4. Template Utilities (`src/lib/utils/template-utils.ts`)

Utility functions for working with templates:

- `filterTemplates(templates, filters)` - Advanced filtering
- `sortTemplates(templates, sortBy, order)` - Sorting
- `getColorScheme(name)` - Get predefined color scheme
- `getTypography(name)` - Get predefined typography
- `mergeTemplateConfig(default, user)` - Merge configurations
- `calculateTemplateMatchScore(template, userProfile)` - AI scoring
- `getRecommendedTemplates(templates, userProfile)` - Smart recommendations
- `groupTemplatesByCategory(templates)` - Group templates
- `getPopularTemplates(templates)` - Get popular templates
- `getATSTemplates(templates, minScore)` - Get ATS-friendly templates

## Creating New Templates

### Quick Start: Using Shared Components

```tsx
import type { Resume } from "@/lib/api/types";
import type { TemplateComponentProps } from "@/lib/types/templates";
import {
  SectionHeader,
  ContactInfo,
  ExperienceEntry,
  EducationEntry,
  SkillsDisplay,
  CertificationsList,
} from "./shared";

export function MyNewTemplate({ resume, config }: TemplateComponentProps) {
  const { personalInfo, experience, education, skills, certifications, links } =
    resume.content;

  // Get color scheme and typography from config or use defaults
  const colorScheme = config?.colorScheme || COLOR_SCHEMES.purple;
  const typography = config?.typography || TYPOGRAPHY_PRESETS.modern;

  return (
    <div className="mx-auto max-w-[21cm] bg-white p-12 shadow-lg">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="mb-2 text-4xl font-bold">{personalInfo.name}</h1>
        <ContactInfo
          personalInfo={personalInfo}
          links={links}
          style="centered"
          colorScheme={colorScheme}
        />
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-6">
          <SectionHeader
            title="Professional Summary"
            style="minimal"
            colorScheme={colorScheme}
          />
          <p className="text-sm">{personalInfo.summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-6">
          <SectionHeader
            title="Experience"
            icon={Briefcase}
            style="icons"
            colorScheme={colorScheme}
          />
          <div className="space-y-4">
            {experience.map((exp) => (
              <ExperienceEntry
                key={exp.id}
                experience={exp}
                variant="default"
                colorScheme={colorScheme}
              />
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-6">
          <SectionHeader
            title="Education"
            icon={GraduationCap}
            style="icons"
            colorScheme={colorScheme}
          />
          <div className="space-y-3">
            {education.map((edu) => (
              <EducationEntry
                key={edu.id}
                education={edu}
                variant="default"
                colorScheme={colorScheme}
              />
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      <section className="mb-6">
        <SectionHeader
          title="Skills"
          style="minimal"
          colorScheme={colorScheme}
        />
        <SkillsDisplay
          skills={skills}
          variant="tags"
          colorScheme={colorScheme}
        />
      </section>

      {/* Certifications */}
      {certifications.length > 0 && (
        <section>
          <SectionHeader
            title="Certifications"
            icon={Award}
            style="icons"
            colorScheme={colorScheme}
          />
          <CertificationsList
            certifications={certifications}
            variant="compact"
            colorScheme={colorScheme}
          />
        </section>
      )}
    </div>
  );
}
```

### Register Your Template

Add to `template-registry.ts`:

```typescript
// 1. Import your template
import { MyNewTemplate } from "./my-new-template";

// 2. Add metadata
export const TEMPLATE_INFO: Record<string, TemplateInfo> = {
  // ... existing templates
  mynew: {
    id: "mynew",
    name: "My New Template",
    description: "Description of my template",
    category: "modern",
    style: "contemporary",
    layout: "single-column",
    tags: ["professional", "clean"],
    bestFor: ["Mid-level professionals"],
    industries: ["Technology", "Business"],
    experienceLevel: ["mid", "senior"],
    atsScore: 9,
    printOptimized: true,
    preview: "/templates/mynew-preview.png",
    thumbnail: "/templates/mynew-thumb.png",
    colorScheme: COLOR_SCHEMES.teal,
    typography: TYPOGRAPHY_PRESETS.modern,
    spacing: "normal",
    features: ["ats-optimized", "one-page"],
  },
};

// 3. Register component
export const TEMPLATE_REGISTRY: TemplateRegistry = {
  // ... existing templates
  mynew: {
    info: TEMPLATE_INFO.mynew,
    component: MyNewTemplate,
  },
};
```

## Template Design Guidelines

### 1. Color Schemes

Use predefined color schemes or create custom ones:

- **Professional**: navy, charcoal (conservative industries)
- **Modern**: purple, teal (tech, creative)
- **Creative**: coral, rose (design, media)
- **Neutral**: black/gray (universal)

### 2. Typography

Available presets:
- **classic** - Georgia + Arial (traditional)
- **modern** - Inter (contemporary)
- **creative** - Montserrat + Open Sans (artistic)
- **professional** - Lato + Merriweather (business)
- **technical** - Inter + Source Code Pro (developers)

### 3. Layouts

- **Single-column**: Traditional, ATS-friendly
- **Two-column**: Modern, space-efficient
- **Three-column**: Information-rich
- **Timeline**: Career progression focus
- **Grid**: Portfolio-style

### 4. Spacing

- **Compact**: Maximum information density
- **Normal**: Balanced readability
- **Spacious**: Premium, high-end feel

### 5. ATS Optimization

For high ATS scores (8-10):
- Use standard section headers
- Avoid tables and columns (or test thoroughly)
- Use standard fonts
- Keep formatting simple
- Use bullet points for achievements
- Include clear contact information

## Template Variants

### Creating Variants (Same Base, Different Styles)

Instead of creating 50 unique templates, create variants:

```typescript
// Base template with customizable colors
function BaseTemplate({ resume, config }: TemplateComponentProps) {
  const colorScheme = config?.colorScheme || COLOR_SCHEMES.purple;
  // Use colorScheme throughout
}

// Register multiple variants
TEMPLATE_INFO.modern_purple = { /* ... */ colorScheme: COLOR_SCHEMES.purple };
TEMPLATE_INFO.modern_teal = { /* ... */ colorScheme: COLOR_SCHEMES.teal };
TEMPLATE_INFO.modern_navy = { /* ... */ colorScheme: COLOR_SCHEMES.navy };
```

This approach: **5 base templates × 7 colors × 2-3 layouts = 70-105 variants!**

## Component Variants Reference

### SectionHeader Styles
- `minimal` - Simple border
- `accented` - Color accent with optional icon
- `icons` - Icon + border
- `bordered` - Left border accent
- `cards` - Background color

### ContactInfo Layouts
- `centered` - Center-aligned (traditional header)
- `left` - Left-aligned (sidebar style)
- `split` - Horizontal spread (name left, contact right)
- `minimal` - Inline, no icons

### ExperienceEntry Variants
- `default` - Standard format
- `compact` - Condensed for space
- `detailed` - Expanded with emphasis
- `timeline` - Visual timeline style

### SkillsDisplay Variants
- `inline` - Comma-separated by category
- `tags` - Pill-style tags
- `columns` - Multi-column list
- `bars` - Progress bars (for skill levels)
- `grid` - Compact grid layout

## Testing Templates

Ensure each template:
- ✅ Prints correctly on A4/Letter
- ✅ Handles missing optional fields gracefully
- ✅ Maintains readability at 100% and 80% zoom
- ✅ Uses semantic HTML structure
- ✅ Has proper color contrast (WCAG AA)
- ✅ Works with long text (names, descriptions)
- ✅ Supports dynamic content length

## Performance

Templates are lazy-loaded automatically via `resume-preview.tsx`:

```typescript
const MyTemplate = lazy(() =>
  import("./templates/my-template").then((m) => ({
    default: m.MyTemplate,
  }))
);
```

## Future Enhancements

- [ ] Visual template builder (drag-and-drop)
- [ ] User-customizable color schemes
- [ ] Font selection
- [ ] Section reordering
- [ ] Custom sections
- [ ] Template marketplace
- [ ] A/B testing tracking
- [ ] AI-generated templates

## Best Practices

1. **Reuse shared components** - Don't reinvent the wheel
2. **Use consistent spacing** - Follow Tailwind spacing scale
3. **Test with real data** - Not just Lorem Ipsum
4. **Keep it simple** - Complexity reduces ATS compatibility
5. **Document variants** - Make it easy for others to extend
6. **Consider print** - Not just screen display
7. **Think mobile** - Preview should work on tablets

## Questions?

For questions or contributions, see the main project README or contact the development team.
