import { useMemo, useState } from "react";
import { DataTable } from "@/components/data-table";
import { reportColumns } from "./column";
import { useGetAllReportsQuery } from "@/features/report/reportAPI";
import { cn } from "@/lib/utils";

type ReportTableProps = {
  className?: string; // lets the parent add table-frosted, padding, etc.
};

const ReportTable = ({ className }: ReportTableProps) => {
  const [filter, setFilter] = useState({
    pageNumber: 1,
    pageSize: 10,
  });

  const { data, isFetching } = useGetAllReportsQuery(filter);

  const pagination = useMemo(
    () => ({
      totalItems: data?.pagination?.totalCount ?? 0,
      totalPages: data?.pagination?.totalPages ?? 0,
      pageNumber: filter.pageNumber,
      pageSize: filter.pageSize,
    }),
    [data?.pagination, filter.pageNumber, filter.pageSize]
  );

  const handlePageChange = (pageNumber: number) => {
    setFilter((prev) => ({ ...prev, pageNumber }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setFilter(() => ({ pageNumber: 1, pageSize })); // reset to first page on size change
  };

  const rows = data?.reports ?? [];
  const isEmpty = !isFetching && rows.length === 0;

  return (
    <>
      {isEmpty ? (
        <div className="empty-ballroom">
          No reports yet. Schedule one with <span className="font-medium">Report Settings</span> 👑
        </div>
      ) : (
        <div className={cn("overflow-hidden", className)}>
          <DataTable
            data={rows}
            columns={reportColumns}
            isLoading={isFetching}
            showSearch={false}
            // remove the global 5% width; let columns set sizes if needed
            // Example if you want a tiny first column:
            // className="[&_th:first-child]:w-10 [&_td:first-child]:w-10"
            pagination={pagination}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      )}
    </>
  );
};

export default ReportTable;
