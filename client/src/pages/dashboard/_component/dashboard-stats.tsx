import { useSummaryAnalyticsQuery } from "@/features/analytics/analyticsAPI";
import SummaryCard from "./summary-card";
import { DateRangeType } from "@/components/date-range-select";
import { cn } from "@/lib/utils";

type DashboardStatsProps = {
  dateRange?: DateRangeType;
  className?: string; // lets parent add panel-fairy, padding, etc.
};

const DashboardStats = ({ dateRange, className }: DashboardStatsProps) => {
  const { data, isFetching } = useSummaryAnalyticsQuery(
    { preset: dateRange?.value },
    { skip: !dateRange }
  );
  const summaryData = data?.data;

  return (
    <section
      aria-label="Key financial stats"
      className={cn(
        // default layout (parent may wrap with panel-fairy)
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5",
        // gentle entrance
        "animate-in fade-in-50 duration-300", "text-white",
        className
      )}
    >
      <SummaryCard
        title="Available Balance"
        value={summaryData?.availableBalance}
        dateRange={dateRange}
        percentageChange={summaryData?.percentageChange?.balance}
        isLoading={isFetching}
        cardType="balance"
      />
      <SummaryCard
        title="Total Income"
        value={summaryData?.totalIncome}
        percentageChange={summaryData?.percentageChange?.income}
        dateRange={dateRange}
        isLoading={isFetching}
        cardType="income"
      />
      <SummaryCard
        title="Total Expenses"
        value={summaryData?.totalExpenses}
        dateRange={dateRange}
        percentageChange={summaryData?.percentageChange?.expenses}
        isLoading={isFetching}
        cardType="expenses"
      />
      <SummaryCard
        title="Savings Rate"
        value={summaryData?.savingRate?.percentage}
        expenseRatio={summaryData?.savingRate?.expenseRatio}
        isPercentageValue
        dateRange={dateRange}
        isLoading={isFetching}
        cardType="savings"
      />
    </section>
  );
};

export default DashboardStats;
