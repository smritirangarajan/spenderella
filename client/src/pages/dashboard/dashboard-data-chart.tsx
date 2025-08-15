import * as React from "react";
import { format } from "date-fns";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
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
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { EmptyState } from "@/components/empty-state";
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import { DateRangeType } from "@/components/date-range-select";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/format-currency";
import { useChartAnalyticsQuery } from "@/features/analytics/analyticsAPI";

interface PropsType {
  dateRange?: DateRangeType;
}

const COLORS = ["var(--primary)", "var(--color-destructive)"];
const TRANSACTION_TYPES = ["income", "expenses"];

const chartConfig = {
  income: {
    label: "Income",
    color: COLORS[0],
  },
  expenses: {
    label: "Expenses",
    color: COLORS[1],
  },
} satisfies ChartConfig;

const DashboardDataChart: React.FC<PropsType> = ({ dateRange }) => {
  const isMobile = useIsMobile();
  const { data, isFetching } = useChartAnalyticsQuery({
    preset: dateRange?.value,
  });

  const chartData = data?.data?.chartData || [];
  const totalExpenseCount = data?.data?.totalExpenseCount || 0;
  const totalIncomeCount = data?.data?.totalIncomeCount || 0;

  if (isFetching) return <ChartSkeleton />;

  return (
    <Card className="panel-fairy rounded-2xl border border-gray-100 dark:border-border !shadow-sm !pt-0">
      <CardHeader className="flex flex-col items-stretch !space-y-0 border-b border-gray-100 dark:border-border !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6">
          <CardTitle className="text-lg font-semibold text-primary">
            Transaction Overview
          </CardTitle>
          <CardDescription>
            Showing total transactions {dateRange?.label}
          </CardDescription>
        </div>
        <div className="flex bg-muted/40 dark:bg-muted/20 rounded-tr-2xl">
          {TRANSACTION_TYPES.map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <div
                key={chart}
                className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-center even:border-l sm:border-l border-gray-100 dark:border-border sm:px-4 sm:py-6 min-w-36"
              >
                <span className="w-full block text-xs text-muted-foreground">
                  No. of {chartConfig[chart].label}
                </span>
                <span className="flex items-center justify-center gap-2 text-lg font-semibold leading-none sm:text-3xl">
                  {key === "income" ? (
                    <TrendingUpIcon className="size-4 text-primary" />
                  ) : (
                    <TrendingDownIcon className="size-4 text-destructive" />
                  )}
                  {key === "income" ? totalIncomeCount : totalExpenseCount}
                </span>
              </div>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 h-[300px]">
        {chartData.length === 0 ? (
          <EmptyState
            title="No transaction data"
            description="There are no transactions recorded for this period."
          />
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[300px] w-full"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS[0]} stopOpacity={1.0} />
                  <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS[1]} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={COLORS[1]} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={isMobile ? 20 : 25}
                tickFormatter={(value) =>
                  format(new Date(value), isMobile ? "MMM d" : "MMMM d, yyyy")
                }
              />
              <ChartTooltip
                cursor={{
                  stroke: "hsl(var(--muted-foreground))",
                  strokeWidth: 1,
                  strokeDasharray: "3 3",
                }}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      format(new Date(value), "MMM d, yyyy")
                    }
                    indicator="line"
                    formatter={(value, name) => {
                      const isExpense = name === "expenses";
                      const color = isExpense ? COLORS[1] : COLORS[0];
                      return [
                        <span key={name} style={{ color }}>
                          {formatCurrency(Number(value), {
                            showSign: true,
                            compact: true,
                            isExpense,
                          })}
                        </span>,
                        isExpense ? "Expenses" : "Income",
                      ];
                    }}
                  />
                }
              />
              <Area
                dataKey="expenses"
                stackId="1"
                type="step"
                fill="url(#expensesGradient)"
                stroke={COLORS[1]}
              />
              <Area
                dataKey="income"
                stackId="1"
                type="step"
                fill="url(#incomeGradient)"
                stroke={COLORS[0]}
              />
              <ChartLegend
                verticalAlign="bottom"
                content={<ChartLegendContent />}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

const ChartSkeleton = () => (
  <Card className="panel-fairy rounded-2xl border border-gray-100 dark:border-border !shadow-sm !pt-0">
    <CardHeader className="flex flex-col items-stretch !space-y-0 border-b border-gray-100 dark:border-border !p-0 sm:flex-row">
      <div className="flex flex-1 flex-col justify-center gap-1 px-6">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32 mt-1" />
      </div>
      <div className="flex">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-center even:border-l sm:border-l border-gray-100 dark:border-border sm:px-4 sm:py-6 min-w-36"
          >
            <Skeleton className="h-4 w-20 mx-auto" />
            <Skeleton className="h-8 w-24 mx-auto mt-1 sm:h-12" />
          </div>
        ))}
      </div>
    </CardHeader>
    <CardContent className="px-2 pt-4 sm:px-6 h-[280px]">
      <Skeleton className="h-full w-full" />
    </CardContent>
  </Card>
);

export default DashboardDataChart;
