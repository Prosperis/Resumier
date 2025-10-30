/**
 * Resume Table Column Definitions
 * TanStack Table column configuration for resume data
 */

import type { ColumnDef } from "@tanstack/react-table";
import { Copy, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

function RowActions({ resume, onEdit, onDuplicate }: RowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" aria-label={`Actions for ${resume.title}`}>
          <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onEdit(resume)}>
          <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
          Edit
        </DropdownMenuItem>
        <RenameResumeDialog
          resumeId={resume.id}
          currentTitle={resume.title}
          trigger={
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
              Rename
            </DropdownMenuItem>
          }
        />
        <DropdownMenuItem onClick={() => onDuplicate(resume)}>
          <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DeleteResumeDialog
          resumeId={resume.id}
          resumeTitle={resume.title}
          trigger={
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
              Delete
            </DropdownMenuItem>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Create resume table columns
 */
export function createResumeColumns(handlers: {
  onEdit: (resume: Resume) => void;
  onDuplicate: (resume: Resume) => void;
}): ColumnDef<Resume>[] {
  return [
    {
      accessorKey: "title",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
      cell: ({ row }) => {
        return (
          <div className="flex flex-col gap-1">
            <span className="font-medium">{row.getValue("title")}</span>
            {/* Show updated date on mobile when date columns are hidden */}
            <span className="text-muted-foreground text-xs md:hidden">
              Updated {formatDate(row.original.updatedAt)}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
      cell: ({ row }) => {
        const dateString = row.getValue("createdAt") as string;
        return (
          <div className="text-muted-foreground text-sm" title={formatDateTime(dateString)}>
            {formatDate(dateString)}
          </div>
        );
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Updated" />,
      cell: ({ row }) => {
        const dateString = row.getValue("updatedAt") as string;
        return (
          <div className="text-muted-foreground text-sm" title={formatDateTime(dateString)}>
            {formatDate(dateString)}
          </div>
        );
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      id: "actions",
      cell: ({ row }) => <RowActions resume={row.original} {...handlers} />,
      enableHiding: false,
    },
  ];
}
