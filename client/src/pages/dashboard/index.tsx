import { useState } from "react";
import DashboardDataChart from "./dashboard-data-chart";
import DashboardSummary from "./dashboard-summary";
import PageLayout from "@/components/page-layout";
import ExpensePieChart from "./expense-pie-chart";
import DashboardRecentTransactions from "./dashboard-recent-transactions";
import { DateRangeType } from "@/components/date-range-select";

const Dashboard = () => {
  const [dateRange, setDateRange] = useState<DateRangeType>(null);

  return (
    <PageLayout
      className="space-y-8"
      /* Glam lives in the header: dreamy gradient + glass + light sparkles */
      renderPageHeader={
        <div className="castle-gradient card-glass spenderella-sparkle rounded-2xl p-4 md:p-6">
          <DashboardSummary dateRange={dateRange} setDateRange={setDateRange} />
        </div>
      }
    >
      {/* Main Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-6 gap-6 md:-mt-20">
        {/* Solid, calm panel for readability */}
        <div className="lg:col-span-4 panel-fairy rounded-2xl p-4">
          <DashboardDataChart dateRange={dateRange} />
        </div>

        {/* ExpensePieChart is already themed as a Card/panel—no extra wrapper to avoid double glass */}
        <div className="lg:col-span-2">
          <ExpensePieChart dateRange={dateRange} />
        </div>
      </section>

      {/* Recent Transactions */}
      <section className="panel-fairy rounded-2xl p-4 -mt-4 md:-mt-0">
        <DashboardRecentTransactions />
      </section>
    </PageLayout>
  );
};

export default Dashboard;
