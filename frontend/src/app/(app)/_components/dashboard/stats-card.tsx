import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatPercent } from "@/lib/utils";
import {
  Comparison,
  Comparison2,
  Comparison3,
  Comparison4,
} from "@/types/dashboard";
import { MinusIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  comparison: Comparison | Comparison2 | Comparison3 | Comparison4;
  description?: string;
}

const StatsCard = ({
  title,
  value,
  comparison,
  description,
}: StatsCardProps) => {
  const TrendIcon =
    comparison.trend === "increase"
      ? TrendingUpIcon
      : comparison.trend === "decrease"
        ? TrendingDownIcon
        : MinusIcon;

  const trendColor =
    comparison.trend === "increase"
      ? "text-green-500"
      : comparison.trend === "decrease"
        ? "text-red-500"
        : "text-gray-500";

  return (
    <div className="relative flex h-fit flex-col gap-4 rounded-lg border p-5 shadow-sm">
      <div className="space-y-1">
        <h3 className="text-muted-foreground text-sm">{title}</h3>
        <h2 className="text-2xl font-bold">
          {title.includes("Revenue") || title.includes("Profit")
            ? formatCurrency(value)
            : value}
        </h2>
      </div>

      <div className="space-y-1 text-sm font-medium">
        <p className="flex items-center gap-1">
          <span>
            {comparison.trend === "increase"
              ? "Up"
              : comparison.trend === "decrease"
                ? "Down"
                : "No change"}
            {` ${formatPercent(comparison.percentage)} from yesterday`}
          </span>
          <TrendIcon size={16} strokeWidth={2} className={trendColor} />
        </p>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>

      <Badge
        variant="outline"
        className={`absolute top-5 right-5 font-medium ${trendColor}`}
      >
        <TrendIcon size={16} strokeWidth={2} className="mr-1" />
        {formatPercent(comparison.percentage)}
      </Badge>
    </div>
  );
};

export default StatsCard;
