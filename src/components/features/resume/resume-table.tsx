/**
 * Resume Table Component
 * Sortable, filterable table for managing resumes with row context menu
 */

import {
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";
import type { Resume } from "@/lib/api/types";
import { createResumeColumns, RowContextMenu } from "./resume-table-columns";

interface ResumeTableProps {
  resumes: Resume[];
  onEdit: (resume: Resume) => void;
  onDuplicate: (resume: Resume) => void;
}

export function ResumeTable({
  resumes,
  onEdit,
  onDuplicate,
}: ResumeTableProps) {
  const columns = createResumeColumns({ onEdit, onDuplicate });

  // Show only Title, Status, and Last Modified by default
  const initialColumnVisibility: VisibilityState = {
    version: false,
    field: false,
    reviewed: false,
    status: true,
    updatedAt: true,
  };

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialColumnVisibility,
  );
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: resumes,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode: "onChange",
  });

  const handleDuplicateSelected = (selectedResumes: Resume[]) => {
    selectedResumes.forEach(resume => onDuplicate(resume));
  };

  const handleOpenInNewTab = (selectedResumes: Resume[]) => {
    if (selectedResumes.length === 1) {
      window.open(`/resume/${selectedResumes[0].id}`, '_blank');
    }
  };

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        searchKey="title"
        searchPlaceholder="Search resumes by title..."
        statusFilter={true}
        onDuplicateSelected={handleDuplicateSelected}
        onOpenInNewTab={handleOpenInNewTab}
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isSelect = header.column.id === "select";
                  const isTitle = header.column.id === "title";
                  const isStatus = header.column.id === "status";
                  const isUpdatedAt = header.column.id === "updatedAt";

                  return (
                    <TableHead
                      key={header.id}
                      className={
                        isSelect
                          ? "w-[50px]"
                          : isTitle
                            ? "w-auto"
                            : isStatus
                              ? "w-[150px]"
                              : isUpdatedAt
                                ? "w-[150px]"
                                : "w-[150px]"
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const resume = row.original;
                return (
                  <RowContextMenu
                    key={row.id}
                    resume={resume}
                    onEdit={onEdit}
                    onDuplicate={onDuplicate}
                  >
                    <TableRow data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => {
                        const isSelect = cell.column.id === "select";
                        const isTitle = cell.column.id === "title";

                        return (
                          <TableCell
                            key={cell.id}
                            className={
                              isSelect
                                ? "w-[50px]"
                                : isTitle
                                  ? "w-auto max-w-0"
                                  : "w-[150px]"
                            }
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </RowContextMenu>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
