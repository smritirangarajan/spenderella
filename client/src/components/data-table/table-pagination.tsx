import {
    ChevronLeft,
    ChevronRight,
  } from "lucide-react";
  
  import { Button } from "@/components/ui/button";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { cn } from "@/lib/utils";
  
  interface DataTablePaginationProps {
    pageNumber: number;
    pageSize: number;
    totalCount: number; // Total rows from the API
    totalPages: number;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
  }
  
  export function DataTablePagination({
    pageNumber,
    pageSize,
    totalCount,
    totalPages,
    onPageChange,
    onPageSizeChange,
  }: DataTablePaginationProps) {
    const handlePageSizeChange = (newSize: number) => {
      onPageSizeChange?.(newSize);
    };
  
    const handlePageChange = (newPage: number) => {
      onPageChange?.(newPage);
    };
  
    return (
      <div
        className={cn(
          "flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-2",
          "rounded-md"
        )}
      >
        {/* Showing X to Y of Z Rows */}
        <div className="flex-1 text-sm text-white/70">
          Showing {(pageNumber - 1) * pageSize + 1}-
          {Math.min(pageNumber * pageSize, totalCount)} of {totalCount}
        </div>
  
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-8">
          {/* Rows Per Page Selector */}
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-white/80">Rows per page</p>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => {
                const size = Number(value);
                onPageChange?.(1); // reset to first page on size change
                handlePageSizeChange(size);
              }}
            >
              <SelectTrigger className="h-8 w-[84px] !bg-[var(--secondary-dark-color)] !text-white border border-gray-700">
                <SelectValue placeholder={`${pageSize}`} />
              </SelectTrigger>
              <SelectContent side="top" className="!bg-[var(--secondary-dark-color)] !text-white border border-gray-700">
                {[10, 20, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={`${size}`} className="capitalize">
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
  
          {/* Page Info + Controls */}
          <div className="flex items-center gap-2">
            <div className="flex min-w-[110px] items-center justify-center text-sm font-medium text-white/85">
              Page {pageNumber} of {totalPages || 1}
            </div>
  
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pageNumber - 1)}
                disabled={pageNumber === 1}
                className="!cursor-pointer border-gray-700 text-white/90 hover:bg-white/10 disabled:opacity-50"
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft className="mr-1 h-4 w-4" /> Previous
              </Button>
  
              {/* Page Numbers (windowed) */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, Math.max(totalPages, 1)) }, (_, i) => {
                  let pageNum: number;
  
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pageNumber <= 3) {
                    pageNum = i + 1;
                  } else if (pageNumber >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = pageNumber - 2 + i;
                  }
  
                  const isActive = pageNumber === pageNum;
  
                  return (
                    <Button
                      key={pageNum}
                      variant={isActive ? "default" : "outline"}
                      className={cn(
                        "h-8 w-8 p-0",
                        isActive
                          ? "!bg-[var(--primary-color)] !text-white border border-transparent"
                          : "border-gray-700 text-white/85 hover:bg-white/10"
                      )}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
  
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pageNumber + 1)}
                disabled={pageNumber >= totalPages || totalPages === 0}
                className="!cursor-pointer border-gray-700 text-white/90 hover:bg-white/10 disabled:opacity-50"
              >
                <span className="sr-only">Go to next page</span>
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  