import * as React from "react";
import { Label as ReLabel, Pie, PieChart, Cell } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DateRangeType } from "@/components/date-range-select";
import { formatCurrency } from "@/lib/format-currency";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPercentage } from "@/lib/format-percentage";
import { EmptyState } from "@/components/empty-state";
import { useExpensePieChartBreakdownQuery } from "@/features/analytics/analyticsAPI";

const COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
];

/** shadcn chart config */
const chartConfig = {
  amount: { label: "Amount" },
} satisfies ChartConfig;

const ExpensePieChart = ({ dateRange }: { dateRange?: DateRangeType }) => {
  const { data, isFetching } = useExpensePieChartBreakdownQuery({
    preset: dateRange?.value,
  });

  const { breakdown: categories = [], totalSpent = 0 } = data?.data || {};

  return (
    <Card className="panel-fairy !shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg brand-spenderella">
          Expenses Breakdown
        </CardTitle>
        <CardDescription>
          Total expenses {dateRange?.label}
        </CardDescription>
      </CardHeader>

      <CardContent className="h-[340px]">
        {isFetching ? (
          <PieChartSkeleton />
        ) : categories.length === 0 ? (
          <EmptyState
            title="No expenses found"
            description="There are no expenses recorded for this period."
          />
        ) : (
          <div className="sparkle-soft rounded-2xl">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square h-[300px]"
            >
              <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

                <Pie
                  data={categories}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={82}
                  paddingAngle={2}
                  strokeWidth={2}
                  stroke="var(--card)"
                >
                  {categories.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}

                  <ReLabel
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        const { cx, cy } = viewBox;
                        return (
                          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
                            <tspan
                              x={cx}
                              y={cy}
                              className="fill-foreground text-2xl font-bold"
                            >
                              {formatCurrency(totalSpent)}
                            </tspan>
                            <tspan
                              x={cx}
                              y={(cy || 0) + 20}
                              className="fill-muted-foreground text-xs"
                            >
                              Total Spent
                            </tspan>
                          </text>
                        );
                      }
                      return null;
                    }}
                  />
                </Pie>

                <ChartLegend content={<ThemedLegend categories={categories} />} />
              </PieChart>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

/** Princessy legend with tiara badges + amounts */
function ThemedLegend({
  categories,
}: {
  categories: { name: string; value: number; percentage: number }[];
}) {
  return (
    <ul
      aria-label="Expense categories"
      className="grid grid-cols-1 gap-y-2 gap-x-4 mt-4"
    >
      {categories.map((entry, index) => (
        <li key={`legend-${index}`} className="flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-full shrink-0"
            style={{ backgroundColor: COLORS[index % COLORS.length] }}
            aria-hidden
          />
          <div className="flex justify-between w-full">
            <span className="badge-tiara capitalize">{entry.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {formatCurrency(entry.value)}
              </span>
              <span className="text-xs text-muted-foreground/70">
                ({formatPercentage(entry.percentage, { decimalPlaces: 0 })})
              </span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Skeleton keeps the same card layout so things don’t jump */
const PieChartSkeleton = () => (
  <div className="h-[313px]">
    <div className="w-full flex items-center justify-center">
      <div className="relative w-[200px] h-[200px]">
        <Skeleton className="rounded-full w-full h-full" />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Skeleton className="h-8 w-24 mb-2" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
    <div className="mt-3 space-y-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-14" />
        </div>
      ))}
    </div>
  </div>
);

export default ExpensePieChart;
