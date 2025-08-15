import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface TableSkeletonProps {
  columns: number;
  rows?: number;
  className?: string;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
  columns,
  rows = 25,
  className,
}) => {
  return (
    <div
      className={cn(
        "w-full rounded-lg overflow-hidden border border-white/10 bg-[var(--secondary-dark-color)] shadow-md",
        className
      )}
    >
      {/* Table Header Skeleton */}
      <div className="flex h-10 bg-[var(--primary-color)]/10">
        {[...Array(columns)].map((_, index) => (
          <div
            key={`header-col-${index}`}
            className="flex-1 px-4 py-2 flex items-center"
          >
            <Skeleton className="h-4 w-full rounded-lg bg-white/10" />
          </div>
        ))}
      </div>

      {/* Table Body Skeleton */}
      <div className="divide-y divide-white/5">
        {[...Array(rows)].map((_, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="flex h-10 hover:bg-white/5 transition-colors"
          >
            {[...Array(columns)].map((_, colIndex) => (
              <div
                key={`row-${rowIndex}-col-${colIndex}`}
                className="flex-1 px-4 py-2 flex items-center"
              >
                <Skeleton className="h-4 w-full rounded-lg bg-white/5" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;
