import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import { formatINRShort } from "@/lib/utils";
import { useMemo } from "react"; // Added for performance

type Props = {
  data: any[];
  title?: string;
  className?: string;
};

export function SpendingByCommitteeBar({
  data,
  title = "Spending by Committee",
  className
}: Props) {
  // 1. Sort Data A-Z by the "name" property
  // We use useMemo so it only re-sorts if the data prop changes
  const sortedData = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => {
      const nameA = a.name?.toLowerCase() || "";
      const nameB = b.name?.toLowerCase() || "";
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
  }, [data]);

  const hasRemain = sortedData?.some((d) => typeof d?.remain === "number");
  const hasOverUtilized = sortedData?.some(
    (d) => typeof d?.overUtilized === "number" && d?.overUtilized < 0
  );

  return (
    <div className={`flex flex-col h-full w-full ${className}`}>
      <h2 className="text-lg font-semibold text-slate-900 mb-4 shrink-0 mx-4 mt-4">
        {title}
      </h2>

      <div className="flex-1 min-h-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData} // Use the sorted data here
            layout="vertical"
            margin={{ left: 10, right: 30, top: 0, bottom: 0 }}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
            
            <XAxis
              type="number"
              domain={['auto', 'auto']}
              tick={{ fontSize: 12, fill: "#64748b" }}
              axisLine={{ stroke: '#cbd5e1', strokeWidth: 1 }}
              tickLine={{ stroke: '#cbd5e1' }}
              // ADD THIS LINE:
  tickFormatter={(value) => `₹${formatINRShort(value)}`}
            />

            <YAxis
              type="category"
              dataKey="name"
              width={140}
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={{ stroke: '#cbd5e1', strokeWidth: 1 }}
              tickLine={{ stroke: '#cbd5e1' }}
              interval={0}
              
            />

            <Tooltip
              formatter={(value: number) => `₹${formatINRShort(Math.abs(value))}`}
              cursor={{ fill: "#f1f5f9" }}
            />

            {(hasRemain || hasOverUtilized) && (
              <ReferenceLine x={0} stroke="#94a3b8" strokeWidth={2} />
            )}

            {!hasRemain ? (
              <>
                <Bar dataKey="budget" name="Budget" fill="#93c5fd" radius={[0, 4, 4, 0]} />
                <Bar dataKey="utilized" name="Actual" fill="#1e3a8a" radius={[0, 4, 4, 0]} />
              </>
            ) : (
              <>
                <Bar dataKey="remain" name="Remaining" fill="#16a34a" radius={[0, 4, 4, 0]} />
                <Bar dataKey="overUtilized" name="Over Utilized" fill="#ef4444" radius={[4, 4, 4, 4]} />
              </>
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}