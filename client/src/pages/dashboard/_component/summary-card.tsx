import { FC } from "react";
import CountUp from "react-countup";
import { TrendingDownIcon, TrendingUpIcon, LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format-currency";
import { formatPercentage } from "@/lib/format-percentage";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { DateRangeEnum, DateRangeType } from "@/components/date-range-select";

type CardType = "balance" | "income" | "expenses" | "savings";
type CardStatus = {
  label: string;
  Icon: LucideIcon;
  description?: string;
};

interface SummaryCardProps {
  title: string;
  value?: number;
  dateRange?: DateRangeType;
  percentageChange?: number;
  isPercentageValue?: boolean;
  isLoading?: boolean;
  expenseRatio?: number;
  cardType: CardType;
}

const getCardStatus = (
  value: number,
  cardType: CardType,
  expenseRatio?: number
): CardStatus => {
  if (cardType === "savings") {
    if (value === 0) {
      return { label: "No Savings Record", Icon: TrendingDownIcon };
    }
    if (value < 10) {
      return { label: "Low Savings", Icon: TrendingDownIcon, description: `Only ${value.toFixed(1)}% saved` };
    }
    if (value < 20) {
      return { label: "Moderate", Icon: TrendingDownIcon, description: `${expenseRatio?.toFixed(0)}% spent` };
    }
    if (expenseRatio && expenseRatio > 75) {
      return { label: "High Spend", Icon: TrendingDownIcon, description: `${expenseRatio.toFixed(0)}% spent` };
    }
    if (expenseRatio && expenseRatio > 60) {
      return { label: "Warning: High Spend", Icon: TrendingDownIcon, description: `${expenseRatio.toFixed(0)}% spent` };
    }
    return { label: "Good Savings", Icon: TrendingUpIcon };
  }

  if (value === 0) {
    const typeLabel = cardType === "income" ? "Income" : cardType === "expenses" ? "Expenses" : "Balance";
    return { label: `No ${typeLabel}`, Icon: TrendingDownIcon };
  }

  if (cardType === "balance" && value < 0) {
    return { label: "Overdrawn", Icon: TrendingDownIcon, description: "Balance is negative" };
  }

  return { label: "", Icon: TrendingDownIcon };
};

const getTrendDirection = (value: number, cardType: CardType) => {
  if (cardType === "expenses") return value <= 0 ? "positive" : "negative";
  return value >= 0 ? "positive" : "negative";
};

const SummaryCard: FC<SummaryCardProps> = ({
  title,
  value = 0,
  dateRange,
  percentageChange,
  isPercentageValue,
  isLoading,
  expenseRatio,
  cardType = "balance",
}) => {
  const status = getCardStatus(value, cardType, expenseRatio);
  const showTrend = percentageChange !== undefined && percentageChange !== null && cardType !== "savings";
  const trendDirection = showTrend && percentageChange !== 0 ? getTrendDirection(percentageChange, cardType) : null;

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-purple-900/20 border border-white/10 rounded-2xl backdrop-blur-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-5">
          <Skeleton className="h-4 w-24 bg-white/30" />
        </CardHeader>
        <CardContent className="space-y-8">
          <Skeleton className="h-10.5 w-full bg-white/30" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-12 bg-white/30" />
            <Skeleton className="h-3 w-16 bg-white/30" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatCountupValue = (val: number) =>
    isPercentageValue
      ? formatPercentage(val, { decimalPlaces: 1 })
      : formatCurrency(val, { isExpense: cardType === "expenses", showSign: cardType === "balance" && val < 0 });

  return (
    <Card
      className={cn(
        "bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-purple-900/20 border border-white/10 rounded-2xl backdrop-blur-md transition-transform hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/20"
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-5">
        <CardTitle className="text-[15px] text-white font-medium tracking-wide">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="text-4xl font-bold drop-shadow-md text-white">
          <CountUp start={0} end={value} preserveValue decimals={2} decimalPlaces={2} formattingFn={formatCountupValue} />
        </div>

        <div className="text-sm text-white mt-2">
          {cardType === "savings" ? (
            <div className="flex items-center gap-1.5">
              <status.Icon className="size-3.5 text-white" />
              <span className="text-white">
                {status.label} {value !== 0 && `(${formatPercentage(value)})`}
              </span>
              {status.description && <span className="text-white/70 ml-1">• {status.description}</span>}
            </div>
          ) : dateRange?.value === DateRangeEnum.ALL_TIME ? (
            <span className="text-white/70">Showing {dateRange?.label}</span>
          ) : value === 0 || status.label ? (
            <div className="flex items-center gap-1.5">
              <status.Icon className="size-3.5 text-white" />
              <span className="text-white">{status.label}</span>
              {status.description && <span className="text-white/70">• {status.description}</span>}
              {!status.description && <span className="text-white/70">• {dateRange?.label}</span>}
            </div>
          ) : showTrend ? (
            <div className="flex items-center gap-1.5">
              {percentageChange !== 0 && (
                <div className="flex items-center gap-0.5 text-white">
                  {trendDirection === "positive" ? <TrendingUpIcon className="size-3" /> : <TrendingDownIcon className="size-3" />}
                  <span>
                    {formatPercentage(percentageChange || 0, {
                      showSign: percentageChange !== 0,
                      isExpense: cardType === "expenses",
                      decimalPlaces: 1,
                    })}
                  </span>
                </div>
              )}
              {percentageChange === 0 && (
                <div className="flex items-center gap-0.5 text-white/70">
                  <TrendingDownIcon className="size-3" />
                  <span>{formatPercentage(0, { showSign: false, decimalPlaces: 1 })}</span>
                </div>
              )}
              <span className="text-white/70">• {dateRange?.label}</span>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
