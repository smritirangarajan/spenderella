import { Card, CardContent } from "@/components/ui/card";
import PageLayout from "@/components/page-layout";
import ScheduleReportDrawer from "./_component/schedule-report-drawer";
import ReportTable from "./_component/report-table";

export default function Reports() {
  return (
    <PageLayout
      title="Spenderella · Report History"
      subtitle="View and manage your financial reports"
      addMarginTop
      // Keep glam in the header only:
      // headerClassName="header-hero spenderella-sparkle"
      rightAction={
        <ScheduleReportDrawer
          /* if supported; otherwise style its internal trigger */
          // @ts-expect-error triggerClassName may be custom
          triggerClassName="btn-princess gilded-focus"
        />
      }
    >
      <div className="max-w-5xl mx-auto px-4">
        {/* Solid-ish content panel (calmer than full glass) */}
        <Card className="panel-fairy">
          <CardContent className="pt-4">
            {/* Frosted table wrapper so it feels consistent */}
            <div className="table-frosted overflow-hidden">
              <ReportTable />
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
