/**
 * Lazy-loaded form components for better code splitting
 * These components are only loaded when the user opens the respective dialogs
 */

import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load form dialogs
export const LazyExperienceFormDialog = lazy(() =>
  import("../forms/experience-form-dialog").then((m) => ({ default: m.ExperienceFormDialog }))
);

export const LazyEducationFormDialog = lazy(() =>
  import("../forms/education-form-dialog").then((m) => ({ default: m.EducationFormDialog }))
);

export const LazyCertificationFormDialog = lazy(() =>
  import("../forms/certification-form-dialog").then((m) => ({
    default: m.CertificationFormDialog,
  }))
);

export const LazyLinkFormDialog = lazy(() =>
  import("../forms/link-form-dialog").then((m) => ({ default: m.LinkFormDialog }))
);

// Lazy load list components (with drag-and-drop)
export const LazyExperienceList = lazy(() =>
  import("../forms/experience-list").then((m) => ({ default: m.ExperienceList }))
);

export const LazyEducationList = lazy(() =>
  import("../forms/education-list").then((m) => ({ default: m.EducationList }))
);

export const LazyCertificationList = lazy(() =>
  import("../forms/certification-list").then((m) => ({ default: m.CertificationList }))
);

export const LazyLinkList = lazy(() =>
  import("../forms/link-list").then((m) => ({ default: m.LinkList }))
);

// Lazy load inline forms
export const LazyPersonalInfoForm = lazy(() =>
  import("../forms/personal-info-form").then((m) => ({ default: m.PersonalInfoForm }))
);

export const LazySkillsForm = lazy(() =>
  import("../forms/skills-form").then((m) => ({ default: m.SkillsForm }))
);

// Lazy load PDF viewer
export const LazyPdfViewer = lazy(() =>
  import("../pdf-viewer").then((m) => ({ default: m.PdfViewer }))
);

/**
 * Loading fallback for form dialogs
 */
export function FormDialogSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

/**
 * Loading fallback for lists
 */
export function ListSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}

/**
 * Loading fallback for forms
 */
export function FormSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
  );
}

/**
 * Wrapper components with Suspense
 */

interface LazyFormDialogProps extends Record<string, unknown> {
  component: React.ComponentType<Record<string, unknown>>;
}

export function LazyFormDialog({ component: Component, ...props }: LazyFormDialogProps) {
  return (
    <Suspense fallback={<FormDialogSkeleton />}>
      <Component {...props} />
    </Suspense>
  );
}

export function LazyFormList({ component: Component, ...props }: LazyFormDialogProps) {
  return (
    <Suspense fallback={<ListSkeleton />}>
      <Component {...props} />
    </Suspense>
  );
}

export function LazyForm({ component: Component, ...props }: LazyFormDialogProps) {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <Component {...props} />
    </Suspense>
  );
}
