/**
 * Resume Table Column Definitions
 * TanStack Table column configuration for resume data
 */

import type { ColumnDef } from "@tanstack/react-table";
import { Copy, Pencil, Trash2 } from "lucide-react";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
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
 * Actions menu for each resume row
 */
interface RowActionsProps {
  resume: Resume;
  onEdit: (resume: Resume) => void;
  onDuplicate: (resume: Resume) => void;
}

function RowContextMenu({
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
          Edit
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
 * Create resume table columns with context menu on each row
 */
export function createResumeColumns(handlers: {
  onEdit: (resume: Resume) => void;
  onDuplicate: (resume: Resume) => void;
}): ColumnDef<Resume>[] {
  return [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => {
        const resume = row.original;
        return (
          <RowContextMenu resume={resume} {...handlers}>
            <div className="flex flex-col gap-1 cursor-context-menu">
              <span className="font-medium">{row.getValue("title")}</span>
              {/* Show updated date on mobile when date columns are hidden */}
              <span className="text-muted-foreground text-xs md:hidden">
                Updated {formatDate(resume.updatedAt)}
              </span>
            </div>
          </RowContextMenu>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created" />
      ),
      cell: ({ row }) => {
        const dateString = row.getValue("createdAt") as string;
        const resume = row.original;
        return (
          <RowContextMenu resume={resume} {...handlers}>
            <div
              className="text-muted-foreground cursor-context-menu text-sm"
              title={formatDateTime(dateString)}
            >
              {formatDate(dateString)}
            </div>
          </RowContextMenu>
        );
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Updated" />
      ),
      cell: ({ row }) => {
        const dateString = row.getValue("updatedAt") as string;
        const resume = row.original;
        return (
          <RowContextMenu resume={resume} {...handlers}>
            <div
              className="text-muted-foreground cursor-context-menu text-sm"
              title={formatDateTime(dateString)}
            >
              {formatDate(dateString)}
            </div>
          </RowContextMenu>
        );
      },
      enableSorting: true,
      enableHiding: true,
    },
  ];
}
