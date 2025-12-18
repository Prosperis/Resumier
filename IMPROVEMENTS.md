# Resumier - Improvement Opportunities

> A comprehensive analysis of potential improvements to enhance the Resumier application.
> Last updated: December 17, 2025

## Status Legend

| Status | Description |
|--------|-------------|
| ✅ Done | Fully implemented |
| 🚧 In Progress | Currently being worked on |
| 📋 Planned | Scheduled for implementation |
| ⏳ Pending | Not yet started |

## Implementation Status Overview

| # | Improvement | Status | Date Completed |
|---|-------------|--------|----------------|
| 1 | Reduce Code Duplication in Resume Builder | ✅ Done | Dec 2025 |
| 2 | Improve Type Safety in Resume Store | ✅ Done | Dec 2025 |
| 3 | Expand E2E Test Coverage | ✅ Done | Dec 2025 |
| 4 | Add Loading States for Better UX | ✅ Done | Dec 2025 |
| 5 | Add Internationalization (i18n) Support | ✅ Done | Dec 2025 |
| 6 | Implement Undo/Redo at Global Level | ✅ Done | Dec 2025 |
| 7 | Add Resume Versioning | ⏳ Pending | - |
| 8 | Improve CSP by Removing unsafe-inline | ⏳ Pending | - |
| 9 | Add Analytics Integration | ⏳ Pending | - |
| 10 | Add Resume Sharing Feature | ⏳ Pending | - |
| 11 | Add Dark Mode for Resume Preview | ⏳ Pending | - |
| 12 | Add Keyboard Navigation | ⏳ Pending | - |
| 13 | Add Drag-and-Drop Section Reordering | ⏳ Pending | - |
| 14 | Add AI-Powered Content Suggestions | ⏳ Pending | - |
| 15 | Add Resume Analytics Dashboard | ⏳ Pending | - |
| 16 | Standardize Error Handling | ⏳ Pending | - |
| 17 | Add Strict ESLint Rules | ⏳ Pending | - |
| 18 | Add JSDoc Comments for Public APIs | ⏳ Pending | - |
| 19 | Implement Virtual Scrolling for Long Lists | ⏳ Pending | - |
| 20 | Optimize Bundle Splitting | ⏳ Pending | - |
| 21 | Add Resource Hints | ⏳ Pending | - |
| 22 | Implement Selective Hydration | ⏳ Pending | - |
| 23 | Add Visual Regression Testing | ⏳ Pending | - |
| 24 | Add Contract Testing for Mock API | ⏳ Pending | - |
| 25 | Add Performance Testing | ⏳ Pending | - |
| 26 | Implement Content Security Policy Reporting | ⏳ Pending | - |
| 27 | Add Input Validation at Form Level | ⏳ Pending | - |
| 28 | Add Rate Limiting for Export Operations | ⏳ Pending | - |
| 29 | Add Development Scripts | ⏳ Pending | - |
| 30 | Add Pre-commit Hooks | ✅ Done | Dec 2025 |
| 31 | Add Storybook for All UI Components | ⏳ Pending | - |
| 32 | Add Resume Comparison View | ⏳ Pending | - |
| 33 | Add Resume Templates Marketplace | ⏳ Pending | - |
| 34 | Add Resume Scoring | ⏳ Pending | - |
| 35 | Add Multi-Resume Support | ⏳ Pending | - |

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [High Priority Improvements](#high-priority-improvements)
3. [Medium Priority Improvements](#medium-priority-improvements)
4. [Low Priority Improvements](#low-priority-improvements)
5. [Code Quality Improvements](#code-quality-improvements)
6. [Performance Optimizations](#performance-optimizations)
7. [Testing Improvements](#testing-improvements)
8. [Security Enhancements](#security-enhancements)
9. [Developer Experience](#developer-experience)
10. [Feature Enhancements](#feature-enhancements)

---

## Executive Summary

Resumier is a well-architected React resume builder with solid foundations:
- ✅ Modern tech stack (React 19, TypeScript 5, TanStack Router)
- ✅ Good test coverage (83.5%)
- ✅ Security-conscious implementation
- ✅ PWA support with offline capabilities
- ✅ Comprehensive template system (26 templates)

This document outlines opportunities to further enhance the application across various dimensions.

---

## High Priority Improvements

### 1. Reduce Code Duplication in Resume Builder ✅

**Status:** ✅ Done (December 2025)

**Location:** `src/components/features/resume/resume-builder.tsx`

**Implementation:** Created `src/hooks/use-entity-list-handlers.ts` with full test coverage.

**Issue:** The component has significant repetition across entity handlers (Experience, Education, Certifications, Links). Each entity has nearly identical:
- State management (`editingId`, `addingNew`)
- Handler functions (`handleAdd`, `handleEdit`, `handleCancel`, `handleDelete`, `handleReorder`)

**Solution:** Create a custom hook to encapsulate this pattern:

```typescript
// src/hooks/use-entity-list-handlers.ts
interface UseEntityListHandlersOptions<T> {
  resumeId: string;
  entityKey: keyof ResumeContent;
  getCurrentItems: () => T[];
}

function useEntityListHandlers<T extends { id: string }>({
  resumeId,
  entityKey,
  getCurrentItems,
}: UseEntityListHandlersOptions<T>) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const { mutate: updateResume } = useUpdateResume();
  const { toast } = useToast();

  const handleAdd = useCallback(() => {
    setEditingId(null);
    setIsAddingNew(true);
  }, []);

  const handleEdit = useCallback((id: string) => {
    setIsAddingNew(false);
    setEditingId(id);
  }, []);

  const handleCancel = useCallback(() => {
    setEditingId(null);
    setIsAddingNew(false);
  }, []);

  const handleDelete = useCallback((id: string) => {
    const items = getCurrentItems();
    const updatedItems = items.filter(item => item.id !== id);
    
    updateResume(
      { id: resumeId, data: { content: { [entityKey]: updatedItems } } },
      {
        onSuccess: () => toast({ title: "Success", description: "Item deleted" }),
        onError: (error) => toast({ 
          title: "Error", 
          description: `Failed to delete: ${error.message}`,
          variant: "destructive" 
        }),
      }
    );
  }, [resumeId, entityKey, getCurrentItems, updateResume, toast]);

  const handleReorder = useCallback((reorderedItems: T[]) => {
    updateResume(
      { id: resumeId, data: { content: { [entityKey]: reorderedItems } } },
      {
        onError: (error) => toast({ 
          title: "Error", 
          description: `Failed to reorder: ${error.message}`,
          variant: "destructive" 
        }),
      }
    );
  }, [resumeId, entityKey, updateResume, toast]);

  return {
    editingId,
    isAddingNew,
    handleAdd,
    handleEdit,
    handleCancel,
    handleDelete,
    handleReorder,
  };
}
```

**Impact:** Reduces `resume-builder.tsx` from ~590 lines to ~250 lines.

---

### 2. Improve Type Safety in Resume Store ✅

**Status:** ✅ Done (December 2025)

**Location:** `src/stores/resume-store.ts`, `src/stores/history-store.ts`, `src/lib/utils/guest-storage.ts`

**Implementation:** Improved type safety across the store layer:

1. **Fixed store exports** (`src/stores/index.ts`):
   - Removed non-existent `Skill` type export
   - Added proper exports for `Experience`, `ExperienceFormat`, `LinkType`, `NameOrder`, `PersonalInfo`, `PhoneFormat`, `Skills`, `SkillWithLevel`
   - Added exports for style types: `CustomFont`, `StyleCustomization`
   - Added exports for legacy types with deprecation notices

2. **Improved HistoryChange type** (`src/stores/history-store.ts`):
   - Created `HistoryValue` union type to replace `unknown`
   - Created `HistorySection` type for section identifiers
   - Added JSDoc comments for all types
   - Values now properly typed as: `string | boolean | undefined | null | string[] | WorkExperience[] | LegacyEducation[] | LegacySkill[] | LegacyCertification[] | LegacyLink[]`

3. **Type-safe guest storage** (`src/lib/utils/guest-storage.ts`):
   - Created `GuestData` interface for import/export operations
   - Created `ZustandPersistedState<T>` wrapper type
   - Created `ResumeStoreState` and `ProfileStoreState` interfaces
   - Replaced `unknown` types with proper typed interfaces

**Note:** The original issue from the analysis mentioned index signatures (`[key: string]: unknown`) but those were already removed in a previous update. The `ResumeContent` type in `src/lib/api/types.ts` is strictly typed.

---

### 3. Expand E2E Test Coverage ✅

**Status:** ✅ Done (December 2025)

**Location:** `e2e/` directory

**Implementation:** Created comprehensive E2E test files covering all critical user flows.

**Issue:** Only 2 basic E2E tests exist. Critical user flows are untested.

**Solution:** Add comprehensive E2E tests:

```typescript
// e2e/resume-workflow.e2e.ts
import { expect, test } from "@playwright/test";

test.describe("Resume Creation Workflow", () => {
  test("should create a new resume from scratch", async ({ page }) => {
    await page.goto("/");
    
    // Click "New Resume" button
    await page.getByRole("button", { name: /new resume/i }).click();
    
    // Fill in resume name
    await page.getByLabel(/resume name/i).fill("My Professional Resume");
    await page.getByRole("button", { name: /create/i }).click();
    
    // Verify we're in the editor
    await expect(page).toHaveURL(/\/resume\/.+/);
    await expect(page.getByText("Personal Information")).toBeVisible();
  });

  test("should add and edit experience", async ({ page }) => {
    // Navigate to existing resume
    await page.goto("/resume/test-id");
    
    // Expand experience section
    await page.getByText("Work Experience").click();
    
    // Add new experience
    await page.getByRole("button", { name: /add/i }).first().click();
    await page.getByLabel(/company/i).fill("Acme Corp");
    await page.getByLabel(/title/i).fill("Software Engineer");
    await page.getByRole("button", { name: /save/i }).click();
    
    // Verify it was added
    await expect(page.getByText("Acme Corp")).toBeVisible();
  });

  test("should export resume to PDF", async ({ page }) => {
    await page.goto("/resume/test-id");
    
    // Open export menu
    await page.getByRole("button", { name: /export/i }).click();
    
    // Click PDF option
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("menuitem", { name: /pdf/i }).click();
    
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain(".pdf");
  });

  test("should switch between templates", async ({ page }) => {
    await page.goto("/resume/test-id");
    
    // Open template selector
    await page.getByRole("button", { name: /template/i }).click();
    
    // Select different template
    await page.getByText("Classic").click();
    
    // Verify template changed (check for template-specific element)
    await expect(page.locator("[data-template='classic']")).toBeVisible();
  });
});

// e2e/authentication.e2e.ts
test.describe("Authentication Flow", () => {
  test("should show auth modal for unauthenticated users", async ({ page }) => {
    await page.goto("/dashboard");
    
    // Should redirect to home or show auth modal
    await expect(page.getByText(/sign in|log in/i)).toBeVisible();
  });

  test("should allow guest mode access", async ({ page }) => {
    await page.goto("/");
    
    // Click guest mode option
    await page.getByRole("button", { name: /continue as guest/i }).click();
    
    // Should access dashboard
    await expect(page).toHaveURL("/dashboard");
  });
});
```

**Files to create:**
- `e2e/resume-workflow.e2e.ts`
- `e2e/authentication.e2e.ts`
- `e2e/export.e2e.ts`
- `e2e/template-selection.e2e.ts`
- `e2e/accessibility.e2e.ts`

---

### 4. Add Loading States for Better UX ✅

**Status:** ✅ Done (December 2025)

**Location:** `src/components/ui/loading-skeletons.tsx`, `src/components/ui/route-loading.tsx`

**Implementation:** Created comprehensive skeleton loading components that match the actual component layouts:

1. **Created `loading-skeletons.tsx`** with domain-specific skeletons:
   - `ResumeEditorSkeleton` - 3-panel layout matching the editor
   - `ResumePreviewSkeleton` - A4 paper preview format
   - `DashboardSkeleton` - Header, tabs, and table layout
   - `ResumeTableSkeleton` - Table with rows and columns
   - `ProfileCardSkeleton` - Card with avatar and content
   - `ProfileGridSkeleton` - Grid of profile cards
   - `SettingsSkeleton` - Settings page sections
   - `FormSectionSkeleton` - Form fields layout
   - `EntityListSkeleton` - Experience/Education lists
   - `TemplateGallerySkeleton` - Template grid
   - `ToolSidebarSkeleton` - Tool sidebar panel

2. **Updated `route-loading.tsx`** to use skeleton-based loading:
   - `DashboardLoading` - Uses `DashboardSkeleton`
   - `ResumeEditorLoading` - Uses `ResumeEditorSkeleton`
   - `SettingsLoading` - Uses `SettingsSkeleton`
   - `ProfileManagerLoading` - Uses `ProfileGridSkeleton`

3. **Updated components** to use new skeletons:
   - `resume-dashboard.tsx` - Uses `DashboardSkeleton`
   - `profile-manager.tsx` - Uses `ProfileGridSkeleton`
   - `lazy/index.tsx` - Improved form and list skeletons
   - `resume-preview.tsx` - Enhanced template loading skeleton

**Impact:** Users now see realistic loading placeholders that match the actual UI structure, reducing perceived loading time and improving UX.

---

## Medium Priority Improvements

### 5. Add Internationalization (i18n) Support ✅

**Status:** ✅ Done (December 2025)

**Issue:** Application only supports English, limiting its reach to non-English speaking users globally.

**Solution:** Implement comprehensive i18n support with `react-i18next` featuring:
- Type-safe translations with TypeScript
- Lazy-loaded language bundles
- RTL (Right-to-Left) support for Arabic, Hebrew, etc.
- Date/number formatting with user locale
- Language persistence in user preferences

#### Step 1: Install Dependencies

```bash
bun add react-i18next i18next i18next-browser-languagedetector i18next-http-backend
bun add -D @types/i18next
```

#### Step 2: Create File Structure

```
src/lib/i18n/
├── index.ts                 # i18n initialization
├── types.ts                 # TypeScript types for translations
├── language-detector.ts     # Custom language detection
├── locales/
│   ├── en/
│   │   ├── common.json      # Shared translations
│   │   ├── dashboard.json   # Dashboard page
│   │   ├── editor.json      # Resume editor
│   │   ├── templates.json   # Template names/descriptions
│   │   └── validation.json  # Form validation messages
│   ├── es/
│   │   └── ... (same structure)
│   ├── fr/
│   │   └── ... (same structure)
│   ├── de/
│   │   └── ... (same structure)
│   ├── pt/
│   │   └── ... (same structure)
│   ├── zh/
│   │   └── ... (same structure)
│   ├── ar/
│   │   └── ... (same structure)
│   └── ja/
│       └── ... (same structure)
```

#### Step 3: Create i18n Configuration

```typescript
// src/lib/i18n/index.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

import type { Language, TranslationResources } from "./types";

export const supportedLanguages: Language[] = [
  { code: "en", name: "English", nativeName: "English", dir: "ltr" },
  { code: "es", name: "Spanish", nativeName: "Español", dir: "ltr" },
  { code: "fr", name: "French", nativeName: "Français", dir: "ltr" },
  { code: "de", name: "German", nativeName: "Deutsch", dir: "ltr" },
  { code: "pt", name: "Portuguese", nativeName: "Português", dir: "ltr" },
  { code: "zh", name: "Chinese", nativeName: "中文", dir: "ltr" },
  { code: "ar", name: "Arabic", nativeName: "العربية", dir: "rtl" },
  { code: "ja", name: "Japanese", nativeName: "日本語", dir: "ltr" },
];

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: supportedLanguages.map((l) => l.code),
    
    // Namespace configuration
    ns: ["common", "dashboard", "editor", "templates", "validation"],
    defaultNS: "common",
    
    // Backend configuration for lazy loading
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    
    // Language detection
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: "resumier-language",
    },
    
    // Interpolation settings
    interpolation: {
      escapeValue: false, // React already escapes
      formatSeparator: ",",
    },
    
    // React specific
    react: {
      useSuspense: true,
      bindI18n: "languageChanged loaded",
      bindI18nStore: "added removed",
    },
  });

export default i18n;
export { supportedLanguages };
```

#### Step 4: Type-Safe Translations

```typescript
// src/lib/i18n/types.ts
export interface Language {
  code: string;
  name: string;
  nativeName: string;
  dir: "ltr" | "rtl";
}

// Import JSON types for type safety
import type common from "./locales/en/common.json";
import type dashboard from "./locales/en/dashboard.json";
import type editor from "./locales/en/editor.json";
import type templates from "./locales/en/templates.json";
import type validation from "./locales/en/validation.json";

export interface TranslationResources {
  common: typeof common;
  dashboard: typeof dashboard;
  editor: typeof editor;
  templates: typeof templates;
  validation: typeof validation;
}

// Extend i18next types for autocomplete
declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: TranslationResources;
  }
}
```

#### Step 5: Create Translation Files

```json
// src/lib/i18n/locales/en/common.json
{
  "appName": "Resumier",
  "tagline": "Build Your Professional Resume",
  "actions": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "add": "Add",
    "create": "Create",
    "update": "Update",
    "download": "Download",
    "export": "Export",
    "import": "Import",
    "preview": "Preview",
    "duplicate": "Duplicate",
    "close": "Close",
    "confirm": "Confirm",
    "back": "Back",
    "next": "Next",
    "submit": "Submit",
    "reset": "Reset"
  },
  "status": {
    "loading": "Loading...",
    "saving": "Saving...",
    "saved": "Saved",
    "error": "Error",
    "success": "Success"
  },
  "navigation": {
    "dashboard": "Dashboard",
    "settings": "Settings",
    "profile": "Profile",
    "help": "Help",
    "logout": "Log out",
    "login": "Log in",
    "signUp": "Sign up"
  },
  "errors": {
    "generic": "Something went wrong. Please try again.",
    "notFound": "Page not found",
    "unauthorized": "Please log in to continue",
    "networkError": "Network error. Please check your connection."
  },
  "confirmation": {
    "deleteTitle": "Are you sure?",
    "deleteMessage": "This action cannot be undone.",
    "unsavedChanges": "You have unsaved changes. Are you sure you want to leave?"
  }
}
```

```json
// src/lib/i18n/locales/en/dashboard.json
{
  "title": "Resume Dashboard",
  "subtitle": "Manage your resumes",
  "newResume": "New Resume",
  "noResumes": {
    "title": "No resumes yet",
    "description": "Create your first resume to get started!",
    "cta": "Create Resume"
  },
  "resumeCard": {
    "lastModified": "Last modified {{date}}",
    "created": "Created {{date}}",
    "template": "Template: {{name}}"
  },
  "filters": {
    "all": "All Resumes",
    "recent": "Recent",
    "favorites": "Favorites"
  },
  "sort": {
    "label": "Sort by",
    "dateModified": "Date Modified",
    "dateCreated": "Date Created",
    "name": "Name"
  },
  "search": {
    "placeholder": "Search resumes...",
    "noResults": "No resumes found matching '{{query}}'"
  },
  "stats": {
    "totalResumes": "{{count}} resume",
    "totalResumes_plural": "{{count}} resumes",
    "totalExports": "{{count}} export",
    "totalExports_plural": "{{count}} exports"
  }
}
```

```json
// src/lib/i18n/locales/en/editor.json
{
  "sections": {
    "personalInfo": {
      "title": "Personal Information",
      "description": "Your contact details and basic info"
    },
    "summary": {
      "title": "Professional Summary",
      "description": "A brief overview of your career",
      "placeholder": "Write a compelling summary of your professional background..."
    },
    "experience": {
      "title": "Work Experience",
      "description": "Your employment history",
      "addButton": "Add Experience"
    },
    "education": {
      "title": "Education",
      "description": "Your academic background",
      "addButton": "Add Education"
    },
    "skills": {
      "title": "Skills",
      "description": "Your professional skills",
      "addButton": "Add Skill"
    },
    "certifications": {
      "title": "Certifications",
      "description": "Professional certifications",
      "addButton": "Add Certification"
    },
    "links": {
      "title": "Links",
      "description": "Portfolio, LinkedIn, GitHub, etc.",
      "addButton": "Add Link"
    }
  },
  "fields": {
    "name": "Full Name",
    "email": "Email Address",
    "phone": "Phone Number",
    "location": "Location",
    "website": "Website",
    "linkedin": "LinkedIn URL",
    "github": "GitHub URL",
    "company": "Company",
    "position": "Position / Title",
    "startDate": "Start Date",
    "endDate": "End Date",
    "current": "I currently work here",
    "description": "Description",
    "institution": "Institution",
    "degree": "Degree",
    "field": "Field of Study",
    "gpa": "GPA",
    "skillName": "Skill Name",
    "skillLevel": "Proficiency Level",
    "certName": "Certification Name",
    "certIssuer": "Issuing Organization",
    "certDate": "Date Obtained",
    "certExpiry": "Expiry Date",
    "linkLabel": "Label",
    "linkUrl": "URL"
  },
  "placeholders": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1 (555) 123-4567",
    "location": "New York, NY",
    "company": "Acme Corporation",
    "position": "Software Engineer"
  },
  "toolbar": {
    "template": "Change Template",
    "export": "Export",
    "save": "Save",
    "autoSave": "Auto-save enabled",
    "undo": "Undo",
    "redo": "Redo",
    "preview": "Preview",
    "download": "Download PDF"
  },
  "exportOptions": {
    "pdf": "Export as PDF",
    "docx": "Export as Word",
    "json": "Export as JSON",
    "png": "Export as Image"
  },
  "messages": {
    "saved": "Resume saved successfully",
    "exportSuccess": "Resume exported successfully",
    "exportError": "Failed to export resume",
    "deleteSuccess": "Item deleted successfully",
    "reorderSuccess": "Order updated"
  }
}
```

```json
// src/lib/i18n/locales/en/validation.json
{
  "required": "{{field}} is required",
  "email": "Please enter a valid email address",
  "url": "Please enter a valid URL",
  "phone": "Please enter a valid phone number",
  "minLength": "{{field}} must be at least {{min}} characters",
  "maxLength": "{{field}} must be no more than {{max}} characters",
  "date": {
    "invalid": "Please enter a valid date",
    "future": "Date cannot be in the future",
    "endBeforeStart": "End date must be after start date"
  },
  "gpa": {
    "invalid": "GPA must be between 0 and 4.0",
    "format": "Please enter a valid GPA (e.g., 3.5)"
  }
}
```

#### Step 6: Create Language Switcher Component

```typescript
// src/components/ui/language-switcher.tsx
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supportedLanguages } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  
  const currentLanguage = supportedLanguages.find(
    (lang) => lang.code === i18n.language
  );

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    
    // Update document direction for RTL languages
    const lang = supportedLanguages.find((l) => l.code === langCode);
    document.documentElement.dir = lang?.dir || "ltr";
    document.documentElement.lang = langCode;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">
            {currentLanguage?.nativeName || "English"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {supportedLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={i18n.language === lang.code ? "bg-accent" : ""}
          >
            <span className="mr-2">{lang.nativeName}</span>
            <span className="text-muted-foreground text-sm">
              ({lang.name})
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

#### Step 7: Create Translation Hook with Type Safety

```typescript
// src/hooks/use-translation.ts
import { useTranslation as useI18nTranslation } from "react-i18next";
import type { TranslationResources } from "@/lib/i18n/types";

type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${NestedKeyOf<T[K]>}` | K
          : K
        : never;
    }[keyof T]
  : never;

export function useTranslation<NS extends keyof TranslationResources = "common">(
  namespace?: NS
) {
  const { t, i18n, ready } = useI18nTranslation(namespace);

  return {
    t: t as (
      key: NestedKeyOf<TranslationResources[NS]>,
      options?: Record<string, unknown>
    ) => string,
    i18n,
    ready,
    currentLanguage: i18n.language,
    changeLanguage: i18n.changeLanguage.bind(i18n),
  };
}
```

#### Step 8: Add RTL Support

```css
/* src/index.css - Add RTL support */
[dir="rtl"] {
  --tw-translate-x: calc(var(--tw-translate-x) * -1);
}

[dir="rtl"] .mr-2 { margin-left: 0.5rem; margin-right: 0; }
[dir="rtl"] .ml-2 { margin-right: 0.5rem; margin-left: 0; }
[dir="rtl"] .text-left { text-align: right; }
[dir="rtl"] .text-right { text-align: left; }

/* Flip icons that indicate direction */
[dir="rtl"] .icon-directional {
  transform: scaleX(-1);
}
```

#### Step 9: Usage Examples in Components

```typescript
// Before (hardcoded English)
<Button>Save</Button>
<h1>Resume Dashboard</h1>

// After (internationalized)
import { useTranslation } from "@/hooks/use-translation";

function Dashboard() {
  const { t } = useTranslation("dashboard");
  const { t: tCommon } = useTranslation("common");

  return (
    <div>
      <h1>{t("title")}</h1>
      <Button>{tCommon("actions.save")}</Button>
      
      {/* With interpolation */}
      <p>{t("stats.totalResumes", { count: resumes.length })}</p>
      
      {/* With plural handling */}
      <span>
        {t("resumeCard.lastModified", { 
          date: new Intl.DateTimeFormat(i18n.language).format(date) 
        })}
      </span>
    </div>
  );
}
```

#### Step 10: Add to App Provider

```typescript
// src/app/providers.tsx
import { Suspense } from "react";
import "@/lib/i18n"; // Initialize i18n

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </Suspense>
  );
}
```

#### Testing i18n

```typescript
// src/lib/i18n/__tests__/translations.test.ts
import { describe, expect, it } from "vitest";
import en from "../locales/en/common.json";
import es from "../locales/es/common.json";

describe("Translation Files", () => {
  it("should have all keys in Spanish that exist in English", () => {
    const enKeys = Object.keys(flattenObject(en));
    const esKeys = Object.keys(flattenObject(es));
    
    const missingKeys = enKeys.filter((key) => !esKeys.includes(key));
    expect(missingKeys).toEqual([]);
  });

  it("should not have empty translations", () => {
    const flatEs = flattenObject(es);
    const emptyKeys = Object.entries(flatEs)
      .filter(([, value]) => value === "")
      .map(([key]) => key);
    
    expect(emptyKeys).toEqual([]);
  });
});

function flattenObject(obj: object, prefix = ""): Record<string, string> {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && value !== null) {
      Object.assign(acc, flattenObject(value, newKey));
    } else {
      acc[newKey] = value;
    }
    return acc;
  }, {} as Record<string, string>);
}
```

**Files to create:**
- `src/lib/i18n/index.ts`
- `src/lib/i18n/types.ts`
- `src/lib/i18n/locales/en/common.json`
- `src/lib/i18n/locales/en/dashboard.json`
- `src/lib/i18n/locales/en/editor.json`
- `src/lib/i18n/locales/en/templates.json`
- `src/lib/i18n/locales/en/validation.json`
- `src/lib/i18n/locales/es/*.json` (Spanish)
- `src/lib/i18n/locales/fr/*.json` (French)
- `src/lib/i18n/locales/de/*.json` (German)
- `src/lib/i18n/locales/pt/*.json` (Portuguese)
- `src/lib/i18n/locales/zh/*.json` (Chinese)
- `src/lib/i18n/locales/ar/*.json` (Arabic - RTL)
- `src/lib/i18n/locales/ja/*.json` (Japanese)
- `src/components/ui/language-switcher.tsx`
- `src/hooks/use-translation.ts`

**Components to update:**
- All UI components with user-facing text
- Navigation components
- Form labels and validation messages
- Toast notifications
- Modal dialogs
- Settings page (add language preference)

**Impact:** Opens the application to a global audience, potentially increasing user base by 3-5x.

---

### 6. Implement Undo/Redo at Global Level ✅

**Status:** ✅ Done (December 2025)

**Location:** `src/stores/global-undo-store.ts`, `src/hooks/use-global-undo-redo.ts`, `src/hooks/use-keyboard-shortcuts.ts`

**Implementation:** Created a comprehensive global undo/redo system that tracks all state changes across the application.

**Files Created:**
1. `src/stores/global-undo-store.ts` - Global undo manager store
   - Tracks state snapshots (template, styleCustomization, userInfo, jobInfo)
   - Supports up to 100 history entries
   - Built-in debouncing to group rapid changes
   - Pause/resume functionality to prevent tracking during undo/redo operations

2. `src/hooks/use-global-undo-redo.ts` - Main integration hook
   - Automatically tracks changes to the resume store
   - Provides `undo()` and `redo()` functions
   - Detects change types and generates descriptions
   - Applies snapshots back to stores during undo/redo

3. `src/hooks/use-keyboard-shortcuts.ts` - Global keyboard shortcuts
   - `Ctrl/Cmd + Z` for Undo
   - `Ctrl/Cmd + Shift + Z` for Redo
   - `Ctrl/Cmd + Y` for Redo (Windows alternative)
   - `Ctrl/Cmd + S` intercept (prevents browser save dialog, shows auto-save toast)
   - Smart detection to skip when in input fields

4. `src/components/features/global-undo-provider.tsx` - Provider component
   - Wraps the app to enable global undo/redo
   - Initializes tracking and keyboard shortcuts

5. `src/components/features/undo-redo-buttons.tsx` - UI components
   - `<UndoRedoButtons />` - Paired undo/redo buttons with tooltips
   - `<UndoButton />` and `<RedoButton />` - Individual buttons
   - Shows keyboard shortcuts in tooltips
   - Disabled state when action not available

**Modified Files:**
- `src/routes/__root.tsx` - Added `GlobalUndoProvider` wrapper
- `src/components/layouts/root-layout.tsx` - Added undo/redo buttons to header
- `src/components/features/resume/resume-editor.tsx` - Removed duplicate keyboard handler
- `src/stores/index.ts` - Added exports for new store

**Features:**
- ✅ Global keyboard shortcuts (Ctrl+Z, Ctrl+Shift+Z, Ctrl+Y)
- ✅ Tracks template changes, style customization, personal info, job info
- ✅ Debouncing to prevent flooding history with rapid changes
- ✅ Toast notifications on undo/redo
- ✅ Undo/Redo buttons in header toolbar when editing resumes
- ✅ Works alongside the existing detailed history panel

---

### 7. Add Resume Versioning

**Feature:** Allow users to save and restore versions of their resume.

```typescript
// src/lib/api/types.ts
export interface ResumeVersion {
  id: string;
  resumeId: string;
  version: number;
  content: ResumeContent;
  createdAt: string;
  label?: string; // e.g., "Before template change"
}

// src/stores/version-store.ts
interface VersionStore {
  versions: Map<string, ResumeVersion[]>;
  
  // Actions
  saveVersion: (resumeId: string, content: ResumeContent, label?: string) => void;
  restoreVersion: (resumeId: string, versionId: string) => void;
  getVersions: (resumeId: string) => ResumeVersion[];
  deleteVersion: (resumeId: string, versionId: string) => void;
}
```

---

### 8. Improve CSP by Removing unsafe-inline

**Location:** `vite.config.ts`, `public/_headers`

**Issue:** CSP uses `'unsafe-inline'` and `'unsafe-eval'` which weakens protection.

**Solution:** Implement nonce-based CSP:

```typescript
// vite.config.ts - Add nonce plugin
import { createHash } from "crypto";

function generateNonce() {
  return createHash("sha256").update(Date.now().toString()).digest("base64");
}

// In production, inject nonce into HTML and CSP header
```

Alternatively, evaluate CSS-in-JS libraries that support CSP nonces.

---

### 9. Add Analytics Integration

**Feature:** Track user engagement and feature usage.

```typescript
// src/lib/analytics/index.ts
interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
}

class Analytics {
  private enabled = import.meta.env.PROD;
  private queue: AnalyticsEvent[] = [];

  track(name: string, properties?: Record<string, unknown>) {
    if (!this.enabled) return;
    
    const event: AnalyticsEvent = { name, properties };
    
    // Send to analytics provider (Plausible, PostHog, etc.)
    // For privacy-focused analytics, use Plausible
    if (window.plausible) {
      window.plausible(name, { props: properties });
    }
  }

  // Predefined events
  resumeCreated(templateId: string) {
    this.track("resume_created", { template: templateId });
  }

  resumeExported(format: "pdf" | "docx" | "json") {
    this.track("resume_exported", { format });
  }

  templateChanged(from: string, to: string) {
    this.track("template_changed", { from, to });
  }
}

export const analytics = new Analytics();
```

---

### 10. Add Resume Sharing Feature

**Feature:** Generate shareable links for resumes.

```typescript
// src/lib/sharing/index.ts
export async function generateShareableLink(resumeId: string): Promise<string> {
  // Encode resume data
  const resume = await getResume(resumeId);
  const encoded = btoa(JSON.stringify(resume.content));
  
  // Create shareable URL
  const baseUrl = window.location.origin;
  return `${baseUrl}/view/${encoded}`;
}

// src/routes/view.$encoded.tsx
export const Route = createFileRoute("/view/$encoded")({
  component: SharedResumeView,
  loader: ({ params }) => {
    try {
      const content = JSON.parse(atob(params.encoded));
      return { content };
    } catch {
      throw new Error("Invalid resume link");
    }
  },
});
```

---

## Low Priority Improvements

### 11. Add Dark Mode for Resume Preview

**Issue:** Resume preview only shows light mode, but users may want dark-themed resumes.

**Solution:** Add optional dark mode templates or theme variants.

---

### 12. Add Keyboard Navigation

**Enhancement:** Full keyboard support for power users:

- `Tab` / `Shift+Tab` - Navigate between sections
- `Enter` - Expand/collapse section
- `Arrow keys` - Navigate within lists
- `Delete` - Delete selected item (with confirmation)
- `Escape` - Cancel editing

---

### 13. Add Drag-and-Drop Section Reordering

**Feature:** Allow reordering of entire resume sections (not just items within sections).

```typescript
// src/components/features/resume/section-manager.tsx
export function SectionManager({ resumeId }: { resumeId: string }) {
  const sections = ["personal", "experience", "education", "skills", "certifications", "links"];
  const [order, setOrder] = useState(sections);

  // Use @dnd-kit for drag-and-drop
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext items={order}>
        {order.map((sectionId) => (
          <SortableSection key={sectionId} id={sectionId} />
        ))}
      </SortableContext>
    </DndContext>
  );
}
```

---

### 14. Add AI-Powered Content Suggestions

**Feature:** AI-assisted resume writing (optional, privacy-conscious).

```typescript
// src/lib/ai/suggestions.ts
interface ContentSuggestion {
  type: "summary" | "bullet-point" | "skill";
  original: string;
  suggestion: string;
  reasoning: string;
}

// Integration with local LLMs (e.g., Ollama) or opt-in cloud services
```

---

### 15. Add Resume Analytics Dashboard

**Feature:** Show users insights about their resume:

- Word count per section
- Reading time estimate
- Keyword density for ATS optimization
- Section balance visualization

---

## Code Quality Improvements

### 16. Standardize Error Handling

**Current state:** Error handling is inconsistent across components.

**Solution:** Create centralized error handling utilities:

```typescript
// src/lib/errors/index.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function handleApiError(error: unknown): AppError {
  if (error instanceof AppError) return error;
  
  if (error instanceof Error) {
    return new AppError(error.message, "UNKNOWN_ERROR", 500);
  }
  
  return new AppError("An unexpected error occurred", "UNKNOWN_ERROR", 500);
}

// src/hooks/use-error-handler.ts
export function useErrorHandler() {
  const { toast } = useToast();

  return useCallback((error: unknown, options?: { silent?: boolean }) => {
    const appError = handleApiError(error);
    
    // Log to Sentry
    Sentry.captureException(appError, {
      extra: appError.context,
      tags: { code: appError.code },
    });

    // Show toast unless silent
    if (!options?.silent) {
      toast({
        title: "Error",
        description: appError.message,
        variant: "destructive",
      });
    }

    return appError;
  }, [toast]);
}
```

---

### 17. Add Strict ESLint Rules

**Enhancement:** Add stricter linting rules:

```json
// oxlint.json
{
  "rules": {
    "no-explicit-any": "error",
    "no-unused-vars": "error",
    "prefer-const": "error",
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "react-hooks/exhaustive-deps": "error"
  }
}
```

---

### 18. Add JSDoc Comments for Public APIs

**Enhancement:** Document all exported functions and types:

```typescript
/**
 * Updates a resume with the provided data.
 * 
 * @param id - The unique identifier of the resume
 * @param data - Partial resume data to update
 * @returns Promise resolving to the updated resume
 * 
 * @example
 * ```ts
 * const updated = await updateResume("resume-123", {
 *   content: { personalInfo: { name: "John Doe" } }
 * });
 * ```
 */
export async function updateResume(id: string, data: Partial<Resume>): Promise<Resume> {
  // ...
}
```

---

## Performance Optimizations

### 19. Implement Virtual Scrolling for Long Lists

**Location:** Experience, Education, Certifications lists

**Issue:** With many entries, DOM becomes heavy.

**Solution:** Already have `@tanstack/react-virtual` - use it:

```typescript
// src/components/features/resume/forms/virtualized-list.tsx
import { useVirtualizer } from "@tanstack/react-virtual";

export function VirtualizedExperienceList({ items }: { items: Experience[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100, // Estimated row height
    overscan: 5,
  });

  return (
    <div ref={parentRef} className="h-96 overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <ExperienceItem experience={items[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### 20. Optimize Bundle Splitting

**Enhancement:** Create more granular code splitting:

```typescript
// vite.config.ts - Add manual chunks for better caching
rollupOptions: {
  output: {
    manualChunks: {
      // Core React
      "react-vendor": ["react", "react-dom"],
      
      // Router
      "router": ["@tanstack/react-router"],
      
      // Query
      "query": ["@tanstack/react-query"],
      
      // UI Components (large)
      "radix": [
        "@radix-ui/react-dialog",
        "@radix-ui/react-dropdown-menu",
        "@radix-ui/react-popover",
        // ... other radix packages
      ],
      
      // PDF/Export
      "export": ["jspdf", "html2canvas", "docx", "file-saver"],
      
      // Forms
      "forms": ["react-hook-form", "@hookform/resolvers", "zod"],
      
      // Animations
      "motion": ["framer-motion"],
    },
  },
},
```

---

### 21. Add Resource Hints

**Enhancement:** Preload critical resources:

```html
<!-- index.html -->
<head>
  <!-- Preconnect to Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  
  <!-- Preload critical fonts -->
  <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin />
  
  <!-- DNS Prefetch for Sentry -->
  <link rel="dns-prefetch" href="https://sentry.io" />
</head>
```

---

### 22. Implement Selective Hydration

**Enhancement:** Use React 19 features for better hydration:

```typescript
// Wrap non-critical components with Suspense for selective hydration
<Suspense fallback={<Skeleton />}>
  <ExpensiveComponent />
</Suspense>
```

---

## Testing Improvements

### 23. Add Visual Regression Testing

**Tool:** Playwright with screenshots or Chromatic

```typescript
// e2e/visual-regression.e2e.ts
import { expect, test } from "@playwright/test";

test.describe("Visual Regression", () => {
  test("dashboard page matches snapshot", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");
    
    await expect(page).toHaveScreenshot("dashboard.png", {
      maxDiffPixels: 100,
    });
  });

  test("resume templates match snapshots", async ({ page }) => {
    const templates = ["modern", "classic", "minimal", "executive"];
    
    for (const template of templates) {
      await page.goto(`/resume/demo?template=${template}`);
      await page.waitForLoadState("networkidle");
      
      await expect(page.locator(".resume-preview")).toHaveScreenshot(
        `template-${template}.png`
      );
    }
  });
});
```

---

### 24. Add Contract Testing for Mock API

**Enhancement:** Ensure mock API matches expected backend contract:

```typescript
// src/lib/api/__tests__/contract.test.ts
import { describe, expect, it } from "vitest";
import { z } from "zod";

const ResumeSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.object({
    personalInfo: z.object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      // ...
    }),
    // ...
  }),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

describe("Mock API Contract", () => {
  it("GET /api/resumes returns valid response", async () => {
    const response = await mockApi.route("/api/resumes", "GET");
    
    const result = z.array(ResumeSchema).safeParse(response);
    expect(result.success).toBe(true);
  });

  it("POST /api/resumes creates valid resume", async () => {
    const response = await mockApi.route("/api/resumes", "POST", {
      title: "Test Resume",
    });
    
    const result = ResumeSchema.safeParse(response);
    expect(result.success).toBe(true);
  });
});
```

---

### 25. Add Performance Testing

**Enhancement:** Test performance budgets:

```typescript
// e2e/performance.e2e.ts
import { expect, test } from "@playwright/test";

test.describe("Performance", () => {
  test("page loads within performance budget", async ({ page }) => {
    await page.goto("/");
    
    const timing = await page.evaluate(() => {
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: nav.domContentLoadedEventEnd - nav.fetchStart,
        load: nav.loadEventEnd - nav.fetchStart,
        firstPaint: performance.getEntriesByName("first-paint")[0]?.startTime,
        firstContentfulPaint: performance.getEntriesByName("first-contentful-paint")[0]?.startTime,
      };
    });

    // Performance budgets
    expect(timing.domContentLoaded).toBeLessThan(2000); // 2 seconds
    expect(timing.firstContentfulPaint).toBeLessThan(1500); // 1.5 seconds
  });
});
```

---

## Security Enhancements

### 26. Implement Content Security Policy Reporting

**Enhancement:** Add CSP violation reporting:

```typescript
// public/_headers
Content-Security-Policy: ...; report-uri /api/csp-reports; report-to csp-endpoint

// Or use Report-To header for newer browsers
Report-To: {"group":"csp-endpoint","max_age":86400,"endpoints":[{"url":"/api/csp-reports"}]}
```

---

### 27. Add Input Validation at Form Level

**Enhancement:** Consistent validation with Zod schemas:

```typescript
// src/lib/validations/personal-info.ts
import { z } from "zod";
import { sanitizeText } from "@/lib/security";

export const personalInfoSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name too long")
    .transform(sanitizeText),
  email: z
    .string()
    .email("Invalid email")
    .transform(sanitizeText),
  phone: z
    .string()
    .optional()
    .transform((val) => (val ? sanitizeText(val) : undefined)),
  // ...
});
```

---

### 28. Add Rate Limiting for Export Operations

**Issue:** PDF generation is CPU-intensive.

**Solution:** Rate limit export operations:

```typescript
// src/lib/security/export-limiter.ts
import { RateLimiter } from "./index";

const exportLimiter = new RateLimiter();

export function canExport(userId: string): boolean {
  // Max 10 exports per hour per user
  return exportLimiter.isAllowed(`export:${userId}`, 10, 60 * 60 * 1000);
}
```

---

## Developer Experience

### 29. Add Development Scripts

**Enhancement:** More helpful npm scripts:

```json
// package.json
{
  "scripts": {
    "dev": "vite",
    "dev:debug": "vite --debug",
    "dev:host": "vite --host",
    
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    
    "typecheck": "tsc --noEmit",
    "typecheck:watch": "tsc --noEmit --watch",
    
    "validate": "bun run typecheck && bun run lint && bun run test",
    
    "clean": "rm -rf dist node_modules/.vite",
    "clean:all": "rm -rf dist node_modules"
  }
}
```

---

### 30. Add Pre-commit Hooks ✅

**Status:** ✅ Done (December 2025)

**Implementation:** Added `.husky/pre-commit` and `.husky/pre-push` hooks that run formatting and linting.

**Enhancement:** Ensure code quality before commits:

```typescript
// .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run lint-staged
npx lint-staged

// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "oxlint --fix",
      "oxfmt"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

---

### 31. Add Storybook for All UI Components

**Enhancement:** Complete Storybook coverage for component library:

```typescript
// src/components/ui/button.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Button",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};
```

---

## Feature Enhancements

### 32. Add Resume Comparison View

**Feature:** Compare two resume versions side-by-side.

---

### 33. Add Resume Templates Marketplace

**Feature:** Community-submitted templates (future feature).

---

### 34. Add Resume Scoring

**Feature:** ATS compatibility scoring with improvement suggestions.

---

### 35. Add Multi-Resume Support

**Enhancement:** Better workflow for managing multiple resumes:
- Resume folders/categories
- Template assignment per resume
- Bulk operations

---

## Implementation Priority Matrix

| Improvement | Priority | Effort | Impact | Status |
|-------------|----------|--------|--------|--------|
| #1 Reduce code duplication | High | Medium | High | ✅ Done |
| #2 Improve type safety | High | Low | Medium | ✅ Done |
| #3 Expand E2E tests | High | High | High | ✅ Done |
| #4 Loading states | High | Low | High | ✅ Done |
| #5 Internationalization | Medium | High | Medium | ✅ Done |
| #6 Undo/Redo shortcuts | Medium | Low | Medium | ✅ Done |
| #16 Error handling | Medium | Medium | High | ⏳ Pending |
| #19 Virtual scrolling | Low | Medium | Low | ⏳ Pending |
| #23 Visual regression | Low | Medium | Medium | ⏳ Pending |

---

## Quick Wins (Can be done in < 2 hours each)

| # | Task | Status |
|---|------|--------|
| 1 | Add keyboard shortcuts for undo/redo | ✅ Done |
| 2 | Add loading skeletons for all async operations | ✅ Done |
| 3 | Add more JSDoc comments | ⏳ Pending |
| 4 | Fix type safety issues in stores | ✅ Done |
| 5 | Add pre-commit hooks | ✅ Done |
| 6 | Add more npm scripts for DX | ⏳ Pending |

---

## Conclusion

Resumier is already a solid application with good architecture and practices. These improvements would elevate it to a production-grade, enterprise-ready application with:

- Better maintainability through reduced duplication
- Enhanced developer experience with better tooling
- Improved user experience with loading states and keyboard navigation
- Stronger security posture
- Comprehensive test coverage

**Progress Summary:**
- ✅ **7 of 35** improvements completed
- High-priority items #1 (code duplication), #2 (type safety), #3 (E2E tests), and #4 (loading states) are done
- Internationalization (#5) is complete with English and Spanish support
- Global Undo/Redo (#6) is complete with keyboard shortcuts and UI buttons
- Pre-commit hooks (#30) are in place for code quality
- Quick wins #1 (undo/redo shortcuts), #2 (loading skeletons), and #4 (type safety) are done

The recommended approach is to tackle high-priority items first, then gradually work through medium and low priority improvements as resources allow.

**Next recommended items:**
1. #16 - Standardize Error Handling (Medium priority, High impact)
2. #7 - Add Resume Versioning (Medium priority)
3. #12 - Add Keyboard Navigation (Low priority, enhances accessibility)

