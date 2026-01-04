import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
  CartesianGrid, // Added for grid lines
} from "recharts";
import { formatINRShort } from "@/lib/utils";

// ... Types remain the same ...
type Props = any

export function SpendingByCommitteeBar({
  data,
  title = "Spending by Committee",
}: Props) {
const activeKeys = {
  budget: data?.some(d => (d.budget ?? 0) !== 0),
  utilized: data?.some(d => (d.utilized ?? 0) !== 0),
  remain: data?.some(d => (d.remain ?? 0) !== 0),
  overUtilized: data?.some(d => (d.overUtilized ?? 0) !== 0),
};
  console.log(data);
  const hasRemain = data?.some((d) => typeof d?.remain === "number");
  const hasOverUtilized = data?.some(
    (d) => typeof d?.overUtilized === "number" && d?.overUtilized < 0
  );

  const rowHeight = 60;
  const chartHeight = Math.max(400, data?.length * rowHeight);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 w-full">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">{title}</h2>

      <div className="w-full overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
        <div style={{ height: `${chartHeight}px`, width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              barCategoryGap={10}
              margin={{ left: 10, right: 30, top: 10, bottom: 10 }}
            >
              {/* 1. ADD GRID LINES */}
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />

              {/* 2. ENABLE X-AXIS LINE */}
             <XAxis
  type="number"
  domain={['auto', 'auto']} // Forces Recharts to calculate min/max including negatives
  tick={{ fontSize: 12, fill: "#64748b" }}
  axisLine={{ stroke: '#cbd5e1', strokeWidth: 1 }}
  tickLine={{ stroke: '#cbd5e1' }}
/>

              {/* 3. ENABLE Y-AXIS LINE */}
              <YAxis
                type="category"
                dataKey="name"
                width={140}
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={{ stroke: '#cbd5e1', strokeWidth: 1 }} // Visible line
                tickLine={{ stroke: '#cbd5e1' }}
                interval={0}
              />

              <Tooltip
                formatter={(value: number) => `₹${formatINRShort(Math.abs(value))}`}
                cursor={{ fill: "#f1f5f9" }}
              />

{/* ... inside BarChart ... */}

{/* <Legend
  verticalAlign="top"
  align="right"
  height={40}
  iconType="circle"
  payload={[
    ...(activeKeys.budget && !hasRemain ? [{ value: 'Budget', type: 'circle', color: '#93c5fd' }] : []),
    ...(activeKeys.utilized && !hasRemain ? [{ value: 'Actual', type: 'circle', color: '#1e3a8a' }] : []),
    ...(activeKeys.remain && hasRemain ? [{ value: 'Remaining', type: 'circle', color: '#16a34a' }] : []),
    ...(activeKeys.overUtilized && hasRemain ? [{ value: 'Over Utilized', type: 'circle', color: '#ef4444' }] : []),
  ].filter(Boolean)} // Ensures no empty slots
/> */}
              {(hasRemain || hasOverUtilized) && (
                <ReferenceLine x={0} stroke="#94a3b8" strokeWidth={2} />
              )}

              {/* BARS (keep your existing logic) */}
              {!hasRemain ? (
                <>
                  <Bar dataKey="budget" name="Budget" fill="#93c5fd" barSize={12} radius={[0, 4, 4, 0]} />
                  <Bar dataKey="utilized" name="Actual" fill="#1e3a8a" barSize={12} radius={[0, 4, 4, 0]} />
                </>
              ) : (
                <>
                  <Bar dataKey="remain" name="Remaining" fill="#16a34a" barSize={12} radius={[0, 4, 4, 0]} />
                  <Bar dataKey="overUtilized" name="Over Utilized" fill="#ef4444" barSize={12} radius={[4, 4, 4, 4]} />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}