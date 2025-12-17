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
| 4 | Add Loading States for Better UX | ⏳ Pending | - |
| 5 | Add Internationalization (i18n) Support | ⏳ Pending | - |
| 6 | Implement Undo/Redo at Global Level | ⏳ Pending | - |
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

### 4. Add Loading States for Better UX ⏳

**Status:** ⏳ Pending

**Location:** Various components

**Issue:** Some components lack proper loading states or skeleton loaders.

**Solution:** Implement consistent loading patterns:

```typescript
// src/components/features/resume/resume-editor-skeleton.tsx
export function ResumeEditorSkeleton() {
  return (
    <div className="flex h-full gap-4">
      {/* Left panel skeleton */}
      <div className="w-80 space-y-4 border-r p-4">
        <Skeleton className="h-8 w-full" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
      
      {/* Preview skeleton */}
      <div className="flex-1 p-4">
        <Skeleton className="mx-auto aspect-[8.5/11] w-full max-w-2xl" />
      </div>
    </div>
  );
}
```

---

## Medium Priority Improvements

### 5. Add Internationalization (i18n) Support

**Issue:** Application only supports English.

**Solution:** Add i18n with `react-i18next`:

```bash
bun add react-i18next i18next
```

```typescript
// src/lib/i18n/index.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import es from "./locales/es.json";
import fr from "./locales/fr.json";
import de from "./locales/de.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
    fr: { translation: fr },
    de: { translation: de },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
```

```json
// src/lib/i18n/locales/en.json
{
  "dashboard": {
    "title": "Resume Dashboard",
    "newResume": "New Resume",
    "noResumes": "No resumes yet. Create your first one!"
  },
  "editor": {
    "personalInfo": "Personal Information",
    "experience": "Work Experience",
    "education": "Education",
    "skills": "Skills",
    "certifications": "Certifications",
    "links": "Links"
  },
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "add": "Add"
  }
}
```

---

### 6. Implement Undo/Redo at Global Level

**Location:** `src/stores/history-store.ts`

**Issue:** Undo/redo exists but may not cover all content changes.

**Enhancement:** Make undo/redo more comprehensive with keyboard shortcuts:

```typescript
// src/hooks/use-keyboard-shortcuts.ts
import { useEffect } from "react";
import { useHistoryStore, selectHistoryActions, selectCanUndo, selectCanRedo } from "@/stores";

export function useKeyboardShortcuts() {
  const { undo, redo } = useHistoryStore(selectHistoryActions);
  const canUndo = useHistoryStore(selectCanUndo);
  const canRedo = useHistoryStore(selectCanRedo);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ctrl/Cmd + Z = Undo
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) undo();
      }
      
      // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y = Redo
      if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        if (canRedo) redo();
      }
      
      // Ctrl/Cmd + S = Save (prevent default, trigger auto-save)
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        // Trigger manual save if needed
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canUndo, canRedo, undo, redo]);
}
```

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
| #4 Loading states | High | Low | High | ⏳ Pending |
| #5 Internationalization | Medium | High | Medium | ⏳ Pending |
| #6 Undo/Redo shortcuts | Medium | Low | Medium | ⏳ Pending |
| #16 Error handling | Medium | Medium | High | ⏳ Pending |
| #19 Virtual scrolling | Low | Medium | Low | ⏳ Pending |
| #23 Visual regression | Low | Medium | Medium | ⏳ Pending |

---

## Quick Wins (Can be done in < 2 hours each)

| # | Task | Status |
|---|------|--------|
| 1 | Add keyboard shortcuts for undo/redo | ⏳ Pending |
| 2 | Add loading skeletons for all async operations | ⏳ Pending |
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
- ✅ **4 of 35** improvements completed
- High-priority items #1 (code duplication), #2 (type safety), and #3 (E2E tests) are done
- Pre-commit hooks (#30) are in place for code quality
- Quick win #4 (type safety) is done

The recommended approach is to tackle high-priority items first, then gradually work through medium and low priority improvements as resources allow.

**Next recommended items:**
1. #4 - Add Loading States for Better UX (High priority, Low effort)
2. #6 - Implement Undo/Redo at Global Level (Quick win)
3. #16 - Standardize Error Handling (Medium priority, High impact)

