import { DateRangeSelect, DateRangeType } from "@/components/date-range-select";
import AddTransactionDrawer from "@/components/transaction/add-transaction-drawer";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  subtitle: string;
  dateRange?: DateRangeType;
  setDateRange?: (range: DateRangeType) => void;
  className?: string; // optional extra styling from parent
}

const DashboardHeader = ({
  title,
  subtitle,
  dateRange,
  setDateRange,
  className,
}: Props) => {
  return (
    <header
      className={cn(
        "flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between",
        "animate-in fade-in-50 duration-300",
        className
      )}
    >
      {/* Title & subtitle */}
      <div className="space-y-1.5">
        <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight">
          {title}
        </h1>
        <p className="text-muted-foreground text-sm">{subtitle}</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap justify-start lg:justify-end gap-3">
        <DateRangeSelect
          dateRange={dateRange || null}
          setDateRange={(range) => setDateRange?.(range)}
        />
        <AddTransactionDrawer />
      </div>
    </header>
  );
};

export default DashboardHeader;
