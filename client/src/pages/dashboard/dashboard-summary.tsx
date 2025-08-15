import { useTypedSelector } from "@/app/hook";
import DashboardHeader from "./_component/dashboard-header";
import DashboardStats from "./_component/dashboard-stats";
import { DateRangeType } from "@/components/date-range-select";

const DashboardSummary = ({
  dateRange,
  setDateRange,
}: {
  dateRange?: DateRangeType;
  setDateRange?: (range: DateRangeType) => void;
}) => {
  const { user } = useTypedSelector((state) => state.auth);

  return (
    <div className="w-full space-y-6">
      {/* Glam Header */}
      <div className="castle-gradient card-glass spenderella-sparkle rounded-2xl p-4 md:p-6">
        <DashboardHeader
          title={`Welcome back, ${user?.name || "Unknown"}`}
          subtitle="This is your overview report for the selected period"
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
      </div>

      {/* Calm stats panel */}
      <div className="panel-fairy rounded-2xl p-4">
        <DashboardStats dateRange={dateRange} />
      </div>
    </div>
  );
};

export default DashboardSummary;
