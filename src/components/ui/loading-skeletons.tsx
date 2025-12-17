/**
 * Domain-Specific Loading Skeletons
 * Provides skeleton loading states that match the actual component layouts
 */

import { cn } from "@/lib/utils";
import { Skeleton, SkeletonText } from "./skeleton";

/**
 * ResumeEditorSkeleton - Loading skeleton for the resume editor view
 * Matches the 3-panel layout: sidebar, preview, tool sidebar
 */
export function ResumeEditorSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex h-full", className)}>
      {/* Left sidebar - collapsed state */}
      <div className="w-12 border-r border-border bg-background flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center gap-1 py-4">
          {/* Section icons */}
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-8 rounded-md" />
          ))}
        </div>
      </div>

      {/* Main preview area */}
      <div className="flex-1 flex items-start justify-center bg-slate-200 dark:bg-slate-800 p-8">
        <ResumePreviewSkeleton />
      </div>

      {/* Right tool sidebar - collapsed state */}
      <div className="w-12 border-l border-border bg-background flex flex-col">
        <div className="flex-1 flex flex-col items-center gap-1 py-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-8 rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * ResumeEditorExpandedSkeleton - Loading skeleton with expanded sidebar
 */
export function ResumeEditorExpandedSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex h-full", className)}>
      {/* Left sidebar - expanded state */}
      <div className="w-80 min-w-80 border-r border-border bg-background flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Form sections */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Import section */}
          <div className="border-b border-border pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-3 rounded" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-2 w-32" />
                </div>
              </div>
              <Skeleton className="h-6 w-14 rounded" />
            </div>
          </div>

          {/* Collapsible sections */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border-b border-border pb-3">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-2 w-40" />
                  </div>
                </div>
                <Skeleton className="h-4 w-4 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main preview area */}
      <div className="flex-1 flex items-start justify-center bg-slate-200 dark:bg-slate-800 p-8">
        <ResumePreviewSkeleton />
      </div>

      {/* Right tool sidebar - collapsed */}
      <div className="w-12 border-l border-border bg-background flex flex-col">
        <div className="flex-1 flex flex-col items-center gap-1 py-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-8 rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * ResumePreviewSkeleton - Loading skeleton for resume preview
 * Matches the A4 paper preview format
 */
export function ResumePreviewSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full max-w-2xl aspect-[8.5/11] bg-card rounded-sm shadow-lg",
        className,
      )}
    >
      <div className="p-8 h-full flex flex-col">
        {/* Header section */}
        <div className="mb-6 text-center">
          <Skeleton className="h-8 w-48 mx-auto mb-2" />
          <Skeleton className="h-4 w-32 mx-auto mb-3" />
          <div className="flex justify-center gap-4">
            <Skeleton className="h-3 w-36" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>

        {/* Summary section */}
        <div className="mb-6">
          <Skeleton className="h-5 w-20 mb-2" />
          <SkeletonText lines={3} />
        </div>

        {/* Experience section */}
        <div className="mb-6 flex-1">
          <Skeleton className="h-5 w-32 mb-3" />
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-3 w-32" />
                <SkeletonText lines={2} />
              </div>
            ))}
          </div>
        </div>

        {/* Skills section */}
        <div>
          <Skeleton className="h-5 w-16 mb-2" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-16 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * DashboardSkeleton - Loading skeleton for the dashboard view
 * Includes header, tabs, and content area
 */
export function DashboardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6 bg-background", className)}>
      {/* Dashboard Header */}
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="space-y-1">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
      </div>

      {/* Tabs and action button */}
      <div className="px-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>

        {/* Content area - Table skeleton */}
        <div className="mt-6">
          <ResumeTableSkeleton rows={5} />
        </div>
      </div>
    </div>
  );
}

/**
 * ResumeTableSkeleton - Loading skeleton for the resume table
 */
export function ResumeTableSkeleton({
  rows = 5,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <div className={cn("rounded-md border", className)}>
      {/* Table header */}
      <div className="bg-muted/50 border-b p-4">
        <div className="grid grid-cols-[1fr_120px_120px_100px_60px] gap-4 items-center">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-8" />
        </div>
      </div>
      {/* Table rows */}
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div className="grid grid-cols-[1fr_120px_120px_100px_60px] gap-4 items-center">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * ProfileCardSkeleton - Loading skeleton for profile cards
 */
export function ProfileCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-card rounded-xl border p-6", className)}>
      {/* Header */}
      <div className="flex items-start justify-between pb-3">
        <div className="flex items-center gap-3">
          <Skeleton variant="circular" className="h-10 w-10" />
          <div className="space-y-1">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>

      {/* Content */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-40" />

        {/* Badge placeholders */}
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/**
 * ProfileGridSkeleton - Loading skeleton for profile grid
 */
export function ProfileGridSkeleton({
  count = 3,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <ProfileCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * SettingsSkeleton - Loading skeleton for settings page
 */
export function SettingsSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("max-w-4xl mx-auto p-6 space-y-8", className)}>
      {/* Page header */}
      <div className="space-y-1">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Settings sections */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <div className="space-y-1">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-80" />
          </div>
          <div className="rounded-lg border p-6 space-y-4">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="flex items-center justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * FormSectionSkeleton - Loading skeleton for form sections
 */
export function FormSectionSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-4 p-4", className)}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      ))}
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-24 w-full rounded-md" />
      </div>
    </div>
  );
}

/**
 * ListItemSkeleton - Loading skeleton for list items
 */
export function ListItemSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-lg border p-4", className)}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Skeleton className="h-5 w-5 mt-0.5" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
    </div>
  );
}

/**
 * EntityListSkeleton - Loading skeleton for entity lists (experience, education, etc.)
 */
export function EntityListSkeleton({
  count = 3,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <ListItemSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * TemplateGallerySkeleton - Loading skeleton for template gallery
 */
export function TemplateGallerySkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4", className)}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="aspect-[8.5/11] w-full rounded-lg" />
          <Skeleton className="h-4 w-24 mx-auto" />
        </div>
      ))}
    </div>
  );
}

/**
 * ToolSidebarSkeleton - Loading skeleton for tool sidebar
 */
export function ToolSidebarSkeleton({
  expanded = false,
  className,
}: {
  expanded?: boolean;
  className?: string;
}) {
  if (!expanded) {
    return (
      <div className={cn("w-12 border-l border-border bg-background flex flex-col", className)}>
        <div className="flex-1 flex flex-col items-center gap-1 py-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-8 rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-80 border-l border-border bg-background flex flex-col", className)}>
      <div className="px-3 py-2 border-b border-border">
        <Skeleton className="h-5 w-20" />
      </div>
      <div className="p-4 space-y-4">
        <TemplateGallerySkeleton />
      </div>
    </div>
  );
}

