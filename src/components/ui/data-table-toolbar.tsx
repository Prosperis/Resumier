import type { Table } from "@tanstack/react-table";
import {
  Copy,
  ExternalLink,
  ListFilter,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchKey?: string;
  searchPlaceholder?: string;
  statusFilter?: boolean;
  onDuplicateSelected?: (rows: TData[]) => void;
  onDeleteSelected?: (rows: TData[]) => void;
  onOpenInNewTab?: (rows: TData[]) => void;
}

export function DataTableToolbar<TData>({
  table,
  searchKey,
  searchPlaceholder = "Search...",
  statusFilter = false,
  onDuplicateSelected,
  onDeleteSelected,
  onOpenInNewTab,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedCount = selectedRows.length;

  const handleDuplicate = () => {
    if (onDuplicateSelected && selectedRows.length > 0) {
      onDuplicateSelected(selectedRows.map((row) => row.original));
    }
  };

  const handleDelete = () => {
    if (onDeleteSelected && selectedRows.length > 0) {
      onDeleteSelected(selectedRows.map((row) => row.original));
    }
  };

  const handleOpenInNewTab = () => {
    if (onOpenInNewTab && selectedRows.length > 0) {
      onOpenInNewTab(selectedRows.map((row) => row.original));
    }
  };

  return (
    <div className="space-y-3">
      {/* Main toolbar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-1 items-center gap-2">
          {/* Search input */}
          {searchKey && (
            <div className="relative flex-1 max-w-sm">
              <Search className="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4" />
              <Input
                placeholder={searchPlaceholder}
                value={
                  (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn(searchKey)?.setFilterValue(event.target.value)
                }
                className="h-9 pl-9"
              />
            </div>
          )}

          {/* Status filter dropdown */}
          {statusFilter && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 border-dashed"
                >
                  <ListFilter className="mr-2 h-4 w-4" />
                  Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[150px]">
                <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>
                  Complete
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>
                  In Progress
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>
                  Draft
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Clear filters */}
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-9 px-2 lg:px-3"
            >
              Clear
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <DataTableViewOptions table={table} />
        </div>
      </div>

      {/* Selection summary */}
      {selectedCount > 0 && (
        <div className="bg-muted/50 flex items-center justify-between rounded-lg border p-2 px-3">
          <span className="text-sm font-medium">
            {selectedCount} row{selectedCount > 1 ? "s" : ""} selected
          </span>
          <div className="flex items-center gap-2">
            {selectedCount === 1 && onOpenInNewTab && (
              <Button variant="outline" size="sm" onClick={handleOpenInNewTab}>
                <ExternalLink className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
                Open in new tab
              </Button>
            )}
            {onDuplicateSelected && (
              <Button variant="outline" size="sm" onClick={handleDuplicate}>
                <Copy className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
                Duplicate {selectedCount > 1 ? `(${selectedCount})` : ""}
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.toggleAllPageRowsSelected(false)}
            >
              Clear selection
            </Button>
            {onDeleteSelected && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
                Delete {selectedCount > 1 ? `(${selectedCount})` : ""}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
