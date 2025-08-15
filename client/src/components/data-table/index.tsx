/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
  SortingState,
  VisibilityState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { Loader, PlusCircleIcon, Trash, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import TableSkeleton from "./table-skeleton-loader";
import { DataTablePagination } from "./table-pagination";
import { EmptyState } from "../empty-state";

type FilterOption = {
  key: string;
  label: string;
  options: { value: string; label: string }[];
};

type PaginationInput = {
  totalItems?: number;
  totalPages?: number;
  pageNumber?: number;
  pageSize?: number;
};

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];

  /** Search */
  searchPlaceholder?: string;
  showSearch?: boolean;
  /** Called with debounced value */
  onSearch?: (term: string) => void;
  /** Debounce ms (default 300) */
  searchDebounceMs?: number;

  /** Filters */
  filters?: FilterOption[];
  onFilterChange?: (filters: Record<string, string>) => void;

  /** Bulk actions */
  selection?: boolean;
  onBulkDelete?: (selectedIds: string[]) => void;

  /** State flags */
  isLoading?: boolean;
  isBulkDeleting?: boolean;

  /** Pagination */
  isShowPagination?: boolean;
  pagination?: PaginationInput;
  onPageChange?: (pageNumber: number) => void;
  onPageSizeChange?: (pageSize: number) => void;

  /** Style / Misc */
  className?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  /** Skeleton rows while loading (default 20) */
  skeletonRows?: number;
  /** Skeleton columns while loading (default 6) */
  skeletonCols?: number;
}

export function DataTable<TData>({
  data,
  columns,

  searchPlaceholder = "Search...",
  showSearch = true,
  onSearch,
  searchDebounceMs = 300,

  filters = [],
  onFilterChange,

  selection = true,
  onBulkDelete,

  isLoading = false,
  isBulkDeleting = false,

  isShowPagination = true,
  pagination,
  onPageChange,
  onPageSizeChange,

  className,
  emptyTitle = "No records found",
  emptyDescription = "",
  skeletonRows = 20,
  skeletonCols = 6,
}: DataTableProps<TData>) {
  const [searchInput, setSearchInput] = React.useState("");
  const [filterValues, setFilterValues] = React.useState<Record<string, string>>(
    {}
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Debounce search → external handler
  React.useEffect(() => {
    if (!onSearch) return;
    const id = setTimeout(() => onSearch(searchInput), searchDebounceMs);
    return () => clearTimeout(id);
  }, [searchInput, onSearch, searchDebounceMs]);

  // Reset selection when data changes
  React.useEffect(() => {
    setRowSelection({});
  }, [data]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection: selection ? rowSelection : {},
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: selection ? setRowSelection : undefined,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const hasSelections = selectedRows.length > 0;

  const selectedIds = React.useMemo(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    () => selectedRows.map((r) => (r.original as any)?.id).filter(Boolean),
    [selectedRows]
  );

  const handleFilterChange = (key: string, value: string) => {
    const updated = { ...filterValues, [key]: value };
    setFilterValues(updated);
    onFilterChange?.(updated);
  };

  const handleClear = () => {
    setSearchInput("");
    setFilterValues({});
    onSearch?.("");
    onFilterChange?.({});
    setRowSelection({});
  };

  const handleDelete = () => {
    if (!selectedIds.length) return;
    onBulkDelete?.(selectedIds);
    setRowSelection({});
  };

  const hasActiveControls =
    !!searchInput ||
    Object.keys(filterValues).length > 0 ||
    Object.keys(rowSelection).length > 0;

  const pageNumber = pagination?.pageNumber || 1;
  const pageSize = pagination?.pageSize || 10;
  const totalItems = pagination?.totalItems || 0;
  const totalPages = pagination?.totalPages || 0;

  return (
    <div className="w-full">
      {/* Top Bar: Search & Filters */}
      <div className="flex flex-wrap justify-between items-center gap-2 pb-4">
        <div className="flex items-center gap-2 flex-wrap flex-1">
          {showSearch && (
            <Input
              aria-label="Search table"
              placeholder={searchPlaceholder}
              value={searchInput}
              disabled={isLoading}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                // Allow instant submit on Enter (still debounced otherwise)
                if (e.key === "Enter") onSearch?.(searchInput);
              }}
              className="max-w-sm"
            />
          )}

          {filters.map(({ key, label, options }) => (
            <Select
              key={key}
              value={filterValues[key] ?? ""}
              disabled={isLoading}
              onValueChange={(value) => handleFilterChange(key, value)}
            >
              <SelectTrigger className="min-w-[160px]">
                <div className="flex items-center gap-2">
                  <PlusCircleIcon className="h-4 w-4 opacity-50" />
                  <SelectValue placeholder={label} />
                </div>
              </SelectTrigger>
              <SelectContent>
                {options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}

          {hasActiveControls && (
            <Button
              variant="ghost"
              disabled={isLoading || isBulkDeleting}
              onClick={handleClear}
              className="h-8 px-2"
            >
              <X className="h-4 w-4 mr-1" />
              Reset
            </Button>
          )}
        </div>

        {(selection && hasSelections) || isBulkDeleting ? (
          <Button
            disabled={isLoading || isBulkDeleting}
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            aria-disabled={isBulkDeleting}
          >
            <Trash className="h-4 w-4 mr-1" />
            Delete ({selectedRows.length})
            {isBulkDeleting && <Loader className="ml-1 h-4 w-4 animate-spin" />}
          </Button>
        ) : null}
      </div>

      {/* Table / Skeleton */}
      <div className={cn("rounded-md border overflow-x-auto", className)}>
        {isLoading ? (
          <TableSkeleton columns={skeletonCols} rows={skeletonRows} />
        ) : (
          <Table
            className={cn(
              table.getRowModel().rows.length === 0 ? "h-[200px]" : ""
            )}
          >
            <TableHeader className="sticky top-0 bg-muted z-10">
              {table.getHeaderGroups().map((group) => (
                <TableRow key={group.id}>
                  {group.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="!font-medium !text-[13px]"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="!text-[13.3px]">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center">
                    <EmptyState title={emptyTitle} description={emptyDescription} />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {isShowPagination && (
        <div className="mt-4">
          <DataTablePagination
            pageNumber={pageNumber}
            pageSize={pageSize}
            totalCount={totalItems}
            totalPages={totalPages}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </div>
      )}
    </div>
  );
}
