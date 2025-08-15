/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    ArrowUpDown,
    CircleDot,
    Copy,
    Loader,
    LucideIcon,
    MoreHorizontal,
    Pencil,
    RefreshCw,
    Trash2,
  } from "lucide-react";
  import { format } from "date-fns";
  import { Button } from "@/components/ui/button";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { ColumnDef } from "@tanstack/react-table";
  import { Checkbox } from "@/components/ui/checkbox";
  import { formatCurrency } from "@/lib/format-currency";
  import useEditTransactionDrawer from "@/hooks/use-edit-transaction-drawer";
  import { TransactionType } from "@/features/transaction/transactionType";
  import { _TRANSACTION_FREQUENCY, _TRANSACTION_TYPE } from "@/constant";
  import {
    useDeleteTransactionMutation,
    useDuplicateTransactionMutation,
  } from "@/features/transaction/transactionAPI";
  import { toast } from "sonner";
  
  type FrequencyInfo = {
    label: string;
    icon: LucideIcon;
  };
  
  type FrequencyMapType = {
    [key: string]: FrequencyInfo;
    DEFAULT: FrequencyInfo;
  };
  
  export const transactionColumns: ColumnDef<TransactionType>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="!border-gray-400 data-[state=checked]:!bg-gray-800 !text-white"
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all rows"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="!border-gray-400 data-[state=checked]:!bg-gray-800 !text-white"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) =>
        row.getValue("createdAt")
          ? format(row.getValue("createdAt"), "MMM dd, yyyy")
          : "—",
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <span className="font-medium">{row.getValue("title")}</span>,
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="!pl-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="capitalize">{row.original.category}</div>,
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const type = row.getValue("type");
        const isIncome = type === _TRANSACTION_TYPE.INCOME;
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              isIncome
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {isIncome ? "Income" : "Expense"}
          </span>
        );
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"));
        const type = row.getValue("type");
        const sign = type === _TRANSACTION_TYPE.EXPENSE ? "-" : "+";
        return (
          <div
            className={`text-right font-medium ${
              type === _TRANSACTION_TYPE.INCOME
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {sign}
            {formatCurrency(amount)}
          </div>
        );
      },
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Transaction Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) =>
        row.original.date
          ? format(row.original.date, "MMM dd, yyyy")
          : "—",
    },
    {
      accessorKey: "paymentMethod",
      header: "Payment Method",
      cell: ({ row }) => {
        const method = row.original.paymentMethod;
        return method
          ? <span className="capitalize">{method.replace("_", " ").toLowerCase()}</span>
          : "N/A";
      },
    },
    {
      accessorKey: "recurringInterval",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Frequency
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const frequency = row.getValue("recurringInterval");
        const nextDate = row.original?.nextRecurringDate;
        const isRecurring = row.original?.isRecurring;
  
        const frequencyMap: FrequencyMapType = isRecurring
          ? {
              [_TRANSACTION_FREQUENCY.DAILY]: { label: "Daily", icon: RefreshCw },
              [_TRANSACTION_FREQUENCY.WEEKLY]: { label: "Weekly", icon: RefreshCw },
              [_TRANSACTION_FREQUENCY.MONTHLY]: { label: "Monthly", icon: RefreshCw },
              [_TRANSACTION_FREQUENCY.YEARLY]: { label: "Yearly", icon: RefreshCw },
              DEFAULT: { label: "One-time", icon: CircleDot },
            }
          : { DEFAULT: { label: "One-time", icon: CircleDot } };
  
        const { label, icon: Icon } =
          frequencyMap?.[isRecurring ? (frequency as string) : "DEFAULT"] ||
          frequencyMap.DEFAULT;
  
        return (
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span>{label}</span>
              {nextDate && isRecurring && (
                <span className="text-xs text-muted-foreground">
                  Next: {format(nextDate, "MMM dd yyyy")}
                </span>
              )}
            </div>
          </div>
        );
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => <ActionsCell row={row} />,
    },
  ];
  
  const ActionsCell = ({ row }: { row: any }) => {
    const transactionId = row.original.id;
    const { onOpenDrawer } = useEditTransactionDrawer();
  
    const [duplicateTransaction, { isLoading: isDuplicating }] =
      useDuplicateTransactionMutation();
    const [deleteTransaction, { isLoading: isDeleting }] =
      useDeleteTransactionMutation();
  
    const handleDuplicate = (e: Event) => {
      e.preventDefault();
      if (isDuplicating) return;
      duplicateTransaction(transactionId)
        .unwrap()
        .then(() => toast.success("Transaction duplicated successfully"))
        .catch((error) =>
          toast.error(error.data?.message || "Failed to duplicate transaction")
        );
    };
  
    const handleDelete = (e: Event) => {
      e.preventDefault();
      if (isDeleting) return;
      deleteTransaction(transactionId)
        .unwrap()
        .then(() => toast.success("Transaction deleted successfully"))
        .catch((error) =>
          toast.error(error.data?.message || "Failed to delete transaction")
        );
    };
  
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-44"
          align="end"
          onCloseAutoFocus={(e) => {
            if (isDeleting || isDuplicating) e.preventDefault();
          }}
        >
          <DropdownMenuItem onClick={() => onOpenDrawer(transactionId)}>
            <Pencil className="mr-1 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="relative"
            disabled={isDuplicating}
            onSelect={handleDuplicate}
          >
            <Copy className="mr-1 h-4 w-4" />
            Duplicate
            {isDuplicating && (
              <Loader className="ml-1 h-4 w-4 absolute right-2 animate-spin" />
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="relative !text-red-600"
            disabled={isDeleting}
            onSelect={handleDelete}
          >
            <Trash2 className="mr-1 h-4 w-4 !text-red-600" />
            Delete
            {isDeleting && (
              <Loader className="ml-1 h-4 w-4 absolute right-2 animate-spin" />
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };
  