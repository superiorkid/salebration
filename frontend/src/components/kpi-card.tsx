interface KpiCardProps {
  title: string;
  value: string;
  trend?: number;
}

const KpiCard = ({ title, value, trend }: KpiCardProps) => {
  return (
    <div className="flex flex-col gap-1 rounded-lg border p-4 shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <div className="flex items-baseline justify-between">
        <h2 className="text-xl font-semibold 2xl:text-2xl">{value}</h2>
        {trend !== undefined && (
          <span
            className={`text-xs ${trend >= 0 ? "text-green-500" : "text-red-500"}`}
          >
            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  );
};

export default KpiCard;
