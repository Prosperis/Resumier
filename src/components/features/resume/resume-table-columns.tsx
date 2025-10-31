/**
 * Resume Table Column Definitions
 * TanStack Table column configuration for resume data
 */

import type { ColumnDef } from "@tanstack/react-table";
import { Copy, Pencil, Trash2 } from "lucide-react";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import type { Resume } from "@/lib/api/types";
import { DeleteResumeDialog, RenameResumeDialog } from "./mutations";

/**
 * Format date string to readable format
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Format date string with time for tooltips
 */
function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Calculate relative time (e.g., "2 hours ago")
 */
function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateString);
  } catch {
    return dateString;
  }
}

/**
 * Determine resume completion status with color coding
 */
function getCompletionStatus(resume: Resume): { 
  status: string; 
  variant: "default" | "secondary" | "destructive" | "outline";
  className: string;
} {
  try {
    const { content } = resume;
    const hasPersonalInfo = content.personalInfo.name && content.personalInfo.email;
    const hasExperience = content.experience.length > 0;
    const hasEducation = content.education.length > 0;
    const hasSkills = (content.skills.technical?.length || 0) + (content.skills.soft?.length || 0) > 0;
    
    const completeness = [hasPersonalInfo, hasExperience, hasEducation, hasSkills].filter(Boolean).length;
    
    if (completeness === 4) {
      return { 
        status: "Complete", 
        variant: "default",
        className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
      };
    }
    if (completeness >= 2) {
      return { 
        status: "In Progress", 
        variant: "outline",
        className: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
      };
    }
    return { 
      status: "Draft", 
      variant: "secondary",
      className: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
    };
  } catch {
    return { 
      status: "Draft", 
      variant: "secondary",
      className: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
    };
  }
}

/**
 * Row context menu component for right-click actions
 */
export interface RowActionsProps {
  resume: Resume;
  onEdit: (resume: Resume) => void;
  onDuplicate: (resume: Resume) => void;
}

export function RowContextMenu({
  resume,
  onEdit,
  onDuplicate,
  children,
}: RowActionsProps & { children: React.ReactNode }) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>Actions</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => onEdit(resume)}>
          <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
          Open
        </ContextMenuItem>
        <RenameResumeDialog
          resumeId={resume.id}
          currentTitle={resume.title}
          trigger={
            <ContextMenuItem onSelect={(e: Event) => e.preventDefault()}>
              <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
              Rename
            </ContextMenuItem>
          }
        />
        <ContextMenuItem onClick={() => onDuplicate(resume)}>
          <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
          Duplicate
        </ContextMenuItem>
        <ContextMenuSeparator />
        <DeleteResumeDialog
          resumeId={resume.id}
          resumeTitle={resume.title}
          trigger={
            <ContextMenuItem
              onSelect={(e: Event) => e.preventDefault()}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
              Delete
            </ContextMenuItem>
          }
        />
      </ContextMenuContent>
    </ContextMenu>
  );
}

/**
 * Create resume table columns
 */
export function createResumeColumns(_handlers?: {
  onEdit: (resume: Resume) => void;
  onDuplicate: (resume: Resume) => void;
}): ColumnDef<Resume>[] {
  return [
    // Select checkbox column
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    // Title column
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => {
        const resume = row.original;
        return (
          <div className="flex flex-col gap-1 min-w-0">
            <span className="font-medium truncate">{row.getValue("title")}</span>
            {/* Show updated date on mobile when date columns are hidden */}
            <span className="text-muted-foreground text-xs md:hidden">
              Updated {formatRelativeTime(resume.updatedAt)}
            </span>
          </div>
        );
      },
      meta: {
        label: "Title",
      },
    },
    // Version column
    {
      accessorKey: "version",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Version" />
      ),
      cell: ({ row }) => {
        const resume = row.original;
        const version = resume.version || 1;
        return (
          <div className="text-muted-foreground text-sm">
            v{version}
          </div>
        );
      },
      enableSorting: true,
      enableHiding: true,
      meta: {
        label: "Version",
      },
    },
    // Field/Usage column (optional)
    {
      accessorKey: "field",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Field" />
      ),
      cell: ({ row }) => {
        const resume = row.original;
        // This will be empty for now, but ready for future use
        const field = (resume as any).field || "";
        return (
          <div className="text-muted-foreground text-sm">
            {field || (
              <span className="italic opacity-50">Not set</span>
            )}
          </div>
        );
      },
      enableSorting: true,
      enableHiding: true,
      meta: {
        label: "Field / Usage",
      },
    },
    // Status column
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const resume = row.original;
        const statusInfo = getCompletionStatus(resume);
        return (
          <Badge variant={statusInfo.variant} className={`text-xs ${statusInfo.className}`}>
            {statusInfo.status}
          </Badge>
        );
      },
      enableSorting: true,
      enableHiding: true,
      filterFn: (row, _id, value) => {
        const resume = row.original;
        const statusInfo = getCompletionStatus(resume);
        return statusInfo.status.toLowerCase().includes(value.toLowerCase());
      },
      meta: {
        label: "Status",
      },
    },
    // Reviewed column
    {
      accessorKey: "reviewed",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Reviewed" />
      ),
      cell: ({ row }) => {
        const resume = row.original;
        // This will be empty for now, ready for future review feature
        const reviewed = (resume as any).reviewed || false;
        return (
          <div>
            {reviewed ? (
              <Badge variant="default" className="text-xs">
                Reviewed
              </Badge>
            ) : (
              <span className="text-muted-foreground text-xs italic">
                Not reviewed
              </span>
            )}
          </div>
        );
      },
      enableSorting: true,
      enableHiding: true,
      meta: {
        label: "Reviewed",
      },
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last Modified" />
      ),
      cell: ({ row }) => {
        const dateString = row.getValue("updatedAt") as string;
        return (
          <div
            className="text-muted-foreground text-sm"
            title={formatDateTime(dateString)}
          >
            {formatRelativeTime(dateString)}
          </div>
        );
      },
      enableSorting: true,
      enableHiding: true,
      meta: {
        label: "Last Modified",
      },
    },
  ];
}
