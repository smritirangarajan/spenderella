import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Clock, RefreshCw } from "lucide-react";
import { _REPORT_STATUS, ReportStatusType } from "@/constant";
import { ReportType } from "@/features/report/reportType";

const statusStyles: Record<ReportStatusType, string> = {
  [_REPORT_STATUS.SENT]: "bg-green-100 text-green-800",
  [_REPORT_STATUS.FAILED]: "bg-red-100 text-red-800",
  [_REPORT_STATUS.PENDING]: "bg-yellow-100 text-yellow-800",
  [_REPORT_STATUS.PROCESSING]: "bg-blue-100 text-blue-800",
  [_REPORT_STATUS.NO_ACTIVITY]: "bg-gray-100 text-gray-800",
};

export const reportColumns: ColumnDef<ReportType>[] = [
  {
    accessorKey: "period",
    header: "Report Period",
    cell: ({ row }) => {
      const period = row.getValue("period") as string;
      return (
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 opacity-50 shrink-0" />
          <span>{period}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "sentDate",
    header: "Sent Date",
    cell: ({ row }) => {
      const date = new Date(row.original.sentDate);
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as ReportStatusType;
      const style = statusStyles[status] || statusStyles[_REPORT_STATUS.NO_ACTIVITY];
      return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${style}`}>
          {status}
        </span>
      );
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button
        size="sm"
        variant="outline"
        className="font-normal"
        onClick={() => console.log("Resend report", row.original.id)}
      >
        <RefreshCw className="h-4 w-4 mr-1" />
        Resend
      </Button>
    ),
  },
];
