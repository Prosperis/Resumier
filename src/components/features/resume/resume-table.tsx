/**
 * Resume Table Component
 * Sortable, filterable table for managing resumes
 */

import { DataTable } from "@/components/ui/data-table";
import type { Resume } from "@/lib/api/types";
import { createResumeColumns } from "./resume-table-columns";

interface ResumeTableProps {
  resumes: Resume[];
  onEdit: (resume: Resume) => void;
  onDuplicate: (resume: Resume) => void;
}

export function ResumeTable({ resumes, onEdit, onDuplicate }: ResumeTableProps) {
  const columns = createResumeColumns({ onEdit, onDuplicate });

  // Hide date columns on mobile by default (can be toggled via column visibility)
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const initialColumnVisibility = isMobile
    ? ({
        createdAt: false,
        updatedAt: false,
      } as const)
    : undefined;

  return (
    <DataTable
      columns={columns}
      data={resumes}
      searchKey="title"
      searchPlaceholder="Search resumes..."
      initialColumnVisibility={initialColumnVisibility}
    />
  );
}
